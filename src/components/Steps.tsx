"use client";

import { motion } from "framer-motion";
import { Upload as UploadIcon, Sparkles, Image as ImageIcon, FileVideo, Clock, FileText, CheckCircle2, Copy, Download, Check, X, Zap, TrendingUp, Target } from "lucide-react";
import { Tone, AnalysisData, Script } from "@/types";
import formatsList from "@/app/formats.json";
import { Logo } from "@/components/Logo";
import { AtomAnimation } from "@/components/AtomAnimation";

export function Landing({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col w-full pb-10 relative"
    >
      {/* Fixed Full-Page Animated Backgrounds */}
      <div className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none -z-20">
        
        {/* Animated Aurora Background (Glowing Orbs) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[100vh] flex justify-center items-center opacity-60">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], x: ["-10%", "10%", "-10%"], y: ["10%", "-10%", "10%"] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute w-[600px] h-[600px] bg-gold/15 blur-[120px] rounded-full mix-blend-screen"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0], x: ["10%", "-10%", "10%"], y: ["-10%", "10%", "-10%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-[500px] h-[500px] bg-blue/15 blur-[120px] rounded-full mix-blend-screen translate-x-32"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], x: ["0%", "20%", "0%"], y: ["-20%", "0%", "-20%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute w-[700px] h-[700px] bg-purple-500/10 blur-[150px] rounded-full mix-blend-screen -translate-x-32"
          />
        </div>

        {/* Stardust / Shooting Stars Background */}
        <div className="absolute inset-0">
          <div className="stars-small" />
          <div className="stars-medium" />
          <div className="stars-large" />
          
          {/* Guaranteed Infinite Loop Shooting Stars via Framer Motion */}
          {[
            { top: "20%", left: "10%", duration: 3, delay: 0 },
            { top: "60%", left: "60%", duration: 4, delay: 1 },
            { top: "40%", left: "80%", duration: 3.5, delay: 2 },
            { top: "80%", left: "20%", duration: 4.5, delay: 0.5 },
            { top: "10%", left: "70%", duration: 3.8, delay: 2.5 },
            { top: "50%", left: "30%", duration: 5, delay: 1.5 },
          ].map((star, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute w-[150px] h-[2px] bg-gradient-to-r from-transparent to-[#F2B632] rounded-full z-0"
              style={{
                top: star.top,
                left: star.left,
                rotate: "-35deg",
                boxShadow: "0 0 15px 2px rgba(242,182,50,0.6)",
              }}
              animate={{
                x: ["-50vw", "10vw", "100vw", "100vw"],
                opacity: [0, 1, 0, 0]
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
                ease: "linear",
                times: [0, 0.1, 0.8, 1]
              }}
            />
          ))}
        </div>
      </div>

      {/* SECTION 1: HERO */}
      <div className="flex flex-col items-center text-center mt-12 max-w-5xl mx-auto px-4 mb-32 relative z-10">
        
        <Logo size="lg" className="mb-12 relative z-10" />

        {/* 3D Atom Background Animation from Video Reference */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-70 mix-blend-screen mt-10 pointer-events-none scale-150 md:scale-[2]">
          <AtomAnimation />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-raised border border-gold/30 text-xs font-mono text-gold mb-8 uppercase tracking-widest shadow-[0_0_15px_rgba(242,182,50,0.15)] relative z-10">
          <Sparkles size={14} /> The Ultimate D2C Content Engine
        </div>
        <h1 className="text-6xl md:text-8xl font-serif leading-tight tracking-tight mb-8 text-text relative z-10">
          Scale your brand with <br />
          <span className="text-gold-soft italic">AI-Driven Content</span>
        </h1>
        <p className="text-xl text-muted mb-12 font-sans max-w-2xl leading-relaxed relative z-10">
          Stop guessing what works. From AI-generated reel scripts and 30-day calendars to UGC briefs and competitor tracking—everything a premium D2C brand needs to go viral.
        </p>
        <button
          onClick={onStart}
          className="bg-gold text-background px-10 py-5 rounded-full font-bold text-lg hover:bg-gold-soft transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(242,182,50,0.4)] hover:shadow-[0_0_60px_rgba(242,182,50,0.6)] flex items-center gap-3 relative z-10"
        >
          <Sparkles size={24} />
          Access Pro Suite
        </button>
      </div>

      {/* SECTION 2: THE TOOL SUITE */}
      <div className="w-full bg-surface/50 backdrop-blur-3xl py-32 border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-serif text-text mb-6">A Studio in Your Browser</h2>
            <p className="text-muted text-xl max-w-2xl mx-auto">Six powerful tools engineered specifically for high-growth e-commerce and D2C brands.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tool 1 */}
            <div className="bg-background/80 backdrop-blur-xl p-10 rounded-[32px] border border-border hover:border-gold/50 transition-all group hover:-translate-y-2 shadow-xl hover:shadow-[0_20px_40px_rgba(242,182,50,0.1)]">
              <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mb-8 border border-gold/20 group-hover:bg-gold/20 transition-colors">
                <Sparkles size={32} className="text-gold" />
              </div>
              <h3 className="text-2xl font-bold text-text mb-4 font-serif">Script Studio</h3>
              <p className="text-muted leading-relaxed text-lg">Upload 1 product photo and instantly generate 5 viral-engineered Reel scripts with exact pacing and audio hooks.</p>
            </div>

            {/* Tool 2 */}
            <div className="bg-background/80 backdrop-blur-xl p-10 rounded-[32px] border border-border hover:border-blue/50 transition-all group hover:-translate-y-2 shadow-xl hover:shadow-[0_20px_40px_rgba(60,116,255,0.1)]">
              <div className="w-16 h-16 bg-blue/10 rounded-2xl flex items-center justify-center mb-8 border border-blue/20 group-hover:bg-blue/20 transition-colors">
                <Clock size={32} className="text-blue" />
              </div>
              <h3 className="text-2xl font-bold text-text mb-4 font-serif">30-Day Calendar</h3>
              <p className="text-muted leading-relaxed text-lg">Never run out of ideas. Generate a full month of balanced educational, entertaining, and promotional content.</p>
            </div>

            {/* Tool 3 */}
            <div className="bg-background/80 backdrop-blur-xl p-10 rounded-[32px] border border-border hover:border-purple-500/50 transition-all group hover:-translate-y-2 shadow-xl hover:shadow-[0_20px_40px_rgba(168,85,247,0.1)]">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                <FileText size={32} className="text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-text mb-4 font-serif">UGC Briefs</h3>
              <p className="text-muted leading-relaxed text-lg">Generate professional PDF briefs for creators in seconds. Ensure every UGC video aligns perfectly with your brand guidelines.</p>
            </div>
            
            {/* Tool 4 */}
            <div className="bg-background/80 backdrop-blur-xl p-10 rounded-[32px] border border-border hover:border-emerald-500/50 transition-all group hover:-translate-y-2 shadow-xl hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)]">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-text mb-4 font-serif">Hook Lab</h3>
              <p className="text-muted leading-relaxed text-lg">A/B test your video hooks before filming. AI scores your hooks based on pattern-interrupt algorithms and retention probability.</p>
            </div>
            
            {/* Tool 5 */}
            <div className="bg-background/80 backdrop-blur-xl p-10 rounded-[32px] border border-border hover:border-rose-500/50 transition-all group hover:-translate-y-2 shadow-xl hover:shadow-[0_20px_40px_rgba(244,63,94,0.1)]">
              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-8 border border-rose-500/20 group-hover:bg-rose-500/20 transition-colors">
                <FileVideo size={32} className="text-rose-400" />
              </div>
              <h3 className="text-2xl font-bold text-text mb-4 font-serif">Competitor Spy</h3>
              <p className="text-muted leading-relaxed text-lg">Input a competitor&apos;s URL and instantly reverse-engineer their winning content formats and transcription strategies.</p>
            </div>
            
            {/* Tool 6 */}
            <div className="bg-background/80 backdrop-blur-xl p-10 rounded-[32px] border border-border hover:border-cyan-500/50 transition-all group hover:-translate-y-2 shadow-xl hover:shadow-[0_20px_40px_rgba(6,182,212,0.1)]">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-8 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                <Copy size={32} className="text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-text mb-4 font-serif">URL to Reels</h3>
              <p className="text-muted leading-relaxed text-lg">Paste a Shopify product page or blog post URL, and let AI transform the copy into high-converting short-form video scripts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: WHY REELGENIE */}
      <div className="w-full py-32 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue/10 border border-blue/20 text-xs font-mono text-blue mb-6 uppercase tracking-widest shadow-inner">
              <Zap size={14} /> The Unfair Advantage
            </div>
            <h2 className="text-5xl md:text-6xl font-serif text-text mb-6">Why Top Brands Choose ReelGenie</h2>
            <p className="text-muted text-xl max-w-2xl mx-auto">Stop paying $5,000/mo to generic agencies. Bring enterprise-grade viral engineering in-house.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Generic AI */}
            <div className="bg-surface/30 p-8 rounded-[32px] border border-border/50 backdrop-blur-sm opacity-80">
              <h3 className="text-xl font-bold text-muted mb-6 flex items-center gap-3">
                <X className="text-rose-500/50" /> Generic AI Tools
              </h3>
              <ul className="space-y-5 text-muted/80">
                <li className="flex gap-3"><X size={20} className="text-border shrink-0" /> Sounds robotic and soulless</li>
                <li className="flex gap-3"><X size={20} className="text-border shrink-0" /> No understanding of pacing</li>
                <li className="flex gap-3"><X size={20} className="text-border shrink-0" /> Misses the core product hook</li>
                <li className="flex gap-3"><X size={20} className="text-border shrink-0" /> Zero direct-response strategy</li>
              </ul>
            </div>

            {/* ReelGenie (Highlight) */}
            <div className="bg-gradient-to-b from-surface to-background p-1 rounded-[32px] relative transform md:-translate-y-4 shadow-[0_0_50px_rgba(242,182,50,0.15)] group">
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-gold/50 via-gold/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gold rounded-t-full shadow-[0_0_20px_rgba(242,182,50,1)]" />
              
              <div className="bg-surface rounded-[31px] p-8 h-full relative z-10 border border-gold/10">
                <h3 className="text-2xl font-bold text-gold mb-6 flex items-center gap-3 font-serif">
                  <Sparkles size={24} className="text-gold" /> ReelGenie
                </h3>
                <ul className="space-y-6 text-text">
                  <li className="flex gap-3 items-start"><Check size={20} className="text-gold shrink-0 mt-0.5" /> <span className="font-semibold text-lg leading-tight">Engineered for Virality</span></li>
                  <li className="flex gap-3 items-start"><Check size={20} className="text-gold shrink-0 mt-0.5" /> <span className="text-muted leading-relaxed">Perfect timing, pacing, & audio cues</span></li>
                  <li className="flex gap-3 items-start"><Check size={20} className="text-gold shrink-0 mt-0.5" /> <span className="text-muted leading-relaxed">Visual intelligence extracts key USPs</span></li>
                  <li className="flex gap-3 items-start"><Check size={20} className="text-gold shrink-0 mt-0.5" /> <span className="text-muted leading-relaxed">Built specifically for D2C growth</span></li>
                </ul>
                <div className="mt-8 pt-8 border-t border-border flex items-center justify-between text-sm font-mono text-muted uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Target size={16} className="text-gold-soft"/> High Conv.</span>
                  <span className="flex items-center gap-2"><TrendingUp size={16} className="text-gold-soft"/> Scalable</span>
                </div>
              </div>
            </div>

            {/* Agencies */}
            <div className="bg-surface/30 p-8 rounded-[32px] border border-border/50 backdrop-blur-sm opacity-80">
              <h3 className="text-xl font-bold text-muted mb-6 flex items-center gap-3">
                <X className="text-rose-500/50" /> Trad. Agencies
              </h3>
              <ul className="space-y-5 text-muted/80">
                <li className="flex gap-3"><X size={20} className="text-border shrink-0" /> $3000-$5000+ retainers</li>
                <li className="flex gap-3"><X size={20} className="text-border shrink-0" /> 2-3 week turnaround times</li>
                <li className="flex gap-3"><X size={20} className="text-border shrink-0" /> Endless back-and-forth emails</li>
                <li className="flex gap-3"><X size={20} className="text-border shrink-0" /> Limited monthly revisions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: IMPACT & CTA */}
      <div className="w-full py-32 border-t border-border relative overflow-hidden bg-surface/20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-serif text-text mb-6">Engineered for Exponential Growth</h2>
            <p className="text-muted text-xl max-w-2xl mx-auto">
              We don&apos;t just generate scripts. We analyze thousands of viral hooks to engineer content that actually converts viewers into buyers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-32">
            {/* Metric 1 */}
            <div className="group relative rounded-[32px] p-[1px] bg-gradient-to-b from-gold/30 via-surface to-background transition-all hover:-translate-y-2 shadow-[0_0_40px_rgba(242,182,50,0.05)] hover:shadow-[0_0_60px_rgba(242,182,50,0.15)] overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gold rounded-full shadow-[0_0_20px_rgba(242,182,50,1)] opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-b from-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="bg-surface/90 backdrop-blur-2xl rounded-[31px] p-10 h-full relative z-10 flex flex-col items-center text-center shadow-inner">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay" />
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/20 blur-[50px] rounded-full group-hover:bg-gold/30 transition-all duration-700" />
                
                <div className="text-6xl md:text-7xl font-serif text-gold mb-6 drop-shadow-[0_0_15px_rgba(242,182,50,0.5)]">10x</div>
                <div className="text-xl font-bold text-text mb-3">Faster Production</div>
                <p className="text-muted/80 text-sm leading-relaxed max-w-[250px]">Go from idea to ready-to-shoot script in seconds, not hours.</p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="group relative rounded-[32px] p-[1px] bg-gradient-to-b from-blue/30 via-surface to-background transition-all hover:-translate-y-2 shadow-[0_0_40px_rgba(59,130,246,0.05)] hover:shadow-[0_0_60px_rgba(59,130,246,0.15)] overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-blue rounded-full shadow-[0_0_20px_rgba(59,130,246,1)] opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-b from-blue/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="bg-surface/90 backdrop-blur-2xl rounded-[31px] p-10 h-full relative z-10 flex flex-col items-center text-center shadow-inner">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay" />
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue/20 blur-[50px] rounded-full group-hover:bg-blue/30 transition-all duration-700" />
                
                <div className="text-6xl md:text-7xl font-serif text-blue mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">40%</div>
                <div className="text-xl font-bold text-text mb-3">Lower CAC</div>
                <p className="text-muted/80 text-sm leading-relaxed max-w-[250px]">Better retention frameworks mean higher watch time and cheaper ad costs.</p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="group relative rounded-[32px] p-[1px] bg-gradient-to-b from-purple-500/30 via-surface to-background transition-all hover:-translate-y-2 shadow-[0_0_40px_rgba(168,85,247,0.05)] hover:shadow-[0_0_60px_rgba(168,85,247,0.15)] overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-purple-400 rounded-full shadow-[0_0_20px_rgba(168,85,247,1)] opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="bg-surface/90 backdrop-blur-2xl rounded-[31px] p-10 h-full relative z-10 flex flex-col items-center text-center shadow-inner">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay" />
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full group-hover:bg-purple-500/30 transition-all duration-700" />
                
                <div className="text-6xl md:text-7xl font-serif text-purple-400 mb-6 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">100%</div>
                <div className="text-xl font-bold text-text mb-3">On-Brand</div>
                <p className="text-muted/80 text-sm leading-relaxed max-w-[250px]">AI trained specifically on top-performing D2C direct-response strategies.</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-4xl bg-gradient-to-r from-surface to-background p-12 rounded-[40px] border border-gold/30 text-center relative overflow-hidden shadow-[0_0_60px_rgba(242,182,50,0.15)] group">
            <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gold rounded-b-full shadow-[0_0_30px_rgba(242,182,50,1)]" />
            
            <h2 className="text-4xl md:text-5xl font-serif text-text mb-6 relative z-10">Ready to dominate your niche?</h2>
            <p className="text-xl text-muted mb-10 max-w-2xl mx-auto relative z-10">Join the next generation of D2C brands automating their organic and paid content engines.</p>
            <button
              onClick={onStart}
              className="bg-gold text-background px-12 py-5 rounded-full font-bold text-lg hover:bg-gold-soft transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(242,182,50,0.4)] hover:shadow-[0_0_60px_rgba(242,182,50,0.6)] flex items-center gap-3 relative z-10 mx-auto"
            >
              <Sparkles size={24} />
              Start Generating Now
            </button>
          </div>
        </div>
      </div>

    </motion.div>
  );
}

