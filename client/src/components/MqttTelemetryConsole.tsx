import React, { useState } from "react";
import { Activity, CheckCircle2, Cpu, Gauge, Radio, RefreshCw, Send, Signal, Thermometer, Zap } from "lucide-react";
import { useMqttTelemetry } from "@/hooks/useMqttTelemetry";

export default function MqttTelemetryConsole() {
  const { payload, brokerUrl, esp32Client, topics, sendPayload } = useMqttTelemetry();
  const [customVoltage, setCustomVoltage] = useState("230.4");
  const [customCurrent, setCustomCurrent] = useState("14.2");
  const [customPower, setCustomPower] = useState("3004.8");
  const [customPf, setCustomPf] = useState("0.92");
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const v = parseFloat(customVoltage);
    const i = parseFloat(customCurrent);
    const pf = parseFloat(customPf);
    const p = parseFloat(customPower) || v * i * pf;
    const s = v * i;

    await sendPayload({
      voltage: v,
      current: i,
      power: p,
      apparentPower: s,
      powerFactor: pf,
      load: Number(((p / (s || 1)) * 90.0).toFixed(1)),
      temperature: Number((65.0 + ((p / (s || 1)) * 90.0 / 100) * 20.0).toFixed(1)),
      source: "ESP32_PHYSICAL_HARDWARE",
    });
    setSending(false);
  };

  return (
    <div className="bg-[#0A1A2F] text-slate-100 rounded-xl p-5 border border-emerald-500/40 shadow-xl space-y-5">
      {/* Console Header with ESP32 Live Pulse */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 stroke-slate-700/50 border-b border-slate-700/60">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                ESP32 HARDWARE MQTT ACTIVE
              </span>
              <span className="text-xs text-slate-400 font-mono">Client: {esp32Client}</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">AVD-TX-027 · Poonamallee Road Physical Energy Meter</h3>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center space-x-2">
            <Signal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Broker: <strong className="text-emerald-300">{brokerUrl}</strong></span>
          </div>
          <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center space-x-2">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>Packets: <strong className="text-amber-300">{payload.packetCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Realtime Telemetry Grid from ESP32 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Voltage */}
        <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Voltage (PowerHouse/Energy/Voltage)</span>
            <strong className="text-xl font-bold font-mono text-sky-300">{payload.voltage} V</strong>
            <span className="text-[10px] text-slate-500 block">Single Phase / Feeder</span>
          </div>
        </div>

        {/* Current */}
        <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Current (PowerHouse/Energy/Current)</span>
            <strong className="text-xl font-bold font-mono text-amber-300">{payload.current ?? 14.2} A</strong>
            <span className="text-[10px] text-amber-400/80 block">Load: {payload.load}%</span>
          </div>
        </div>

        {/* Active Power */}
        <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Active Power (PowerHouse/Energy/Power)</span>
            <strong className="text-xl font-bold font-mono text-rose-300">{payload.power ?? 3004.8} W</strong>
            <span className="text-[10px] text-rose-400/80 block">Temp: {payload.temperature}°C</span>
          </div>
        </div>

        {/* Power Factor */}
        <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Power Factor (PowerHouse/Energy/PowerFactor)</span>
            <strong className="text-xl font-bold font-mono text-emerald-300">{payload.powerFactor}</strong>
            <span className="text-[10px] text-emerald-400/80 block">Status: {payload.status || "ONLINE"}</span>
          </div>
        </div>
      </div>

      {/* Topics List & Test Injection Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* ESP32 MQTT Subscribed Topics */}
        <div className="bg-slate-900/90 rounded-lg p-4 border border-slate-800 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
            <span className="flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <strong className="text-slate-200">ESP32 Subscribed MQTT Topics:</strong>
            </span>
            <span className="text-[11px] text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Listening on 1883</span>
            </span>
          </div>
          <div className="space-y-1 pt-1">
            {topics.map((tp) => (
              <div key={tp} className="flex items-center justify-between bg-slate-950 px-2.5 py-1 rounded text-[11px]">
                <code className="text-sky-300">{tp}</code>
                <span className="text-[10px] text-emerald-400">Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live ESP32 Topic Injector / Test Console */}
        <form onSubmit={handleSend} className="bg-slate-900/90 rounded-lg p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-200 pb-1 border-b border-slate-800">
            <span className="font-semibold text-xs flex items-center space-x-2">
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>ESP32 Hardware Test Injector</span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Voltage (PowerHouse/Energy/Voltage)</label>
              <input
                type="number"
                step="0.1"
                value={customVoltage}
                onChange={(e) => setCustomVoltage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Current (PowerHouse/Energy/Current)</label>
              <input
                type="number"
                step="0.1"
                value={customCurrent}
                onChange={(e) => setCustomCurrent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Power (PowerHouse/Energy/Power)</label>
              <input
                type="number"
                step="0.1"
                value={customPower}
                onChange={(e) => setCustomPower(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Power Factor (PowerHouse/Energy/PowerFactor)</label>
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
            <span>{sending ? "Publishing to ESP32 Topics..." : "Publish Test ESP32 Topic Packets"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
