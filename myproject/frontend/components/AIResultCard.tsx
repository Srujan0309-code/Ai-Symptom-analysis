"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, AlertTriangle, Stethoscope, ChevronRight, Info } from "lucide-react";
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
    Low: { color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", icon: <CheckCircle2 /> },
    Medium: { color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", icon: <AlertTriangle /> },
    Emergency: { color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", icon: <AlertCircle /> },
  };

  const config = urgencyConfig[result.urgency] || urgencyConfig.Low;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto mt-12 overflow-hidden rounded-[2.5rem] glass border-2 border-white/10 shadow-3xl"
    >
      {/* Header Banner */}
      <div className={`px-8 py-6 flex items-center justify-between ${config.bg} border-b border-white/10`}>
        <div className="flex items-center gap-3">
          <div className={`${config.color} h-6 w-6`}>{config.icon}</div>
          <span className={`font-bold uppercase tracking-wider text-sm ${config.color}`}>
            {result.urgency} Urgency detected
          </span>
        </div>
        <div className="text-foreground/30 text-xs flex items-center gap-1">
          <Info className="h-3 w-3" />
          AI Analysis
        </div>
      </div>

      <div className="p-10">
        <div className="mb-10">
          <h3 className="text-3xl font-bold mb-2">{result.category}</h3>
          <p className="text-foreground/50">Probable symptom category based on your input.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3 text-primary-400 font-bold mb-4">
              <Stethoscope className="h-5 w-5" />
              <span>Recommended Specialist</span>
            </div>
            <div className="text-2xl font-bold mb-6">{result.specialist}</div>
            <Link 
              href={`/map?specialty=${result.specialist}`}
              className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors group"
            >
              Find nearby clinics
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
            <h4 className="font-bold mb-4 text-foreground/70">Next Steps</h4>
            <ul className="space-y-3">
              {result.advice.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground/50">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-xs text-foreground/40 italic flex gap-3 items-center">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {result.disclaimer}
        </div>
      </div>

      {result.isEmergency && (
        <div className="bg-rose-600 text-white px-8 py-4 text-center font-bold animate-pulse">
          ⚠️ SEEK IMMEDIATE MEDICAL ATTENTION
        </div>
      )}
    </motion.div>
  );
};

export default AIResultCard;