export function Upload({
  onImageSelected,
  tone,
  setTone
}: {
  onImageSelected: (base64: string) => void;
  tone: Tone;
  setTone: (t: Tone) => void;
}) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageSelected(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-3xl mx-auto mt-20 w-full px-4"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h2 className="text-4xl font-serif text-text mb-2">Upload Product</h2>
          <p className="text-muted text-lg">Drop a high-quality photo to begin.</p>
        </div>
        <div className="flex bg-surface-raised border border-border rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setTone("english")}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              tone === "english" ? "bg-background text-text shadow-sm border border-border" : "text-muted hover:text-text transparent"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setTone("hinglish")}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              tone === "hinglish" ? "bg-background text-text shadow-sm border border-border" : "text-muted hover:text-text transparent"
            }`}
          >
            Hinglish
          </button>
        </div>
      </div>

      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center w-full h-[400px] border border-dashed border-gold/30 rounded-[32px] bg-gradient-to-b from-surface/50 to-surface hover:from-surface-raised hover:to-surface transition-all cursor-pointer group relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.2)]"
      >
        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-24 h-24 bg-gradient-to-br from-gold/20 to-gold/5 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(242,182,50,0.15)] border border-gold/20">
          <UploadIcon size={40} className="text-gold" />
        </div>
        <p className="text-2xl font-serif text-text mb-3">Click or drag image here</p>
        <p className="text-muted font-mono text-sm uppercase tracking-widest">PNG, JPG up to 10MB</p>
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>
    </motion.div>
  );
}

export function Analyzing({ image }: { image: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto mt-20 w-full px-4 flex flex-col md:flex-row gap-16 items-center"
    >
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-[32px] overflow-hidden border-2 border-blue/40 shadow-[0_0_40px_rgba(60,116,255,0.2)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Product" className="object-cover w-full h-full opacity-80" />
          <div className="absolute inset-0 bg-blue/10 mix-blend-overlay" />
          <motion.div
            animate={{ top: ["-10%", "110%", "-10%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-white shadow-[0_0_20px_4px_rgba(60,116,255,1)] z-10 opacity-80"
          />
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col items-start space-y-6">
        <div className="p-4 bg-blue/10 rounded-2xl border border-blue/20">
          <Sparkles size={40} className="text-blue animate-pulse" />
        </div>
        <h2 className="text-5xl font-serif text-text">Decoding Magic...</h2>
        <p className="text-muted text-xl leading-relaxed">Extracting visual features, category, and core selling propositions using Gemini vision models.</p>
        <div className="flex gap-4 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="bg-surface-raised border border-border text-text px-5 py-2.5 rounded-full font-mono text-sm uppercase flex items-center gap-3 shadow-md"
          >
            <ImageIcon size={18} className="text-blue" /> Scanning Pixels
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function FormatMatch({ data }: { data: AnalysisData }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto mt-20 w-full px-4"
    >
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue/20 to-blue/5 border border-blue/30 text-blue px-6 py-2 rounded-full font-mono text-sm uppercase tracking-widest mb-6 shadow-sm"
        >
          <Sparkles size={16} /> Category: {data.category}
        </motion.div>
        <h2 className="text-5xl font-serif text-text mb-4">Finding the Perfect Angles</h2>
        <p className="text-muted text-xl">Aligning <span className="text-text font-bold">{data.productName}</span> with proven reel formats.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {formatsList.map((format, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="bg-gradient-to-br from-surface to-background border border-blue/20 rounded-[24px] p-8 shadow-[0_0_30px_rgba(60,116,255,0.05)] hover:border-blue/50 transition-colors group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue/5 rounded-full blur-3xl group-hover:bg-blue/10 transition-colors" />
            <div className="flex items-center gap-4 mb-6 text-blue relative z-10">
              <div className="p-3 bg-blue/10 rounded-xl">
                <FileVideo size={28} />
              </div>
              <h3 className="font-bold text-xl text-text leading-tight">{format.format}</h3>
            </div>
            <p className="text-base text-muted leading-relaxed relative z-10">{format.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function Generating() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto mt-20 w-full px-4 text-center"
    >
      <div className="inline-flex p-5 bg-gold/10 rounded-3xl border border-gold/20 mb-8 shadow-[0_0_30px_rgba(242,182,50,0.15)]">
        <Sparkles size={56} className="text-gold animate-pulse" />
      </div>
      <h2 className="text-5xl md:text-6xl font-serif text-text mb-6">Crafting Masterpieces...</h2>
      <p className="text-muted text-xl mb-16 max-w-2xl mx-auto leading-relaxed">Drafting viral hooks, breaking down scenes, matching audio vibes, and writing SEO captions.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-[24px] h-72 overflow-hidden relative shadow-lg">
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: i * 0.2 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
            />
            <div className="p-6 space-y-6">
              <div className="h-5 bg-surface-raised rounded-md w-3/4"></div>
              <div className="h-24 bg-surface-raised rounded-xl w-full"></div>
              <div className="h-4 bg-surface-raised rounded-md w-1/2"></div>
              <div className="h-4 bg-surface-raised rounded-md w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 inline-flex items-center gap-3 bg-surface border border-border px-6 py-3 rounded-full font-mono text-gold text-lg shadow-sm">
        <Clock size={24} className="animate-spin-slow" /> Estimated time: ~45s
      </div>
    </motion.div>
  );
}

export function Export({
  onRestart,
  scripts,
  approvedIndices
}: {
  onRestart: () => void;
  scripts: Script[];
  approvedIndices: Set<number>;
}) {
  const formatScriptsText = () => {
    return Array.from(approvedIndices)
      .map(index => scripts[index])
      .map((script, i) => {
        let text = `SCRIPT ${i + 1}: ${script.format}\n`;
        text += `HOOK: ${script.hook}\n\n`;
        text += `SCENES:\n`;
        script.scenes.forEach((scene, j) => {
          text += `  Scene ${j + 1} (${scene.time})\n`;
          text += `  - Shot: ${scene.shot}\n`;
          text += `  - Voiceover: ${scene.voiceover}\n`;
          if (scene.overlay) text += `  - Overlay: ${scene.overlay}\n`;
          text += `\n`;
        });
        text += `CAPTION: ${script.caption}\n`;
        text += `HASHTAGS: ${script.hashtags.join(" ")}\n`;
        return text;
      })
      .join("\n" + "=".repeat(40) + "\n\n");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatScriptsText());
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy to clipboard.");
    }
  };

  const handleDownload = () => {
    const text = formatScriptsText();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reelgenie_scripts.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="max-w-3xl mx-auto mt-20 text-center px-4 relative"
    >
      <div className="absolute inset-0 bg-gold/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
      
      <div className="inline-flex p-6 bg-surface border border-border rounded-full shadow-[0_0_50px_rgba(242,182,50,0.15)] mb-8 relative group">
        <div className="absolute inset-0 bg-gold/10 rounded-full blur-xl group-hover:bg-gold/20 transition-colors" />
        <CheckCircle2 size={72} className="text-gold relative z-10" />
      </div>
      
      <h2 className="text-6xl md:text-7xl font-serif text-text mb-6">Ready to Shoot.</h2>
      <p className="text-2xl text-muted mb-16 font-sans max-w-xl mx-auto leading-relaxed">
        You&apos;ve got <span className="text-gold font-bold">{approvedIndices.size} approved {approvedIndices.size === 1 ? 'script' : 'scripts'}</span> engineered for engagement, ready for production.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <button
          onClick={handleCopy}
          className="bg-surface/80 backdrop-blur-md text-text px-10 py-5 rounded-full font-bold text-lg hover:bg-surface-raised transition-all border border-border hover:border-gold/30 flex items-center justify-center gap-3 shadow-lg group"
        >
          <Copy size={24} className="text-muted group-hover:text-gold transition-colors" />
          Copy All to Clipboard
        </button>
        <button
          onClick={handleDownload}
          className="bg-gradient-to-r from-gold to-gold-soft text-background px-10 py-5 rounded-full font-bold text-lg hover:brightness-110 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(242,182,50,0.4)] flex items-center justify-center gap-3"
        >
          <Download size={24} />
          Download .txt
        </button>
      </div>

      <div className="mt-24 pt-10 border-t border-border/50">
        <button
          onClick={onRestart}
          className="text-muted hover:text-gold font-mono text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <Sparkles size={16} /> Generate another batch
        </button>
      </div>
    </motion.div>
  );
}
