"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileVideo, Clock, Type, Mic, Hash, Save, Sparkles } from "lucide-react";
import { Script } from "@/types";

export function Results({
  scripts,
  approvedIndices,
  onApprove,
  onUpdateScript
}: {
  scripts: Script[];
  approvedIndices: Set<number>;
  onApprove: (index: number) => void;
  onUpdateScript: (index: number, newScript: Script) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeScript = scripts[activeIndex];

  const handleEdit = (field: keyof Script, value: Script[keyof Script]) => {
    onUpdateScript(activeIndex, { ...activeScript, [field]: value });
  };

  const handleSceneEdit = (sceneIndex: number, field: string, value: string) => {
    const newScenes = [...activeScript.scenes];
    newScenes[sceneIndex] = { ...newScenes[sceneIndex], [field]: value };
    handleEdit("scenes", newScenes);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="max-w-7xl mx-auto mt-8 w-full px-4 flex flex-col lg:flex-row gap-8 items-start h-[calc(100vh-140px)]"
    >
      {/* Left Column: Script Tabs */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar pb-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-gold" />
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted font-bold">Generated Scripts</h3>
        </div>
        
        {scripts.map((script, idx) => {
          const isActive = activeIndex === idx;
          const isApproved = approvedIndices.has(idx);
          
          return (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-full text-left p-6 rounded-[24px] transition-all duration-300 relative overflow-hidden group ${
                isActive
                  ? "bg-gradient-to-br from-surface-raised/80 to-surface/40 border border-gold/50 shadow-[0_8px_30px_rgba(242,182,50,0.2)] scale-[1.02]"
                  : "bg-surface/30 backdrop-blur-sm border border-border/50 hover:bg-surface/80 hover:border-gold/30 hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)]"
              }`}
            >
              {isActive && (
                <>
                  <div className="absolute inset-0 bg-gold/10 blur-2xl rounded-[24px]" />
                  <div className="absolute -inset-[100%] animate-[spin_4s_linear_infinite] opacity-20" style={{ background: 'conic-gradient(from 90deg at 50% 50%, #00000000 50%, #F2B632, #00000000)' }} />
                </>
              )}
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs font-bold font-mono tracking-wider flex items-center gap-2 uppercase ${isActive ? "text-gold" : "text-muted group-hover:text-gold-soft"}`}>
                    <FileVideo size={16} /> {script.format}
                  </span>
                  {isApproved && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle2 size={20} className="text-gold drop-shadow-md" />
                    </motion.div>
                  )}
                </div>
                <p className={`font-serif text-xl leading-tight line-clamp-2 ${isActive ? "text-text" : "text-muted group-hover:text-text transition-colors"}`}>
                  {script.hook}
                </p>
              </div>
            </button>
          );
        })}

        <div className="mt-8 bg-gradient-to-b from-surface to-background border border-border p-6 rounded-[24px] shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-muted">Approval Progress</span>
            <span className="text-sm font-bold text-text bg-surface-raised px-3 py-1 rounded-full border border-border">{approvedIndices.size} / {scripts.length}</span>
          </div>
          <div className="h-2 w-full bg-surface-raised rounded-full overflow-hidden shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-gold-soft to-gold relative"
              initial={{ width: 0 }}
              animate={{ width: `${(approvedIndices.size / scripts.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Column: Editor */}
      <div className="w-full lg:w-2/3 bg-surface/20 backdrop-blur-2xl border border-white/5 rounded-[32px] h-full overflow-hidden flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.3)] ring-1 ring-white/10">
        {/* Subtle top glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        
        <div className="p-10 flex-grow space-y-12 overflow-y-auto custom-scrollbar relative z-10">
          
          {/* Format & Hook */}
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gold/20 to-gold/5 text-gold border border-gold/30 px-5 py-2 rounded-full text-xs font-mono uppercase mb-8 shadow-[0_0_15px_rgba(242,182,50,0.15)] backdrop-blur-md">
              <Sparkles size={14} className="animate-pulse" /> {activeScript.format}
            </div>
            
            <label className="block text-xs font-mono uppercase tracking-widest text-gold-soft mb-4 pl-2 opacity-80">The Hook</label>
            <div className="relative group rounded-3xl p-1 transition-all duration-300 focus-within:bg-gradient-to-br focus-within:from-gold/20 focus-within:to-transparent">
              <textarea
                value={activeScript.hook}
                onChange={(e) => handleEdit("hook", e.target.value)}
                className="w-full bg-surface/40 backdrop-blur-md text-4xl md:text-5xl font-serif text-text outline-none resize-none overflow-hidden leading-tight p-6 rounded-[28px] transition-all border border-white/5 focus:border-gold/40 shadow-inner"
                rows={2}
              />
            </div>
          </div>

          {/* Timeline / Scenes */}
          <div>
             <label className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-blue mb-8 border-b border-white/5 pb-4 pl-2">
               <Clock size={16} className="text-blue" /> Scene Timeline
             </label>
             <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[7px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-blue/50 before:via-purple-500/30 before:to-transparent">
                {activeScript.scenes.map((scene, sIdx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sIdx * 0.1, type: "spring", stiffness: 100 }}
                    key={sIdx} 
                    className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group"
                  >
                    <div className="flex items-center justify-center w-4 h-4 rounded-full bg-blue absolute left-0 md:left-1/2 -translate-x-[7px] md:-translate-x-1/2 translate-y-6 shadow-[0_0_20px_rgba(60,116,255,0.8)] z-10 border-2 border-background group-hover:scale-150 group-hover:bg-gold transition-all duration-300"></div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-3rem)] bg-surface/30 backdrop-blur-md border border-white/5 group-hover:border-blue/40 p-7 rounded-[32px] ml-10 md:ml-0 transition-all duration-300 shadow-lg group-hover:shadow-[0_15px_40px_rgba(60,116,255,0.15)] group-hover:-translate-y-1">
                       
                       <input 
                         value={scene.time}
                         onChange={(e) => handleSceneEdit(sIdx, "time", e.target.value)}
                         className="bg-transparent text-xs font-mono text-blue group-hover:text-gold transition-colors mb-4 outline-none w-full uppercase tracking-widest font-bold bg-blue/5 py-1 px-3 rounded-md w-fit border border-blue/10"
                       />
                       
                       <textarea 
                         value={scene.shot}
                         onChange={(e) => handleSceneEdit(sIdx, "shot", e.target.value)}
                         className="bg-transparent text-lg font-bold text-text mb-5 outline-none w-full resize-none"
                         rows={2}
                       />
                       
                       <div className="space-y-4">
                         <div className="flex items-start gap-4 bg-background/40 hover:bg-background/60 p-4 rounded-2xl border border-white/5 focus-within:border-blue/30 transition-all duration-300">
                           <div className="p-2 bg-blue/10 rounded-lg">
                             <Mic size={16} className="text-blue flex-shrink-0" />
                           </div>
                           <textarea
                             value={scene.voiceover}
                             onChange={(e) => handleSceneEdit(sIdx, "voiceover", e.target.value)}
                             className="bg-transparent text-sm text-text outline-none resize-none w-full leading-relaxed pt-1"
                             rows={2}
                             placeholder="Voiceover audio..."
                           />
                         </div>
                         <div className="flex items-center gap-4 bg-background/40 hover:bg-background/60 p-4 rounded-2xl border border-white/5 focus-within:border-purple-500/30 transition-all duration-300">
                           <div className="p-2 bg-purple-500/10 rounded-lg">
                             <Type size={16} className="text-purple-400 flex-shrink-0" />
                           </div>
                           <input
                             value={scene.overlay}
                             onChange={(e) => handleSceneEdit(sIdx, "overlay", e.target.value)}
                             className="bg-transparent text-sm text-text outline-none w-full"
                             placeholder="Text overlay..."
                           />
                         </div>
                       </div>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>

          {/* Caption & Hashtags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-muted mb-4 pl-2">Caption</label>
              <textarea
                value={activeScript.caption}
                onChange={(e) => handleEdit("caption", e.target.value)}
                className="w-full bg-surface/30 backdrop-blur-md hover:bg-surface/50 focus:bg-surface/60 border border-white/5 hover:border-gold/30 p-6 rounded-[28px] text-sm text-text outline-none resize-y min-h-[160px] transition-all duration-300 leading-relaxed shadow-lg focus:border-gold/60 focus:shadow-[0_0_30px_rgba(242,182,50,0.1)]"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted mb-4 pl-2">
                <Hash size={14} className="text-blue" /> Hashtags
              </label>
              <textarea
                value={activeScript.hashtags.join(" ")}
                onChange={(e) => handleEdit("hashtags", e.target.value.split(" "))}
                className="w-full bg-surface/30 backdrop-blur-md hover:bg-surface/50 focus:bg-surface/60 border border-white/5 hover:border-blue/30 p-6 rounded-[28px] text-sm text-blue outline-none resize-y min-h-[160px] transition-all duration-300 leading-relaxed shadow-lg focus:border-blue/60 focus:shadow-[0_0_30px_rgba(60,116,255,0.15)]"
              />
            </div>
          </div>

        </div>

        {/* Sticky Action Bar */}
        <div className="sticky bottom-0 bg-background/60 backdrop-blur-2xl border-t border-white/10 p-6 px-10 flex justify-between items-center shadow-[0_-20px_40px_rgba(0,0,0,0.4)] z-20">
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${approvedIndices.has(activeIndex) ? "text-gold" : "text-text"} transition-colors`}>
              {approvedIndices.has(activeIndex) ? "✨ Script Approved" : "Needs Review"}
            </span>
            <span className="text-xs text-muted mt-1">
              {approvedIndices.has(activeIndex) ? "Ready for export." : "Tweak the details before saving."}
            </span>
          </div>
          
          <button
            onClick={() => onApprove(activeIndex)}
            className={`px-8 py-4 rounded-full font-bold text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-3 ${
              approvedIndices.has(activeIndex)
                ? "bg-surface-raised/50 text-text border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                : "bg-gradient-to-r from-gold to-gold-soft text-background hover:brightness-110 shadow-[0_0_30px_rgba(242,182,50,0.5)] hover:shadow-[0_0_50px_rgba(242,182,50,0.8)]"
            }`}
          >
            {approvedIndices.has(activeIndex) ? (
              <>Revoke Approval <Save size={18} className="rotate-45 opacity-50" /></>
            ) : (
              <>Approve Script <CheckCircle2 size={20} className="drop-shadow-md" /></>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
