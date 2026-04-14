"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Filter, Search, AlertCircle } from "lucide-react";
import ClinicCard from "@/components/ClinicCard";
import { fetchClinics } from "@/lib/api";
import { useAuth } from "@/components/AuthContext";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-surface-container-low">
      <div className="text-on-surface-variant animate-pulse font-heading text-sm">Loading Map...</div>
    </div>
  ),
});

function MapContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const initialSpecialty = searchParams.get("specialty") || "";
  
  const [clinics, setClinics] = useState<any[]>([]);
  const [rawLocalClinics, setRawLocalClinics] = useState<any[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);
  const [filter, setFilter] = useState(initialSpecialty);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const loadClinics = async () => {
      if (rawLocalClinics.length > 0) return;
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
  }, [filter, rawLocalClinics.length]);

  const handleClinicsFetched = (fetchedClinics: any[]) => {
    setRawLocalClinics(fetchedClinics);
    setIsLoading(false);
  };

  const filteredLocal = rawLocalClinics.filter(c => 
    !filter || 
    c.specialty?.toLowerCase().includes(filter.toLowerCase()) || 
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

  const displayClinics = filteredLocal.length > 0 
    ? filteredLocal 
    : (rawLocalClinics.length > 0 ? rawLocalClinics : clinics);

  const isShowingFallback = filter && rawLocalClinics.length > 0 && filteredLocal.length === 0;

  if (loading || (!user && !loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-2 border-outline-variant border-t-emerald rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-full lg:w-[420px] bg-background flex flex-col z-20 editorial-shadow">
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-heading font-extrabold text-foreground tracking-tight">
              Care Finder
            </h1>
            <button suppressHydrationWarning className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors">
              <Filter className="h-4 w-4 text-on-surface-variant" />
            </button>
          </div>

          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Search specialists or hospitals..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-surface-container-low rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-emerald/20 transition-all font-body text-sm text-foreground placeholder:text-outline"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {["General", "Cardiology", "Dermatology", "Pediatrics"].map((cat, idx) => (
              <button
                suppressHydrationWarning
                key={cat}
                onClick={() => setFilter(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-heading font-bold transition-all ${filter.toLowerCase() === cat.toLowerCase() ? (idx % 2 === 0 ? 'bg-emerald text-white' : 'bg-lavender text-white') : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar custom-scrollbar">
          {isShowingFallback && (
            <div className="p-4 rounded-xl badge-medium text-xs font-heading font-medium flex items-center gap-3">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Showing all nearby hospitals (no specific &ldquo;{filter}&rdquo; found).
            </div>
          )}
          
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-surface-container-low animate-pulse" />
            ))
          ) : displayClinics.length > 0 ? (
            displayClinics.map((clinic) => (
              <ClinicCard 
                key={clinic.id} 
                clinic={clinic} 
                isSelected={selectedClinic === clinic.id}
                onClick={() => setSelectedClinic(clinic.id)}
              />
            ))
          ) : (
            <div className="py-16 text-center">
              <div className="w-14 h-14 bg-surface-container rounded-xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-7 w-7 text-outline/30" />
              </div>
              <p className="text-on-surface-variant font-heading font-medium text-sm">No clinics found for this specialty.</p>
            </div>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-surface-container-low">
        <div className="absolute inset-0">
          <MapView
            clinics={displayClinics}
            selectedClinic={selectedClinic}
            onSelectClinic={setSelectedClinic}
            onClinicsFetched={handleClinicsFetched}
            specialtyFilter={filter}
          />
        </div>

        {initialSpecialty && (
          <div className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-80 px-5 py-4 surface-float editorial-shadow-lg rounded-2xl flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-emerald/8 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-emerald" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-heading font-bold text-foreground">Routing for {initialSpecialty}</div>
              <div className="text-xs text-on-surface-variant">Showing clinics with relevant doctors.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-background font-heading text-on-surface-variant">Loading Maps...</div>}>
      <MapContent />
    </Suspense>
  );
}
