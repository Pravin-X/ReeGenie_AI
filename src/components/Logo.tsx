import { Clapperboard, Sparkles } from "lucide-react";

export function Logo({ className = "", size = "md" }: { className?: string, size?: "sm" | "md" | "lg" }) {
  const iconSize = size === "sm" ? 18 : size === "md" ? 24 : 32;
  const textSize = size === "sm" ? "text-lg" : size === "md" ? "text-2xl" : "text-4xl";
  
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Subtle glow effect behind the icon */}
        <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full" />
        
        {/* Icon Container */}
        <div className="relative bg-gradient-to-br from-surface-raised to-background border border-gold/30 p-2 rounded-xl shadow-[0_0_15px_rgba(242,182,50,0.1)] flex items-center justify-center">
          <Clapperboard size={iconSize} className="text-text" strokeWidth={1.5} />
          <Sparkles 
            size={iconSize * 0.5} 
            className="text-gold-soft absolute -top-1 -right-1 drop-shadow-md" 
            strokeWidth={2.5}
            fill="currentColor"
          />
        </div>
      </div>
      <div className={`font-serif font-bold text-text tracking-tight ${textSize}`}>
        ReelGenie <span className="text-gold-soft italic font-normal">AI</span>
      </div>
    </div>
  );
}
