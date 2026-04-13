"use client";

import Navbar from "./Navbar";
import { useLanguage } from "@/components/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="min-h-screen hero-gradient pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={language}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="bg-background border-t border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-xl font-bold text-gradient">MediRoute AI</div>
            <p className="text-sm text-foreground/50 text-center md:text-left max-w-xs">
              Empowering healthcare through intelligent AI triage and seamless specialist routing.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="text-xs font-semibold py-1 px-3 rounded-full bg-emergency-600/10 text-emergency-500 border border-emergency-500/20">
              Disclaimer: Not a medical diagnosis
            </div>
            <p className="text-xs text-foreground/30">
              © 2026 MediRoute AI. All rights reserved. Built for Clinical Excellence.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
