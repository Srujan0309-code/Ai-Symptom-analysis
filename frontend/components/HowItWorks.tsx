"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-32 px-8 lg:px-16 overflow-hidden bg-background">
      {/* Gradient background */}
      <div className="absolute inset-0 emerald-surface z-0" />
      <div className="absolute inset-0 sanctuary-grid opacity-10 z-[1]" />
      
      {/* Soft orbs */}
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[120px] z-[1]" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="bg-white/10 rounded-full px-5 py-1.5 text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-white/80 mb-8 backdrop-blur-sm"
        >
          How It Works
        </motion.div>

        <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-white leading-[1] tracking-tight mb-8">
          You describe it.<br />We solve it.
        </h2>

        <p className="text-white/70 font-body text-base md:text-lg max-w-xl leading-relaxed mb-12">
          Share your health concerns in natural language. Our AI handles the rest—urgency 
          assessment, specialist matching, and real-time routing. All in seconds, 
          not hours in a waiting room.
        </p>

        <Link href="/triage" className="btn-pill bg-white text-emerald font-heading font-bold hover:scale-105 transition-transform editorial-shadow">
          Start Triage Now
        </Link>
      </div>
    </section>
  );
};

export default HowItWorks;
