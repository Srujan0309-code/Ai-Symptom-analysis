"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Phone, Navigation, X, ShieldAlert } from "lucide-react";

interface EmergencyAlertProps {
  isVisible: boolean;
  onClose: () => void;
}

const EmergencyAlert = ({ isVisible, onClose }: EmergencyAlertProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
        >
          {/* Backdrop with toned intensity */}
          <motion.div 
            animate={{ 
              backgroundColor: ["rgba(186, 26, 26, 0.1)", "rgba(186, 26, 26, 0.25)", "rgba(186, 26, 26, 0.1)"] 
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-3xl p-10 shadow-[0_20px_80px_rgba(186,26,26,0.15)] text-center overflow-hidden border border-error/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top scanning line */}
            <motion.div 
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-error to-transparent opacity-50"
            />

            {/* Warning Icon Cluster */}
            <div className="relative mb-10">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-24 h-24 bg-error/8 rounded-full flex items-center justify-center mx-auto"
              >
                <div className="w-16 h-16 bg-error flex items-center justify-center rounded-full shadow-lg shadow-error/30">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-dashed border-error/20 rounded-full"
              />
            </div>

            <div className="space-y-4 mb-10">
              <div className="flex items-center justify-center gap-2 text-error font-heading font-black uppercase tracking-[0.2em] text-xs">
                <ShieldAlert className="h-4 w-4" />
                Critical Priority Detected
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight leading-none">
                Immediate<br />Action Required
              </h2>
              <p className="text-on-surface-variant text-base md:text-lg max-w-md mx-auto leading-relaxed">
                Life-threatening symptoms identified. Clinical routing suggests immediate professional intervention.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <a 
                href="tel:911" 
                className="w-full bg-error hover:bg-error/90 text-white py-5 rounded-2xl font-heading font-black text-xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl shadow-error/20"
              >
                <Phone className="h-6 w-6" />
                CALL EMERGENCY (911)
              </a>
              <a 
                href="/map?specialty=Emergency" 
                className="w-full bg-surface-container hover:bg-surface-container-high text-foreground py-5 rounded-2xl font-heading font-bold text-lg flex items-center justify-center gap-3 transition-all"
              >
                <Navigation className="h-5 w-5 text-emerald" />
                Find Nearest ER
              </a>
            </div>

            <button 
              onClick={onClose}
              className="mt-10 text-outline hover:text-foreground transition-colors text-sm font-heading font-bold flex items-center gap-2 mx-auto uppercase tracking-widest"
            >
              <X className="h-4 w-4" />
              Dismiss Security Alert
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmergencyAlert;
