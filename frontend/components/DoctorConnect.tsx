"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope, Star, Clock, MessageSquare, Video,
  Phone, X, Send, CheckCircle2, Loader2, ExternalLink
} from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviews: number;
  experience: string;
  availability: "Available Now" | "Available Today" | "Busy";
  avatar: string;
  fee: string;
  languages: string[];
  meetLink: string;
}

const MOCK_DOCTORS: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Priya Sharma",
    specialty: "General Physician",
    hospital: "Apollo Health Centre",
    rating: 4.9,
    reviews: 312,
    experience: "12 yrs",
    availability: "Available Now",
    avatar: "PS",
    fee: "₹500 / session",
    languages: ["English", "Hindi", "Tamil"],
    meetLink: "https://meet.jit.si/MediRoute-DrPriyaSharma",
  },
  {
    id: "d2",
    name: "Dr. Arjun Mehta",
    specialty: "Cardiologist",
    hospital: "Max Super Speciality",
    rating: 4.8,
    reviews: 189,
    experience: "18 yrs",
    availability: "Available Today",
    avatar: "AM",
    fee: "₹1200 / session",
    languages: ["English", "Hindi"],
    meetLink: "https://meet.jit.si/MediRoute-DrArjunMehta",
  },
  {
    id: "d3",
    name: "Dr. Sneha Reddy",
    specialty: "Neurologist",
    hospital: "NIMHANS",
    rating: 4.7,
    reviews: 254,
    experience: "15 yrs",
    availability: "Available Now",
    avatar: "SR",
    fee: "₹900 / session",
    languages: ["English", "Telugu", "Kannada"],
    meetLink: "https://meet.jit.si/MediRoute-DrSnehaReddy",
  },
  {
    id: "d4",
    name: "Dr. Vikram Nair",
    specialty: "Pulmonologist",
    hospital: "Fortis Healthcare",
    rating: 4.6,
    reviews: 143,
    experience: "10 yrs",
    availability: "Busy",
    avatar: "VN",
    fee: "₹750 / session",
    languages: ["English", "Hindi", "Malayalam"],
    meetLink: "https://meet.jit.si/MediRoute-DrVikramNair",
  },
];

const avatarColors = [
  "bg-emerald/20 text-emerald",
  "bg-lavender/20 text-lavender",
  "bg-sky-500/20 text-sky-500",
  "bg-amber-500/20 text-amber-500",
];

const availabilityConfig = {
  "Available Now": { color: "text-emerald", bg: "bg-emerald/8", dot: "bg-emerald" },
  "Available Today": { color: "text-amber-500", bg: "bg-amber-500/8", dot: "bg-amber-500" },
  "Busy": { color: "text-outline", bg: "bg-surface-container", dot: "bg-outline/50" },
};

