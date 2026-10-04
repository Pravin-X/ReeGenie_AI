import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const MOCK_AI = process.env.MOCK_AI === "true";
const apiKey = process.env.GEMINI_API_KEY;
const firecrawlKey = process.env.FIRECRAWL_API_KEY;

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
    const { url, tone = "english" } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Competitor URL is required" }, { status: 400 });
    }

    if (MOCK_AI) {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 3500));
      return NextResponse.json({
        hookPattern: "Negative Emotional Hook + Pattern Interrupt",
        pacing: "Rapid (Cuts every 1.2s)",
        format: "Us vs. Them",
        estimatedRetention: "Very High (82% past 3s)",
        keyTakeaways: [
          "Calls out the audience's pain point immediately in the first 2 seconds.",
          "Uses high-contrast text overlays to emphasize negative words.",
          "Transitions smoothly into a soft-sell solution without sounding salesy."
        ],
        counterScripts: [
          {
            format: "The Superior Alternative",
            hook: "Stop using [Competitor Method]. Do this instead...",
            scenes: [
              { time: "0:00-0:03", shot: "Show frustration with old method", voiceover: "If you're still doing this, you're wasting time.", overlay: "STOP DOING THIS 🛑" },
              { time: "0:03-0:08", shot: "Reveal your product as the smooth fix", voiceover: "This is the upgrade you actually need.", overlay: "The Upgrade ✨" }
            ],
            caption: "Upgrade your routine today! 🚀",
            hashtags: ["#upgrade", "#lifehack", "#betterway"]
          }
        ]
      });
    }

    if (!apiKey) {
      return NextResponse.json({ error: "API key is missing and mock mode is off." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.MODEL_LITE || "gemini-3.5-flash-lite";
    
    let scrapedContent = "";
    if (firecrawlKey) {
      try {
        const fcRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${firecrawlKey}`
          },
          body: JSON.stringify({ url: url, formats: ["markdown"] })
        });
        
        if (fcRes.ok) {
          const fcData = await fcRes.json();
          if (fcData.success && fcData.data?.markdown) {
            scrapedContent = fcData.data.markdown;
          }
        }
      } catch (err) {
        console.error("Firecrawl extraction failed", err);
      }
    }

    const prompt = `You are a world-class social media strategist and growth hacker for premium D2C brands.
Your task is to analyze the following competitor URL (it might be a social media post, video, or website).
URL: """${url}"""
${scrapedContent ? `\nHere is the scraped content from the URL:\n${scrapedContent.substring(0, 10000)}\n` : ""}
Since you cannot directly view the video, infer the most likely winning content strategy, hook patterns, and pacing for a top competitor in this niche based on the URL context and any scraped data (or just provide a highly realistic, professional analysis of a typical viral video in this space).

When generating the counter-scripts, use the ${
    tone === "hindi" ? "Pure Hindi (in Devanagari script, professional yet engaging)" :
    tone === "hinglish" ? "Hinglish (Hindi wording written in English alphabet, like 'Aap is reel ko save karlo')" : 
    "English"
  } tone for the voiceover, hook, and caption.

Output exactly a JSON object with the following schema:
{
  "hookPattern": "Short description of the hook strategy used (e.g. 'Visual pattern interrupt + Negative hook')",
  "pacing": "Description of the video pacing (e.g. 'Fast (scene change every 1.5s)')",
  "format": "The storytelling format (e.g. 'Problem/Agitation/Solution')",
  "estimatedRetention": "Guess the retention rate (e.g. 'High (70%+ past 3s)')",
  "keyTakeaways": ["Insight 1", "Insight 2", "Insight 3"],
  "counterScripts": [
    {
      "format": "Name of our counter-strategy format",
      "hook": "Our 3-second hook to steal their audience",
      "scenes": [
        {
          "time": "0:00-0:03",
          "shot": "Visual description",
          "voiceover": "What is being said",
          "overlay": "On-screen text"
        }
      ],
      "caption": "Suggested post caption",
      "hashtags": ["#tag1", "#tag2"]
    }
  ]
}

Provide exactly one counter-script that directly attacks or out-positions the competitor's approach. Do not return any markdown blocks, only the raw JSON string.`;

    const jsonResp = await retryWithBackoff(async () => {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "";
      return JSON.parse(text);
    });

    return NextResponse.json(jsonResp);
  } catch (error) {
    console.error("Competitor Spy API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    if (errorMessage.includes("overloaded") || errorMessage.includes("503") || errorMessage.includes("429")) {
      return NextResponse.json(
        { error: "AI model is temporarily overloaded. Please wait 30 seconds and try again. 🔄" }, 
        { status: 503 }
      );
    }
    
    return NextResponse.json({ error: "Failed to analyze competitor. Please try again." }, { status: 500 });
  }
}
