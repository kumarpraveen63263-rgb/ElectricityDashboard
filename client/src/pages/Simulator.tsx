/**
 * Design philosophy: A transparent training simulator. Each control changes a named region,
 * recalculates the combined diagnosis, and explains the recommended protective action.
 */
import { useMemo, useState } from "react";
import {
  Activity,
  BatteryCharging,
  CheckCircle2,
  CircleAlert,
  CloudOff,
  CloudSun,
  Gauge,
  Info,
  Play,
  RotateCcw,
  ShieldCheck,
  ThermometerSun,
  TriangleAlert,
  Zap,
} from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import FaultCompass, { type RegionData, type RegionTone } from "@/components/FaultCompass";

type DiagnosticState = "Normal" | "Watch" | "Warning" | "Critical";

const baseline = { load: 63, temp: 0, voltage: 415, pf: 0.93, connected: true };

function toneFromState(state: DiagnosticState): RegionTone {
  if (state === "Critical") return "coral";
  if (state === "Watch" || state === "Warning") return "amber";
  return "jade";
}

function severity(state: DiagnosticState) {
  return { Normal: 0, Watch: 1, Warning: 2, Critical: 3 }[state];
}

function SliderControl({ label, value, unit, min, max, step, onChange, icon: Icon, tone }: { label: string; value: number; unit: string; min: number; max: number; step: number; onChange: (value: number) => void; icon: typeof Gauge; tone: string }) {
  return <label className={`sim-control ${tone}`}><div className="sim-control-head"><span><Icon size={16} />{label}</span><output>{value}{unit}</output></div><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /><div className="range-labels"><span>{min}{unit}</span><span>{max}{unit}</span></div></label>;
}

