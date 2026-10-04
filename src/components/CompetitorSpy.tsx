"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Activity, Target, TrendingUp, Zap, Copy, Check, ChevronRight, ShieldAlert, Cpu } from "lucide-react";

type Scene = {
  time: string;
  shot: string;
  voiceover: string;
  overlay: string;
};

type CounterScript = {
  format: string;
  hook: string;
  scenes: Scene[];
  caption: string;
  hashtags: string[];
};

type AnalysisResult = {
  hookPattern: string;
  pacing: string;
  format: string;
  estimatedRetention: string;
  keyTakeaways: string[];
  counterScripts: CounterScript[];
};

export function CompetitorSpy() {
  const [step, setStep] = useState<"input" | "analyzing" | "results">("input");
  const [url, setUrl] = useState("");
  const [tone, setTone] = useState<"english" | "hinglish" | "hindi">("english");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");
    setStep("analyzing");

    try {
      const res = await fetch("/api/competitor-spy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, tone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze");

      setResult(data);
      setStep("results");
    } catch (err: any) {
      setError(err.message);
      setStep("input");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const reset = () => {
    setResult(null);
    setUrl("");
    setStep("input");
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-6 font-medium text-sm">
          <Eye size={16} />
          <span>Competitor Intelligence</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-text mb-6 tracking-tight">
          Competitor <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-500">Spy</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Input a viral competitor video. We'll reverse-engineer their hook, pacing, and retention strategy, and generate a counter-script to steal their audience.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <form onSubmit={handleAnalyze} className="relative bg-surface border border-border p-8 rounded-3xl shadow-xl">
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-3">
                    <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="mb-6">
                  <label htmlFor="comp-url" className="block text-sm font-bold text-text mb-3">
                    Competitor Post URL (IG Reel, TikTok, Shorts)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                      <Target size={20} />
                    </div>
                    <input
                      id="comp-url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://tiktok.com/@competitor/video/..."
                      required
                      className="w-full bg-background border border-border rounded-xl py-4 pl-12 pr-4 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-bold text-text mb-2">Counter-Script Tone</label>
                  <div className="flex bg-background border border-border rounded-xl p-1 shadow-sm w-fit">
                    <button
                      type="button"
                      onClick={() => setTone("english")}
                      className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        tone === "english" ? "bg-surface text-text shadow-sm border border-border" : "text-muted hover:text-text transparent"
                      }`}
                    >
                      🇺🇸 English
                    </button>
                    <button
                      type="button"
                      onClick={() => setTone("hinglish")}
                      className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        tone === "hinglish" ? "bg-surface text-text shadow-sm border border-border" : "text-muted hover:text-text transparent"
                      }`}
                    >
                      🇮🇳 Hinglish
                    </button>
                    <button
                      type="button"
                      onClick={() => setTone("hindi")}
                      className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        tone === "hindi" ? "bg-surface text-text shadow-sm border border-border" : "text-muted hover:text-text transparent"
                      }`}
                    >
                      🕉️ Hindi
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!url || loading}
                  className="w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-rose-400 hover:to-purple-500 transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  <Search size={20} />
                  Initiate Scan
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {step === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-rose-500/20 blur-[50px] rounded-full"></div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="relative z-10 w-32 h-32 rounded-full border-2 border-rose-500/30 border-t-rose-500 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.3)]"
              >
                <Cpu size={40} className="text-rose-400" />
              </motion.div>
              <motion.div 
                className="absolute inset-0 z-0 rounded-full border border-purple-500/20"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <h2 className="text-3xl font-serif text-text mb-4">Breaching Competitor Defenses...</h2>
            <div className="flex flex-col gap-3 text-muted font-mono text-sm">
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>[1/3] Extracting hook metadata & visual patterns...</motion.span>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>[2/3] Analyzing pacing & retention markers...</motion.span>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>[3/3] Generating aggressive counter-scripts...</motion.span>
            </div>
          </motion.div>
        )}

        {step === "results" && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Analytics */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-surface border border-rose-500/20 p-6 rounded-3xl relative overflow-hidden group hover:border-rose-500/40 transition-colors">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-transparent"></div>
                  <h3 className="text-rose-400 font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Activity size={16} /> Threat Analysis
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs text-muted mb-1 font-mono uppercase">Detected Hook Pattern</p>
                      <p className="text-text font-medium text-lg leading-tight">{result.hookPattern}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1 font-mono uppercase">Pacing Strategy</p>
                      <div className="flex items-center gap-2">
                        <Zap size={14} className="text-yellow-400" />
                        <p className="text-text font-medium">{result.pacing}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1 font-mono uppercase">Est. Retention</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-emerald-400" />
                        <p className="text-emerald-400 font-bold">{result.estimatedRetention}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface border border-border p-6 rounded-3xl">
                  <h3 className="text-text font-bold mb-4 flex items-center gap-2">
                    <Target size={18} className="text-purple-400" /> Key Vulnerabilities
                  </h3>
                  <ul className="space-y-3">
                    {result.keyTakeaways.map((takeaway, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                        <span className="text-sm text-muted leading-relaxed">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Counter Scripts */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-serif text-text flex items-center gap-3">
                  <ShieldAlert className="text-rose-500" /> Suggested Counter-Attack
                </h3>
                
                {result.counterScripts.map((script, idx) => {
                  const formatContent = `HOOK: ${script.hook}\n\n` + 
                    script.scenes.map(s => `[${s.time}] ${s.shot}\nVO: ${s.voiceover}\nTEXT: ${s.overlay}`).join('\n\n') +
                    `\n\nCAPTION: ${script.caption}\n${script.hashtags.join(' ')}`;

                  return (
                    <div key={idx} className="bg-surface border border-border rounded-3xl overflow-hidden hover:border-purple-500/30 transition-colors">
                      <div className="p-4 bg-background/50 border-b border-border flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                            {script.format}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(formatContent, idx)}
                          className="p-2 text-muted hover:text-text hover:bg-surface rounded-lg transition-colors"
                          title="Copy counter-script"
                        >
                          {copiedIndex === idx ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                        </button>
                      </div>

                      <div className="p-6 md:p-8">
                        <div className="mb-6 p-5 bg-purple-500/5 border border-purple-500/10 rounded-2xl relative overflow-hidden group">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
                          <p className="text-xs text-purple-400 font-mono mb-2 uppercase tracking-widest">Killer Hook</p>
                          <p className="text-xl md:text-2xl font-bold text-text leading-tight">{script.hook}</p>
                        </div>

                        <div className="space-y-4 mb-8">
                          {script.scenes.map((scene, sIdx) => (
                            <div key={sIdx} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl hover:bg-background/50 transition-colors border border-transparent hover:border-border">
                              <div className="shrink-0 w-24">
                                <span className="inline-block px-2 py-1 bg-surface text-muted text-xs font-mono rounded border border-border">
                                  {scene.time}
                                </span>
                              </div>
                              <div className="flex-1 space-y-3">
                                <div>
                                  <span className="text-xs font-bold text-muted uppercase">Visual</span>
                                  <p className="text-sm text-text mt-1">{scene.shot}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="bg-surface p-3 rounded-lg border border-border/50">
                                    <span className="text-xs font-bold text-blue-400 uppercase flex items-center gap-1"><Zap size={12}/> Audio</span>
                                    <p className="text-sm text-text mt-1 font-medium">{scene.voiceover}</p>
                                  </div>
                                  <div className="bg-surface p-3 rounded-lg border border-border/50">
                                    <span className="text-xs font-bold text-pink-400 uppercase flex items-center gap-1"><Target size={12}/> Text</span>
                                    <p className="text-sm text-text mt-1 font-bold">"{scene.overlay}"</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-6 border-t border-border">
                          <p className="text-sm text-muted mb-3">{script.caption}</p>
                          <div className="flex flex-wrap gap-2">
                            {script.hashtags.map((tag, tIdx) => (
                              <span key={tIdx} className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center mt-12 pt-8 border-t border-border">
              <button
                onClick={reset}
                className="px-8 py-3 bg-surface border border-border text-text rounded-xl font-medium hover:bg-background transition-colors flex items-center gap-2"
              >
                Scan Another Competitor <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
