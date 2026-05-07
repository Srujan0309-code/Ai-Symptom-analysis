"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Play, Shield, Heart, Brain } from "lucide-react";
import { BlurText } from "./BlurText";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-background">
      {/* Subtle Grid */}
      <div className="absolute inset-0 sanctuary-grid opacity-40 pointer-events-none" />
      
      {/* Soft gradient orbs */}
      <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-emerald/5 dark:bg-emerald/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-lavender/5 dark:bg-lavender/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 lg:px-16 pt-[220px] pb-24 flex flex-col items-center text-center">
        
        {/* Visual Background Accent */}
        <div className="absolute top-[180px] right-[5%] w-[300px] h-[300px] hidden xl:block opacity-20 pointer-events-none">
          <img 
            src="/medical_ai_1.png"
            alt="AI Architecture"
            className="w-full h-full object-cover rounded-3xl rotate-12"
          />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-surface-container rounded-full px-1.5 py-1.5 flex items-center gap-3 mb-10"
        >
          <span className="bg-emerald text-white rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-[0.15em]">
            v4.2
          </span>
          <span className="text-on-surface-variant text-xs font-heading font-medium px-3 tracking-wide">
            Clinical AI — Now with Neural Pattern Analysis
          </span>
        </motion.div>

        {/* Main Heading */}
        <BlurText 
          text="The Healthcare Your Family Deserves"
          className="text-5xl md:text-6xl lg:text-[5.5rem] font-heading font-extrabold text-foreground leading-[0.95] max-w-5xl tracking-[-2px] mb-8"
        />

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-base md:text-lg text-on-surface-variant font-body max-w-xl leading-relaxed mb-12"
        >
          AI-powered symptom analysis with zero latency. 
          Engineered for safety, refined for speed. 
          Elite patient care, reimagined for the digital age.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6, duration: 0.6 }}
           className="flex flex-wrap items-center justify-center gap-6 mb-24"
        >
          <Link 
            href="/triage"
            className="btn-pill btn-primary flex items-center gap-2 group text-base"
          >
            <span className="font-heading font-bold">Start Diagnosis</span>
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <button className="flex items-center gap-3 group text-on-surface-variant hover:text-foreground transition-colors">
            <div className="w-11 h-11 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-emerald group-hover:border-emerald group-hover:text-white transition-all">
              <Play className="h-4 w-4 fill-current ml-0.5" />
            </div>
            <span className="font-heading text-sm font-bold">Watch Demo</span>
          </button>
        </motion.div>

        {/* Feature Cards Row */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: <Shield className="h-6 w-6" />, title: "Clinical Accuracy", desc: "99.2% diagnostic precision powered by medical AI models." },
            { icon: <Heart className="h-6 w-6" />, title: "Patient First", desc: "Your data stays private. HIPAA-compliant architecture." },
            { icon: <Brain className="h-6 w-6" />, title: "Neural Analysis", desc: "Deep pattern recognition across 10,000+ clinical conditions." },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="surface-card p-8 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald/8 flex items-center justify-center text-emerald mb-5">
                {card.icon}
              </div>
              <h3 className="font-heading font-bold text-foreground mb-2 text-lg">{card.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Partners */}
        <div className="w-full pb-16 flex flex-col items-center gap-8">
          <div className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-outline">
            Trusted by Leading Healthcare Institutions
          </div>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
            {["Mayo Clinic", "Pfizer", "CVS Health", "UnitedHealth", "BlueShield"].map((partner) => (
              <span 
                key={partner} 
                className="text-lg md:text-xl font-heading font-bold text-outline/50 hover:text-foreground transition-colors cursor-default"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
