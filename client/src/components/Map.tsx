/// <reference types="@types/google.maps" />

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

declare global { interface Window { google?: typeof google; } }

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL = import.meta.env.VITE_FRONTEND_FORGE_API_URL || "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;
let mapScriptPromise: Promise<void> | null = null;

function loadMapScript() {
  if (window.google?.maps) return Promise.resolve();
  if (mapScriptPromise) return mapScriptPromise;
  mapScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&loading=async&libraries=marker,places,geocoding,geometry`;
    script.async = true;
    script.onload = () => window.google?.maps ? resolve() : reject(new Error("Google Maps did not initialise"));
    script.onerror = () => reject(new Error("Google Maps script request failed"));
    document.head.appendChild(script);
  }).catch((error) => { mapScriptPromise = null; throw error; });
  return mapScriptPromise;
}

interface MapViewProps { className?: string; initialCenter?: google.maps.LatLngLiteral; initialZoom?: number; onMapReady?: (map: google.maps.Map) => void; }

export function MapView({ className, initialCenter = { lat: 37.7749, lng: -122.4194 }, initialZoom = 12, onMapReady }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const initialise = async () => {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          await loadMapScript();
          if (cancelled || !mapContainer.current || !window.google?.maps) return;
          const map = new window.google.maps.Map(mapContainer.current, { zoom: initialZoom, center: initialCenter, mapTypeControl: false, fullscreenControl: false, zoomControl: true, streetViewControl: false, mapId: "DEMO_MAP_ID" });
          onMapReady?.(map);
          return;
        } catch (error) {
          if (attempt === 1) { console.error("Failed to load Google Maps script", error); if (!cancelled) setLoadError(true); }
          else await new Promise((resolve) => window.setTimeout(resolve, 500));
        }
      }
    };
    initialise();
    return () => { cancelled = true; };
  }, [initialCenter, initialZoom, onMapReady]);
  return <div ref={mapContainer} className={cn("w-full h-[500px]", className)}>{loadError ? <div className="map-load-note">Map service is reconnecting. Geographic overlays will return automatically.</div> : null}</div>;
}
