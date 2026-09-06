/**
 * Design philosophy: Keep faults spatial. The four stable regions give operators
 * a repeatable visual model of how thermal, loading, electrical and telemetry signals combine.
 */
import { Activity, CloudCog, Gauge, ThermometerSun } from "lucide-react";
import { TransformerCoreLogo } from "@/components/Logos";

const transformerCore = "/transformer-core.png";

export type RegionTone = "jade" | "amber" | "cyan" | "coral" | "slate";

export type RegionData = {
  id: "thermal" | "loading" | "electrical" | "communication";
  label: string;
  reading: string;
  state: string;
  detail: string;
  tone: RegionTone;
};

const icons = {
  thermal: ThermometerSun,
  loading: Gauge,
  electrical: Activity,
  communication: CloudCog,
};

export default function FaultCompass({
  regions,
  healthScore,
  status,
  compact = false,
}: {
  regions: RegionData[];
  healthScore: number;
  status: string;
  compact?: boolean;
}) {
  return (
    <div className={`fault-compass ${compact ? "compact" : ""}`}>
      <div className="compass-meta">
        <div>
          <span className="eyebrow">Region-based diagnosis</span>
          <h2>Transformer health compass</h2>
        </div>
        <div className={`health-badge ${healthScore < 50 ? "critical" : healthScore < 80 ? "watch" : ""}`}>
          <span>Health</span><strong>{healthScore}%</strong><small>{status}</small>
        </div>
      </div>
      <div className="compass-layout">
        {regions.map((region) => {
          const Icon = icons[region.id];
          return (
            <div className={`region-card ${region.id} tone-${region.tone}`} key={region.id}>
              <div className="region-head"><span className="region-icon"><Icon size={17} /></span><span>{region.label}</span></div>
              <strong>{region.reading}</strong>
              <small>{region.detail}</small>
              <span className="region-state">{region.state}</span>
            </div>
          );
        })}
        <div className="transformer-orb" aria-label="Transformer diagnostic core">
          <div className="orb-rings" />
          <TransformerCoreLogo src={transformerCore} />
          <span className="orb-label">TX · NC-33 / 07</span>
        </div>
      </div>
      <div className="compass-foot"><span><i className="legend-dot jade" /> Normal</span><span><i className="legend-dot amber" /> Watch</span><span><i className="legend-dot coral" /> Critical</span><span>Last diagnostic sweep: 10:42:16 IST</span></div>
    </div>
  );
}
