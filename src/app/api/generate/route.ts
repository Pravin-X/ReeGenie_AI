import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import formats from "../../formats.json";

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
    const model = process.env.MODEL_LITE || "gemini-3.5-flash-lite";

    const prompt = `You are a viral social media manager.
Write 5 Instagram Reel scripts for a product in the "${category}" category.
Product attributes: ${attributes.join(", ")}.
Language/Tone: ${
      tone === "hindi" ? "Pure Hindi (in Devanagari script or exact Hindi phrasing, professional yet engaging)" :
      tone === "hinglish" ? "Hinglish (a mix of Hindi and English written in English alphabet, natural conversational style)" : 
      "English (modern, engaging, natural)"
    }.

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

    const jsonResp = await retryWithBackoff(async () => {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                format: { type: Type.STRING },
                hook: { type: Type.STRING },
                scenes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      shot: { type: Type.STRING },
                      voiceover: { type: Type.STRING },
                      overlay: { type: Type.STRING }
                    },
                    required: ["time", "shot", "voiceover", "overlay"]
                  }
                },
                caption: { type: Type.STRING },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["format", "hook", "scenes", "caption", "hashtags"]
            }
          }
        }
      });
      
      const text = response.text || "";
      const parsed = JSON.parse(text);
      
      if (!Array.isArray(parsed) || parsed.length !== 5) {
        throw new Error("Invalid format - expected array of 5 scripts");
      }
      
      return parsed;
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
    
    return NextResponse.json({ error: "Failed to generate scripts. Please try again." }, { status: 500 });
  }
}
