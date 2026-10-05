import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";




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
  const MOCK_AI = process.env.MOCK_AI === "true";
  const apiKey = process.env.GEMINI_API_KEY;
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (MOCK_AI) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return NextResponse.json({
        summary: "A comprehensive 30-day strategy focusing on education, entertainment, and product benefits to drive engagement and sales.",
        days: Array.from({ length: 30 }).map((_, i) => {
          const pillars = ["Educational", "Entertaining", "Promotional"];
          const pillar = pillars[i % 3];
          return {
            day: i + 1,
            pillar,
            hookIdea: `Catchy ${pillar} hook for day ${i + 1}`,
            description: `This is a mock description for day ${i + 1} focusing on ${pillar.toLowerCase()} content.`
          };
        })
      });
    }

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.MODEL_LITE || "gemini-3.5-flash-lite";

    const base64Data = imageBase64.split(",")[1];
    if (!base64Data) {
        return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }

    const prompt = `
      Act as a D2C social media strategist. Analyze this product image and generate a 30-day Instagram Reels content calendar.
      Use a mix of Educational, Entertaining, and Promotional content pillars.

      Return ONLY a JSON object (no markdown, no backticks) with this structure:
      {
        "summary": "A brief 2-sentence strategy overview for this product.",
        "days": [
          {
            "day": 1,
            "pillar": "Educational",
            "hookIdea": "Did you know...",
            "description": "Show the product solving X problem."
          },
          ... (30 items total, numbered 1 to 30)
        ]
      }
    `;

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
                text: prompt
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "";
      const parsed = JSON.parse(text);
      
      if (!parsed || !parsed.summary || !Array.isArray(parsed.days)) {
        throw new Error("Invalid format");
      }
      
      return parsed;
    });

    return NextResponse.json(jsonResp);
  } catch (error) {
    console.error("Calendar generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    if (errorMessage.includes("overloaded") || errorMessage.includes("503") || errorMessage.includes("429")) {
      return NextResponse.json(
        { error: "AI model is temporarily overloaded. Please wait 30 seconds and try again. 🔄" }, 
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to generate calendar. Please try again." },
      { status: 500 }
    );
  }
}
