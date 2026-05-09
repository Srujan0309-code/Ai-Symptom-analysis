"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle, CheckCircle2, AlertTriangle, Stethoscope,
  ChevronRight, Info, Activity, Brain, Pill, ShieldAlert,
  TrendingUp, Database, CheckCheck
} from "lucide-react";
import Link from "next/link";

interface AIResult {
  urgency: "Low" | "Medium" | "Emergency";
  category: string;
  specialist: string;
  advice: string[];
  disclaimer: string;
  isEmergency: boolean;
  // Enhanced fields
  probableConditions?: string[];
  redFlags?: string[];
  medications?: string[];
  confidence?: number;
  followUpInDays?: number;
  clinicalContext?: string | null;
  dataSources?: string[];
  analyzedAt?: string;
}

const AIResultCard = ({ result }: { result: AIResult }) => {
  const urgencyConfig = {
    Low: { color: "text-emerald", bg: "badge-low", icon: <CheckCircle2 /> },
    Medium: { color: "text-amber-600", bg: "badge-medium", icon: <AlertTriangle /> },
    Emergency: { color: "text-error", bg: "badge-emergency", icon: <AlertCircle /> },
  };

  const config = urgencyConfig[result.urgency] || urgencyConfig.Low;
  const confidenceColor =
    (result.confidence || 0) >= 80 ? "text-emerald" :
    (result.confidence || 0) >= 55 ? "text-amber-500" : "text-outline";

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
          <div className={`${config.color} h-5 w-5`}>{config.icon}</div>
          <span className={`font-heading font-bold uppercase tracking-[0.15em] text-[11px] ${config.color}`}>
            {result.urgency} Priority
          </span>
        </div>
        <div className="flex items-center gap-2">
          {result.confidence !== undefined && (
            <div className={`flex items-center gap-1 text-[10px] font-heading font-bold uppercase tracking-[0.1em] ${confidenceColor}`}>
              <TrendingUp className="h-3 w-3" />
              {result.confidence}% Confidence
            </div>
          )}
          <div className="text-on-surface-variant text-[10px] font-heading font-bold uppercase tracking-[0.1em] flex items-center gap-2 bg-surface-container px-3 py-1 rounded-full">
            <Activity className="h-3 w-3" />
            AI Analysis
          </div>
        </div>
      </motion.div>

      <div className="p-8 md:p-10 relative z-10 space-y-8">
        {/* Classification */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="text-[11px] text-emerald font-heading font-bold uppercase tracking-[0.2em] mb-3">Diagnostic Classification</div>
          <h3 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-2 tracking-tight">{result.category}</h3>
          <p className="text-on-surface-variant text-sm">AI-driven prioritization based on reported symptoms using WHO/CDC/NHS guidelines.</p>
        </motion.div>

        {/* Probable Conditions */}
        {result.probableConditions && result.probableConditions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="p-5 rounded-2xl bg-surface-container-low space-y-3"
          >
            <div className="flex items-center gap-2 text-on-surface-variant font-heading font-bold text-[11px] uppercase tracking-[0.15em]">
              <Brain className="h-3.5 w-3.5 text-lavender" />
              Probable Conditions
            </div>
            <div className="flex flex-wrap gap-2">
              {result.probableConditions.map((cond, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-lavender/8 text-lavender text-xs font-heading font-bold">
                  {cond}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Red Flags */}
        {result.redFlags && result.redFlags.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
            className="p-5 rounded-2xl bg-error/5 border border-error/10 space-y-3"
          >
            <div className="flex items-center gap-2 text-error font-heading font-bold text-[11px] uppercase tracking-[0.15em]">
              <ShieldAlert className="h-3.5 w-3.5" />
              Red Flag Symptoms Detected
            </div>
            <ul className="space-y-1.5">
              {result.redFlags.map((flag, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-error/80">
                  <div className="h-1.5 w-1.5 rounded-full bg-error flex-shrink-0" />
                  {flag}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Specialist + Advice */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="surface-card p-7 space-y-7"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-on-surface-variant font-heading font-bold text-[11px] uppercase tracking-[0.15em]">
                <Stethoscope className="h-3.5 w-3.5 text-lavender" />
                Recommended Specialist
              </div>
              <div className="text-2xl font-heading font-extrabold text-foreground">{result.specialist}</div>
              {result.followUpInDays !== undefined && (
                <p className="text-on-surface-variant text-xs">
                  {result.followUpInDays === 0 ? "⚡ Seek immediate care" : `📅 Follow up within ${result.followUpInDays} days`}
                </p>
              )}
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
              <CheckCheck className="h-3.5 w-3.5 text-lavender" />
              Recommended Actions
            </div>
            <ul className="space-y-2">
              {result.advice.map((item, i) => (
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  key={i}
                  className={`flex gap-3 p-4 rounded-xl text-sm text-on-surface-variant leading-relaxed ${i % 2 === 0 ? "bg-surface-container-low" : ""}`}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-lavender mt-2 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Medication Classes */}
        {result.medications && result.medications.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="p-5 rounded-2xl bg-surface-container-low space-y-3"
          >
            <div className="flex items-center gap-2 text-on-surface-variant font-heading font-bold text-[11px] uppercase tracking-[0.15em]">
              <Pill className="h-3.5 w-3.5 text-amber-500" />
              Common Treatment Classes (from FDA database)
            </div>
            <div className="flex flex-wrap gap-2">
              {result.medications.map((med, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-amber-500/8 text-amber-500 text-xs font-heading font-bold">
                  {med}
                </span>
              ))}
            </div>
            <p className="text-outline text-[10px] italic">Always consult a doctor before starting any medication.</p>
          </motion.div>
        )}

        {/* Clinical Context from Wikipedia */}
        {result.clinicalContext && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="p-5 rounded-2xl bg-surface-container-low space-y-2"
          >
            <div className="flex items-center gap-2 text-on-surface-variant font-heading font-bold text-[11px] uppercase tracking-[0.15em]">
              <Info className="h-3.5 w-3.5 text-sky-400" />
              Clinical Background
            </div>
            <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-3">{result.clinicalContext}</p>
          </motion.div>
        )}

        {/* Data Sources */}
        {result.dataSources && result.dataSources.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="flex items-center gap-2 flex-wrap"
          >
            <div className="flex items-center gap-1.5 text-outline text-[10px] font-heading font-bold uppercase tracking-[0.1em]">
              <Database className="h-3 w-3" />
              Data sources:
            </div>
            {result.dataSources.map((src, i) => (
              <span key={i} className="text-[10px] font-heading font-bold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">
                {src}
              </span>
            ))}
          </motion.div>
        )}

        {/* Disclaimer */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="mt-2 p-5 rounded-xl bg-surface-container-low text-[11px] text-outline italic flex gap-3 items-start"
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
            🚨 CRITICAL: SEEK IMMEDIATE MEDICAL ATTENTION — CALL 112 / 911 NOW
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIResultCard;
