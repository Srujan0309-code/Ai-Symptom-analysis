"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Phone, Navigation, X } from "lucide-react";

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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop with extreme pulse */}
          <motion.div 
            animate={{ 
              backgroundColor: ["rgba(225, 29, 72, 0.4)", "rgba(225, 29, 72, 0.7)", "rgba(225, 29, 72, 0.4)"] 
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-[#1e070b] border-2 border-rose-500 rounded-[3rem] p-10 shadow-[0_0_50px_rgba(225,29,72,0.5)] text-center overflow-hidden"
          >
            {/* Warning Icon Animation */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-24 h-24 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(225,29,72,0.8)]"
            >
              <AlertCircle className="h-12 w-12 text-white" />
            </motion.div>

            <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">CRITICAL EMERGENCY</h2>
            <p className="text-rose-200/70 mb-10 text-lg">
              Our AI has detected life-threatening symptoms. Please act immediately. 
              Do not wait for further analysis.
            </p>

            <div className="flex flex-col gap-4">
              <a 
                href="tel:911" 
                className="w-full bg-rose-500 hover:bg-rose-600 text-white py-6 rounded-2xl font-black text-2xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-lg shadow-rose-900/50"
              >
                <Phone className="h-8 w-8" />
                CALL EMERGENCY (911)
              </a>
              <a 
                href="/map?specialty=Emergency" 
                className="w-full bg-white/10 hover:bg-white/20 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all"
              >
                <Navigation className="h-5 w-5" />
                Navigate to Nearest ER
              </a>
            </div>

            <button 
              onClick={onClose}
              className="mt-8 text-rose-200/30 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 mx-auto"
            >
              <X className="h-4 w-4" />
              Dismiss (I am already in care)
            </button>

            {/* Scanning graphic */}
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 shadow-[0_0_20px_rgba(225,29,72,1)] animate-[scan_2s_linear_infinite]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmergencyAlert;
