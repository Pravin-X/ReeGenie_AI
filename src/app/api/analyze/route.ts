import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const MOCK_AI = process.env.MOCK_AI === "true";
const apiKey = process.env.GEMINI_API_KEY;

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
    const model = process.env.MODEL_LITE || "gemini-2.5-flash";

    // Prepare image for Gemini
    // Expecting base64 to be in format "data:image/jpeg;base64,..."
    const base64Data = imageBase64.split(",")[1];
    if (!base64Data) {
        return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }

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
      }
    });

    const text = response.text || "";
    let jsonResp;
    try {
      jsonResp = JSON.parse(text);
    } catch {
      console.error("Failed to parse JSON", text);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    return NextResponse.json(jsonResp);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
  }
}
