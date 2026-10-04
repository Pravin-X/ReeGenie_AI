import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const MOCK_AI = process.env.MOCK_AI === "true";
const apiKey = process.env.GEMINI_API_KEY;

// Retry helper with exponential backoff
async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 2000): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const isLastAttempt = attempt === maxRetries - 1;
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isOverloaded = errorMessage.includes("overloaded") || 
                           errorMessage.includes("503") || 
                           errorMessage.includes("429") ||
                           errorMessage.includes("RESOURCE_EXHAUSTED") ||
                           errorMessage.includes("500");
      
      if (isLastAttempt || !isOverloaded) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      console.log(`API attempt ${attempt + 1} failed, retrying in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries exceeded");
}

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    if (MOCK_AI) {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json({
        category: "Skincare",
        productName: "Glow Serum 500",
        attributes: ["hydrating", "glass skin", "vitamin C", "vegan"],
      });
    }

    if (!apiKey) {
      return NextResponse.json({ error: "API key is missing and mock mode is off." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.MODEL_LITE || "gemini-3.5-flash-lite";

    // Prepare image for Gemini
    // Expecting base64 to be in format "data:image/jpeg;base64,..."
    const base64Data = imageBase64.split(",")[1];
    if (!base64Data) {
        return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }

    const jsonResp = await retryWithBackoff(async () => {
      const response = await ai.models.generateContent({
        model: model,
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: imageBase64.substring(5, imageBase64.indexOf(";")),
                }
              },
              {
                text: `Analyze this product image. Return a JSON object with exactly these fields:
- "category": a short string describing the product category (e.g., "Skincare", "Snacks").
- "productName": the likely name of the product or a generic name if unclear.
- "attributes": an array of 3-5 strings describing key features, visual traits, or vibes.
Do not wrap the JSON in markdown code blocks, return raw JSON.`
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              productName: { type: Type.STRING },
              attributes: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["category", "productName", "attributes"]
          }
        }
      });

      const text = response.text || "";
      return JSON.parse(text);
    });

    return NextResponse.json(jsonResp);
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    if (errorMessage.includes("overloaded") || errorMessage.includes("503") || errorMessage.includes("429")) {
      return NextResponse.json(
        { error: "AI model is temporarily overloaded. Please wait 30 seconds and try again. 🔄" }, 
        { status: 503 }
      );
    }
    
    return NextResponse.json({ error: "Failed to analyze image. Please try again." }, { status: 500 });
  }
}
