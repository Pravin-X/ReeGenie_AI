"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Landing } from "@/components/Steps";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  const [view, setView] = useState<"landing" | "dashboard">("landing");

  return (
    <main className="min-h-screen bg-background text-text flex flex-col font-sans selection:bg-gold/30">
      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <Landing key="landing" onStart={() => setView("dashboard")} />
        ) : (
          <Dashboard key="dashboard" onGoHome={() => setView("landing")} />
        )}
      </AnimatePresence>
    </main>
  );
}
