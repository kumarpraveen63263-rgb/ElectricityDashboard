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
          <div class="gis-permanent-label-badge">
            <div class="title">
              <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#00FF66;box-shadow:0 0 6px #00FF66"></span>
              AVD-TX-027
            </div>
            <div class="sub">S.A. Engineering College</div>
            <div class="mqtt-tag">🟢 LIVE MQTT SIGNAL</div>
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

// 2. Substation Marker Generator (Purple Electrical Grid Tower)
function createSubstationIcon() {
  return L.divIcon({
    className: "gis-marker-wrapper",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    html: `
      <div class="gis-substation-node">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v20M17 5H7M19 12H5M16 19H8"/>
        </svg>
      </div>
    `,
  });
}

// 3. EB Office Marker Generator (Orange Government Building)
function createEbOfficeIcon() {
  return L.divIcon({
    className: "gis-marker-wrapper",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    html: `
      <div class="gis-eboffice-node">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
          <path d="M9 22v-4h6v4M8 6h2M14 6h2M8 11h2M14 11h2M8 16h2M14 16h2"/>
        </svg>
      </div>
    `,
  });
}

// 4. S.A. Engineering College Marker Generator (Blue Graduation Cap)
function createCollegeIcon() {
  return L.divIcon({
    className: "gis-marker-wrapper",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    html: `
      <div class="gis-college-node">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a> | TANGEDCO Smart Grid Control Room'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <FitScope zoneId={zoneId} cityId={cityId} selectedId={selectedId} />

        {/* Operational Zone Polygons (Government SCADA Boundaries) */}
        {activeZones.map((zone) => (
          <Polygon
            key={zone.id}
            positions={zone.boundary.map(asPoint)}
            pathOptions={{ color: "#00E5FF", weight: 1.5, dashArray: "6 4", fillColor: "#00E5FF", fillOpacity: 0.06 }}
          >
            <Tooltip sticky direction="center" className="zone-tooltip">
              {zone.name.toUpperCase()} ZONE CONTROL BOUNDARY
            </Tooltip>
          </Polygon>
        ))}

        {/* Coverage Radius Circles */}
        {activeZones.map((zone) => (
          <Circle
            key={`${zone.id}-coverage`}
            center={asPoint(zone.center)}
            radius={zone.cityId === "coimbatore" ? 2500 : zone.id === "avadi" ? 3200 : 3800}
            pathOptions={{ color: "#D7A445", weight: 1, dashArray: "5 5", fillColor: "#D7A445", fillOpacity: 0.02 }}
          />
        ))}

        {/* Radar Sweep Circle Overlay centered at AVD-TX-027 */}
        <Circle
          center={[13.0620, 80.0975]}
          radius={500}
          pathOptions={{ color: "#00FF66", weight: 1.5, dashArray: "3 3", fillColor: "#00FF66", fillOpacity: 0.04 }}
        />

        {/* Animated Power-Flow Feeder Lines */}
        {feederLines.map((feeder) => (
          <Polyline
            key={feeder.id}
            positions={feeder.path}
            pathOptions={{
              color: feeder.color,
              weight: feeder.status === "live_mqtt" ? 4 : 3,
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
                    <h4 className="text-purple-400">{ss.id}</h4>
                    <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded font-mono">
                      SUBSTATION
                    </span>
                  </div>
                  <strong className="text-xs text-white block mb-2">{ss.name}</strong>
                  <div className="kpi-grid">
                    <div>
                      <label>Voltage Level</label>
                      <span className="font-mono text-xs font-bold text-slate-200">{ss.voltage}</span>
                    </div>
                    <div>
                      <label>Health Status</label>
                      <span className="font-mono text-xs font-bold text-emerald-400">{ss.health}</span>
                    </div>
                    <div>
                      <label>Connected Feeders</label>
                      <span className="font-mono text-xs font-bold text-slate-200">{ss.connectedFeeders} Feeders</span>
                    </div>
                    <div>
                      <label>Transformers</label>
                      <span className="font-mono text-xs font-bold text-slate-200">{ss.connectedTransformers} Units</span>
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
                    <h4 className="text-orange-400">{office.code}</h4>
                    <span className="text-[10px] bg-orange-950 text-orange-300 border border-orange-500/40 px-2 py-0.5 rounded font-mono">
                      EB O&M OFFICE
                    </span>
                  </div>
                  <strong className="text-xs text-white block mb-2">{office.name}</strong>
                  <div className="kpi-grid">
                    <div>
                      <label>Status</label>
                      <span className="font-mono text-xs font-bold text-emerald-400">{office.status}</span>
                    </div>
                    <div>
                      <label>Assigned Engineers</label>
                      <span className="font-mono text-xs font-bold text-slate-200">{office.engineers} Staff</span>
                    </div>
                    <div>
                      <label>Open Tickets</label>
                      <span className={`font-mono text-xs font-bold ${office.openTickets ? "text-amber-400" : "text-slate-300"}`}>
                        {office.openTickets} Active
                      </span>
                    </div>
                    <div>
                      <label>Division</label>
                      <span className="font-mono text-xs font-bold text-slate-200">{office.zoneId.toUpperCase()}</span>
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
                  <h4 className="text-sky-400">{collegeAsset.id}</h4>
                  <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-500/40 px-2 py-0.5 rounded font-mono">
                    EDUCATIONAL CAMPUS
                  </span>
                </div>
                <strong className="text-xs text-white block mb-1">{collegeAsset.name}</strong>
                <p className="text-[10px] text-slate-400 mb-2">{collegeAsset.category}</p>
                <div className="kpi-grid">
                  <div>
                    <label>Fed By Transformer</label>
                    <span className="font-mono text-xs font-bold text-emerald-400">AVD-TX-027</span>
                  </div>
                  <div>
                    <label>Peak Demand</label>
                    <span className="font-mono text-xs font-bold text-slate-200">{collegeAsset.demandKva}</span>
                  </div>
                  <div>
                    <label>Supply Status</label>
                    <span className="font-mono text-xs font-bold text-emerald-400">🟢 LIVE MQTT</span>
                  </div>
                  <div>
                    <label>Feeder Type</label>
                    <span className="font-mono text-xs font-bold text-slate-200">Dedicated 11kV</span>
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
                <strong className={isLiveMqtt ? "text-emerald-400 font-bold" : ""}>
                  {asset.id} {isLiveMqtt ? "🟢 (LIVE MQTT SENSOR)" : ""}
                </strong>
                <br />
                {asset.name}
                <br />
                {asset.health}% health · {currentVoltage} · Load {currentLoad}
              </Tooltip>
              <Popup>
                <div className="tangedco-popup-card">
                  <div className="card-head">
                    <h4 className={isLiveMqtt ? "text-[#00FF66]" : "text-amber-400"}>{asset.id}</h4>
                    <span className="text-[10px] bg-slate-900 text-slate-200 border border-slate-700 px-2 py-0.5 rounded font-mono">
                      {isLiveMqtt ? "🟢 LIVE HARDWARE MQTT" : asset.state.toUpperCase()}
                    </span>
                  </div>
                  <strong className="text-xs text-white block mb-1">{asset.name}</strong>
                  {isLiveMqtt && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded block mb-2 font-mono border border-emerald-500/30">
                      Supplying: S.A. Engineering College (SAEC)
                    </span>
                  )}
                  <div className="kpi-grid">
                    <div>
                      <label>Voltage</label>
                      <span className="font-mono text-xs font-bold text-sky-300">{currentVoltage}</span>
                    </div>
                    <div>
                      <label>Load %</label>
                      <span className="font-mono text-xs font-bold text-amber-300">{currentLoad}</span>
                    </div>
                    <div>
                      <label>Core Temp</label>
                      <span className="font-mono text-xs font-bold text-rose-300">{currentTemp}</span>
                    </div>
                    <div>
                      <label>Power Factor</label>
                      <span className="font-mono text-xs font-bold text-emerald-300">{currentPf}</span>
                    </div>
                    <div>
                      <label>Health Score</label>
                      <span className="font-mono text-xs font-bold text-emerald-400">{asset.health}%</span>
                    </div>
                    <div>
                      <label>Last Packet</label>
                      <span className="font-mono text-xs font-bold text-slate-300">{currentUpdate}</span>
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
          <span className="text-[9px] text-emerald-400 font-mono bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.5 rounded">LIVE 11kV</span>
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
              <span className="text-[9px] text-emerald-400 font-mono">LIVE 11kV</span>
            </div>
            <span className="text-slate-400 hover:text-white transition-colors">
              <ChevronUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="legend-grid">
            <div className="legend-item">
              <div className="icon-box bg-[#00FF66] text-slate-950 font-bold">027</div>
              <span>Selected Tx (AVD-TX-027 Neon)</span>
            </div>
            <div className="legend-item">
              <div className="icon-box bg-[#2d8a74] text-white">●</div>
              <span>Healthy Transformer</span>
            </div>
            <div className="legend-item">
              <div className="icon-box bg-[#d18b18] text-white">●</div>
              <span>Watch / High Load</span>
            </div>
            <div className="legend-item">
              <div className="icon-box bg-[#c34c38] text-white">▲</div>
              <span>Fault Exception</span>
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
              <span>Educational Inst. (SAEC)</span>
            </div>
            <div className="legend-item">
              <div className="w-4 h-1 bg-[#00FF66] shadow-[0_0_6px_#00FF66]"></div>
              <span>Animated 11kV Feeder Line</span>
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
