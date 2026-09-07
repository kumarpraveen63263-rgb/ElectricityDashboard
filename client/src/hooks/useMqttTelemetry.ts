import { useEffect, useState } from "react";

export type TelemetryPayload = {
  transformerId: string;
  voltage: number;
  load: number;
  temperature: number;
  powerFactor: number;
  heartbeat: number;
  lat?: number;
  lng?: number;
  timestamp: string;
  packetCount: number;
  source: "MQTT_PHYSICAL_HARDWARE" | "SIMULATED_TEST";
};

export type MqttState = {
  payload: TelemetryPayload;
  history: TelemetryPayload[];
  brokerUrl: string;
  topic: string;
  isConnected: boolean;
};

const defaultState: MqttState = {
  payload: {
    transformerId: "AVD-TX-027",
    voltage: 410.2,
    load: 84.0,
    temperature: 81.4,
    powerFactor: 0.91,
    heartbeat: 0.6,
    lat: 13.1118,
    lng: 80.0969,
    timestamp: "10:41:52 IST",
    packetCount: 1,
    source: "MQTT_PHYSICAL_HARDWARE",
  },
  history: [],
  brokerUrl: "wss://broker.hivemq.com:8884/mqtt",
  topic: "tneb/avadi/AVD-TX-027/telemetry",
  isConnected: true,
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
