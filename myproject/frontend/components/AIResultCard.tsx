"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, AlertTriangle, Stethoscope, ChevronRight, Info, Activity } from "lucide-react";
import Link from "next/link";

interface AIResult {
  urgency: "Low" | "Medium" | "Emergency";
  category: string;
  specialist: string;
  advice: string[];
  disclaimer: string;
  isEmergency: boolean;
}

const AIResultCard = ({ result }: { result: AIResult }) => {
  const urgencyConfig = {
    Low: { color: "text-emerald", bg: "badge-low", icon: <CheckCircle2 /> },
    Medium: { color: "text-amber-600", bg: "badge-medium", icon: <AlertTriangle /> },
    Emergency: { color: "text-error", bg: "badge-emergency", icon: <AlertCircle /> },
  };

  const config = urgencyConfig[result.urgency] || urgencyConfig.Low;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="w-full max-w-2xl mx-auto mt-10 overflow-hidden rounded-3xl surface-float editorial-shadow-lg relative"
    >
      {/* Header Banner */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`px-8 py-5 flex items-center justify-between ${config.bg} relative z-10`}
      >
        <div className="flex items-center gap-3">
          <div className={`${config.color} h-5 w-5`}>
            {config.icon}
          </div>
          <span className={`font-heading font-bold uppercase tracking-[0.15em] text-[11px] ${config.color}`}>
            {result.urgency} Priority
          </span>
        </div>
        <div className="text-on-surface-variant text-[10px] font-heading font-bold uppercase tracking-[0.1em] flex items-center gap-2 bg-surface-container px-3 py-1 rounded-full">
          <Activity className="h-3 w-3" />
          AI Analysis
        </div>
      </motion.div>

      <div className="p-8 md:p-10 relative z-10">
        {/* Classification */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="text-[11px] text-emerald font-heading font-bold uppercase tracking-[0.2em] mb-3">Diagnostic Classification</div>
          <h3 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-2 tracking-tight">{result.category}</h3>
          <p className="text-on-surface-variant text-sm">AI-driven prioritization based on reported symptoms.</p>
        </motion.div>

        {/* Specialist + Advice */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="surface-card p-7 space-y-7"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-on-surface-variant font-heading font-bold text-[11px] uppercase tracking-[0.15em]">
                 <Stethoscope className="h-3.5 w-3.5 text-lavender" />
                 Recommended Specialist
              </div>
              <div className="text-2xl font-heading font-extrabold text-foreground">{result.specialist}</div>
            </div>
            <Link 
              href={`/map?specialty=${result.specialist}`}
              className="btn-pill btn-primary flex items-center justify-center gap-2 text-sm group"
            >
              Find Nearby
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="h-px bg-outline-variant/10 w-full" />

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-on-surface-variant font-heading font-bold text-[11px] uppercase tracking-[0.15em]">
               <CheckCircle2 className="h-3.5 w-3.5 text-lavender" />
               Recommended Actions
            </div>
            <ul className="space-y-2">
              {result.advice.map((item, i) => (
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.08) }}
                  key={i} 
                  className={`flex gap-3 p-4 rounded-xl text-sm text-on-surface-variant leading-relaxed ${i % 2 === 0 ? 'bg-surface-container-low' : ''}`}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-lavender mt-2 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-5 rounded-xl bg-surface-container-low text-[11px] text-outline italic flex gap-3 items-start"
        >
          <Info className="h-4 w-4 flex-shrink-0 text-outline/60 mt-0.5" />
          <p className="leading-relaxed">{result.disclaimer}</p>
        </motion.div>
      </div>

      {/* Emergency Banner */}
      <AnimatePresence>
        {result.isEmergency && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-error text-white px-8 py-4 text-center font-heading font-black tracking-[0.15em] animate-pulse text-xs"
          >
            CRITICAL: SEEK IMMEDIATE MEDICAL ATTENTION
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIResultCard;
