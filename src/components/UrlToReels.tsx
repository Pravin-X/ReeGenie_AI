"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as LinkIcon, Sparkles, RefreshCw, AlertCircle, ArrowRight } from "lucide-react";
import { Script, Tone } from "@/types";
import { Results } from "@/components/Results";
import { Export } from "@/components/Steps";

export function UrlToReels() {
  const [url, setUrl] = useState("");
  const [tone, setTone] = useState<Tone>("english");
  const [loading, setLoading] = useState(false);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [approvedIndices, setApprovedIndices] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"input" | "generating" | "results" | "export">("input");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setStep("generating");

    try {
      const res = await fetch("/api/url-to-reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, tone }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to generate scripts from URL");
      
      setScripts(data);
      setApprovedIndices(new Set());
      setStep("results");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStep("input");
    } finally {
      setLoading(false);
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

  const reset = () => {
    setUrl("");
    setScripts([]);
    setApprovedIndices(new Set());
    setError(null);
    setStep("input");
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar relative h-full">
      {/* Header */}
      <header className="w-full border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-10 px-8 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-serif text-text">URL to Reels</h2>
          <p className="text-xs text-muted font-mono uppercase tracking-widest">Blog/Shopify to video</p>
        </div>
        {step !== "input" && step !== "generating" && (
          <button onClick={reset} className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors px-4 py-2">
            <RefreshCw size={16} /> Start Over
          </button>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-950 border border-red-500 text-red-200 px-6 py-4 rounded-xl flex items-center gap-3 mb-8 mx-auto max-w-2xl shadow-lg">
              <AlertCircle size={24} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {step === "input" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto mt-12">
            <div className="text-center mb-12">
              <div className="inline-flex p-4 bg-cyan-500/10 rounded-full border border-cyan-500/20 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <LinkIcon size={32} className="text-cyan-400" />
              </div>
              <h2 className="text-4xl font-serif text-text mb-4">Turn Pages into Reels</h2>
              <p className="text-muted text-lg">Paste a Shopify product URL, a blog post, or an article, and our AI will extract the core message to generate high-converting short-form video scripts.</p>
            </div>

            <form onSubmit={handleGenerate} className="bg-surface border border-border p-8 rounded-[32px] shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-text mb-2">Target URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LinkIcon size={20} className="text-muted" />
                  </div>
                  <input 
                    type="url" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    placeholder="https://yourstore.com/products/glow-serum"
                    className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 text-text outline-none focus:border-cyan-500/50 transition-colors shadow-inner"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-text mb-2">Content Tone</label>
                <div className="flex bg-background border border-border rounded-xl p-1 shadow-sm w-fit">
                  <button
                    type="button"
                    onClick={() => setTone("english")}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      tone === "english" ? "bg-surface text-text shadow-sm border border-border" : "text-muted hover:text-text transparent"
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setTone("hinglish")}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      tone === "hinglish" ? "bg-surface text-text shadow-sm border border-border" : "text-muted hover:text-text transparent"
                    }`}
                  >
                    Hinglish
                  </button>
                  <button
                    type="button"
                    onClick={() => setTone("hindi")}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      tone === "hindi" ? "bg-surface text-text shadow-sm border border-border" : "text-muted hover:text-text transparent"
                    }`}
                  >
                    Hindi
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={!url || loading}
                className="w-full bg-cyan-500 text-background py-4 rounded-xl font-bold text-lg hover:bg-cyan-400 transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                Generate Scripts <ArrowRight size={20} />
              </button>
            </form>
          </motion.div>
        )}

        {step === "generating" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="relative mb-8">
              <div className="inline-flex p-5 bg-cyan-500/10 rounded-3xl border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                <Sparkles size={56} className="text-cyan-400 animate-pulse" />
              </div>
            </div>
            <h2 className="text-4xl font-serif text-text mb-4">Reading & Converting...</h2>
            <p className="text-muted text-lg max-w-md mx-auto">Scraping URL contents, extracting key value props, and structuring viral short-form scripts.</p>
          </motion.div>
        )}

        {step === "results" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full">
            <Results
              scripts={scripts}
              approvedIndices={approvedIndices}
              onApprove={handleApprove}
              onUpdateScript={handleUpdateScript}
            />
          </motion.div>
        )}
        
        {step === "export" && (
           <Export
             onRestart={reset}
             scripts={scripts}
             approvedIndices={approvedIndices}
           />
        )}
      </div>
    </div>
  );
}
