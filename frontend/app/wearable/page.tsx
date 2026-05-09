"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Watch, Cpu } from "lucide-react";
import WearableHub from "@/components/WearableHub";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

export default function WearablePage() {
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
      <div className="absolute top-[8%] left-[10%] w-[400px] h-[400px] bg-sky-400/3 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[10%] w-[350px] h-[350px] bg-rose-400/3 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="bg-surface-container rounded-full px-5 py-2 text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-sky-400 mb-8 inline-flex items-center gap-2">
            <Watch className="h-3.5 w-3.5" />
            Connected Health
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-foreground tracking-tight leading-[1] mb-6">
            Wearable Hub
          </h1>

          <p className="text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Sync your smartwatch or fitness tracker to get real-time vitals — heart rate, blood oxygen,
            steps, and sleep quality — all analyzed in the context of your health profile.
          </p>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { step: "01", title: "Connect", desc: "Pair your smartwatch via Bluetooth" },
            { step: "02", title: "Sync", desc: "Pull real-time vitals and activity data" },
            { step: "03", title: "Analyze", desc: "AI correlates vitals with symptoms" },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-5 rounded-2xl bg-surface-container-low text-center space-y-2"
            >
              <div className="text-[10px] font-heading font-bold uppercase tracking-[0.15em] text-sky-400">Step {item.step}</div>
              <p className="font-heading font-extrabold text-foreground text-sm">{item.title}</p>
              <p className="text-on-surface-variant text-xs">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Supported Devices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-12 p-6 rounded-2xl bg-surface-container-low border border-outline-variant/10"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-400/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cpu className="h-5 w-5 text-sky-400" />
            </div>
            <div className="space-y-1">
              <p className="font-heading font-bold text-foreground text-sm">Supported Devices</p>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Apple Watch Series 5+ · Samsung Galaxy Watch 4+ · Fitbit Sense / Versa ·
                Garmin Fenix / Venu · Xiaomi Mi Band · Google Pixel Watch
              </p>
            </div>
          </div>
        </motion.div>

        {/* WearableHub */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <WearableHub />
        </motion.div>
      </div>
    </div>
  );
}