export default function Simulator() {
  const [load, setLoad] = useState(baseline.load);
  const [temp, setTemp] = useState(baseline.temp);
  const [voltage, setVoltage] = useState(baseline.voltage);
  const [pf, setPf] = useState(baseline.pf);
  const [connected, setConnected] = useState(baseline.connected);
  const [notice, setNotice] = useState("Baseline conditions loaded. Adjust a condition or inject a training scenario.");

  const diagnosis = useMemo(() => {
    const thermal: DiagnosticState = temp >= 100 ? "Critical" : temp >= 86 ? "Warning" : temp >= 76 ? "Watch" : "Normal";
    const loading: DiagnosticState = load >= 101 ? "Critical" : load >= 95 ? "Warning" : load >= 80 ? "Watch" : "Normal";
    const electrical: DiagnosticState = !connected || voltage < 374 || voltage > 456 || pf < 0.75 ? "Critical" : voltage < 390 || voltage > 440 || pf < 0.9 ? "Warning" : "Normal";
    const communication: DiagnosticState = connected ? "Normal" : "Critical";
    const states = [thermal, loading, electrical, communication];
    const worst = Math.max(...states.map(severity));
    const healthScore = Math.max(18, Math.round(98 - states.reduce((sum, state) => sum + severity(state) * 10, 0) - Math.max(0, load - 70) * 0.1));
    const status = worst === 3 ? "Critical" : worst === 2 ? "Warning" : worst === 1 ? "Watch" : "Stable";
    const source = pf < 0.9 ? "SOLAR + GRID" : "GRID";
    const action = healthScore < 50 ? "Initiate feeder isolation and preserve critical load through solar support." : healthScore < 80 ? "Schedule solar support and reduce discretionary load before the next cycle." : pf < 0.9 ? "Maintain grid feed while engaging solar support to improve power quality." : "Continue grid feed and observe the scheduled diagnostic interval.";
    const regions: RegionData[] = [
      { id: "thermal", label: "Thermal region", reading: `${temp.toFixed(1)} °C`, state: thermal, detail: temp >= 86 ? "Temperature threshold exceeded" : "Core temperature / ambient model", tone: toneFromState(thermal) },
      { id: "loading", label: "Loading region", reading: `${load}%`, state: loading, detail: `${Math.round(load * 2.08)} A · ${Math.round(load * 1.5)} kVA`, tone: toneFromState(loading) },
      { id: "electrical", label: "Electrical region", reading: `${voltage.toFixed(0)} V`, state: electrical, detail: `PF ${pf.toFixed(2)} · line-to-line`, tone: toneFromState(electrical) },
      { id: "communication", label: "Communication", reading: connected ? "0.9 sec" : "No signal", state: communication, detail: connected ? "MQTT + relay heartbeat" : "Telemetry interruption", tone: toneFromState(communication) },
    ];
    return { thermal, loading, electrical, communication, healthScore, status, source, action, regions };
  }, [connected, load, pf, temp, voltage]);

  const setScenario = (scenario: "nominal" | "thermal" | "pf" | "critical") => {
    if (scenario === "nominal") { setLoad(63); setTemp(0); setVoltage(415); setPf(0.93); setConnected(true); setNotice("Nominal baseline restored. All diagnosis regions are within their normal operating bands."); }
    if (scenario === "thermal") { setLoad(89); setTemp(0); setVoltage(412); setPf(0.92); setConnected(true); setNotice("Thermal drill injected. Core temperature fixed at 0 °C for presentation."); }
    if (scenario === "pf") { setLoad(72); setTemp(0); setVoltage(404); setPf(0.84); setConnected(true); setNotice("Power-factor drill injected. The decision engine should recommend a SOLAR + GRID operating mode."); }
    if (scenario === "critical") { setLoad(106); setTemp(0); setVoltage(369); setPf(0.71); setConnected(false); setNotice("Critical compound fault injected. Review the action ledger before acknowledging the simulated event."); }
  };

  return <DashboardShell eyebrow="TNEB / TRAINING SIMULATION / REGION ENGINE" title="Fault Diagnosis Simulator">
    <section className="sim-topline"><div><span className="eyebrow">Interactive training console</span><h2>Model how a feeder condition changes from telemetry to action.</h2></div><div className="scenario-list"><button onClick={() => setScenario("nominal")}>Nominal</button><button onClick={() => setScenario("thermal")}>Thermal drill</button><button onClick={() => setScenario("pf")}>PF drill</button><button className="danger" onClick={() => setScenario("critical")}>Critical drill</button></div></section>

    <section className="sim-layout">
      <article className="panel controls-panel"><div className="card-heading"><div><span className="eyebrow">Step 01 · establish condition</span><h2>Simulated telemetry</h2></div><button className="ghost-icon" aria-label="Reset simulation" onClick={() => setScenario("nominal")}><RotateCcw size={17} /></button></div>
        <SliderControl label="Transformer load" value={load} unit="%" min={40} max={115} step={1} onChange={setLoad} icon={Gauge} tone="load" />
        <SliderControl label="Core temperature" value={temp} unit="°C" min={0} max={110} step={1} onChange={setTemp} icon={ThermometerSun} tone="thermal" />
        <SliderControl label="Line voltage" value={voltage} unit=" V" min={360} max={465} step={1} onChange={setVoltage} icon={Zap} tone="electrical" />
        <SliderControl label="Power factor" value={pf} unit="" min={0.7} max={1} step={0.01} onChange={setPf} icon={Activity} tone="power" />
        <button className={`connection-toggle ${connected ? "on" : "off"}`} onClick={() => { setConnected(!connected); setNotice(connected ? "Telemetry heartbeat interrupted for this training scenario." : "Telemetry heartbeat restored. The communication region will re-evaluate on the next sweep."); }}><span><CloudSun size={17} />MQTT relay heartbeat</span><strong>{connected ? "CONNECTED" : "OFFLINE"}</strong></button>
      </article>

      <FaultCompass regions={diagnosis.regions} healthScore={diagnosis.healthScore} status={diagnosis.status} />

      <aside className="panel action-ledger"><div className="card-heading"><div><span className="eyebrow">Step 03 · recommended action</span><h2>Decision ledger</h2></div><span className={`status-tag ${diagnosis.healthScore < 50 ? "critical" : diagnosis.healthScore < 80 ? "watch" : "stable"}`}>{diagnosis.status}</span></div>
        <div className="source-mode"><span>Recommended source mode</span><strong className={diagnosis.source === "GRID" ? "grid" : "hybrid"}>{diagnosis.source === "GRID" ? <Zap size={19} /> : <BatteryCharging size={19} />}{diagnosis.source}</strong></div>
        <div className="action-copy"><span className="action-index">01</span><p>{diagnosis.action}</p></div>
        <div className="trigger-stack"><div><i className={pf < 0.9 ? "is-hit" : ""} /> <span>PF &gt; 0.90</span><strong>GRID</strong></div><div><i className={pf < 0.9 ? "is-hit" : ""} /> <span>PF &lt; 0.90</span><strong>SOLAR + GRID</strong></div><div><i className={diagnosis.healthScore < 80 ? "is-hit" : ""} /> <span>Health &lt; 80%</span><strong>SOLAR</strong></div><div><i className={diagnosis.healthScore < 50 ? "is-hit critical" : ""} /> <span>Health &lt; 50%</span><strong>ISOLATE</strong></div></div>
        <button className="primary-button full" onClick={() => setNotice(`Recommendation recorded in the training log: ${diagnosis.source} operating mode with ${diagnosis.status.toLowerCase()} supervision.`)}><Play size={16} /> Record simulated response</button>
      </aside>
    </section>

    <section className="simulation-explain"><div className="notice-icon">{diagnosis.status === "Stable" ? <ShieldCheck size={19} /> : diagnosis.status === "Critical" ? <CloudOff size={19} /> : <TriangleAlert size={19} />}</div><div><span className="eyebrow">Training feedback</span><p>{notice}</p></div><span className="simulated-label"><Info size={14} /> No live equipment is controlled</span></section>
  </DashboardShell>;
}
