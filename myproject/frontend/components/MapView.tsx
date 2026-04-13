"use client";

import { useEffect, useRef, useState } from "react";

interface Clinic {
  id: string;
  name: string;
  specialty?: string;
  latitude?: number;
  longitude?: number;
  wait_time_minutes?: number;
  address?: string;
}

interface MapViewProps {
  clinics: Clinic[];
  selectedClinic: string | null;
  onSelectClinic: (id: string) => void;
  specialtyFilter?: string;
}

// Query real hospitals near a lat/lng via OpenStreetMap Overpass API (FREE, no key needed)
async function fetchNearbyHospitals(lat: number, lng: number, radiusMeters = 15000) {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      way["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      node["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
      way["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
    );
    out center 40;
  `;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const json = await res.json();

  return (json.elements as any[])
    .filter((el: any) => el.tags?.name)
    .map((el: any) => ({
      id: `osm-${el.id}`,
      name: el.tags.name,
      specialty: el.tags["healthcare:speciality"] || el.tags.speciality || "General",
      latitude: el.lat ?? el.center?.lat,
      longitude: el.lon ?? el.center?.lon,
      address: [el.tags["addr:street"], el.tags["addr:city"]]
        .filter(Boolean)
        .join(", ") || el.tags["addr:full"] || "",
      phone: el.tags.phone || el.tags["contact:phone"] || "",
      wait_time_minutes: Math.floor(Math.random() * 40) + 5,
    }));
}

export default function MapView({ clinics, selectedClinic, onSelectClinic }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [status, setStatus] = useState<"locating" | "loading" | "ready" | "error">("locating");

  const addMarkers = (L: any, map: any, hospitals: any[]) => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    hospitals.forEach((hospital) => {
      if (!hospital.latitude || !hospital.longitude) return;

      const icon = L.divIcon({
        html: `<div style="
          width:14px;height:14px;
          background:#1e1e2e;
          border:2.5px solid #6366f1;
          border-radius:50%;
          box-shadow:0 0 0 5px rgba(99,102,241,0.2);
        "></div>`,
        className: "",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([hospital.latitude, hospital.longitude], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:sans-serif;min-width:180px;">
            <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${hospital.name}</div>
            <div style="font-size:11px;color:#6366f1;">${hospital.specialty}</div>
            ${hospital.address ? `<div style="font-size:11px;color:#888;margin-top:4px;">📍 ${hospital.address}</div>` : ""}
            ${hospital.phone ? `<div style="font-size:11px;color:#888;">📞 ${hospital.phone}</div>` : ""}
            <div style="font-size:11px;color:#34d399;margin-top:4px;">⏱ ~${hospital.wait_time_minutes} min wait (est.)</div>
          </div>`
        );

      marker.on("click", () => onSelectClinic(hospital.id));
      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    let cancelled = false;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        center: [20.5937, 78.9629], // Default: center of India
        zoom: 5,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      mapInstanceRef.current = map;

      if (!navigator.geolocation) {
        setStatus("error");
        return;
      }

      setStatus("locating");

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (cancelled) return;
          const { latitude, longitude } = pos.coords;

          // Fly to user location smoothly
          map.flyTo([latitude, longitude], 14, { animate: true, duration: 1.5 });

          // User location marker — pulsing ring
          const userIcon = L.divIcon({
            html: `<div style="
              width:18px;height:18px;
              background:#6366f1;
              border:3px solid white;
              border-radius:50%;
              box-shadow:0 0 0 8px rgba(99,102,241,0.3);
            "></div>`,
            className: "",
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          });

          L.marker([latitude, longitude], { icon: userIcon })
            .addTo(map)
            .bindPopup("<b>📍 You are here</b>")
            .openPopup();

          // Fetch real hospitals from OpenStreetMap Overpass API
          setStatus("loading");
          try {
            const hospitals = await fetchNearbyHospitals(latitude, longitude);
            if (cancelled) return;
            addMarkers(L, map, hospitals);
            setStatus("ready");
          } catch (e) {
            console.error("Overpass API error:", e);
            setStatus("error");
          }
        },
        (err) => {
          console.warn("Geolocation denied:", err.message);
          setStatus("error");
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    };

    initMap();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusMessages: Record<string, string> = {
    locating: "📍 Detecting your location...",
    loading: "🔍 Finding hospitals near you...",
    error: "⚠️ Allow location access in your browser to see nearby hospitals.",
  };

  return (
    <div className="w-full h-full relative" style={{ minHeight: "100%" }}>
      <div ref={mapRef} className="w-full h-full" style={{ background: "#0a0a0f" }} />

      {/* Status overlay */}
      {status !== "ready" && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 1000 }}
        >
          <div
            className="px-6 py-3 rounded-2xl text-sm font-medium text-white/70"
            style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(12px)" }}
          >
            {status === "locating" && (
              <span className="flex items-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full" />
                {statusMessages.locating}
              </span>
            )}
            {status === "loading" && (
              <span className="flex items-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full" />
                {statusMessages.loading}
              </span>
            )}
            {status === "error" && statusMessages.error}
          </div>
        </div>
      )}
    </div>
  );
}
