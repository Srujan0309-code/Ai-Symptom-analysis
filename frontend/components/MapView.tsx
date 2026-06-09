"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";

export interface Clinic {
  id: string;
  name: string;
  specialty: string;
  lat: number;
  lng: number;
  wait_time_minutes: number;
  address: string;
  rating: number;
  phone: string;
  email?: string;
  opening_hours?: string;
  isOpen?: boolean;
}

interface MapViewProps {
  clinics: Clinic[];
  selectedClinic: string | null;
  onSelectClinic: (id: string) => void;
  onClinicsFetched?: (clinics: Clinic[]) => void;
  specialtyFilter?: string;
}

const LIBRARIES: ("places")[] = ["places"];

// Dark/light elegant map style
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { featureType: "all", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9e8f0" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ececec" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e8f5e9" }] },
  { featureType: "poi.medical", elementType: "geometry", stylers: [{ color: "#fce4ec" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c9b2d4" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f9f9f9" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#555555" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }, { weight: 2 }] },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
];

const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };
const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };

export default function MapView({
  onSelectClinic,
  onClinicsFetched,
}: MapViewProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: LIBRARIES,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [hospitals, setHospitals] = useState<Clinic[]>([]);
  const [selectedInfo, setSelectedInfo] = useState<Clinic | null>(null);
  const [status, setStatus] = useState<"locating" | "loading" | "ready" | "error">("locating");

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Fetch nearby hospitals using Places API
  const fetchNearby = useCallback(
    (lat: number, lng: number) => {
      if (!mapRef.current) return;
      setStatus("loading");

      const service = new google.maps.places.PlacesService(mapRef.current);
      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(lat, lng),
        radius: 10000,
        type: "hospital",
      };

      service.nearbySearch(request, (results, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          results &&
          results.length > 0
        ) {
          const mapped: Clinic[] = results
            .filter((p) => p.geometry?.location)
            .map((p, i) => ({
              id: p.place_id || `gplace-${i}`,
              name: p.name || "Hospital",
              specialty: "General / Emergency",
              lat: p.geometry!.location!.lat(),
              lng: p.geometry!.location!.lng(),
              address: p.vicinity || "Nearby",
              rating: p.rating || +(4.0 + Math.random() * 0.9).toFixed(1),
              phone: "+91 999 888 7777",
              wait_time_minutes: Math.floor(Math.random() * 35) + 5,
              isOpen: p.opening_hours?.isOpen?.() ?? true,
              opening_hours: p.opening_hours?.isOpen?.() ? "Open Now" : "Closed",
            }));

          setHospitals(mapped);
          setStatus("ready");
          onClinicsFetched?.(mapped);
        } else {
          setStatus("error");
        }
      });
    },
    [onClinicsFetched]
  );

  // Get user location on mount
  useEffect(() => {
    if (!isLoaded) return;

    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc = { lat: latitude, lng: longitude };
        setUserPos(loc);
        mapRef.current?.panTo(loc);
        mapRef.current?.setZoom(14);
        fetchNearby(latitude, longitude);
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
        setStatus("error");
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  }, [isLoaded, fetchNearby]);

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface-container-low">
        <p className="text-error text-sm font-heading font-bold">
          ⚠️ Google Maps failed to load. Check your API key.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface-container-low">
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-background/80 backdrop-blur-sm shadow-lg">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-emerald border-t-transparent rounded-full" />
          <span className="text-on-surface-variant text-sm font-heading font-medium">Loading Google Maps…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={userPos ?? DEFAULT_CENTER}
        zoom={userPos ? 14 : 5}
        onLoad={onMapLoad}
        options={{
          styles: MAP_STYLES,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          clickableIcons: false,
        }}
      >
        {/* User location — blue pulsing dot */}
        {userPos && (
          <>
            <Circle
              center={userPos}
              radius={300}
              options={{
                fillColor: "#4f46e5",
                fillOpacity: 0.12,
                strokeColor: "#4f46e5",
                strokeOpacity: 0.4,
                strokeWeight: 1,
              }}
            />
            <Marker
              position={userPos}
              title="You are here"
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 9,
                fillColor: "#4f46e5",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 3,
              }}
              zIndex={999}
            />
          </>
        )}

        {/* Hospital markers */}
        {hospitals.map((h) => (
          <Marker
            key={h.id}
            position={{ lat: h.lat, lng: h.lng }}
            title={h.name}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: h.isOpen ? "#059669" : "#9ca3af",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2.5,
            }}
            onClick={() => {
              setSelectedInfo(h);
              onSelectClinic(h.id);
            }}
            zIndex={100}
          />
        ))}

        {/* Info Window on selected hospital */}
        {selectedInfo && (
          <InfoWindow
            position={{ lat: selectedInfo.lat, lng: selectedInfo.lng }}
            onCloseClick={() => setSelectedInfo(null)}
          >
            <div style={{
              fontFamily: "'Inter', sans-serif",
              minWidth: "220px",
              padding: "4px 2px",
            }}>
              <div style={{
                fontWeight: 800,
                fontSize: "14px",
                color: "#111827",
                marginBottom: "4px",
                lineHeight: 1.3,
              }}>
                {selectedInfo.name}
              </div>
              <div style={{
                display: "inline-block",
                background: selectedInfo.isOpen ? "#d1fae5" : "#f3f4f6",
                color: selectedInfo.isOpen ? "#065f46" : "#6b7280",
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "999px",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}>
                {selectedInfo.isOpen ? "Open Now" : "Closed"}
              </div>
              {selectedInfo.address && (
                <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>
                  📍 {selectedInfo.address}
                </div>
              )}
              <div style={{ fontSize: "12px", color: "#059669", fontWeight: 600, marginBottom: "3px" }}>
                ⏱ ~{selectedInfo.wait_time_minutes} min wait
              </div>
              <div style={{ fontSize: "12px", color: "#f59e0b", fontWeight: 600 }}>
                ⭐ {selectedInfo.rating.toFixed(1)} rating
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Status overlay */}
      {status !== "ready" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 10 }}>
          <div className="px-6 py-3 rounded-2xl text-sm font-medium shadow-lg"
            style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", color: "#374151" }}>
            {status === "locating" && (
              <span className="flex items-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full" />
                📍 Detecting your location…
              </span>
            )}
            {status === "loading" && (
              <span className="flex items-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-emerald border-t-transparent rounded-full" />
                🔍 Finding hospitals near you…
              </span>
            )}
            {status === "error" && (
              <span>⚠️ Allow location access to find nearby hospitals.</span>
            )}
          </div>
        </div>
      )}

      {/* Google Maps branding badge */}
      {status === "ready" && (
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EA4335"/>
          </svg>
          <span className="text-xs font-heading font-bold text-gray-600">
            {hospitals.length} hospitals nearby
          </span>
        </div>
      )}
    </div>
  );
}
