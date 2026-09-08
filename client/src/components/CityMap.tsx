import { useEffect, useMemo, useState } from "react";
import { Circle, MapContainer, Marker, Polyline, Polygon, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { ChevronDown, ChevronUp, Layers } from "lucide-react";
import { cityZones, getCity, getZone, transformers, type Transformer, type Zone } from "@/data/controlRoomData";
import { collegeAsset, ebOffices, feederLines, substations } from "@/data/tangedcoGisData";
import { useMqttTelemetry } from "@/hooks/useMqttTelemetry";

const stateColours = { healthy: "#2d8a74", watch: "#d18b18", fault: "#c34c38", offline: "#758294" };
const asPoint = (point: { lat: number; lng: number }): [number, number] => [point.lat, point.lng];

// 1. Transformer Marker Generator (Special Neon-Green Pulse for AVD-TX-027)
function createTransformerIcon(asset: Transformer, selected: boolean) {
  const isMqttLive = asset.id === "AVD-TX-027";

  if (isMqttLive) {
    return L.divIcon({
      className: "gis-marker-wrapper",
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      html: `
        <div class="gis-tx-027-container">
          <div class="gis-mqtt-ripple"></div>
          <div class="gis-pulse-halo"></div>
          <div class="gis-neon-core ${selected ? "ring-4 ring-white" : ""}">
            027
          </div>
        </div>
      `,
    });
  }

  return L.divIcon({
    className: "leaflet-asset-icon",
    iconSize: [selected ? 37 : 31, selected ? 37 : 31],
    iconAnchor: [selected ? 18 : 15, selected ? 18 : 15],
    html: `<span class="leaflet-asset-dot ${asset.state} ${selected ? "selected" : ""}" style="--asset-colour:${stateColours[asset.state]}"><b>${asset.id.replace(/.*-/, "")}</b></span>`,
  });
}

// 2. Substation Marker Generator (Purple Electrical Grid Power Facility Building)
function createSubstationIcon() {
  return L.divIcon({
    className: "gis-marker-wrapper",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    html: `
      <div class="gis-substation-node" title="110/33kV Substation">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 20h20" stroke="#c084fc" stroke-width="2"/>
          <rect x="4" y="11" width="16" height="9" rx="1" fill="rgba(168, 85, 247, 0.18)" stroke="#a855f7"/>
          <path d="M12 2v9M8 5h8M9 8h6" stroke="#c084fc"/>
          <path d="M7 15h3M14 15h3" stroke="#a855f7"/>
          <circle cx="8.5" cy="15" r="1" fill="#c084fc"/>
          <circle cx="15.5" cy="15" r="1" fill="#c084fc"/>
        </svg>
        <span class="node-tag ss-tag">SS</span>
      </div>
    `,
  });
}

// 3. EB Office Marker Generator (Orange TANGEDCO Government Office Building)
function createEbOfficeIcon() {
  return L.divIcon({
    className: "gis-marker-wrapper",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    html: `
      <div class="gis-eboffice-node" title="TANGEDCO EB O&M Office">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 21h18" stroke="#fb923c" stroke-width="2"/>
          <path d="M5 21V7l7-4 7 4v14" fill="rgba(251, 146, 60, 0.15)" stroke="#fb923c"/>
          <rect x="7" y="9" width="2.5" height="2.5" rx="0.5" fill="#fb923c" stroke="none"/>
          <rect x="14.5" y="9" width="2.5" height="2.5" rx="0.5" fill="#fb923c" stroke="none"/>
          <rect x="7" y="13" width="2.5" height="2.5" rx="0.5" fill="#fb923c" stroke="none"/>
          <rect x="14.5" y="13" width="2.5" height="2.5" rx="0.5" fill="#fb923c" stroke="none"/>
          <rect x="10.5" y="16" width="3" height="5" rx="0.5" fill="#f97316" stroke="none"/>
        </svg>
        <span class="node-tag eb-tag">EB</span>
      </div>
    `,
  });
}

// 4. S.A. Engineering College Marker Generator (Blue Academic Building)
function createCollegeIcon() {
  return L.divIcon({
    className: "gis-marker-wrapper",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    html: `
      <div class="gis-college-node" title="S.A. Engineering College Campus">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="#60a5fa"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="#3b82f6" fill="rgba(59, 130, 246, 0.2)"/>
        </svg>
        <span class="node-tag edu-tag">SAEC</span>
      </div>
    `,
  });
}

// Map Auto-Pan and Fit Bounds Helper Component
function FitScope({ zoneId, cityId, selectedId }: { zoneId?: Zone["id"]; cityId?: string; selectedId?: string }) {
  const map = useMap();

  useEffect(() => {
    if (selectedId) {
      const asset = transformers.find((t) => t.id === selectedId);
      if (asset) {
        map.flyTo([asset.position.lat, asset.position.lng], 15, { animate: true, duration: 1.2 });
        return;
      }
    }

    const scoped = zoneId ? [getZone(zoneId)] : cityZones(cityId ?? "chennai");
    const bounds = L.latLngBounds(scoped.flatMap((zone) => zone.boundary.map(asPoint)));
    map.fitBounds(bounds, { padding: [38, 38], maxZoom: zoneId ? 14 : 12 });
  }, [map, zoneId, cityId, selectedId]);

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
  const [isLegendOpen, setIsLegendOpen] = useState(false);
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | TANGEDCO Smart Grid'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitScope zoneId={zoneId} cityId={cityId} selectedId={selectedId} />

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

        {/* Feeder Lines (excluding green feeder lines per requirement) */}
        {feederLines
          .filter((feeder) => feeder.color !== "#00FF66" && feeder.status !== "live_mqtt")
          .map((feeder) => (
            <Polyline
              key={feeder.id}
              positions={feeder.path}
              pathOptions={{
                color: feeder.color,
                weight: 3,
                className: `gis-feeder-line ${feeder.status}`,
              }}
            >
              <Tooltip sticky direction="top" className="asset-tooltip">
                <strong>{feeder.name}</strong>
                <br />
                Status: {feeder.status.toUpperCase()}
              </Tooltip>
            </Polyline>
          ))}

        {/* TANTRANSCO / TANGEDCO Substations (Purple Markers) */}
        {substations
          .filter((ss) => visibleZoneIds.has(ss.zoneId))
          .map((ss) => (
            <Marker key={ss.id} position={asPoint(ss.position)} icon={createSubstationIcon()}>
              <Tooltip direction="top" offset={[0, -18]} className="asset-tooltip">
                <strong className="text-purple-300">{ss.name}</strong>
                <br />
                {ss.voltage} · {ss.health}
              </Tooltip>
              <Popup>
                <div className="tangedco-popup-card">
                  <div className="card-head">
                    <h4 className="text-purple-700 font-bold">{ss.id}</h4>
                    <span className="text-[10px] bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded font-mono font-bold">
                      SUBSTATION
                    </span>
                  </div>
                  <strong className="text-xs text-slate-900 block mb-2 font-bold">{ss.name}</strong>
                  <div className="kpi-grid">
                    <div>
                      <label>Voltage Level</label>
                      <span className="font-mono text-xs font-bold text-slate-800">{ss.voltage}</span>
                    </div>
                    <div>
                      <label>Health Status</label>
                      <span className="font-mono text-xs font-bold text-emerald-700">{ss.health}</span>
                    </div>
                    <div>
                      <label>Connected Feeders</label>
                      <span className="font-mono text-xs font-bold text-slate-800">{ss.connectedFeeders} Feeders</span>
                    </div>
                    <div>
                      <label>Transformers</label>
                      <span className="font-mono text-xs font-bold text-slate-800">{ss.connectedTransformers} Units</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* TANGEDCO O&M EB Offices (Orange Markers) */}
        {ebOffices
          .filter((office) => visibleZoneIds.has(office.zoneId))
          .map((office) => (
            <Marker key={office.id} position={asPoint(office.position)} icon={createEbOfficeIcon()}>
              <Tooltip direction="top" offset={[0, -16]} className="asset-tooltip">
                <strong className="text-orange-300">{office.name}</strong>
                <br />
                Status: {office.status} · {office.engineers} Engineers
              </Tooltip>
              <Popup>
                <div className="tangedco-popup-card">
                  <div className="card-head">
                    <h4 className="text-orange-700 font-bold">{office.code}</h4>
                    <span className="text-[10px] bg-orange-100 text-orange-800 border border-orange-300 px-2 py-0.5 rounded font-mono font-bold">
                      EB O&M OFFICE
                    </span>
                  </div>
                  <strong className="text-xs text-slate-900 block mb-2 font-bold">{office.name}</strong>
                  <div className="kpi-grid">
                    <div>
                      <label>Status</label>
                      <span className="font-mono text-xs font-bold text-emerald-700">{office.status}</span>
                    </div>
                    <div>
                      <label>Assigned Engineers</label>
                      <span className="font-mono text-xs font-bold text-slate-800">{office.engineers} Staff</span>
                    </div>
                    <div>
                      <label>Open Tickets</label>
                      <span className={`font-mono text-xs font-bold ${office.openTickets ? "text-amber-700" : "text-slate-800"}`}>
                        {office.openTickets} Active
                      </span>
                    </div>
                    <div>
                      <label>Division</label>
                      <span className="font-mono text-xs font-bold text-slate-800">{office.zoneId.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* S.A. Engineering College (Educational Institution - Blue Marker) */}
        {visibleZoneIds.has(collegeAsset.zoneId) && (
          <Marker position={asPoint(collegeAsset.position)} icon={createCollegeIcon()}>
            <Tooltip direction="top" offset={[0, -18]} className="asset-tooltip">
              <strong className="text-sky-300">{collegeAsset.name}</strong>
              <br />
              Connected Transformer: {collegeAsset.connectedTx}
            </Tooltip>
            <Popup>
              <div className="tangedco-popup-card">
                <div className="card-head">
                  <h4 className="text-sky-700 font-bold">{collegeAsset.id}</h4>
                  <span className="text-[10px] bg-sky-100 text-sky-800 border border-sky-300 px-2 py-0.5 rounded font-mono font-bold">
                    EDUCATIONAL CAMPUS
                  </span>
                </div>
                <strong className="text-xs text-slate-900 block mb-1 font-bold">{collegeAsset.name}</strong>
                <p className="text-[10px] text-slate-600 mb-2 font-medium">{collegeAsset.category}</p>
                <div className="kpi-grid">
                  <div>
                    <label>Fed By Transformer</label>
                    <span className="font-mono text-xs font-bold text-emerald-700">AVD-TX-027</span>
                  </div>
                  <div>
                    <label>Peak Demand</label>
                    <span className="font-mono text-xs font-bold text-slate-800">{collegeAsset.demandKva}</span>
                  </div>
                  <div>
                    <label>Supply Status</label>
                    <span className="font-mono text-xs font-bold text-emerald-700">🟢 LIVE MQTT</span>
                  </div>
                  <div>
                    <label>Feeder Type</label>
                    <span className="font-mono text-xs font-bold text-slate-800">Dedicated 11kV</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Distribution Transformers Markers (AVD-TX-027 Focal Point) */}
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
              <Tooltip direction="top" offset={[0, -20]} className="asset-tooltip">
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

      {/* Clickable Floating Control Room Legend Overlay */}
      {!isLegendOpen ? (
        <button
          type="button"
          onClick={() => setIsLegendOpen(true)}
          className="tangedco-gis-legend-toggle"
          title="Click to view TANGEDCO GIS Legend"
        >
          <Layers className="w-3.5 h-3.5 text-[#d7a445]" />
          <span className="font-mono text-xs font-bold text-[#d7a445] tracking-wider uppercase">GIS LEGEND</span>
          <span className="text-[9px] text-emerald-400 font-mono bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.5 rounded">1 LIVE / SIMULATED</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
        </button>
      ) : (
        <div className="tangedco-gis-legend">
          <div
            className="legend-header cursor-pointer select-none flex items-center justify-between"
            onClick={() => setIsLegendOpen(false)}
            title="Click to collapse Legend"
          >
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#d7a445]" />
              <span>TANGEDCO GIS LEGEND</span>
              <span className="text-[9px] text-emerald-400 font-mono">1 LIVE MQTT</span>
            </div>
            <span className="text-slate-400 hover:text-white transition-colors">
              <ChevronUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="legend-grid">
            <div className="legend-item">
              <div className="icon-box bg-[#00FF66] text-slate-950 font-bold">027</div>
              <span>Live Hardware MQTT Node (AVD-TX-027)</span>
            </div>
            <div className="legend-item">
              <div className="icon-box bg-[#2d8a74] text-white">●</div>
              <span>Simulated Transformer (Healthy)</span>
            </div>
            <div className="legend-item">
              <div className="icon-box bg-[#d18b18] text-white">●</div>
              <span>Simulated Transformer (Watch)</span>
            </div>
            <div className="legend-item">
              <div className="icon-box bg-[#c34c38] text-white">▲</div>
              <span>Simulated Transformer (Fault)</span>
            </div>
            <div className="legend-item">
              <div className="icon-box bg-[#0f172a] text-[#c084fc] border border-purple-500">⚡</div>
              <span>Substation (110/33kV Grid)</span>
            </div>
            <div className="legend-item">
              <div className="icon-box bg-[#0f172a] text-[#fb923c] border border-orange-500">🏢</div>
              <span>EB O&M Office (TANGEDCO)</span>
            </div>
            <div className="legend-item">
              <div className="icon-box bg-[#0f172a] text-[#60a5fa] border border-blue-500">🎓</div>
              <span>Educational Inst. (SAEC Campus)</span>
            </div>
          </div>
        </div>
      )}

      <div className="map-caption">
        OpenStreetMap GIS base · TANGEDCO / TANTRANSCO Smart Grid Control Room Overlay
      </div>
    </div>
  );
}
