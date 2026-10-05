import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import * as cheerio from "cheerio";


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
  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  try {
    const { url, tone } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (MOCK_AI) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return NextResponse.json([
        {
          format: "Problem/Solution",
          hook: "Are you struggling with X?",
          scenes: [
            { time: "0:00-0:03", shot: "Show problem", voiceover: "Struggling?", overlay: "The struggle" },
            { time: "0:03-0:10", shot: "Show solution", voiceover: "Here is the fix", overlay: "The fix" }
          ],
          caption: "Get yours today! 🚀",
          hashtags: ["#solution", "#hack"]
        }
      ]);
    }

    if (!apiKey) {
      return NextResponse.json({ error: "API key is missing and mock mode is off." }, { status: 500 });
    }

    // 1. Fetch URL content using Firecrawl API (Data Extraction) or fallback to Cheerio
    let pageText = "";
    
    if (firecrawlKey) {
      try {
        console.log("Using Firecrawl API for advanced extraction...");
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
            pageText = fcData.data.markdown;
          }
        }
      } catch (err) {
        console.error("Firecrawl extraction failed, falling back...", err);
      }
    }

    // Fallback to Cheerio if Firecrawl wasn't used or failed
    if (!pageText) {
      try {
        const response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }
        const html = await response.text();
        const $ = cheerio.load(html);
        
        // Remove scripts, styles, etc.
        $('script, style, nav, footer, iframe, noscript').remove();
        
        // Extract text
        pageText = $('body').text().replace(/\s+/g, ' ').trim();
        
      } catch (e) {
        console.error("Error fetching URL:", e);
        return NextResponse.json({ error: "Failed to scrape the provided URL. Ensure it is accessible." }, { status: 400 });
      }
    }

    // Limit text length to prevent token overflow
    if (pageText.length > 15000) {
      pageText = pageText.substring(0, 15000);
    }

    if (!pageText) {
      return NextResponse.json({ error: "Could not extract any content from the URL." }, { status: 400 });
    }

    // 2. Generate Scripts with Gemini (with retry)
    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.MODEL_LITE || "gemini-3.5-flash-lite";

    const prompt = `You are an expert social media strategist and short-form video scriptwriter.
Analyze the following text extracted from a product page or blog post.
URL Text: """${pageText}"""

Based on this content, generate exactly 3 highly engaging, viral-worthy short-form video scripts (Reels/TikToks).
Use the ${
    tone === "hindi" ? "Pure Hindi (in Devanagari script, professional yet engaging)" :
    tone === "hinglish" ? "Hinglish (Hindi + English mix)" : 
    "English"
  } tone.

Output EXACTLY as a JSON array of objects with the following schema:
[
  {
    "format": "Name of the format (e.g., Problem/Solution, 3 Reasons Why, Storytime)",
    "hook": "The opening 3-second spoken or text hook",
    "scenes": [
      {
        "time": "e.g., 0:00-0:03",
        "shot": "Visual description of what's on screen",
        "voiceover": "What is being said",
        "overlay": "On-screen text"
      }
    ],
    "caption": "Suggested post caption",
    "hashtags": ["#tag1", "#tag2"]
  }
]
Do not return any markdown code blocks, just the raw JSON array. Make sure the JSON is valid.`;

    const jsonResp = await retryWithBackoff(async () => {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "";
      const parsed = JSON.parse(text);
      
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("Invalid response format");
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