interface ChatMessage {
  role: "user" | "doctor";
  text: string;
  time: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

export default function DoctorConnect({ suggestedSpecialty }: { suggestedSpecialty?: string }) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredDoctors = suggestedSpecialty
    ? MOCK_DOCTORS.filter(d => d.specialty.toLowerCase().includes(suggestedSpecialty.toLowerCase())).concat(
        MOCK_DOCTORS.filter(d => !d.specialty.toLowerCase().includes(suggestedSpecialty.toLowerCase()))
      )
    : MOCK_DOCTORS;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openChat = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setChatOpen(true);
    setMessages([
      {
        role: "doctor",
        text: `Hello! I'm ${doctor.name}, ${doctor.specialty} at ${doctor.hospital}. How can I help you today? Please describe your symptoms or concerns.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const openVideoCall = (doctor: Doctor) => {
    window.open(doctor.meetLink, "_blank", "noopener,noreferrer");
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !selectedDoctor) return;

    const userMsg: ChatMessage = {
      role: "user",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText("");
    setIsSending(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const res = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: currentInput,
          language: "en",
          doctorChat: true,
          doctorName: selectedDoctor.name,
          doctorSpecialty: selectedDoctor.specialty,
          conversationHistory,
        }),
      });

      if (!res.ok) throw new Error("AI unavailable");
      const data = await res.json();

      // Use the AI's advice field or construct from the result
      const replyText =
        data.doctorReply ||
        data.advice ||
        `Based on what you've shared, ${data.recommendation || "I recommend scheduling an in-person consultation for a thorough evaluation. Could you tell me more about when these symptoms started and their severity?"}`;

      setMessages(prev => [
        ...prev,
        {
          role: "doctor",
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      // Fallback AI-like response
      const fallbacks = [
        "Thank you for sharing that. Could you describe the intensity of this symptom on a scale of 1–10?",
        "I understand your concern. How long have you been experiencing this? Any recent changes in diet, sleep, or stress levels?",
        "That's important information. Are you currently on any medications or have any known allergies?",
        "Based on what you've described, this warrants attention. I'd suggest we book a proper consultation for a full evaluation.",
        "I hear you. Have you experienced similar symptoms before? Any family history of related conditions?",
      ];
      setMessages(prev => [
        ...prev,
        {
          role: "doctor",
          text: fallbacks[Math.floor(Math.random() * fallbacks.length)],
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-card overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-outline-variant/10">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald/10 flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-emerald" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-foreground text-lg">Find a Doctor</h3>
              <p className="text-on-surface-variant text-xs mt-0.5">
                {suggestedSpecialty ? `Showing specialists for: ${suggestedSpecialty}` : "Connect with medical professionals"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-4">
          {filteredDoctors.map((doctor, idx) => {
            const avail = availabilityConfig[doctor.availability];
            const colorClass = avatarColors[idx % avatarColors.length];
            return (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all group"
              >
                {/* Avatar */}
                <div className={`w-14 h-14 rounded-2xl ${colorClass} flex items-center justify-center font-heading font-extrabold text-base flex-shrink-0`}>
                  {doctor.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-extrabold text-foreground text-base">{doctor.name}</span>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-[0.08em] ${avail.bg} ${avail.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${avail.dot} flex-shrink-0`} />
                      {doctor.availability}
                    </div>
                  </div>
                  <p className="text-emerald text-[11px] font-heading font-bold uppercase tracking-[0.12em]">{doctor.specialty}</p>
                  <p className="text-on-surface-variant text-xs">{doctor.hospital} · {doctor.experience} exp · {doctor.languages.join(", ")}</p>

                  <div className="flex items-center gap-4 flex-wrap pt-1">
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      <Star className="h-3 w-3 fill-amber-400" />
                      <span className="font-heading font-bold text-foreground">{doctor.rating}</span>
                      <span className="text-on-surface-variant">({doctor.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                      <Clock className="h-3 w-3" />
                      {doctor.fee}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openChat(doctor)}
                    disabled={doctor.availability === "Busy"}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald/10 text-emerald hover:bg-emerald/20 font-heading font-bold text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Chat
                  </button>
                  <button
                    onClick={() => openVideoCall(doctor)}
                    disabled={doctor.availability === "Busy"}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lavender/10 text-lavender hover:bg-lavender/20 font-heading font-bold text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Video className="h-3.5 w-3.5" />
                    Video
                  </button>
                  <button
                    onClick={() => window.open(`tel:+919998887777`, "_self")}
                    className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-foreground transition-all"
                    title="Call Doctor"
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Chat Modal */}
      <AnimatePresence>
        {chatOpen && selectedDoctor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-background/70 backdrop-blur-md"
            onClick={(e) => { if (e.target === e.currentTarget) setChatOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="w-full max-w-md surface-float rounded-3xl overflow-hidden editorial-shadow-lg"
            >
              {/* Chat Header */}
              <div className="px-6 py-5 flex items-center gap-4 border-b border-outline-variant/10 bg-surface-container-low">
                <div className="w-10 h-10 rounded-xl bg-emerald/15 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-emerald" />
                </div>
                <div className="flex-1">
                  <p className="font-heading font-extrabold text-foreground text-sm">{selectedDoctor.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald" />
                    <span className="text-emerald text-[10px] font-heading font-bold uppercase tracking-[0.1em]">AI-Assisted Consultation</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openVideoCall(selectedDoctor)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lavender/10 text-lavender hover:bg-lavender/20 font-heading font-bold text-xs transition-all"
                    title="Start Video Call"
                  >
                    <Video className="h-3.5 w-3.5" />
                    <ExternalLink className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => setChatOpen(false)}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
                  >
                    <X className="h-4 w-4 text-on-surface-variant" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="h-72 overflow-y-auto p-5 space-y-3">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-lavender text-white rounded-br-none"
                          : "bg-surface-container-low text-foreground rounded-bl-none"
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-outline px-1">{msg.time}</span>
                    </div>
                  </motion.div>
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 rounded-2xl bg-surface-container-low rounded-bl-none flex items-center gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/40"
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-5 pb-5 pt-3 flex items-center gap-3">
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                  placeholder="Describe your symptoms..."
                  className="flex-1 bg-surface-container-low rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-outline outline-none border border-outline-variant/10 focus:border-lavender/30 transition-colors"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                  disabled={!inputText.trim() || isSending}
                  className="w-10 h-10 rounded-2xl bg-lavender flex items-center justify-center text-white flex-shrink-0 disabled:opacity-40"
                >
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </motion.button>
              </div>

              <div className="px-5 pb-4 text-center">
                <p className="text-[10px] text-outline">AI-assisted responses · Not a substitute for professional medical advice</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
