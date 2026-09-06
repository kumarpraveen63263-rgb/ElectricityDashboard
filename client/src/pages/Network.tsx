/**
 * Design philosophy: Regional context remains visual and auditable, using a restrained network map
 * plus a concise active-feeder register rather than pretending to be a live GIS product.
 */
import { useState } from "react";
import { CircleCheck, MapPinned, RadioTower, SignalHigh } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import ZoneMap from "@/components/ZoneMap";
import { getZone, zones, type TransformerAsset } from "@/data/zoneData";

export default function Network() {
  const [zoneId, setZoneId] = useState<"avadi" | "ambattur">("ambattur");
  const zone = getZone(zoneId);
  const [selected, setSelected] = useState<TransformerAsset>(zone.transformers[0]);
  const selectZone = (id: "avadi" | "ambattur") => { const next = getZone(id); setZoneId(id); setSelected(next.transformers[0]); };
  return <DashboardShell eyebrow="TNEB / SOUTH ZONE / COVERAGE REGISTER" title="Coverage & Asset Register">
    <section className="coverage-title"><div><span className="eyebrow">Service footprint</span><h2>Understand health in the context of transformer coverage.</h2></div><p>Coverage is a zone-level operating view: location, reporting continuity and the customer area attached to each transformer.</p></section>
    <section className="coverage-layout"><article className="coverage-map-shell"><div className="coverage-tabs">{zones.map((item) => <button key={item.id} className={item.id === zone.id ? "active" : ""} onClick={() => selectZone(item.id)}><span>{item.name}</span><small>{item.coverage} · {item.assets} assets</small></button>)}</div><ZoneMap zone={zone} selectedId={selected.id} onSelect={setSelected} /></article><aside className="coverage-meter"><span className="eyebrow">Zone status</span><h2>{zone.name}</h2><div className="coverage-circle"><strong>{zone.availability}</strong><span>telemetry available</span></div><dl><div><dt><RadioTower size={15} /> Assets</dt><dd>{zone.assets}</dd></div><div><dt><SignalHigh size={15} /> Healthy</dt><dd>{zone.healthy}</dd></div><div><dt><MapPinned size={15} /> Coverage</dt><dd>{zone.coverage}</dd></div></dl><p>{zone.note}</p></aside></section>
    <section className="coverage-table"><header><div><span className="eyebrow">Asset coverage register</span><h2>{zone.name} transformers</h2></div><button className="subtle-button"><CircleCheck size={15} /> Export service summary</button></header>{zone.transformers.map((asset) => <button className={selected.id === asset.id ? "selected" : ""} key={asset.id} onClick={() => setSelected(asset)}><i className={asset.state} /><span><strong>{asset.id}</strong><small>{asset.name}</small></span><span><small>Health</small><b>{asset.health}%</b></span><span><small>Coverage</small><b>{asset.coverage}</b></span><span><small>Last update</small><b>{asset.updated} IST</b></span></button>)}</section>
  </DashboardShell>;
}
