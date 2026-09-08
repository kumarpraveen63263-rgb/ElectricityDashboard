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
    <div className="bg-[#fffdf8] text-[#173b57] rounded-xl p-5 border border-[#d9e1e4] border-t-4 border-t-[#d7a445] shadow-sm space-y-5">
      {/* Console Header with ESP32 Live Pulse */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#e8eeec]">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                ESP32 HARDWARE MQTT ACTIVE
              </span>
              <span className="text-xs text-slate-500 font-mono">Client: {esp32Client}</span>
            </div>
            <h3 className="text-lg font-bold text-[#173b57] mt-0.5">AVD-TX-027 · Poonamallee Road Physical Energy Meter</h3>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-[#f4f7f6] px-3 py-1.5 rounded-lg border border-[#d9e1e4] flex items-center space-x-2 text-slate-700">
            <Signal className="w-3.5 h-3.5 text-emerald-600" />
            <span>Broker: <strong className="text-emerald-800 font-bold">{brokerUrl}</strong></span>
          </div>
          <div className="bg-[#f4f7f6] px-3 py-1.5 rounded-lg border border-[#d9e1e4] flex items-center space-x-2 text-slate-700">
            <Radio className="w-3.5 h-3.5 text-amber-600" />
            <span>Packets: <strong className="text-amber-800 font-bold">{payload.packetCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Realtime Telemetry Grid from ESP32 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Voltage */}
        <div className="bg-[#f8faf9] p-4 rounded-lg border border-[#e2e8e5] flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-sky-100 text-sky-700">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Voltage (PowerHouse/Energy/Voltage)</span>
            <strong className="text-xl font-bold font-mono text-[#0369a1]">{payload.voltage} V</strong>
            <span className="text-[10px] text-slate-500 block">Single Phase / Feeder</span>
          </div>
        </div>

        {/* Current */}
        <div className="bg-[#f8faf9] p-4 rounded-lg border border-[#e2e8e5] flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Current (PowerHouse/Energy/Current)</span>
            <strong className="text-xl font-bold font-mono text-[#b45309]">{payload.current ?? 14.2} A</strong>
            <span className="text-[10px] text-amber-700 font-medium block">Load: {payload.load}%</span>
          </div>
        </div>

        {/* Active Power */}
        <div className="bg-[#f8faf9] p-4 rounded-lg border border-[#e2e8e5] flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-rose-100 text-rose-700">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Active Power (PowerHouse/Energy/Power)</span>
            <strong className="text-xl font-bold font-mono text-[#be123c]">{payload.power ?? 3004.8} W</strong>
            <span className="text-[10px] text-rose-700 font-medium block">Temp: {payload.temperature}°C</span>
          </div>
        </div>

        {/* Power Factor */}
        <div className="bg-[#f8faf9] p-4 rounded-lg border border-[#e2e8e5] flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Power Factor (PowerHouse/Energy/PowerFactor)</span>
            <strong className="text-xl font-bold font-mono text-[#047857]">{payload.powerFactor}</strong>
            <span className="text-[10px] text-emerald-700 font-medium block">Status: {payload.status || "ONLINE"}</span>
          </div>
        </div>
      </div>

      {/* Topics List & Test Injection Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* ESP32 MQTT Subscribed Topics */}
        <div className="bg-[#f8faf9] rounded-lg p-4 border border-[#e2e8e5] space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-600 pb-1.5 border-b border-[#e2e8e5]">
            <span className="flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <strong className="text-[#173b57] font-sans font-bold">ESP32 Subscribed MQTT Topics:</strong>
            </span>
            <span className="text-[11px] text-emerald-700 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Listening on 1883</span>
            </span>
          </div>
          <div className="space-y-1 pt-1">
            {topics.map((tp) => (
              <div key={tp} className="flex items-center justify-between bg-white border border-[#e2e8e5] px-2.5 py-1 rounded text-[11px]">
                <code className="text-[#0369a1] font-semibold">{tp}</code>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live ESP32 Topic Injector / Test Console */}
        <form onSubmit={handleSend} className="bg-[#f8faf9] rounded-lg p-4 border border-[#e2e8e5] space-y-3">
          <div className="flex items-center justify-between text-[#173b57] pb-1.5 border-b border-[#e2e8e5]">
            <span className="font-bold text-xs flex items-center space-x-2">
              <Send className="w-3.5 h-3.5 text-sky-600" />
              <span>ESP32 Hardware Test Injector</span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Voltage (PowerHouse/Energy/Voltage)</label>
              <input
                type="number"
                step="0.1"
                value={customVoltage}
                onChange={(e) => setCustomVoltage(e.target.value)}
                className="w-full bg-white border border-[#cbd5e1] focus:border-[#2d8a74] rounded px-2.5 py-1.5 text-[#173b57] font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Current (PowerHouse/Energy/Current)</label>
              <input
                type="number"
                step="0.1"
                value={customCurrent}
                onChange={(e) => setCustomCurrent(e.target.value)}
                className="w-full bg-white border border-[#cbd5e1] focus:border-[#2d8a74] rounded px-2.5 py-1.5 text-[#173b57] font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Power (PowerHouse/Energy/Power)</label>
              <input
                type="number"
                step="0.1"
                value={customPower}
                onChange={(e) => setCustomPower(e.target.value)}
                className="w-full bg-white border border-[#cbd5e1] focus:border-[#2d8a74] rounded px-2.5 py-1.5 text-[#173b57] font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Power Factor (PowerHouse/Energy/PowerFactor)</label>
              <input
                type="number"
                step="0.01"
                value={customPf}
                onChange={(e) => setCustomPf(e.target.value)}
                className="w-full bg-white border border-[#cbd5e1] focus:border-[#2d8a74] rounded px-2.5 py-1.5 text-[#173b57] font-mono outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-[#2d8a74] hover:bg-[#236e5d] text-white font-bold py-2 px-4 rounded text-xs transition flex items-center justify-center space-x-2 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${sending ? "animate-spin" : ""}`} />
            <span>{sending ? "Publishing to ESP32 Topics..." : "Publish Test ESP32 Topic Packets"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
