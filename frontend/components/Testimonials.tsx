"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "A complete diagnosis path in seconds. The result outperformed traditional triage systems we'd spent years developing.",
    name: "Dr. Aris Thorne",
    role: "Chief Medical Officer, Clinical Horizon"
  },
  {
    quote: "Accuracy up 4x. That's not a typo. The AI clinical routing just works differently when it's built on real-time case data.",
    name: "Jane Doe",
    role: "Patient & Health Advocate"
  },
  {
    quote: "They didn't just build a triage tool. They redefined our patient journey. Elite-grade intelligence doesn't begin to cover it.",
    name: "James Miller",
    role: "Health Administrator, Nexus Care"
  }
];

const Testimonials = () => {
  return (
    <section className="py-32 px-8 lg:px-16 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="bg-surface-container rounded-full px-5 py-1.5 text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-6">
            Testimonials
          </div>
          <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-foreground tracking-tight leading-[1]">
            Don&apos;t take our word for it.
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="surface-float p-10 space-y-8 h-full flex flex-col justify-between"
            >
              <p className="text-foreground/80 font-body text-base md:text-lg italic leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="space-y-1">
                <div className="text-foreground font-heading font-bold text-sm">
                  {item.name}
                </div>
                <div className="text-on-surface-variant text-xs">
                  {item.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
