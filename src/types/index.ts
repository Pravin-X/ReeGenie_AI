export type Tone = "english" | "hinglish" | "hindi";

export interface AnalysisData {
  category: string;
  productName: string;
  attributes: string[];
}

export interface Scene {
  time: string;
  shot: string;
  voiceover: string;
  overlay: string;
}

export interface Script {
  format: string;
  hook: string;
  scenes: Scene[];
  caption: string;
  hashtags: string[];
}

export type AppStep = "landing" | "upload" | "analyzing" | "format-match" | "generating" | "results" | "export";

export type ContentPillar = "Educational" | "Entertaining" | "Promotional";

export interface CalendarDay {
  day: number;
  pillar: ContentPillar;
  hookIdea: string;
  description: string;
}

export interface CalendarData {
  summary: string;
  days: CalendarDay[];
}
