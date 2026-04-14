"use client";

import Navbar from "./Navbar";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <Navbar />}
      <main className={`min-h-screen bg-background ${!isLoginPage ? "pt-16" : ""}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {!isLoginPage && pathname !== "/" && (
        <footer className="bg-surface-container-low border-t border-outline-variant/10 py-12 px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="text-xl font-heading font-extrabold text-foreground tracking-tight">MediRoute AI</div>
              <p className="text-sm text-on-surface-variant text-center md:text-left max-w-xs leading-relaxed">
                Empowering healthcare through intelligent clinical triage and seamless specialist routing.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
              <div className="text-[10px] font-heading font-black py-1 px-4 rounded-full bg-error/8 text-error uppercase tracking-widest border border-error/5">
                Clinical Disclaimer: Not a diagnosis
              </div>
              <p className="text-[11px] text-outline font-body">
                © 2026 MediRoute AI. All rights reserved. Clinical Grade Intelligence.
              </p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
