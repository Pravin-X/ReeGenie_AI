"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clapperboard, CalendarDays, FileText, FlaskConical, Search, Link as LinkIcon, AlertCircle, Sparkles
} from "lucide-react";
import { AppStep, Tone, AnalysisData, Script } from "@/types";
import { CalendarTool } from "@/components/CalendarTool";
import { Upload, Analyzing, FormatMatch, Generating, Export } from "@/components/Steps";
import { Results } from "@/components/Results";
import { UGCBriefs } from "@/components/UGCBriefs";
import { Logo } from "@/components/Logo";

type ToolId = "script-studio" | "calendar" | "ugc-briefs" | "hook-lab" | "competitor-spy" | "url-to-reels";

const TOOLS = [
  { id: "script-studio", name: "Script Studio", icon: Clapperboard, desc: "1 Photo to 5 Scripts" },
  { id: "calendar", name: "30-Day Calendar", icon: CalendarDays, desc: "Full month content plan" },
  { id: "ugc-briefs", name: "UGC Briefs", icon: FileText, desc: "PDF for creators" },
  { id: "hook-lab", name: "Hook Lab", icon: FlaskConical, desc: "A/B test your hooks" },
  { id: "competitor-spy", name: "Competitor Spy", icon: Search, desc: "Steal winning formats" },
  { id: "url-to-reels", name: "URL to Reels", icon: LinkIcon, desc: "Blog/Shopify to video" },
];

