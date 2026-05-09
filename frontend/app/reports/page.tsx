"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { FlaskConical, ShieldCheck } from "lucide-react";
import ReportUploader from "@/components/ReportUploader";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || (!user && !loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-2 border-outline-variant border-t-emerald rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-32 pb-20 px-6 md:px-12 lg:px-16 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[5%] right-[15%] w-[350px] h-[350px] bg-lavender/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] bg-emerald/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="bg-surface-container rounded-full px-5 py-2 text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-lavender mb-8 inline-flex items-center gap-2">
            <FlaskConical className="h-3.5 w-3.5" />
            Medical Report Intelligence
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-foreground tracking-tight leading-[1] mb-6">
            Report Analysis
          </h1>

          <p className="text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Upload blood work, radiology reports, ECG, discharge summaries or any medical document.
            Our AI extracts key findings and flags abnormalities using clinical databases.
          </p>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-12 p-6 rounded-2xl bg-surface-container-low border border-outline-variant/10"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="h-5 w-5 text-emerald" />
            </div>
            <div className="space-y-1">
              <p className="font-heading font-bold text-foreground text-sm">Supported Document Types</p>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                PDF lab reports · Blood test results (CBC, CMP, Lipid Panel) · X-Ray / CT / MRI summaries ·
                ECG/EKG printouts · Discharge summaries · Pathology reports · Prescription notes
              </p>
            </div>
          </div>
        </motion.div>

        {/* Uploader */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <ReportUploader />
        </motion.div>
      </div>
    </div>
  );
}
