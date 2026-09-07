import { useEffect, useMemo } from "react";
import { Circle, MapContainer, Marker, Polygon, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { cityZones, getCity, getZone, transformers, type Transformer, type Zone } from "@/data/controlRoomData";

const stateColours = { healthy: "#2d8a74", watch: "#d18b18", fault: "#c34c38", offline: "#758294" };
const asPoint = (point: google.maps.LatLngLiteral): [number, number] => [point.lat, point.lng];

function markerIcon(asset: Transformer, selected: boolean) {
  const isMqttLive = asset.id === "AVD-TX-027";
  return L.divIcon({
    className: "leaflet-asset-icon",
    iconSize: [selected ? 37 : 31, selected ? 37 : 31],
    iconAnchor: [selected ? 18 : 15, selected ? 18 : 15],
    html: `<span class="leaflet-asset-dot ${asset.state} ${selected ? "selected" : ""} ${isMqttLive ? "mqtt-live-beacon" : ""}" style="--asset-colour:${isMqttLive ? "#10b981" : stateColours[asset.state]}"><b>${asset.id.replace(/.*-/, "")}</b>${isMqttLive ? '<i class="mqtt-pulse-ring"></i>' : ""}</span>`
  });
}

function FitScope({ zoneId, cityId }: { zoneId?: Zone["id"]; cityId?: string }) {
  const map = useMap();
  useEffect(() => {
    const scoped = zoneId ? [getZone(zoneId)] : cityZones(cityId ?? "chennai");
    const bounds = L.latLngBounds(scoped.flatMap((zone) => zone.boundary.map(asPoint)));
    map.fitBounds(bounds, { padding: [38, 38], maxZoom: zoneId ? 14 : 12 });
  }, [map, zoneId, cityId]);
  return null;
}

type Props = { cityId?: string; zoneId?: Zone["id"]; selectedId?: string; onSelect: (asset: Transformer) => void; className?: string };

export default function CityMap({ cityId = "chennai", zoneId, selectedId, onSelect, className }: Props) {
  const activeZones = useMemo(() => zoneId ? [getZone(zoneId)] : cityZones(cityId), [zoneId, cityId]);
  const visibleZoneIds = new Set(activeZones.map((zone) => zone.id)); const visibleTransformers = transformers.filter((asset) => visibleZoneIds.has(asset.zoneId));
  return <div className={`city-map live-leaflet-map ${className ?? ""}`}><MapContainer center={zoneId ? asPoint(getZone(zoneId).center) : asPoint(getCity(cityId).center)} zoom={getCity(cityId).zoom} scrollWheelZoom className="city-map-canvas" zoomControl><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><FitScope zoneId={zoneId} cityId={cityId} />{activeZones.map((zone) => <Polygon key={zone.id} positions={zone.boundary.map(asPoint)} pathOptions={{ color: "#1e5874", weight: 2, fillColor: "#5db4c3", fillOpacity: .13 }}><Tooltip sticky direction="center" className="zone-tooltip">{zone.name.toUpperCase()} ZONE</Tooltip></Polygon>)}{activeZones.map((zone) => <Circle key={`${zone.id}-coverage`} center={asPoint(zone.center)} radius={zone.cityId === "coimbatore" ? 2500 : zone.id === "avadi" ? 3200 : 3800} pathOptions={{ color: "#c49538", weight: 1, dashArray: "5 5", fillColor: "#dfb85d", fillOpacity: .05 }} />)}{visibleTransformers.map((asset) => <Marker key={asset.id} position={asPoint(asset.position)} icon={markerIcon(asset, selectedId === asset.id)} eventHandlers={{ click: () => onSelect(asset) }}><Tooltip direction="top" offset={[0, -16]} className="asset-tooltip"><strong>{asset.id}</strong><br />{asset.health}% health · {asset.coverage}</Tooltip></Marker>)}</MapContainer><div className="map-caption">OpenStreetMap base · calibrated zone, coverage and transformer overlays</div></div>;
}
