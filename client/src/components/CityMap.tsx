import { useEffect, useMemo } from "react";
import { Circle, MapContainer, Marker, Polygon, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { cityZones, getCity, getZone, transformers, type Transformer, type Zone } from "@/data/controlRoomData";
import { useMqttTelemetry } from "@/hooks/useMqttTelemetry";

const stateColours = { healthy: "#2d8a74", watch: "#d18b18", fault: "#c34c38", offline: "#758294" };
const asPoint = (point: { lat: number; lng: number }): [number, number] => [point.lat, point.lng];

// Clean Transformer Marker Generator (Numbered dots matching original control room design)
function createTransformerIcon(asset: Transformer, selected: boolean) {
  const isMqttLive = asset.id === "AVD-TX-027";
  const stateColor = isMqttLive ? "#2d8a74" : stateColours[asset.state];

  return L.divIcon({
    className: "leaflet-asset-icon",
    iconSize: [selected ? 37 : 31, selected ? 37 : 31],
    iconAnchor: [selected ? 18 : 15, selected ? 18 : 15],
    html: `<span class="leaflet-asset-dot ${asset.state} ${selected ? "selected" : ""}" style="--asset-colour:${stateColor}"><b>${asset.id.replace(/.*-/, "")}</b></span>`,
  });
}

// Map Auto-Pan & Zoom-out Helper Component
function FitScope({ zoneId, cityId }: { zoneId?: Zone["id"]; cityId?: string }) {
  const map = useMap();

  useEffect(() => {
    const scoped = zoneId ? [getZone(zoneId)] : cityZones(cityId ?? "chennai");
    const bounds = L.latLngBounds(scoped.flatMap((zone) => zone.boundary.map(asPoint)));
    map.fitBounds(bounds, { padding: [45, 45], maxZoom: zoneId ? 13 : 11 });
  }, [map, zoneId, cityId]);

  return null;
}

type Props = {
  cityId?: string;
  zoneId?: Zone["id"];
  selectedId?: string;
  onSelect: (asset: Transformer) => void;
  className?: string;
};

export default function CityMap({ cityId = "chennai", zoneId, selectedId, onSelect, className }: Props) {
  const activeZones = useMemo(() => (zoneId ? [getZone(zoneId)] : cityZones(cityId)), [zoneId, cityId]);
  const visibleZoneIds = new Set(activeZones.map((zone) => zone.id));
  const visibleTransformers = transformers.filter((asset) => visibleZoneIds.has(asset.zoneId));

  const { payload: mqttPayload } = useMqttTelemetry();

  return (
    <div className={`city-map live-leaflet-map ${className ?? ""}`}>
      <MapContainer
        center={zoneId ? asPoint(getZone(zoneId).center) : asPoint(getCity(cityId).center)}
        zoom={getCity(cityId).zoom}
        scrollWheelZoom
        className="city-map-canvas"
        zoomControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitScope zoneId={zoneId} cityId={cityId} />

        {/* Operational Zone Polygons */}
        {activeZones.map((zone) => (
          <Polygon
            key={zone.id}
            positions={zone.boundary.map(asPoint)}
            pathOptions={{ color: "#1e5874", weight: 2, fillColor: "#5db4c3", fillOpacity: 0.12 }}
          >
            <Tooltip sticky direction="center" className="zone-tooltip">
              {zone.name.toUpperCase()} ZONE
            </Tooltip>
          </Polygon>
        ))}

        {/* Coverage Radius Circles */}
        {activeZones.map((zone) => (
          <Circle
            key={`${zone.id}-coverage`}
            center={asPoint(zone.center)}
            radius={zone.cityId === "coimbatore" ? 2500 : zone.id === "avadi" ? 3200 : 3800}
            pathOptions={{ color: "#c49538", weight: 1, dashArray: "5 5", fillColor: "#dfb85d", fillOpacity: 0.04 }}
          />
        ))}

        {/* Distribution Transformers Markers */}
        {visibleTransformers.map((asset) => {
          const isLiveMqtt = asset.id === "AVD-TX-027";
          const currentVoltage = isLiveMqtt ? `${mqttPayload.voltage} V` : asset.voltage;
          const currentLoad = isLiveMqtt ? `${mqttPayload.load}%` : asset.load;
          const currentTemp = isLiveMqtt ? `${mqttPayload.temperature}°C` : asset.temperature;
          const currentPf = isLiveMqtt ? `${mqttPayload.powerFactor}` : asset.powerFactor;
          const currentUpdate = isLiveMqtt ? mqttPayload.timestamp : asset.lastUpdate;

          return (
            <Marker
              key={asset.id}
              position={asPoint(asset.position)}
              icon={createTransformerIcon(asset, selectedId === asset.id)}
              eventHandlers={{ click: () => onSelect(asset) }}
            >
              <Tooltip direction="top" offset={[0, -18]} className="asset-tooltip">
                <strong className={isLiveMqtt ? "text-emerald-400 font-bold" : "text-slate-200"}>
                  {asset.id} {isLiveMqtt ? "🟢 (LIVE MQTT SENSOR)" : "⚪ (SIMULATED NODE)"}
                </strong>
                <br />
                {asset.name}
                <br />
                {asset.health}% health · {currentVoltage} · Load {currentLoad}
              </Tooltip>
              <Popup>
                <div className="tangedco-popup-card">
                  <div className="card-head">
                    <h4 className={isLiveMqtt ? "text-emerald-700 font-bold" : "text-slate-800 font-bold"}>{asset.id}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${isLiveMqtt ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-slate-100 text-slate-700 border border-slate-300"}`}>
                      {isLiveMqtt ? "🟢 LIVE HARDWARE MQTT" : "⚪ SIMULATED / UNCONNECTED"}
                    </span>
                  </div>
                  <strong className="text-xs text-slate-900 block mb-1 font-bold">{asset.name}</strong>
                  {isLiveMqtt ? (
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded block mb-2 font-mono border border-emerald-300 font-bold">
                      Supplying: S.A. Engineering College (SAEC) · ESP32 Live Stream
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded block mb-2 font-mono border border-slate-200 font-medium">
                      Simulated Grid Node · No Hardware Sensor Attached
                    </span>
                  )}
                  <div className="kpi-grid">
                    <div>
                      <label>Voltage</label>
                      <span className="font-mono text-xs font-bold text-sky-800">{currentVoltage}</span>
                    </div>
                    <div>
                      <label>Load %</label>
                      <span className="font-mono text-xs font-bold text-amber-800">{currentLoad}</span>
                    </div>
                    <div>
                      <label>Core Temp</label>
                      <span className="font-mono text-xs font-bold text-rose-800">{currentTemp}</span>
                    </div>
                    <div>
                      <label>Power Factor</label>
                      <span className="font-mono text-xs font-bold text-emerald-800">{currentPf}</span>
                    </div>
                    <div>
                      <label>Health Score</label>
                      <span className="font-mono text-xs font-bold text-emerald-700">{asset.health}%</span>
                    </div>
                    <div>
                      <label>Last Packet</label>
                      <span className="font-mono text-xs font-bold text-slate-700">{currentUpdate}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="map-caption">
        OpenStreetMap GIS base · TANGEDCO / TANTRANSCO Smart Grid Control Room Overlay
      </div>
    </div>
  );
}
