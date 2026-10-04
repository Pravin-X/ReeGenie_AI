"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FlaskConical, Sparkles, Copy, CheckCircle2, TrendingUp, AlertCircle, RefreshCw, Zap, ArrowRight, Activity
} from "lucide-react";

interface HookResult {
  type: string;
  hook: string;
  score: number;
  explanation: string;
}

const HOOK_TYPES = [
  { name: "The Contrarian", icon: AlertCircle, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", glow: "shadow-[0_0_15px_rgba(248,113,113,0.15)]" },
  { name: "The Data Drop", icon: TrendingUp, color: "text-blue", bg: "bg-blue/10", border: "border-blue/20", glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]" },
  { name: "The Story Loop", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", glow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]" },
  { name: "The Direct Benefit", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", glow: "shadow-[0_0_15px_rgba(74,222,128,0.15)]" },
  { name: "The Curiosity Gap", icon: Zap, color: "text-gold", bg: "bg-gold/10", border: "border-gold/20", glow: "shadow-[0_0_15px_rgba(242,182,50,0.15)]" },
];

export function HookLab() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<HookResult[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateHooks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setLoading(true);
    setResults([]);
    
    // Simulate AI generation delay
    setTimeout(() => {
      setLoading(false);
      setResults([
        {
          type: "The Contrarian",
          hook: `Stop doing [common practice] if you want to achieve ${topic}. Here's why you've been lied to.`,
          score: 94,
          explanation: "Challenges a deeply held belief, forcing viewers to stop scrolling to defend their stance or learn the 'truth'."
        },
        {
          type: "The Data Drop",
          hook: `92% of people fail at ${topic}. Here is the exact 3-step framework the top 8% use daily.`,
          score: 88,
          explanation: "Uses specific numbers to build immediate authority and promises a structured, easy-to-follow solution."
        },
        {
          type: "The Story Loop",
          hook: `I spent 3 years struggling with ${topic} until I discovered this one weird trick that changed everything.`,
          score: 91,
          explanation: "Builds empathy through a personal struggle and opens a curiosity loop that can only be closed by watching till the end."
        },
        {
          type: "The Direct Benefit",
          hook: `The ultimate guide to mastering ${topic} in under 24 hours (without spending a dime).`,
          score: 85,
          explanation: "Clearly states the value proposition, timeframe, and removes a common objection (cost)."
        },
        {
          type: "The Curiosity Gap",
          hook: `Everyone is talking about ${topic}, but nobody is mentioning this one hidden detail...`,
          score: 97,
          explanation: "Leverages FOMO (Fear Of Missing Out). Viewers feel compelled to know the 'secret' they are currently excluded from."
        }
      ]);
    }, 2500);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const reset = () => {
    setTopic("");
    setResults([]);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar relative h-full">
      {/* Header */}
      <header className="w-full border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-20 px-8 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-serif text-text">Hook Lab</h2>
          <p className="text-xs text-muted font-mono uppercase tracking-widest">A/B Test Your Hooks</p>
        </div>
        {results.length > 0 && (
          <button onClick={reset} className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors px-4 py-2">
            <RefreshCw size={16} /> New Experiment
          </button>
        )}
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12 relative">
        {/* Background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <AnimatePresence mode="wait">
          {!loading && results.length === 0 && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              className="max-w-2xl mx-auto text-center mt-12 relative z-10"
            >
              <div className="inline-flex p-4 bg-gradient-to-br from-surface to-background border border-gold/20 rounded-2xl mb-8 shadow-[0_0_30px_rgba(242,182,50,0.15)] relative group">
                <div className="absolute inset-0 bg-gold/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <FlaskConical size={40} className="text-gold relative z-10" />
              </div>
              <h1 className="text-5xl font-serif text-text mb-6 leading-tight">
                Engineer <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-blue to-purple-500">Viral Hooks</span>
              </h1>
              <p className="text-muted text-lg mb-10 max-w-lg mx-auto">
                Enter your video topic or a boring hook, and our AI will synthezise 5 psychologically-engineered variations designed to stop the scroll.
              </p>

              <form onSubmit={generateHooks} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-gold via-blue to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                <div className="relative flex items-center bg-surface border border-border/80 rounded-full p-2 shadow-2xl">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. How to lose weight without cardio..."
                    className="flex-1 bg-transparent border-none outline-none px-6 text-text placeholder:text-muted/50 h-12"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={!topic.trim()}
                    className="bg-gold text-background px-6 h-12 rounded-full font-bold flex items-center gap-2 hover:bg-gold-soft transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  >
                    Synthesize <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-[50vh] text-center relative z-10"
            >
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-t-2 border-gold rounded-full animate-spin" />
                <div className="absolute inset-2 border-r-2 border-blue rounded-full animate-spin animation-delay-150" style={{ animationDirection: "reverse" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FlaskConical size={32} className="text-gold animate-pulse" />
                </div>
              </div>
              <h2 className="text-3xl font-serif text-text mb-4">Synthesizing Hooks...</h2>
              <p className="text-muted text-lg max-w-md mx-auto">
                Applying psychological frameworks and analyzing viral patterns for your topic.
              </p>
            </motion.div>
          )}

          {results.length > 0 && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="relative z-10 pb-12"
            >
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-serif text-text mb-2">Your Engineered Hooks</h2>
                <p className="text-muted">Topic: <span className="text-gold">{topic}</span></p>
              </div>

              <div className="grid gap-6">
                {results.map((result, idx) => {
                  const typeConfig = HOOK_TYPES[idx % HOOK_TYPES.length];
                  const Icon = typeConfig.icon;
                  const isCopied = copiedIndex === idx;

                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-surface/80 backdrop-blur-md border border-border hover:border-border/80 rounded-[24px] p-6 lg:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center transition-all group hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)] relative overflow-hidden"
                    >
                      {/* Subtle background glow based on type */}
                      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none ${typeConfig.bg.replace('/10', '')}`} />
                      
                      <div className="flex-1 space-y-4 relative z-10 w-full">
                        <div className="flex items-center justify-between">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${typeConfig.bg} ${typeConfig.color} ${typeConfig.border} ${typeConfig.glow}`}>
                            <Icon size={14} />
                            {result.type}
                          </div>
                          
                          {/* Mobile copy button */}
                          <button 
                            onClick={() => copyToClipboard(result.hook, idx)}
                            className="md:hidden p-2 bg-background border border-border rounded-xl text-muted hover:text-text hover:border-gold/50 transition-colors"
                          >
                            {isCopied ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                          </button>
                        </div>
                        
                        <p className="text-2xl font-serif text-text leading-snug group-hover:text-white transition-colors">
                          &quot;{result.hook}&quot;
                        </p>
                        
                        <p className="text-sm text-muted leading-relaxed max-w-3xl">
                          <span className="font-bold text-text/80">Why it works:</span> {result.explanation}
                        </p>
                      </div>

                      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t border-border/50 md:border-t-0 pt-4 md:pt-0 relative z-10">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1.5 text-gold font-mono text-2xl font-bold mb-1">
                            <Activity size={20} className="text-gold/70" />
                            {result.score}
                          </div>
                          <p className="text-[10px] uppercase tracking-widest text-muted/70 font-bold">Viral Prob.</p>
                        </div>
                        
                        <button 
                          onClick={() => copyToClipboard(result.hook, idx)}
                          className={`hidden md:flex items-center justify-center w-12 h-12 rounded-2xl border transition-all ${
                            isCopied 
                              ? "bg-green-500/10 border-green-500/30 text-green-500" 
                              : "bg-background border-border text-muted hover:text-gold hover:border-gold/50 hover:shadow-[0_0_15px_rgba(242,182,50,0.15)]"
                          }`}
                        >
                          {isCopied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
