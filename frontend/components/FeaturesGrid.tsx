"use client";

import { motion } from "framer-motion";
import { Zap, Palette, BarChart3, Shield } from "lucide-react";

const cards = [
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Seconds, Not Hours",
    desc: "From symptoms to specialist routing at a pace that redefines medical access. Because waiting is not a cure.",
    color: "text-emerald bg-emerald/8"
  },
  {
    icon: <Palette className="h-5 w-5" />,
    title: "Precision Matching",
    desc: "Every detail considered. Every specialist refined. Routing so precise, it feels inevitable for your recovery.",
    color: "text-lavender bg-lavender/8"
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Data-Driven Triage",
    desc: "Insights informed by global clinical data. Decisions backed by proven patterns. Results you can trust.",
    color: "text-emerald bg-emerald/8"
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Private by Default",
    desc: "Enterprise-grade encryption for your health data. Privacy isn't a feature—it's the foundation.",
    color: "text-lavender bg-lavender/8"
  }
];

const FeaturesGrid = () => {
  return (
    <section className="py-32 px-8 lg:px-16 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="bg-surface-container rounded-full px-5 py-1.5 text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-6">
            Why MediRoute
          </div>
          <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-foreground tracking-tight leading-[1]">
            The difference is everything.
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="surface-float p-8 space-y-6 flex flex-col items-start"
            >
              <div className={`rounded-xl w-11 h-11 flex items-center justify-center ${card.color}`}>
                {card.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-heading font-bold text-foreground">
                  {card.title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
