"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  direction?: "top" | "bottom";
}

export const BlurText = ({ 
  text, 
  delay = 0, 
  className = "", 
  direction = "bottom" 
}: BlurTextProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const words = text.split(" ");

  return (
    <div ref={ref} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ 
            filter: "blur(10px)", 
            opacity: 0, 
            y: direction === "bottom" ? 50 : -50 
          }}
          animate={isInView ? { 
            filter: ["blur(10px)", "blur(5px)", "blur(0px)"], 
            opacity: [0, 0.5, 1], 
            y: [direction === "bottom" ? 50 : -50, -5, 0] 
          } : {}}
          transition={{
            duration: 0.8,
            delay: delay + i * 0.1,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className="mr-[0.25em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};
