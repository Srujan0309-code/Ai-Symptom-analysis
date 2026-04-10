"use client";

import { useState, useEffect } from "react";
import { Mic, Send, RotateCcw, Volume2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpeech } from "@/hooks/useSpeech";

interface SymptomInputProps {
  onAnalyze: (symptoms: string) => void;
  isLoading: boolean;
}

const SymptomInput = ({ onAnalyze, isLoading }: SymptomInputProps) => {
  const [value, setValue] = useState("");
  const { isListening, transcript, startListening, stopListening } = useSpeech();

  // Update input value when transcript changes
  useEffect(() => {
    if (transcript) {
      setValue(transcript);
    }
  }, [transcript]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim()) {
      onAnalyze(value);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className={`relative flex flex-col glass transition-all duration-500 rounded-[2rem] border-2 shadow-2xl ${isListening ? 'border-primary-500 ring-4 ring-primary-500/10' : 'border-white/10 group-focus-within:border-primary-500/50'}`}>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="I have chest pain and dizziness..."
            className="w-full h-40 bg-transparent p-8 text-xl outline-none resize-none placeholder:text-foreground/20 leading-relaxed overflow-hidden"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/5 rounded-b-[2rem]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`relative flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all active:scale-95 ${isListening ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-white/10 text-foreground/70 hover:bg-white/20'}`}
              >
                {isListening ? (
                  <>
                    <div className="flex gap-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-1.5 bg-white rounded-full waveform-bar" style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                    <span>Listening...</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5" />
                    <span>Speak symptoms</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setValue("")}
                className="p-3 rounded-full hover:bg-white/10 transition-colors text-foreground/40"
                title="Reset"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !value.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" />
              ) : (
                <>
                  <span>Analyze</span>
                  <Sparkles className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suggestion tags */}
        <div className="flex gap-3 mt-6 flex-wrap justify-center">
          {["Sudden fever", "Shoulder ache", "Migraine", "Shortness of breath"].map((symptom) => (
            <button
              key={symptom}
              type="button"
              onClick={() => setValue(symptom)}
              className="px-4 py-2 rounded-full glass border border-white/5 text-xs text-foreground/40 hover:text-foreground hover:border-white/20 transition-all"
            >
              + {symptom}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default SymptomInput;
