import { useMemo, useState } from "react";
import { Activity, ArrowUpRight, CircleAlert, Gauge, RadioTower, Signal, Thermometer, Zap } from "lucide-react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import MqttTelemetryConsole from "@/components/MqttTelemetryConsole";
import { getTransformer, getZone, transformers, zones } from "@/data/controlRoomData";
import { useMqttTelemetry } from "@/hooks/useMqttTelemetry";

export default function Transformers() {
  const [, setLocation] = useLocation();
  const initial = useMemo(() => new URLSearchParams(window.location.search).get("asset") ?? "AVD-TX-027", []);
  const [assetId, setAssetId] = useState(initial);

  const baseAsset = getTransformer(assetId);
  const zone = getZone(baseAsset.zoneId);
  const { payload: mqttData } = useMqttTelemetry();

  const isLiveMqtt = assetId === "AVD-TX-027";

  // Dynamic asset values merged with live MQTT payload for AVD-TX-027
  const asset = useMemo(() => {
    if (!isLiveMqtt) return baseAsset;
    return {
      ...baseAsset,
      voltage: `${mqttData.voltage} V`,
      load: `${mqttData.load}%`,
      temperature: `${mqttData.temperature}°C`,
      powerFactor: `${mqttData.powerFactor}`,
      heartbeat: `${mqttData.heartbeat} sec`,
      lastUpdate: mqttData.timestamp,
    };
  }, [baseAsset, isLiveMqtt, mqttData]);

  const changeAsset = (id: string) => {
    setAssetId(id);
    setLocation(`/transformers?asset=${id}`);
  };

  return (
    <DashboardLayout eyebrow="CHENNAI CITY / TRANSFORMER DESK" title="Transformer Monitoring">
      <section className="page-intro concise">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="section-label">Individual transformer insight</span>
            <h2>Read health, telemetry, diagnostics and work context in one record.</h2>
          </div>
          {isLiveMqtt && (
            <div className="flex items-center space-x-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs px-3 py-1.5 rounded-lg font-mono">
              <span className="animate-ping h-2 w-2 rounded-full bg-emerald-400 opacity-75 inline-block" />
              <Signal size={15} />
              <span>LIVE HARDWARE MQTT CONNECTED</span>
            </div>
          )}
        </div>
      </section>

      <section className="transformer-filters">
        <label>
          Zone
          <select
            value={asset.zoneId}
            onChange={(event) => changeAsset(transformers.find((item) => item.zoneId === event.target.value)?.id ?? assetId)}
          >
            {zones.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Transformer
          <select value={assetId} onChange={(event) => changeAsset(event.target.value)}>
            {transformers
              .filter((item) => item.zoneId === asset.zoneId)
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} · {item.name} {item.id === "AVD-TX-027" ? "🟢 (LIVE MQTT)" : ""}
                </option>
              ))}
          </select>
        </label>
      </section>

      {/* Hero Asset Overview */}
      <section className="transformer-hero">
        <article className="asset-profile">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="section-label">{zone.name} · {asset.zoneId === "avadi" ? "Northwest" : "Central"} zone</span>
              {isLiveMqtt && (
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/40">
                  LIVE MQTT HARDWARE
                </span>
              )}
            </div>
            <h2>{asset.id}</h2>
            <p>{asset.name}</p>
          </div>
          <div className={`large-health ${asset.state}`}>
            <strong>{asset.health}%</strong>
            <span>health</span>
          </div>
          <div className="asset-meta">
            <span>{asset.coverage}</span>
            <span>Last update {asset.lastUpdate}</span>
            <span>Heartbeat {asset.heartbeat}</span>
          </div>
        </article>

        <article className="diagnostic-panel">
          <span className="section-label">Region-based diagnosis</span>
          <div className="diagnostic-grid">
            <div>
              <Thermometer size={18} />
              <span>Thermal</span>
              <strong>{asset.temperature}</strong>
              <small>{asset.state === "watch" ? "Elevated" : "Normal"}</small>
            </div>
            <div>
              <Activity size={18} />
              <span>Loading</span>
              <strong>{asset.load}</strong>
              <small>{parseFloat(asset.load) > 80 ? "Review" : "Stable"}</small>
            </div>
            <div>
              <Zap size={18} />
              <span>Electrical</span>
              <strong>{asset.voltage}</strong>
              <small>PF {asset.powerFactor}</small>
            </div>
            <div>
              <RadioTower size={18} />
              <span>Communication</span>
              <strong>{asset.heartbeat}</strong>
              <small className={isLiveMqtt ? "text-emerald-400 font-bold" : ""}>
                {isLiveMqtt ? "Live Hardware" : "Connected"}
              </small>
            </div>
          </div>
        </article>
      </section>

      {/* Show Live Hardware MQTT Console when AVD-TX-027 is active */}
      {isLiveMqtt && (
        <section className="my-6">
          <MqttTelemetryConsole />
        </section>
      )}

      <section className="transformer-lower">
        <article className="section-card readings-card">
          <header>
            <div>
              <span className="section-label">Current measurements</span>
              <h3>Telemetry snapshot</h3>
            </div>
            <Gauge size={19} />
          </header>
          <div className="reading-bars">
            {[
              ["Voltage", asset.voltage, (parseFloat(asset.voltage) / 450) * 100],
              ["Load", asset.load, parseFloat(asset.load)],
              ["Temperature", asset.temperature, Math.min(100, parseFloat(asset.temperature))],
              ["Power factor", asset.powerFactor, parseFloat(asset.powerFactor) * 100],
            ].map(([label, value, width]) => (
              <div key={String(label)}>
                <span>
                  <small>{label}</small>
                  <strong>{value}</strong>
                </span>
                <i>
                  <b style={{ width: `${Math.min(100, Math.max(10, Number(width)))}%` }} />
                </i>
              </div>
            ))}
          </div>
        </article>

        <article className="section-card incident-card">
          <span className="section-label">Incident context</span>
          {asset.issue ? (
            <>
              <div className="incident-warning">
                <CircleAlert size={19} />
                <div>
                  <strong>{asset.issue}</strong>
                  <p>Review zone conditions and create or update a field ticket before the next escalation window.</p>
                </div>
              </div>
              <button className="primary-action compact">
                Create work ticket <ArrowUpRight size={16} />
              </button>
            </>
          ) : (
            <div className="clear-state">
              <span>✓</span>
              <div>
                <strong>No active diagnosis exception</strong>
                <p>All four regions remain inside their current operating bands.</p>
              </div>
            </div>
          )}
        </article>
      </section>
    </DashboardLayout>
  );
}
