"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, RotateCcw, Sparkles, Camera, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpeech } from "@/hooks/useSpeech";

interface SymptomInputProps {
  onAnalyze: (symptoms: string, imageBase64?: string) => void;
  isLoading: boolean;
}

const SymptomInput = ({ onAnalyze, isLoading }: SymptomInputProps) => {
  const [value, setValue] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isListening, transcript, startListening, stopListening } = useSpeech();

  useEffect(() => {
    if (transcript) {
      setTimeout(() => setValue(transcript), 0);
    }
  }, [transcript]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim() || imageBase64) {
      onAnalyze(value, imageBase64 || undefined);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      <form onSubmit={handleSubmit} className="relative group">
        <div className={`relative flex flex-col surface-float transition-all duration-500 rounded-3xl ${isListening ? 'ring-2 ring-lavender/30' : 'group-focus-within:ring-2 group-focus-within:ring-emerald/20'}`}>
          
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Describe your symptoms in detail..."
            className="w-full h-44 bg-transparent p-8 text-lg font-body outline-none resize-none placeholder:text-outline text-foreground leading-relaxed relative z-10"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          <AnimatePresence>
            {imageBase64 && (
              <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.9 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.9 }}
                className="px-8 pb-4 relative z-10"
              >
                <div className="relative inline-block">
                  <img src={imageBase64} alt="Symptom" className="h-24 w-24 object-cover rounded-2xl border-2 border-emerald/30 shadow-lg" />
                  <button
                    type="button"
                    onClick={() => setImageBase64(null)}
                    className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1 hover:bg-error/80 transition-colors shadow-md"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-5 bg-surface-container-low rounded-b-3xl gap-4 relative z-10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`relative flex items-center gap-3 px-6 py-3 rounded-full font-heading font-bold text-sm transition-all active:scale-95 ${isListening ? 'bg-error/10 text-error' : 'bg-surface-container text-on-surface-variant hover:text-foreground'}`}
              >
                {isListening ? (
                  <>
                    <div className="flex gap-1 h-3 items-center">
                      {[1, 2, 3, 4].map(i => (
                        <motion.div 
                          key={i} 
                          animate={{ height: [4, 12, 4] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                          className="w-1 bg-error rounded-full" 
                        />
                      ))}
                    </div>
                    <span>Recording...</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    <span className="hidden sm:inline">Voice Input</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative flex items-center gap-3 px-6 py-3 rounded-full font-heading font-bold text-sm transition-all active:scale-95 bg-surface-container text-on-surface-variant hover:text-foreground hover:bg-emerald/10"
                title="Add Photo"
              >
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Photo</span>
              </button>

              <button
                type="button"
                onClick={() => { setValue(""); setImageBase64(null); }}
                className="p-3 rounded-full hover:bg-surface-container transition-all text-outline hover:text-foreground"
                title="Reset"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || (!value.trim() && !imageBase64)}
              className="w-full sm:w-auto btn-pill btn-secondary flex items-center justify-center gap-2 font-heading font-bold disabled:opacity-30 disabled:grayscale transition-all hover:shadow-[0_0_20px_rgba(107,56,212,0.2)]"
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <>
                  <span>Run Analysis</span>
                  <Sparkles className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <span className="text-[11px] font-heading font-bold text-outline uppercase tracking-[0.15em] mr-1">Presets:</span>
          {[
            { symptom: "Persistent chest tightness with rapid pulse", title: "Cardiac" },
            { symptom: "Severe localized migraine with light sensitivity", title: "Neural" },
            { symptom: "Respiratory distress and persistent cough", title: "Pulmonary" }
          ].map((card, index) => (
            <motion.button
              key={card.title}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              onClick={() => setValue(card.symptom)}
              className="px-4 py-2 rounded-full bg-surface-container text-[11px] font-heading font-bold text-on-surface-variant hover:text-emerald hover:bg-emerald/5 transition-all"
            >
              {card.title}
            </motion.button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default SymptomInput;
