"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, Image as ImageIcon, X, CheckCircle2, AlertCircle,
  Loader2, FlaskConical, ChevronRight, Info, Sparkles
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";

interface Finding {
  name: string;
  value: string;
  status: "Normal" | "High" | "Low" | "Critical";
  explanation: string;
}

interface ReportAnalysis {
  reportType: string;
  keyFindings: Finding[];
  healthConcerns: string[];
  recommendations: string[];
  urgencyLevel: "Routine" | "Soon" | "Urgent" | "Emergency";
  specialistReferral: string;
  overallSummary: string;
  disclaimer: string;
}

interface ReportResult {
  success: boolean;
  fileName: string;
  analysis: ReportAnalysis;
  analyzedAt: string;
}

const statusColors: Record<string, string> = {
  Normal: "text-emerald bg-emerald/8",
  High: "text-amber-600 bg-amber-50",
  Low: "text-blue-500 bg-blue-50",
  Critical: "text-error bg-error/8",
};

const urgencyColors: Record<string, string> = {
  Routine: "badge-low",
  Soon: "badge-medium",
  Urgent: "badge-medium",
  Emergency: "badge-emergency",
};

export default function ReportUploader() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ReportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const handleFile = (f: File) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp", "text/plain"];
    if (!allowed.includes(f.type)) {
      setError("Unsupported file type. Please upload PDF, PNG, JPG, WEBP, or TXT.");
      return;
    }
    if (f.size > 15 * 1024 * 1024) {
      setError("File too large. Maximum size is 15MB.");
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleAnalyze = async () => {
    if (!file || !user) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = await (user as any).getIdToken();
      const formData = new FormData();
      formData.append("report", file);
      formData.append("notes", notes);

      const res = await fetch(`${BACKEND_URL}/api/reports/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Analysis failed. Please ensure the backend is running and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-card overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex items-center gap-4 border-b border-outline-variant/10">
          <div className="w-11 h-11 rounded-xl bg-lavender/10 flex items-center justify-center">
            <FlaskConical className="h-5 w-5 text-lavender" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-foreground text-lg">Diagnostic Report Analysis</h3>
            <p className="text-on-surface-variant text-xs mt-0.5">Upload lab reports, blood work, imaging or discharge summaries</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
              isDragging
                ? "border-lavender bg-lavender/5 scale-[1.01]"
                : file
                ? "border-emerald/40 bg-emerald/3"
                : "border-outline-variant/30 hover:border-outline-variant/60 hover:bg-surface-container/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.txt"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
            />
            <AnimatePresence mode="wait">
              {file ? (
                <motion.div key="file" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald/10 flex items-center justify-center">
                    {file.type.startsWith("image/") ? <ImageIcon className="h-7 w-7 text-emerald" /> : <FileText className="h-7 w-7 text-emerald" />}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-foreground text-sm">{file.name}</p>
                    <p className="text-on-surface-variant text-xs mt-1">{(file.size / 1024).toFixed(1)} KB • {file.type.split("/")[1].toUpperCase()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }}
                    className="text-outline hover:text-error transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center">
                    <Upload className="h-6 w-6 text-outline" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-foreground text-sm">Drop your medical report here</p>
                    <p className="text-on-surface-variant text-xs mt-1">PDF, PNG, JPG, WEBP or TXT · Max 15MB</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notes */}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional context for the AI? (e.g. 'Patient is diabetic, 45M, follow-up after 3 weeks')"
            className="w-full h-24 bg-surface-container-low rounded-xl p-4 text-sm text-foreground placeholder:text-outline outline-none resize-none border border-outline-variant/10 focus:border-lavender/30 transition-colors"
          />

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-error/5 border border-error/20">
              <AlertCircle className="h-4 w-4 text-error flex-shrink-0" />
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className="w-full btn-pill btn-secondary flex items-center justify-center gap-2 font-heading font-bold disabled:opacity-30 disabled:grayscale py-4"
          >
            {isAnalyzing ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing Report...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Analyze with AI</>
            )}
          </button>
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="surface-card overflow-hidden"
          >
            {/* Result Header */}
            <div className={`px-8 py-5 flex items-center justify-between ${urgencyColors[result.analysis.urgencyLevel] || "badge-low"}`}>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-heading font-bold text-[11px] uppercase tracking-[0.15em]">
                  {result.analysis.urgencyLevel} · {result.analysis.reportType}
                </span>
              </div>
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.1em] opacity-70">
                {new Date(result.analyzedAt).toLocaleString()}
              </span>
            </div>

            <div className="p-8 space-y-8">
              {/* Summary */}
              <div>
                <p className="text-on-surface-variant text-sm leading-relaxed">{result.analysis.overallSummary}</p>
              </div>

              {/* Key Findings */}
              {result.analysis.keyFindings?.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-on-surface-variant">Key Findings</h4>
                  <div className="space-y-2">
                    {result.analysis.keyFindings.map((f, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-low"
                      >
                        <div className={`px-2.5 py-1 rounded-lg text-[10px] font-heading font-bold uppercase tracking-wide flex-shrink-0 ${statusColors[f.status] || ""}`}>
                          {f.status}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-heading font-bold text-foreground text-sm">{f.name}</span>
                            {f.value && <span className="text-outline text-xs">— {f.value}</span>}
                          </div>
                          <p className="text-on-surface-variant text-xs mt-1 leading-relaxed">{f.explanation}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Health Concerns */}
              {result.analysis.healthConcerns?.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-on-surface-variant">Health Concerns Identified</h4>
                  <ul className="space-y-2">
                    {result.analysis.healthConcerns.map((c, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-on-surface-variant">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {result.analysis.recommendations?.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-on-surface-variant">Recommendations</h4>
                  <ul className="space-y-2">
                    {result.analysis.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-on-surface-variant p-3 bg-emerald/5 rounded-xl">
                        <ChevronRight className="h-4 w-4 text-emerald flex-shrink-0 mt-0.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specialist */}
              {result.analysis.specialistReferral && result.analysis.specialistReferral !== "None" && (
                <div className="p-5 bg-lavender/5 rounded-xl border border-lavender/10">
                  <p className="text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-lavender mb-1">Recommended Specialist</p>
                  <p className="font-heading font-extrabold text-foreground text-lg">{result.analysis.specialistReferral}</p>
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low text-[11px] text-outline italic">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-outline/60" />
                <p className="leading-relaxed">{result.analysis.disclaimer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
