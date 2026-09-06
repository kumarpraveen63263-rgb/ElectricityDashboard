/**
 * Design philosophy: This page is a zone desk, not a simulator. It lets a control-room operator
 * pin Avadi or Ambattur, inspect coverage, and open transformer health without synthetic control widgets.
 */
import { useState } from "react";
import { Activity, BellRing, Cable, ChevronRight, CircleAlert, Cloud, MapPinned, RadioTower, ShieldCheck, ThermometerSun, Zap } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import ZoneMap from "@/components/ZoneMap";
import { getZone, zones, type TransformerAsset } from "@/data/zoneData";

function statIcon(label: string) {
  if (label === "Load") return <Activity size={15} />;
  if (label === "Temperature") return <ThermometerSun size={15} />;
  if (label === "Voltage") return <Zap size={15} />;
  return <Cable size={15} />;
}

export default function ZoneMonitor() {
  const [zoneId, setZoneId] = useState<"avadi" | "ambattur">("avadi");
  const zone = getZone(zoneId);
  const [selected, setSelected] = useState<TransformerAsset>(zone.transformers[1]);
  const changeZone = (id: "avadi" | "ambattur") => { const next = getZone(id); setZoneId(id); setSelected(next.transformers.find((asset) => asset.fault) ?? next.transformers[0]); };

  return <DashboardShell eyebrow="TNEB / ZONE DESK / LIVE COVERAGE" title="Zone Monitoring Atlas">
    <section className="atlas-intro"><div><span className="eyebrow">Two-zone transformer watch</span><h2>See coverage, telemetry and fault conditions where they occur.</h2></div><div className="atlas-live"><span className="live-orbit" /><div><strong>Live ingest active</strong><small>Last regional aggregation: 10:42:16 IST</small></div></div></section>
    <section className="zone-switcher" aria-label="Choose monitored zone">{zones.map((item) => <button key={item.id} onClick={() => changeZone(item.id)} className={item.id === zone.id ? "selected" : ""}><span className="zone-tab-code">{item.code}</span><strong>{item.name}</strong><small>{item.assets} transformers · {item.coverage}</small><i>{item.transformers.filter((asset) => asset.fault).length} notice{item.transformers.filter((asset) => asset.fault).length === 1 ? "" : "s"}</i></button>)}</section>
    <section className="atlas-workspace"><article className="atlas-map-card"><header><div><span className="eyebrow">{zone.code}</span><h2>{zone.name} coverage view</h2></div><div className="map-legend"><span><i className="healthy" /> Healthy</span><span><i className="watch" /> Watch</span><span><i className="fault" /> Fault</span></div></header><ZoneMap zone={zone} selectedId={selected.id} onSelect={setSelected} /><footer><span><MapPinned size={15} />{zone.coverage} monitored service area</span><span><RadioTower size={15} />{zone.availability} telemetry availability</span><span><ShieldCheck size={15} />{zone.healthy} assets within normal range</span></footer></article>
      <aside className="asset-inspector"><div className="inspector-head"><div><span className="eyebrow">Selected transformer</span><h2>{selected.id}</h2></div><span className={`asset-state ${selected.state}`}>{selected.state === "fault" ? "Fault" : selected.state === "watch" ? "Watch" : "Healthy"}</span></div><p className="asset-name">{selected.name}</p><div className="asset-health"><div className="health-ring"><strong>{selected.health}</strong><span>health</span></div><div><span className="eyebrow">Service coverage</span><strong>{selected.coverage}</strong><small>Last telemetry: {selected.updated} IST</small></div></div><div className="asset-readings">{[["Load", selected.load], ["Temperature", selected.temperature], ["Voltage", selected.voltage], ["Power factor", selected.pf]].map(([label, value]) => <div key={label}><span>{statIcon(label)}</span><small>{label}</small><strong>{value}</strong></div>)}</div>{selected.fault ? <div className={`asset-notice ${selected.fault.severity.toLowerCase()}`}><BellRing size={18} /><div><strong>{selected.fault.title}</strong><p>{selected.fault.detail}</p></div></div> : <div className="asset-clear"><ShieldCheck size={18} /><div><strong>No active fault at this asset</strong><p>Telemetry heartbeat received {selected.heartbeat} ago.</p></div></div>}<button className="inspector-action"><Cloud size={16} /> View full telemetry history <ChevronRight size={15} /></button></aside>
    </section>
    <section className="zone-register"><div className="register-intro"><span className="eyebrow">Transformer register</span><h2>{zone.name} live asset list</h2><p>Select an asset to centre the inspector on its current health and service coverage.</p></div><div className="asset-list">{zone.transformers.map((asset) => <button key={asset.id} onClick={() => setSelected(asset)} className={`asset-row ${asset.id === selected.id ? "active" : ""}`}><i className={asset.state} /><span><strong>{asset.id}</strong><small>{asset.name}</small></span><span><small>Coverage</small><b>{asset.coverage}</b></span><span><small>Health</small><b>{asset.health}%</b></span><ChevronRight size={16} /></button>)}</div></section>
    <section className="fault-strip"><CircleAlert size={20} /><div><span className="eyebrow">Notification protocol</span><p>Fault notices are raised when any transformer leaves its thermal, loading, electrical, or communication health band. The alert ledger keeps acknowledgement history.</p></div><a href="/alerts">Open fault notices <ChevronRight size={16} /></a></section>
  </DashboardShell>;
}
