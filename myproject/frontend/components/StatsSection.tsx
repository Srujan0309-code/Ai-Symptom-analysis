"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "10k+", label: "Patient cases analyzed" },
  { value: "99.4%", label: "Triage accuracy rate" },
  { value: "5.2x", label: "Faster clinical routing" },
  { value: "24/7", label: "AI clinical availability" }
];

const StatsSection = () => {
  return (
    <section className="relative py-32 px-8 lg:px-16 overflow-hidden bg-background">
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="emerald-surface rounded-3xl p-12 md:p-20 relative overflow-hidden"
        >
          <div className="absolute inset-0 sanctuary-grid opacity-10" />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 relative z-10">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-3">
                <div className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white leading-none">
                  {stat.value}
                </div>
                <div className="text-white/60 font-body text-xs md:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
