"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SymptomInput from "@/components/SymptomInput";
import AIResultCard from "@/components/AIResultCard";
import EmergencyAlert from "@/components/EmergencyAlert";
import { useLanguage } from "@/components/LanguageContext";
import { analyzeSymptoms as analyzeApi } from "@/lib/api";
import { ShieldAlert, Info } from "lucide-react";

export default function TriagePage() {
  const { language } = useLanguage();
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (symptoms: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeApi(symptoms, "00000000-0000-0000-0000-000000000123", language); // Mock user id
      setResult(data);
    } catch (err) {
      setError("Something went wrong during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-16 pb-32">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black mb-6"
        >
          AI Symptom <span className="text-gradient">Analyzer</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-foreground/50 text-lg max-w-xl mx-auto"
        >
          Speak or type your symptoms. Our clinical AI will determine urgency levels and recommend the right path forward.
        </motion.p>
      </div>

      <SymptomInput onAnalyze={handleAnalyze} isLoading={isLoading} />

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <AIResultCard result={result} />
          </motion.div>
        )}
      </AnimatePresence>

      <EmergencyAlert 
        isVisible={result?.isEmergency || false} 
        onClose={() => setResult({ ...result, isEmergency: false })} 
      />

      {error && (
        <div className="mt-12 p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-center max-w-2xl mx-auto flex items-center justify-center gap-3">
          <ShieldAlert className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Background AI Effect */}
      {isLoading && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-[500px] h-[500px] bg-primary-500 rounded-full blur-[120px]"
          />
          <div className="absolute font-bold text-2xl tracking-[0.5em] text-primary-400 animate-pulse">
            ANALYZING...
          </div>
        </div>
      )}
    </div>
  );
}
