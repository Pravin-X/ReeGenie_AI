import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import formats from "../../formats.json";

const MOCK_AI = process.env.MOCK_AI === "true";
const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const { category, attributes, tone } = await req.json();

    if (!category || !attributes || !tone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (MOCK_AI) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return NextResponse.json([
        {
          format: "Problem fix",
          hook: "Tired of dull skin? This changed everything.",
          scenes: [
            { time: "0-3s", shot: "Close up of frustrated face", voiceover: "If you have dull skin...", overlay: "Dull skin struggles" },
            { time: "3-7s", shot: "Applying the serum", voiceover: "This glow serum is magic.", overlay: "Instant glow" }
          ],
          caption: "Get your glow back instantly! ✨",
          hashtags: ["#SkincareRoutine", "#GlowUp"]
        },
        {
          format: "POV routine",
          hook: "POV: You finally found the perfect morning serum.",
          scenes: [
            { time: "0-3s", shot: "Waking up", voiceover: "Morning routine time.", overlay: "Morning vibes" },
            { time: "3-7s", shot: "Product on vanity", voiceover: "My holy grail.", overlay: "The secret" }
          ],
          caption: "Morning routines made better. 🌞",
          hashtags: ["#MorningRoutine", "#Skincare"]
        },
        {
          format: "Myth buster",
          hook: "They say vitamin C is irritating. They're wrong.",
          scenes: [
            { time: "0-3s", shot: "Shaking head", voiceover: "Myth: Vitamin C burns.", overlay: "Myth busted" },
            { time: "3-7s", shot: "Applying smoothly", voiceover: "This one is super gentle.", overlay: "Gentle formula" }
          ],
          caption: "Don't believe the myths! 🚫",
          hashtags: ["#SkincareTips", "#VitaminC"]
        },
        {
          format: "Before/After",
          hook: "Look at this 1-week transformation.",
          scenes: [
            { time: "0-3s", shot: "Before photo", voiceover: "My skin was so dry.", overlay: "Day 1" },
            { time: "3-7s", shot: "After photo", voiceover: "Now it's glowing.", overlay: "Day 7" }
          ],
          caption: "The results speak for themselves. 🤩",
          hashtags: ["#Transformation", "#SkincareResults"]
        },
        {
          format: "Trend remix",
          hook: "3 reasons I can't live without this.",
          scenes: [
            { time: "0-2s", shot: "Quick pan", voiceover: "Reason one, it hydrates.", overlay: "1. Hydrates" },
            { time: "2-4s", shot: "Texture shot", voiceover: "Reason two, no sticky feel.", overlay: "2. Non-sticky" },
            { time: "4-6s", shot: "Glowing face", voiceover: "Reason three, the glow.", overlay: "3. The glow" }
          ],
          caption: "Obsessed is an understatement. 😍",
          hashtags: ["#MustHave", "#SkincareObsessed"]
        }
      ]);
    }

    if (!apiKey) {
      return NextResponse.json({ error: "API key is missing and mock mode is off." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.MODEL_PRO || "gemini-2.5-pro";

    const prompt = `You are a viral social media manager.
Write 5 Instagram Reel scripts for a product in the "${category}" category.
Product attributes: ${attributes.join(", ")}.
Language/Tone: ${tone === "hinglish" ? "Hinglish (a mix of Hindi and English, natural conversational style)" : "English (modern, engaging, natural)"}.

Use these 5 formats EXACTLY:
${formats.map(f => `- ${f.format}: ${f.description}`).join("\n")}

Output the result as a raw JSON array of 5 objects (one for each format). Each object must have:
- "format": The format name.
- "hook": A catchy, viral hook line.
- "scenes": An array of scene objects. Each scene needs:
    - "time": string (e.g. "0-3s")
    - "shot": string (visual description)
    - "voiceover": string (what to say)
    - "overlay": string (text on screen)
- "caption": A short engaging caption.
- "hashtags": An array of 3-5 relevant hashtags (no trending spam, only highly relevant ones).

Return ONLY the JSON array, no markdown wrappers.`;

    // Try twice for valid JSON
    let attempts = 0;
    while (attempts < 2) {
      try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        const text = response.text || "";
        const jsonResp = JSON.parse(text);
        
        if (Array.isArray(jsonResp) && jsonResp.length === 5) {
            return NextResponse.json(jsonResp);
        }
        throw new Error("Invalid format");
      } catch (e) {
        attempts++;
        if (attempts === 2) {
            console.error("Failed after 2 attempts", e);
            return NextResponse.json({ error: "Failed to generate scripts" }, { status: 500 });
        }
      }
    }

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
