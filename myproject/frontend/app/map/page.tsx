"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Map as MapIcon, Filter, Search, List, ChevronLeft, AlertCircle, Navigation } from "lucide-react";
import ClinicCard from "@/components/ClinicCard";
import { fetchClinics } from "@/lib/api";

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
      <div className="text-foreground/40 animate-pulse">Loading Map...</div>
    </div>
  ),
});

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
              <button suppressHydrationWarning className="p-2 glass rounded-xl hover:bg-white/10 transition-colors">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
            <input
              suppressHydrationWarning
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
                suppressHydrationWarning
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
        <div className="absolute inset-0">
          <MapView
            clinics={clinics}
            selectedClinic={selectedClinic}
            onSelectClinic={setSelectedClinic}
          />
        </div>

        {/* Info Banner when specialist selected */}
        {initialSpecialty && (
          <div className="absolute bottom-8 left-8 right-8 lg:left-auto lg:right-8 lg:w-96 px-6 py-4 glass rounded-2xl flex items-center gap-4 border-primary-500/30 z-10">
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
