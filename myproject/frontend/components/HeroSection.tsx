"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, HeartPulse } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-20 pb-20 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-primary-400 text-sm font-medium mb-8">
            <Zap className="h-4 w-4" />
            <span>AI-Powered Health Triage is here</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Stop Searching, <br />
            <span className="text-gradient">Start Healing.</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Describe your symptoms to our intelligent AI and get routed to the right specialist in seconds. 
            Smart, safe, and lightning fast.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link 
              href="/triage"
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg transition-all shadow-xl shadow-primary-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              Start Free Checkup
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="#how-it-works"
              className="w-full sm:w-auto px-10 py-4 rounded-full glass hover:bg-white/10 text-foreground font-semibold text-lg transition-all"
            >
              See How It Works
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
        >
          {[
            { 
              icon: <Zap className="h-6 w-6 text-yellow-400" />, 
              title: "Instant Triage", 
              desc: "AI identifies symptom urgency and suggests the best next steps without waiting rooms." 
            },
            { 
              icon: <ShieldCheck className="h-6 w-6 text-green-400" />, 
              title: "Safe Guidance", 
              desc: "Engineered with medical safety at core. Always prioritizing emergency care when needed." 
            },
            { 
              icon: <HeartPulse className="h-6 w-6 text-rose-500" />, 
              title: "Specialist Routing", 
              desc: "Automatically identifies the right doctors nearby based on your unique symptom profile." 
            }
          ].map((feature, idx) => (
            <div key={idx} className="glass p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all text-left group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-foreground/50 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
