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
              className={`w-full text-left p-5 rounded-[24px] transition-all relative overflow-hidden group ${
                isActive
                  ? "bg-gradient-to-br from-surface to-background border border-gold/40 shadow-[0_0_30px_rgba(242,182,50,0.15)]"
                  : "bg-surface/50 border border-border hover:bg-surface hover:border-gold/20"
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gold/5 blur-xl rounded-[24px]" />
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
      <div className="w-full lg:w-2/3 bg-gradient-to-b from-surface to-background border border-border rounded-[32px] h-full overflow-hidden flex flex-col relative shadow-2xl">
        <div className="p-10 flex-grow space-y-10 overflow-y-auto custom-scrollbar relative">
          
          {/* Format & Hook */}
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold border border-gold/20 px-4 py-1.5 rounded-full text-xs font-mono uppercase mb-6 shadow-sm">
              <Sparkles size={14} /> {activeScript.format}
            </div>
            
            <label className="block text-xs font-mono uppercase tracking-widest text-muted mb-3 pl-1">The Hook</label>
            <div className="relative group">
              <textarea
                value={activeScript.hook}
                onChange={(e) => handleEdit("hook", e.target.value)}
                className="w-full bg-transparent text-4xl md:text-5xl font-serif text-text outline-none resize-none overflow-hidden leading-tight group-hover:bg-surface/30 focus:bg-surface/50 p-4 -ml-4 rounded-2xl transition-colors border border-transparent focus:border-border"
                rows={2}
              />
            </div>
          </div>

          {/* Timeline / Scenes */}
          <div>
             <label className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-muted mb-8 border-b border-border pb-4 pl-1">
               <Clock size={16} className="text-blue" /> Scene Timeline
             </label>
             <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[7px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:via-blue/20 before:to-transparent">
                {activeScript.scenes.map((scene, sIdx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sIdx * 0.1 }}
                    key={sIdx} 
                    className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group"
                  >
                    <div className="flex items-center justify-center w-4 h-4 rounded-full bg-blue absolute left-0 md:left-1/2 -translate-x-[7px] md:-translate-x-1/2 translate-y-3 shadow-[0_0_15px_rgba(60,116,255,0.6)] z-10 border-2 border-background group-hover:scale-125 transition-transform"></div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-3rem)] bg-surface-raised/50 hover:bg-surface-raised border border-border hover:border-blue/30 p-6 rounded-[24px] ml-10 md:ml-0 transition-all shadow-sm hover:shadow-[0_0_20px_rgba(60,116,255,0.05)]">
                       
                       <input 
                         value={scene.time}
                         onChange={(e) => handleSceneEdit(sIdx, "time", e.target.value)}
                         className="bg-transparent text-xs font-mono text-blue mb-3 outline-none w-full uppercase tracking-wider font-bold"
                       />
                       
                       <textarea 
                         value={scene.shot}
                         onChange={(e) => handleSceneEdit(sIdx, "shot", e.target.value)}
                         className="bg-transparent text-lg font-bold text-text mb-5 outline-none w-full resize-none"
                         rows={2}
                       />
                       
                       <div className="space-y-3">
                         <div className="flex items-start gap-3 bg-background/80 p-3.5 rounded-xl border border-transparent focus-within:border-border transition-colors">
                           <Mic size={16} className="text-muted mt-0.5 flex-shrink-0" />
                           <textarea
                             value={scene.voiceover}
                             onChange={(e) => handleSceneEdit(sIdx, "voiceover", e.target.value)}
                             className="bg-transparent text-sm text-text outline-none resize-none w-full leading-relaxed"
                             rows={2}
                             placeholder="Voiceover audio..."
                           />
                         </div>
                         <div className="flex items-center gap-3 bg-background/80 p-3.5 rounded-xl border border-transparent focus-within:border-border transition-colors">
                           <Type size={16} className="text-muted flex-shrink-0" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-muted mb-3 pl-1">Caption</label>
              <textarea
                value={activeScript.caption}
                onChange={(e) => handleEdit("caption", e.target.value)}
                className="w-full bg-surface-raised/50 hover:bg-surface-raised focus:bg-surface-raised border border-border hover:border-gold/20 p-5 rounded-[20px] text-sm text-text outline-none resize-y min-h-[140px] transition-colors leading-relaxed shadow-sm focus:border-gold/50"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted mb-3 pl-1">
                <Hash size={14} className="text-blue" /> Hashtags
              </label>
              <textarea
                value={activeScript.hashtags.join(" ")}
                onChange={(e) => handleEdit("hashtags", e.target.value.split(" "))}
                className="w-full bg-surface-raised/50 hover:bg-surface-raised focus:bg-surface-raised border border-border hover:border-blue/20 p-5 rounded-[20px] text-sm text-blue outline-none resize-y min-h-[140px] transition-colors leading-relaxed shadow-sm focus:border-blue/50"
              />
            </div>
          </div>

        </div>

        {/* Sticky Action Bar */}
        <div className="sticky bottom-0 bg-surface/80 backdrop-blur-xl border-t border-border p-5 px-8 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-text">
              {approvedIndices.has(activeIndex) ? "Script Approved" : "Needs Review"}
            </span>
            <span className="text-xs text-muted">
              {approvedIndices.has(activeIndex) ? "Ready for export." : "Tweak the details before saving."}
            </span>
          </div>
          
          <button
            onClick={() => onApprove(activeIndex)}
            className={`px-8 py-4 rounded-full font-bold text-sm transition-all transform hover:scale-105 flex items-center gap-3 ${
              approvedIndices.has(activeIndex)
                ? "bg-surface-raised text-text border border-border hover:bg-surface hover:text-red-400"
                : "bg-gold text-background hover:bg-gold-soft shadow-[0_0_20px_rgba(242,182,50,0.4)] hover:shadow-[0_0_30px_rgba(242,182,50,0.6)]"
            }`}
          >
            {approvedIndices.has(activeIndex) ? (
              <>Revoke Approval <Save size={18} className="rotate-45 opacity-50" /></>
            ) : (
              <>Approve Script <CheckCircle2 size={20} /></>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
