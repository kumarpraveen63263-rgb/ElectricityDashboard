import React, { useState } from "react";
import { Activity, CheckCircle2, Cpu, Gauge, Radio, RefreshCw, Send, Signal, Thermometer, Zap } from "lucide-react";
import { useMqttTelemetry } from "@/hooks/useMqttTelemetry";

export default function MqttTelemetryConsole() {
  const { payload, history, brokerUrl, topic, isConnected, sendPayload } = useMqttTelemetry();
  const [customVoltage, setCustomVoltage] = useState("414.5");
  const [customLoad, setCustomLoad] = useState("86.2");
  const [customTemp, setCustomTemp] = useState("83.1");
  const [customPf, setCustomPf] = useState("0.92");
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await sendPayload({
      voltage: parseFloat(customVoltage),
      load: parseFloat(customLoad),
      temperature: parseFloat(customTemp),
      powerFactor: parseFloat(customPf),
      source: "MQTT_PHYSICAL_HARDWARE",
    });
    setSending(false);
  };

  return (
    <div className="bg-[#0A1A2F] text-slate-100 rounded-xl p-5 border border-emerald-500/40 shadow-xl space-y-5">
      {/* Console Header with Live Pulse */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 stroke-slate-700/50 border-b border-slate-700/60">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                LIVE HARDWARE MQTT SIGNAL
              </span>
              <span className="text-xs text-slate-400 font-mono">AVD-TX-027</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">Poonamallee Road 027 Sensor Node</h3>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono text-slate-300">
          <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center space-x-2">
            <Signal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Broker: <strong className="text-emerald-300">{brokerUrl.split("://")[1]}</strong></span>
          </div>
          <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center space-x-2">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>Packets: <strong className="text-amber-300">{payload.packetCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Realtime Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Voltage */}
        <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Voltage (Phase A-B)</span>
            <strong className="text-xl font-bold font-mono text-sky-300">{payload.voltage} V</strong>
            <span className="text-[10px] text-slate-500 block">Target: 415 V ±5%</span>
          </div>
        </div>

        {/* Load */}
        <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Transformer Load</span>
            <strong className="text-xl font-bold font-mono text-amber-300">{payload.load}%</strong>
            <span className="text-[10px] text-amber-400/80 block">Review Band (&gt;80%)</span>
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Oil/Core Temp</span>
            <strong className="text-xl font-bold font-mono text-rose-300">{payload.temperature}°C</strong>
            <span className="text-[10px] text-rose-400/80 block">Thermal Sensor Node</span>
          </div>
        </div>

        {/* Power Factor */}
        <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Power Factor (PF)</span>
            <strong className="text-xl font-bold font-mono text-emerald-300">{payload.powerFactor}</strong>
            <span className="text-[10px] text-emerald-400/80 block">Optimal (&gt;0.90)</span>
          </div>
        </div>
      </div>

      {/* Lower Section: Topic Details & Payload Injection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Live MQTT JSON Telemetry Stream */}
        <div className="bg-slate-900/90 rounded-lg p-4 border border-slate-800 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
            <span className="flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <strong className="text-slate-200">MQTT Topic:</strong> {topic}
            </span>
            <span className="text-[11px] text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Receiving</span>
            </span>
          </div>
          <pre className="text-emerald-300/90 bg-slate-950 p-3 rounded overflow-x-auto text-[11px] leading-relaxed">
{JSON.stringify(
  {
    asset_id: payload.transformerId,
    voltage_v: payload.voltage,
    load_pct: payload.load,
    core_temp_c: payload.temperature,
    power_factor: payload.powerFactor,
    heartbeat_sec: payload.heartbeat,
    location: { lat: payload.lat, lng: payload.lng },
    last_pkt: payload.timestamp,
    packet_seq: payload.packetCount,
    source: payload.source,
  },
  null,
  2
)}
          </pre>
        </div>

        {/* Live Packet Ingestion & Test Controls */}
        <form onSubmit={handleSend} className="bg-slate-900/90 rounded-lg p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-200 pb-1 border-b border-slate-800">
            <span className="font-semibold text-xs flex items-center space-x-2">
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>Live MQTT Telemetry Injector / Hardware Simulator</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Publish custom physical sensor values to topic <code className="text-sky-300">{topic}</code>:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Voltage (V)</label>
              <input
                type="number"
                step="0.1"
                value={customVoltage}
                onChange={(e) => setCustomVoltage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Load (%)</label>
              <input
                type="number"
                step="0.1"
                value={customLoad}
                onChange={(e) => setCustomLoad(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                value={customTemp}
                onChange={(e) => setCustomTemp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Power Factor</label>
              <input
                type="number"
                step="0.01"
                value={customPf}
                onChange={(e) => setCustomPf(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded text-xs transition flex items-center justify-center space-x-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${sending ? "animate-spin" : ""}`} />
            <span>{sending ? "Publishing to MQTT..." : "Publish Live MQTT Packet Now"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
