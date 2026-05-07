"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const features = [
  {
    badge: "Diagnostic Precision",
    title: "Informed by data. Built for accuracy.",
    desc: "Every triage path is intentional. Our AI analyzes patterns across thousands of clinical cases to provide guidance that outperforms traditional symptom checkers.",
    gif: "https://motionsites.ai/assets/hero-finlytic-preview-CV9g0FHP.gif",
    reverse: false
  },
  {
    badge: "Adaptive Care",
    title: "It gets smarter. Automatically.",
    desc: "Your health journey evolves. The system monitors feedback loops—then optimizes routing in real time. No static rules. Ever.",
    gif: "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
    reverse: true
  }
];

const FeaturesChess = () => {
  return (
    <section className="py-32 px-8 lg:px-16 bg-background relative">
      <div className="max-w-7xl mx-auto space-y-32">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="bg-surface-container rounded-full px-5 py-1.5 text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-6">
            Capabilities
          </div>
          <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-foreground tracking-tight leading-[1]">
            Advanced Diagnosis.<br />Zero Complexity.
          </h2>
        </div>

        {features.map((item, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col ${item.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-24`}
          >
            {/* Text */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 space-y-6"
            >
              <div className={`rounded-full px-4 py-1.5 text-[11px] font-heading font-bold uppercase tracking-[0.15em] inline-block ${item.reverse ? 'bg-lavender/8 text-lavender' : 'bg-emerald/8 text-emerald'}`}>
                {item.badge}
              </div>
              <h3 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground leading-[1.1]">
                {item.title}
              </h3>
              <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-lg">
                {item.desc}
              </p>
              <button className={`btn-pill text-foreground font-heading font-bold text-sm bg-surface-container transition-all ${item.reverse ? 'hover:bg-lavender/10 hover:text-lavender' : 'hover:bg-emerald/10 hover:text-emerald'}`}>
                Learn more
              </button>
            </motion.div>

            {/* Visual */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 w-full"
            >
              <div className="surface-card h-[350px] lg:h-[450px] overflow-hidden rounded-2xl relative group">
                {/* Real Medical Image */}
                <img 
                  src={idx === 0 ? "/medical_ai_1.png" : "/medical_specialist.png"}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-6 left-6 z-10">
                   <div className="text-[10px] font-heading font-black uppercase tracking-[0.25em] text-white/70">
                     Clinical Focus_{idx.toString().padStart(2, '0')}
                   </div>
                </div>

                {/* Corner Accents - Lavender prominence */}
                <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-lavender/30" />
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-emerald/30" />
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesChess;
