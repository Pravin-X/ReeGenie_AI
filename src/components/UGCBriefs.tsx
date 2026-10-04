"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Upload as UploadIcon, Download, Sparkles, 
  CheckCircle2, Users, Target, Camera, Video, AlertCircle, RefreshCw
} from "lucide-react";

export function UGCBriefs() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [briefGenerated, setBriefGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          generateBrief(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          generateBrief(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateBrief = (base64: string) => {
    setImage(base64);
    setLoading(true);
    setError(null);
    
    // Simulate generation for the UI
    setTimeout(() => {
      setLoading(false);
      setBriefGenerated(true);
    }, 4000);
  };

  const reset = () => {
    setImage(null);
    setBriefGenerated(false);
    setError(null);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar relative h-full">
      {/* Header */}
      <header className="w-full border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-10 px-8 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-serif text-text">UGC Briefs</h2>
          <p className="text-xs text-muted font-mono uppercase tracking-widest">PDF for Creators</p>
        </div>
        {briefGenerated && (
          <div className="flex gap-4">
             <button onClick={reset} className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors px-4 py-2">
               <RefreshCw size={16} /> Start Over
             </button>
             <button className="flex items-center gap-2 text-sm font-bold bg-gold text-background px-4 py-2 rounded-full hover:bg-gold-soft transition-transform hover:scale-105 shadow-[0_0_15px_rgba(242,182,50,0.3)]">
               <Download size={16} /> Download Brief (PDF)
             </button>
          </div>
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

        {!loading && !briefGenerated && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto mt-12">
            <div className="text-center mb-8">
              <div className="inline-flex p-4 bg-gold/10 rounded-full border border-gold/20 mb-4 shadow-[0_0_20px_rgba(242,182,50,0.15)]">
                <FileText size={32} className="text-gold" />
              </div>
              <h2 className="text-4xl font-serif text-text mb-4">Craft the Perfect UGC Brief</h2>
              <p className="text-muted text-lg">Upload your product photo and our AI will generate a highly detailed, professional brief for your content creators.</p>
            </div>

            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center w-full h-80 border border-dashed border-border hover:border-gold/50 rounded-[32px] bg-gradient-to-b from-surface/50 to-surface hover:from-surface-raised hover:to-surface transition-all cursor-pointer group shadow-[0_0_30px_rgba(0,0,0,0.1)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-border shadow-sm">
                <UploadIcon size={32} className="text-muted group-hover:text-gold transition-colors" />
              </div>
              <p className="text-xl font-serif text-text mb-2">Click or drop product image</p>
              <p className="text-muted font-mono text-xs uppercase tracking-widest">PNG, JPG to generate brief</p>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
            
            <div className="grid grid-cols-3 gap-4 mt-8">
               <div className="bg-surface border border-border p-4 rounded-2xl text-center">
                 <Target className="mx-auto text-gold mb-2" size={24} />
                 <p className="text-sm text-text font-bold">Clear Goals</p>
                 <p className="text-xs text-muted">Defines target audience & objective</p>
               </div>
               <div className="bg-surface border border-border p-4 rounded-2xl text-center">
                 <Camera className="mx-auto text-blue mb-2" size={24} />
                 <p className="text-sm text-text font-bold">Shot List</p>
                 <p className="text-xs text-muted">Exact angles & lighting specs</p>
               </div>
               <div className="bg-surface border border-border p-4 rounded-2xl text-center">
                 <CheckCircle2 className="mx-auto text-green-500 mb-2" size={24} />
                 <p className="text-sm text-text font-bold">Do&apos;s &amp; Don&apos;ts</p>
                 <p className="text-xs text-muted">Brand safety guidelines</p>
               </div>
            </div>
          </motion.div>
        )}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="relative mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {image && <img src={image} alt="Uploading" className="w-32 h-32 object-cover rounded-2xl opacity-50 blur-sm" />}
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={48} className="text-gold animate-pulse drop-shadow-[0_0_20px_rgba(242,182,50,0.8)]" />
              </div>
            </div>
            <h2 className="text-4xl font-serif text-text mb-4">Drafting UGC Brief...</h2>
            <p className="text-muted text-lg max-w-md mx-auto">Extracting product selling points, formulating shot lists, and compiling brand guidelines.</p>
          </motion.div>
        )}

        {briefGenerated && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-20 max-w-5xl mx-auto">
            
            {/* The Document Preview */}
            <div className="bg-white text-black p-10 md:p-16 rounded-[12px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-border relative overflow-hidden font-sans">
               {/* Document styling specifically to look like a premium PDF */}
               <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-gold via-blue to-purple-500" />
               
               <div className="flex justify-between items-start mb-12 mt-4 border-b border-gray-200 pb-8">
                 <div>
                   <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">UGC Content Brief</h1>
                   <p className="text-gray-500 font-mono text-sm uppercase tracking-wider">Campaign: Q4 Growth Injection</p>
                 </div>
                 {image && (
                   /* eslint-disable-next-line @next/next/no-img-element */
                   <img src={image} alt="Product" className="w-24 h-24 object-cover rounded-lg shadow-sm border border-gray-100" />
                 )}
               </div>

               <div className="grid md:grid-cols-2 gap-12 mb-12">
                 <div>
                   <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                     <Target size={20} className="text-gold" /> Campaign Objectives
                   </h3>
                   <ul className="space-y-3 text-gray-700">
                     <li className="flex gap-3"><span className="text-gold font-bold">1.</span> Drive conversions through authentic testimonials.</li>
                     <li className="flex gap-3"><span className="text-gold font-bold">2.</span> Highlight the immediate visual benefits of the product.</li>
                     <li className="flex gap-3"><span className="text-gold font-bold">3.</span> Educate the audience on the key active ingredients.</li>
                   </ul>
                 </div>
                 
                 <div>
                   <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                     <Users size={20} className="text-blue" /> Target Audience
                   </h3>
                   <p className="text-gray-700 leading-relaxed">
                     Women aged 24-35 who are interested in premium, science-backed skincare. They value transparency, aesthetic packaging, and visible results over flashy marketing.
                   </p>
                 </div>
               </div>

               <div className="mb-12">
                 <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                   <Video size={20} className="text-purple-500" /> Required Deliverables
                 </h3>
                 <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div>
                       <p className="font-bold text-gray-900 mb-1">Format</p>
                       <p className="text-gray-600 text-sm">9:16 (Vertical Video)</p>
                     </div>
                     <div>
                       <p className="font-bold text-gray-900 mb-1">Duration</p>
                       <p className="text-gray-600 text-sm">15-30 seconds</p>
                     </div>
                     <div>
                       <p className="font-bold text-gray-900 mb-1">Resolution</p>
                       <p className="text-gray-600 text-sm">4K at 60fps preferred</p>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="mb-12">
                 <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                   <Camera size={20} className="text-green-500" /> Specific Shot List
                 </h3>
                 <div className="space-y-4">
                   <div className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors">
                     <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-900 shrink-0">1</div>
                     <div>
                       <p className="font-bold text-gray-900">The &quot;Texture Pull&quot;</p>
                       <p className="text-gray-600 text-sm">Close-up macro shot of the product texture being applied to the back of the hand. Must show the glow.</p>
                     </div>
                   </div>
                   <div className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors">
                     <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-900 shrink-0">2</div>
                     <div>
                       <p className="font-bold text-gray-900">The Problem/Solution Transition</p>
                       <p className="text-gray-600 text-sm">Start bare-faced in natural lighting talking about dull skin. Snap transition to glowing, hydrated skin post-application.</p>
                     </div>
                   </div>
                   <div className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors">
                     <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-900 shrink-0">3</div>
                     <div>
                       <p className="font-bold text-gray-900">Aesthetic Bathroom Shot</p>
                       <p className="text-gray-600 text-sm">Product sitting on a clean, aesthetic vanity or bathroom sink to establish the premium brand identity.</p>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="grid md:grid-cols-2 gap-8 bg-gray-900 text-white p-8 rounded-2xl">
                 <div>
                   <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2"><CheckCircle2 size={18} /> DO&apos;s</h4>
                   <ul className="space-y-2 text-sm text-gray-300">
                     <li>• Use bright, indirect natural sunlight.</li>
                     <li>• Speak casually to the camera like a friend.</li>
                     <li>• Clean the camera lens before filming.</li>
                     <li>• Highlight the sleek packaging.</li>
                   </ul>
                 </div>
                 <div>
                   <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2"><AlertCircle size={18} /> DON&apos;Ts</h4>
                   <ul className="space-y-2 text-sm text-gray-300">
                     <li>• No heavy beauty filters or skin smoothing.</li>
                     <li>• Don&apos;t mention competitor brands by name.</li>
                     <li>• Avoid cluttered or messy backgrounds.</li>
                     <li>• Do not make medical claims.</li>
                   </ul>
                 </div>
               </div>
               
               <div className="mt-12 text-center text-sm text-gray-400 font-mono border-t border-gray-100 pt-8">
                 Generated by ReelGenie AI • Confidential
               </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
