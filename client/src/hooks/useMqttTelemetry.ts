import { useEffect, useState } from "react";

export type TelemetryPayload = {
  transformerId: string;
  voltage: number;
  current: number;
  power: number;
  apparentPower: number;
  load: number;
  temperature: number;
  powerFactor: number;
  status: string;
  heartbeat: number;
  lat?: number;
  lng?: number;
  timestamp: string;
  packetCount: number;
  source: "ESP32_PHYSICAL_HARDWARE" | "MQTT_BROKER" | "SIMULATED_TEST";
  lastTopic?: string;
};

export type MqttState = {
  payload: TelemetryPayload;
  history: TelemetryPayload[];
  brokerUrl: string;
  esp32Client: string;
  topics: string[];
  esp32Connected: boolean;
};

const defaultState: MqttState = {
  payload: {
    transformerId: "AVD-TX-027",
    voltage: 230.4,
    current: 14.2,
    power: 3004.8,
    apparentPower: 3266.0,
    load: 84.0,
    temperature: 0.0,
    powerFactor: 0.92,
    status: "ONLINE",
    heartbeat: 0.5,
    lat: 13.1118,
    lng: 80.0969,
    timestamp: "10:41:52 IST",
    packetCount: 1,
    source: "ESP32_PHYSICAL_HARDWARE",
    lastTopic: "PowerHouse/Energy/Voltage",
  },
  history: [],
  brokerUrl: "mqtt://192.168.137.1:1883",
  esp32Client: "PowerHouse_EnergyMeter",
  topics: [
    "PowerHouse/Energy/Voltage",
    "PowerHouse/Energy/Current",
    "PowerHouse/Energy/Power",
    "PowerHouse/Energy/ApparentPower",
    "PowerHouse/Energy/PowerFactor",
    "PowerHouse/Energy/Status",
  ],
  esp32Connected: true,
};

export function useMqttTelemetry() {
  const [data, setData] = useState<MqttState>(defaultState);

  useEffect(() => {
    // Connect to Server-Sent Events stream for real-time live telemetry
    const eventSource = new EventSource("/api/telemetry/stream");

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as MqttState;
        if (parsed && parsed.payload) {
          setData(parsed);
        }
      } catch (e) {
        console.error("SSE parse error", e);
      }
    };

    eventSource.onerror = () => {
      // Fallback polling if SSE drops
      fetch("/api/telemetry/AVD-TX-027")
        .then((res) => res.json())
        .then((res) => setData(res))
        .catch(() => {});
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const sendPayload = async (payload: Partial<TelemetryPayload>) => {
    try {
      const res = await fetch("/api/telemetry/AVD-TX-027", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (e) {
      console.error("Failed to post telemetry", e);
    }
  };

  return { ...data, sendPayload };
}
