"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const CtaFooter = () => {
  return (
    <section className="relative pt-32 pb-16 px-8 lg:px-16 overflow-hidden bg-background">
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Content */}
        <div className="text-center space-y-10 mb-24">
          <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-heading font-extrabold text-foreground leading-[1] tracking-tight max-w-4xl">
            Your next healthcare journey starts here.
          </h2>
          <p className="text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Consult our AI diagnostic assistant. See what advanced medical intelligence can do. 
            No waiting, no pressure. Just possibilities.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link 
              href="/triage"
              className="btn-pill btn-primary font-heading font-bold flex items-center gap-2 text-base group"
            >
              Start Your Triage
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <Link 
              href="/dashboard"
              className="btn-pill bg-surface-container text-foreground font-heading font-bold hover:bg-surface-container-high transition-all text-base"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="w-full pt-8 border-t border-outline-variant/15 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-on-surface-variant font-body text-xs">
            © 2026 MediRoute AI. All rights reserved.
          </div>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Documentation", "Contact"].map((link) => (
              <Link 
                key={link} 
                href="#" 
                className="text-on-surface-variant font-body text-xs hover:text-foreground transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaFooter;
