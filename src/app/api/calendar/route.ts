import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const MOCK_AI = process.env.MOCK_AI === "true";
const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
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
    const model = process.env.MODEL_PRO || "gemini-2.5-pro";

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

    let attempts = 0;
    while (attempts < 2) {
      try {
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
        let jsonResp;
        try {
          jsonResp = JSON.parse(text);
        } catch {
          throw new Error("Failed to parse JSON");
        }
        
        if (jsonResp && jsonResp.summary && Array.isArray(jsonResp.days)) {
            return NextResponse.json(jsonResp);
        }
        throw new Error("Invalid format");
      } catch (e) {
        attempts++;
        if (attempts === 2) {
            console.error("Failed after 2 attempts", e);
            return NextResponse.json({ error: "Failed to generate calendar. Please try again." }, { status: 500 });
        }
      }
    }
  } catch (error) {
    console.error("Calendar generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate calendar. Please try again." },
      { status: 500 }
    );
  }
}
