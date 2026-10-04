"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload as UploadIcon, Calendar as CalendarIcon, Sparkles, BookOpen, Smile, Tag, Download, RefreshCw, AlertCircle } from "lucide-react";
import { CalendarData } from "@/types";

export function CalendarTool() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          generateCalendar(e.target.result as string);
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
          generateCalendar(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCalendar = async (base64: string) => {
    setImage(base64);
    setLoading(true);
    setError(null);
    setCalendarData(null);

    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to generate calendar");

      setCalendarData(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate calendar");
      setImage(null);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setCalendarData(null);
    setError(null);
  };

  const getPillarIcon = (pillar: string) => {
    if (pillar === "Educational") return <BookOpen size={16} className="text-blue" />;
    if (pillar === "Entertaining") return <Smile size={16} className="text-purple-400" />;
    return <Tag size={16} className="text-gold" />;
  };

  const getPillarColor = (pillar: string) => {
    if (pillar === "Educational") return "bg-blue/10 text-blue border-blue/20";
    if (pillar === "Entertaining") return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    return "bg-gold/10 text-gold border-gold/20";
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar relative h-full">
      
      {/* Header */}
      <header className="w-full border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-10 px-8 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-serif text-text">30-Day Calendar</h2>
          <p className="text-xs text-muted font-mono uppercase tracking-widest">Full Month Content Plan</p>
        </div>
        {calendarData && (
          <div className="flex gap-4">
             <button onClick={reset} className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors px-4 py-2">
               <RefreshCw size={16} /> Start Over
             </button>
             <button className="flex items-center gap-2 text-sm font-bold bg-gold text-background px-4 py-2 rounded-full hover:bg-gold-soft transition-transform hover:scale-105 shadow-[0_0_15px_rgba(242,182,50,0.3)]">
               <Download size={16} /> Export PDF
             </button>
          </div>
        )}
      </header>

      {/* Main Content */}
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

        {!loading && !calendarData && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto mt-12">
            <div className="text-center mb-8">
              <div className="inline-flex p-4 bg-gold/10 rounded-full border border-gold/20 mb-4 shadow-[0_0_20px_rgba(242,182,50,0.15)]">
                <CalendarIcon size={32} className="text-gold" />
              </div>
              <h2 className="text-4xl font-serif text-text mb-4">Generate Your Calendar</h2>
              <p className="text-muted text-lg">Upload a product photo, and our AI strategist will build a perfectly balanced 30-day content plan.</p>
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
              <p className="text-xl font-serif text-text mb-2">Click or drag product image</p>
              <p className="text-muted font-mono text-xs uppercase tracking-widest">PNG, JPG up to 10MB</p>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
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
            <h2 className="text-4xl font-serif text-text mb-4">Architecting Strategy...</h2>
            <p className="text-muted text-lg max-w-md mx-auto">Analyzing product and formulating 30 days of high-converting content concepts.</p>
          </motion.div>
        )}

        {calendarData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
            
            <div className="bg-gradient-to-br from-surface to-background border border-gold/20 rounded-[32px] p-8 mb-12 shadow-[0_0_40px_rgba(242,182,50,0.1)] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
               {image && (
                 /* eslint-disable-next-line @next/next/no-img-element */
                 <img src={image} alt="Product" className="w-32 h-32 object-cover rounded-[20px] shadow-lg border border-border relative z-10" />
               )}
               <div className="relative z-10">
                 <h3 className="text-sm font-mono uppercase tracking-widest text-gold mb-2">Strategy Overview</h3>
                 <p className="text-xl text-text font-serif leading-relaxed max-w-3xl">{calendarData.summary}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {calendarData.days.map((day) => (
                <div key={day.day} className="bg-surface border border-border rounded-[24px] p-6 hover:border-gold/30 transition-all shadow-sm hover:shadow-[0_0_20px_rgba(242,182,50,0.1)] flex flex-col h-full group relative overflow-hidden">
                   <div className="flex justify-between items-start mb-4 relative z-10">
                     <span className="text-3xl font-serif text-muted group-hover:text-text transition-colors">
                       {String(day.day).padStart(2, '0')}
                     </span>
                     <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${getPillarColor(day.pillar)}`}>
                       {getPillarIcon(day.pillar)} {day.pillar}
                     </span>
                   </div>
                   <div className="relative z-10 flex-1">
                     <h4 className="text-lg font-bold text-text mb-3 leading-tight">{day.hookIdea}</h4>
                     <p className="text-sm text-muted leading-relaxed">{day.description}</p>
                   </div>
                </div>
              ))}
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