export function Dashboard({ onGoHome }: { onGoHome: () => void }) {
  const [activeTool, setActiveTool] = useState<ToolId>("script-studio");

  // Script Studio State
  const [step, setStep] = useState<AppStep>("upload");
  const [tone, setTone] = useState<Tone>("english");
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [approvedIndices, setApprovedIndices] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = async (base64: string) => {
    setImage(base64);
    setStep("analyzing");
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to analyze image");
      
      setAnalysis(data);
      setStep("format-match");
      
      setTimeout(() => {
        handleGenerate(data);
      }, 3000);
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to analyze image");
    }
  };

  const handleGenerate = async (analysisData: AnalysisData) => {
    setStep("generating");
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: analysisData.category,
          attributes: analysisData.attributes,
          tone,
        }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to generate scripts");
      
      setScripts(data);
      setApprovedIndices(new Set());
      setStep("results");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate scripts");
    }
  };

  const handleApprove = (index: number) => {
    const newApproved = new Set(approvedIndices);
    if (newApproved.has(index)) {
      newApproved.delete(index);
    } else {
      newApproved.add(index);
      if (newApproved.size === scripts.length) {
        setTimeout(() => setStep("export"), 800);
      }
    }
    setApprovedIndices(newApproved);
  };

  const handleUpdateScript = (index: number, newScript: Script) => {
    const newScripts = [...scripts];
    newScripts[index] = newScript;
    setScripts(newScripts);
  };

  const handleRestart = () => {
    setImage(null);
    setAnalysis(null);
    setScripts([]);
    setApprovedIndices(new Set());
    setError(null);
    setStep("upload");
  };

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      {/* Sidebar */}
      {/* Sidebar - Premium Redesign */}
      <aside className="w-[300px] border-r border-border bg-background flex flex-col z-20 relative overflow-hidden">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gold/5 blur-[50px] pointer-events-none" />
        
        <div className="p-8 border-b border-border/50 relative z-10 flex items-center justify-between">
          <button onClick={onGoHome} className="hover:opacity-80 transition-opacity focus:outline-none flex items-center gap-3">
            <Logo size="sm" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2 custom-scrollbar relative z-10">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted/70 px-4 mb-6">Pro Tools</p>
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as ToolId)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative ${
                  isActive 
                    ? "bg-gradient-to-r from-gold/10 to-transparent border border-gold/20 shadow-[0_0_20px_rgba(242,182,50,0.05)]" 
                    : "hover:bg-surface-raised border border-transparent"
                }`}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gold rounded-r-full shadow-[0_0_10px_rgba(242,182,50,0.8)]"
                  />
                )}
                
                <div className={`p-2.5 rounded-xl transition-all duration-300 ${isActive ? "bg-gold/20 text-gold shadow-[inset_0_0_10px_rgba(242,182,50,0.2)]" : "bg-surface text-muted group-hover:text-text group-hover:bg-border"}`}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <div className="text-left flex-1">
                  <h4 className={`text-sm font-semibold tracking-wide transition-colors ${isActive ? "text-gold" : "text-text group-hover:text-white"}`}>{tool.name}</h4>
                  <p className={`text-xs transition-colors mt-0.5 ${isActive ? "text-gold-soft/80" : "text-muted/70"}`}>{tool.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
        
        <div className="p-6 border-t border-border/50 bg-gradient-to-t from-surface/50 to-transparent relative z-10">
          <div className="bg-surface/80 backdrop-blur-md rounded-2xl p-4 border border-border/80 flex items-center gap-4 shadow-lg hover:border-gold/30 transition-all cursor-pointer group">
             <div className="relative">
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold via-blue to-purple-500 p-[2px]">
                 <div className="w-full h-full bg-background rounded-full flex items-center justify-center text-text font-bold text-sm">
                   D2C
                 </div>
               </div>
               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background shadow-sm" />
             </div>
             <div className="flex-1">
               <p className="text-sm font-bold text-text group-hover:text-white transition-colors">D2C Brand</p>
               <p className="text-[10px] text-gold-soft font-mono uppercase tracking-widest mt-0.5 flex items-center gap-1">
                 <Sparkles size={10} /> Pro Plan
               </p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        
        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-950 border border-red-500 text-red-200 px-6 py-3 rounded-lg flex items-center gap-3 shadow-lg"
            >
              <AlertCircle size={20} />
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-4 text-red-200/50 hover:text-red-200">Dismiss</button>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTool === "script-studio" ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            
            {/* Header for Script Studio Progress */}
            <header className="w-full border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-10 px-8 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-serif text-text">Script Studio</h2>
                <p className="text-xs text-muted font-mono uppercase tracking-widest">1 Photo to 5 Scripts</p>
              </div>
              <div className="flex gap-2">
                {["Upload", "Analyze", "Generate", "Review", "Export"].map((label, idx) => {
                  const map: Record<string, number> = {
                    "upload": 0, "analyzing": 1, "format-match": 1, 
                    "generating": 2, "results": 3, "export": 4
                  };
                  const activeIdx = map[step];
                  const isActive = idx === activeIdx;
                  const isPast = idx < activeIdx;
                  
                  return (
                    <div key={label} className="flex items-center">
                      <div className={`text-xs font-mono uppercase tracking-wide px-3 py-1.5 rounded-full ${
                        isActive ? "bg-gold/10 text-gold font-bold border border-gold/20 shadow-[0_0_15px_rgba(242,182,50,0.15)]" :
                        isPast ? "text-text border border-border bg-surface-raised" : "text-muted"
                      }`}>
                        {label}
                      </div>
                      {idx < 4 && <div className={`w-6 h-[1px] mx-1 ${isPast ? "bg-gold/50" : "bg-border"}`} />}
                    </div>
                  );
                })}
              </div>
            </header>

            <AnimatePresence mode="wait">
              {step === "upload" && <Upload key="upload" onImageSelected={handleImageSelected} tone={tone} setTone={setTone} />}
              {step === "analyzing" && image && <Analyzing key="analyzing" image={image} />}
              {step === "format-match" && analysis && <FormatMatch key="format-match" data={analysis} />}
              {step === "generating" && <Generating key="generating" />}
              {step === "results" && scripts.length > 0 && (
                <Results
                  key="results"
                  scripts={scripts}
                  approvedIndices={approvedIndices}
                  onApprove={handleApprove}
                  onUpdateScript={handleUpdateScript}
                />
              )}
              {step === "export" && (
                <Export
                  key="export"
                  onRestart={handleRestart}
                  scripts={scripts}
                  approvedIndices={approvedIndices}
                />
              )}
            </AnimatePresence>
          </div>
        ) : activeTool === "calendar" ? (
          <CalendarTool />
        ) : activeTool === "ugc-briefs" ? (
          <UGCBriefs />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-transparent to-surface/20 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
            <div className="text-center p-12 bg-surface/50 border border-border backdrop-blur-xl rounded-[32px] max-w-lg shadow-2xl relative z-10 group hover:border-gold/30 transition-all">
              <div className="absolute inset-0 bg-gold/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />
              <FlaskConical size={64} className="text-gold mx-auto mb-6 drop-shadow-[0_0_15px_rgba(242,182,50,0.4)]" />
              <h2 className="text-4xl font-serif text-text mb-4">Coming Soon</h2>
              <p className="text-lg text-muted">
                The <span className="text-gold font-bold">{TOOLS.find(t => t.id === activeTool)?.name}</span> module is currently in development for our Pro users. Stay tuned for massive updates!
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
