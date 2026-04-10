"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map as MapIcon, Filter, Search, List, ChevronLeft, AlertCircle } from "lucide-react";
import ClinicCard from "@/components/ClinicCard";
import { fetchClinics } from "@/lib/api";

function MapContent() {
  const searchParams = useSearchParams();
  const initialSpecialty = searchParams.get("specialty") || "";
  
  const [clinics, setClinics] = useState<any[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);
  const [filter, setFilter] = useState(initialSpecialty);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadClinics = async () => {
      setIsLoading(true);
      try {
        const data = await fetchClinics(filter);
        setClinics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadClinics();
  }, [filter]);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar - Clinic List */}
      <div className="w-full lg:w-[450px] bg-background border-r border-white/10 flex flex-col z-20">
        <div className="p-8 border-b border-white/10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black tracking-tight">Nearby <span className="text-gradient">Clinics</span></h1>
            <div className="flex gap-2">
              <button className="p-2 glass rounded-xl hover:bg-white/10 transition-colors">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
            <input 
              type="text"
              placeholder="Search specialists..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary-500/50 transition-all font-medium"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {["General", "Cardiology", "Dermatology", "Pediatrics"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${filter.toLowerCase() === cat.toLowerCase() ? 'bg-primary-600 text-white' : 'bg-white/5 text-foreground/40 hover:bg-white/10'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar custom-scrollbar">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-48 rounded-[2rem] bg-white/5 animate-shimmer" />
            ))
          ) : clinics.length > 0 ? (
            clinics.map((clinic) => (
              <ClinicCard 
                key={clinic.id} 
                clinic={clinic} 
                isSelected={selectedClinic === clinic.id}
                onClick={() => setSelectedClinic(clinic.id)}
              />
            ))
          ) : (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-foreground/20" />
              </div>
              <p className="text-foreground/40 font-medium">No clinics found for this specialty.</p>
            </div>
          )}
        </div>
      </div>

      {/* Map View Area */}
      <div className="flex-1 relative bg-[#0a0a0f]">
        {/* Mock Map UI */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/77.5946,12.9716,12,0/1200x800?access_token=pk.mock')] bg-cover opacity-50 grayscale contrast-125" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          {/* Animated Markers */}
          {clinics.map((clinic, idx) => (
            <motion.div
              key={clinic.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              style={{ 
                left: `${30 + (idx * 15)}%`, 
                top: `${20 + (idx * 20)}%` 
              }}
              className="absolute cursor-pointer group"
              onClick={() => setSelectedClinic(clinic.id)}
            >
              <div className={`relative flex items-center justify-center ${selectedClinic === clinic.id ? 'scale-125' : 'hover:scale-110'} transition-transform`}>
                <div className={`absolute w-12 h-12 rounded-full animate-pulse transition-colors ${selectedClinic === clinic.id ? 'bg-primary-500/40' : 'bg-primary-500/20'}`} />
                <div className={`w-6 h-6 rounded-full border-2 border-white shadow-xl flex items-center justify-center z-10 transition-colors ${selectedClinic === clinic.id ? 'bg-primary-500' : 'bg-background'}`}>
                  <MapIcon className={`h-3 w-3 ${selectedClinic === clinic.id ? 'text-white' : 'text-primary-500'}`} />
                </div>
              </div>
              
              <AnimatePresence>
                {selectedClinic === clinic.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 p-3 glass-dark rounded-xl text-center z-30"
                  >
                    <div className="text-sm font-bold truncate">{clinic.name}</div>
                    <div className="text-[10px] text-emerald-400 font-bold">{clinic.wait_time_minutes} min wait</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Map Controls */}
        <div className="absolute top-8 right-8 flex flex-col gap-4">
          <button className="p-4 glass rounded-2xl hover:bg-white/10 transition-colors shadow-2xl">
            <Navigation className="h-6 w-6 text-primary-400" />
          </button>
          <div className="flex flex-col glass rounded-2xl overflow-hidden shadow-2xl">
            <button className="p-4 hover:bg-white/10 border-b border-white/5 text-xl font-bold">+</button>
            <button className="p-4 hover:bg-white/10 text-xl font-bold">−</button>
          </div>
        </div>

        {/* Info Banner when specialist selected */}
        {initialSpecialty && (
          <div className="absolute bottom-8 left-8 right-8 lg:left-auto lg:right-8 lg:w-96 px-6 py-4 glass rounded-2xl flex items-center gap-4 border-primary-500/30">
            <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-primary-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold">Routing for {initialSpecialty}</div>
              <div className="text-xs text-foreground/50">Showing clinics with relevant doctors.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading Maps...</div>}>
      <MapContent />
    </Suspense>
  );
}
