"use client";

import { motion } from "framer-motion";
import { MessageSquare, Cpu, UserCog, MapPin } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Input Symptoms",
      desc: "Speak or type your symptoms in natural language. We understand you like a human would.",
      color: "bg-blue-500"
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "AI Analysis",
      desc: "Our engine processes urgency levels, specialist types, and immediate safety measures.",
      color: "bg-purple-500"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Doctor Routing",
      desc: "Get matched with the correct specialist and view real-time walk-in times at nearby clinics.",
      color: "bg-emerald-500"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 bg-white/5 backdrop-blur-3xl rounded-[3rem] mx-4 my-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How it works</h2>
          <p className="text-foreground/60">Three simple steps to better health navigation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />

          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className={`w-20 h-20 rounded-full ${step.color} shadow-2xl flex items-center justify-center text-white mb-8 border-4 border-background`}>
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-foreground/50 leading-relaxed max-w-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
