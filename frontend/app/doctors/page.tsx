"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Stethoscope, ShieldCheck, Video, MessageSquare, Phone } from "lucide-react";
import DoctorConnect from "@/components/DoctorConnect";
import { useAuth } from "@/components/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function DoctorsContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const specialty = searchParams.get("specialty") || undefined;

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
      <div className="absolute top-[5%] left-[15%] w-[350px] h-[350px] bg-emerald/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[8%] right-[8%] w-[400px] h-[400px] bg-lavender/3 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="bg-surface-container rounded-full px-5 py-2 text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-emerald mb-8 inline-flex items-center gap-2">
            <Stethoscope className="h-3.5 w-3.5" />
            MediConnect
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-foreground tracking-tight leading-[1] mb-6">
            Find a Doctor
          </h1>

          <p className="text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Connect with verified medical professionals for consultations.
            Chat, video call, or phone a specialist based on your AI-recommended referral.
          </p>
        </motion.div>

        {/* Consultation Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { icon: <MessageSquare className="h-5 w-5" />, title: "Text Chat", desc: "Instant messaging with a specialist", color: "text-emerald bg-emerald/10" },
            { icon: <Video className="h-5 w-5" />, title: "Video Call", desc: "Face-to-face virtual consultation", color: "text-lavender bg-lavender/10" },
            { icon: <Phone className="h-5 w-5" />, title: "Phone Call", desc: "Direct voice consultation", color: "text-sky-400 bg-sky-400/10" },
          ].map((opt, i) => (
            <motion.div
              key={opt.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-6 rounded-2xl bg-surface-container-low text-center space-y-3"
            >
              <div className={`w-12 h-12 rounded-2xl ${opt.color} flex items-center justify-center mx-auto`}>
                {opt.icon}
              </div>
              <p className="font-heading font-extrabold text-foreground text-sm">{opt.title}</p>
              <p className="text-on-surface-variant text-xs">{opt.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-12 p-6 rounded-2xl bg-surface-container-low border border-outline-variant/10"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="h-5 w-5 text-emerald" />
            </div>
            <div className="space-y-1">
              <p className="font-heading font-bold text-foreground text-sm">All Doctors Are Verified</p>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Every listed doctor is a licensed professional with verified credentials, hospital affiliations,
                and patient reviews. Your health data is encrypted and HIPAA-compliant.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Doctor List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DoctorConnect suggestedSpecialty={specialty} />
        </motion.div>
      </div>
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-2 border-outline-variant border-t-emerald rounded-full" />
      </div>
    }>
      <DoctorsContent />
    </Suspense>
  );
}
