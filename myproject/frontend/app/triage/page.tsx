"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SymptomInput from "@/components/SymptomInput";
import AIResultCard from "@/components/AIResultCard";
import EmergencyAlert from "@/components/EmergencyAlert";
import { useLanguage } from "@/components/LanguageContext";
import { analyzeSymptoms as analyzeApi } from "@/lib/api";
import { ShieldAlert, Brain } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

export default function TriagePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleAnalyze = async (symptoms: string) => {
    if (!user) return setError("Please sign in to analyze symptoms.");
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeApi(symptoms, undefined, language);
      setResult(data);
    } catch (err) {
      setError("Something went wrong during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || (!user && !loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-2 border-outline-variant border-t-emerald rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-32 pb-32 px-6 md:px-12 lg:px-16 relative overflow-hidden">
      {/* Soft background orbs */}
      <div className="absolute top-[5%] right-[10%] w-[400px] h-[400px] bg-emerald/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] bg-lavender/3 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-container rounded-full px-5 py-2 text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-emerald mb-8 inline-flex items-center gap-2"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            AI Symptom Analyzer
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-heading font-extrabold text-foreground tracking-tight leading-[1] mb-6"
          >
            Clinical Triage
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Describe your symptoms for immediate AI-powered diagnostic prioritization and specialist routing.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto">
          <SymptomInput onAnalyze={handleAnalyze} isLoading={isLoading} />

          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-16"
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
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 p-10 surface-card badge-emergency text-center flex flex-col items-center justify-center gap-5"
            >
              <div className="w-14 h-14 rounded-xl bg-error/10 flex items-center justify-center">
                <ShieldAlert className="h-7 w-7 text-error" />
              </div>
              <div className="space-y-2">
                <p className="font-heading font-bold text-xl text-error">Analysis Interrupted</p>
                <p className="text-on-surface-variant text-sm max-w-xs mx-auto">{error}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[100] bg-background/80 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.15, 0.05] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="w-[600px] h-[600px] bg-lavender rounded-full blur-[160px] absolute"
          />
          <div className="relative flex flex-col items-center gap-8 text-center px-6">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-lavender/20" />
              <div className="animate-spin h-16 w-16 border-3 border-outline-variant/20 border-t-lavender rounded-full relative z-10" />
            </div>
            <div className="space-y-3">
              <div className="font-heading font-extrabold text-3xl md:text-4xl tracking-tight text-foreground">
                Analyzing Symptoms
              </div>
              <div className="text-xs text-on-surface-variant font-heading font-bold uppercase tracking-[0.2em] bg-surface-container py-2 px-6 rounded-full inline-block">
                Neural Pattern Recognition Active
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
