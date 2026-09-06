/**
 * Design philosophy: A restrained civic atlas. Real map geography anchors the
 * regional monitoring experience while crisp signal circles and markers expose coverage and health.
 */
import { useEffect, useRef, useState } from "react";
import { MapView } from "@/components/Map";
import type { MonitoringZone, TransformerAsset } from "@/data/zoneData";

const mapStyle: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#102a47" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9cbcd9" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#102a47" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#31577c" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#294c70" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1b3b5d" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#a8c4de" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#173b61" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#80a7cb" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#071e35" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#284a6c" }] },
];

const dotColors = { healthy: "#52d0a2", watch: "#efbd62", fault: "#ef745d", offline: "#71869a" };

const atlasPositions = {
  avadi: [
    { x: 33, y: 30, label: "014", state: "healthy" },
    { x: 61, y: 49, label: "027", state: "watch" },
    { x: 72, y: 25, label: "031", state: "healthy" },
    { x: 25, y: 69, label: "044", state: "healthy" },
  ],
  ambattur: [
    { x: 59, y: 30, label: "008", state: "fault" },
    { x: 37, y: 52, label: "019", state: "healthy" },
    { x: 23, y: 71, label: "026", state: "healthy" },
    { x: 72, y: 64, label: "042", state: "watch" },
  ],
};

function AtlasDrawing({ zone }: { zone: MonitoringZone }) {
  const isAvadi = zone.id === "avadi";
  const placeLabel = isAvadi ? "Avadi Railway Corridor" : "Ambattur Industrial Estate";
  const secondaryLabel = isAvadi ? "MTH Road service belt" : "Korattur link service belt";
  return <div className="atlas-map-drawing" aria-hidden="true">
    <svg viewBox="0 0 1000 620" preserveAspectRatio="none">
      <defs><pattern id="atlas-grid" width="52" height="52" patternUnits="userSpaceOnUse"><path d="M 52 0 L 0 0 0 52" fill="none" stroke="rgba(149,191,221,.18)" strokeWidth="1" /></pattern></defs>
      <rect width="1000" height="620" fill="url(#atlas-grid)" />
      <path className="atlas-boundary" d={isAvadi ? "M120 100 L300 62 L492 128 L780 92 L911 201 L847 411 L694 541 L413 511 L265 566 L103 460 Z" : "M105 127 L291 78 L504 129 L751 79 L903 198 L848 424 L667 537 L446 490 L227 550 L92 392 Z"} />
      <path className="atlas-ward" d="M100 322 C225 255 317 320 411 248 S600 208 748 278 S832 386 946 338" />
      <path className="atlas-ward thin" d="M175 89 C238 186 379 210 490 128 S713 145 833 102" />
      <path className="atlas-route" d={isAvadi ? "M64 404 C234 347 344 388 477 310 S720 201 936 250" : "M72 376 C232 293 344 367 484 331 S671 253 923 291"} />
      <path className="atlas-route secondary" d={isAvadi ? "M250 552 C318 436 430 437 565 482 S768 494 863 398" : "M145 505 C296 437 378 474 497 429 S728 440 843 524"} />
      <circle className="atlas-coverage" cx="510" cy="325" r="165" /><circle className="atlas-coverage inner" cx="510" cy="325" r="95" />
    </svg>
    <span className="atlas-field-label primary">{zone.name.toUpperCase()} ZONE</span>
    <span className="atlas-field-label route-label">{placeLabel}</span>
    <span className="atlas-field-label secondary-label">{secondaryLabel}</span>
    <span className="atlas-field-label north-label">NORTH</span>
    {atlasPositions[zone.id].map((point) => <span key={point.label} className={`atlas-transformer-point ${point.state}`} style={{ left: `${point.x}%`, top: `${point.y}%` }}><i /><b>TX-{point.label}</b></span>)}
    <span className="atlas-compass">N<br /><i /></span>
  </div>;
}

export default function ZoneMap({ zone, selectedId, onSelect }: { zone: MonitoringZone; selectedId: string; onSelect: (asset: TransformerAsset) => void }) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.setOptions({ styles: mapStyle, disableDefaultUI: true, zoomControl: true, zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_TOP }, gestureHandling: "cooperative" });
    map.panTo(zone.centre);
    map.setZoom(13);
    const coverage = new google.maps.Circle({ map, center: zone.centre, radius: zone.coverageRadius, strokeColor: "#77bedf", strokeOpacity: 0.6, strokeWeight: 1, fillColor: "#2e91be", fillOpacity: 0.13 });
    const markers = zone.transformers.map((asset) => new google.maps.Marker({ map, position: asset.position, title: `${asset.id} — ${asset.health}% health`, label: { text: "", color: "transparent" }, icon: { path: google.maps.SymbolPath.CIRCLE, scale: asset.id === selectedId ? 11 : 8, fillColor: dotColors[asset.state], fillOpacity: 1, strokeColor: asset.id === selectedId ? "#f8fbff" : "#0b2846", strokeWeight: asset.id === selectedId ? 3 : 2 }, zIndex: asset.id === selectedId ? 10 : 4 }));
    markers.forEach((marker, index) => marker.addListener("click", () => onSelect(zone.transformers[index])));
    return () => { coverage.setMap(null); markers.forEach((marker) => marker.setMap(null)); };
  }, [zone, selectedId, ready, onSelect]);

  return <div className="zone-map-surface"><MapView initialCenter={zone.centre} initialZoom={13} className="zone-map-google" onMapReady={(map) => { mapRef.current = map; setReady(true); }} /><AtlasDrawing zone={zone} /><div className="map-scale"><span>Coverage radius</span><strong>{(zone.coverageRadius / 1000).toFixed(1)} km</strong></div><div className="map-attribution">Map view · Government monitoring prototype</div></div>;
}
