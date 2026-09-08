/**
 * Civic Operations Atlas data model. These values are prototype monitoring signals
 * for the dashboard design, not live TNEB operational telemetry.
 */
export type HealthState = "healthy" | "watch" | "fault" | "offline";

export type TransformerAsset = {
  id: string;
  name: string;
  zoneId: "avadi" | "ambattur";
  position: { lat: number; lng: number };
  health: number;
  state: HealthState;
  coverage: string;
  load: string;
  temperature: string;
  voltage: string;
  pf: string;
  heartbeat: string;
  updated: string;
  fault?: { title: string; detail: string; severity: "Watch" | "High" };
};

export type MonitoringZone = {
  id: "avadi" | "ambattur";
  name: string;
  code: string;
  centre: { lat: number; lng: number };
  coverageRadius: number;
  coverage: string;
  assets: number;
  availability: string;
  healthy: number;
  note: string;
  transformers: TransformerAsset[];
};

export const zones: MonitoringZone[] = [
  {
    id: "avadi",
    name: "Avadi",
    code: "AVD / NORTHWEST",
    centre: { lat: 13.114656, lng: 80.089645 },
    coverageRadius: 3600,
    coverage: "18.6 km²",
    assets: 46,
    availability: "97.8%",
    healthy: 42,
    note: "Rail corridor and residential feeders",
    transformers: [
      { id: "AVD-TX-014", name: "HV Service Point · 014", zoneId: "avadi", position: { lat: 13.1202, lng: 80.0829 }, health: 96, state: "healthy", coverage: "1,260 connections", load: "61%", temperature: "0°C", voltage: "414 V", pf: "0.94", heartbeat: "0.8 sec", updated: "10:42:16" },
      { id: "AVD-TX-027", name: "Poonamallee Road · 027", zoneId: "avadi", position: { lat: 13.065278, lng: 80.110556 }, health: 78, state: "watch", coverage: "910 connections", load: "84%", temperature: "0°C", voltage: "410 V", pf: "0.91", heartbeat: "1.1 sec", updated: "10:41:52", fault: { title: "Load trend under review", detail: "Feeder loading level operating at peak band.", severity: "Watch" } },
      { id: "AVD-TX-031", name: "Tank Factory Estate · 031", zoneId: "avadi", position: { lat: 13.1165, lng: 80.1054 }, health: 93, state: "healthy", coverage: "740 connections", load: "58%", temperature: "0°C", voltage: "416 V", pf: "0.95", heartbeat: "0.7 sec", updated: "10:42:01" },
      { id: "AVD-TX-044", name: "MTH Road West · 044", zoneId: "avadi", position: { lat: 13.1064, lng: 80.0864 }, health: 89, state: "healthy", coverage: "1,090 connections", load: "71%", temperature: "0°C", voltage: "413 V", pf: "0.92", heartbeat: "1.0 sec", updated: "10:41:45" },
    ],
  },
  {
    id: "ambattur",
    name: "Ambattur",
    code: "AMT / CENTRAL",
    centre: { lat: 13.09978, lng: 80.15804 },
    coverageRadius: 4200,
    coverage: "23.1 km²",
    assets: 58,
    availability: "96.4%",
    healthy: 51,
    note: "Industrial estate and mixed urban demand",
    transformers: [
      { id: "AMT-TX-008", name: "Industrial Estate · 008", zoneId: "ambattur", position: { lat: 13.0964, lng: 80.1662 }, health: 74, state: "fault", coverage: "1,840 connections", load: "76%", temperature: "0°C", voltage: "403 V", pf: "0.84", heartbeat: "0.9 sec", updated: "10:42:09", fault: { title: "Low power factor detected", detail: "PF is below the 0.90 operating reference. Support review requested.", severity: "High" } },
      { id: "AMT-TX-019", name: "Korattur Link · 019", zoneId: "ambattur", position: { lat: 13.1043, lng: 80.1531 }, health: 94, state: "healthy", coverage: "1,120 connections", load: "55%", temperature: "0°C", voltage: "415 V", pf: "0.95", heartbeat: "0.8 sec", updated: "10:42:12" },
      { id: "AMT-TX-026", name: "Mogappair West · 026", zoneId: "ambattur", position: { lat: 13.0942, lng: 80.1504 }, health: 90, state: "healthy", coverage: "960 connections", load: "68%", temperature: "0°C", voltage: "412 V", pf: "0.93", heartbeat: "1.0 sec", updated: "10:41:58" },
      { id: "AMT-TX-042", name: "Ambattur Lake Road · 042", zoneId: "ambattur", position: { lat: 13.1073, lng: 80.1637 }, health: 86, state: "watch", coverage: "1,080 connections", load: "81%", temperature: "0°C", voltage: "409 V", pf: "0.90", heartbeat: "1.2 sec", updated: "10:41:50", fault: { title: "Loading threshold approaching", detail: "Load has remained above 80% for the last diagnostic cycle.", severity: "Watch" } },
    ],
  },
];

export const allTransformers = zones.flatMap((zone) => zone.transformers);
export const activeFaults = allTransformers.filter((asset) => asset.fault);

export function getZone(zoneId: string) {
  return zones.find((zone) => zone.id === zoneId) ?? zones[0];
}
