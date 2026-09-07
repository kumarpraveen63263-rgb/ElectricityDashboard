export type Substation = {
  id: string;
  name: string;
  code: string;
  voltage: string;
  position: { lat: number; lng: number };
  health: "Healthy" | "Watch" | "Critical";
  connectedFeeders: number;
  connectedTransformers: number;
  cityId: string;
  zoneId: string;
};

export type EbOffice = {
  id: string;
  name: string;
  code: string;
  position: { lat: number; lng: number };
  status: "Online" | "Maintenance";
  engineers: number;
  openTickets: number;
  cityId: string;
  zoneId: string;
};

export type CollegeAsset = {
  id: string;
  name: string;
  code: string;
  position: { lat: number; lng: number };
  connectedTx: string;
  category: string;
  demandKva: string;
  cityId: string;
  zoneId: string;
};

export type FeederLine = {
  id: string;
  name: string;
  color: string;
  status: "healthy" | "high_load" | "maintenance" | "fault" | "live_mqtt";
  path: [number, number][];
};

// Educational Institution: S.A. Engineering College (SAEC)
export const collegeAsset: CollegeAsset = {
  id: "SAEC-AVD",
  name: "S.A. Engineering College (SAEC)",
  code: "SAEC-CAMPUS",
  position: { lat: 13.0612, lng: 80.0988 },
  connectedTx: "AVD-TX-027",
  category: "Higher Education Campus / High-Load Consumer",
  demandKva: "650 kVA Peak",
  cityId: "chennai",
  zoneId: "avadi",
};

// TANGEDCO Operation & Maintenance EB Offices
export const ebOffices: EbOffice[] = [
  { id: "EB-AVD-01", name: "Avadi EB O&M Office", code: "TNEB-AVD-01", position: { lat: 13.1175, lng: 80.1012 }, status: "Online", engineers: 5, openTickets: 1, cityId: "chennai", zoneId: "avadi" },
  { id: "EB-ANN-02", name: "Annanur EB O&M Office", code: "TNEB-ANN-02", position: { lat: 13.1255, lng: 80.1120 }, status: "Online", engineers: 4, openTickets: 0, cityId: "chennai", zoneId: "avadi" },
  { id: "EB-KMR-03", name: "Kamaraj Nagar EB Office", code: "TNEB-KMR-03", position: { lat: 13.1210, lng: 80.0865 }, status: "Online", engineers: 3, openTickets: 1, cityId: "chennai", zoneId: "avadi" },
  { id: "EB-GVD-04", name: "Govardanagiri EB Office", code: "TNEB-GVD-04", position: { lat: 13.1075, lng: 80.0915 }, status: "Online", engineers: 4, openTickets: 0, cityId: "chennai", zoneId: "avadi" },
  { id: "EB-PNM-05", name: "Poonamallee EB Office", code: "TNEB-PNM-05", position: { lat: 13.0490, lng: 80.0945 }, status: "Online", engineers: 6, openTickets: 2, cityId: "chennai", zoneId: "avadi" },
  { id: "EB-PRR-06", name: "Porur EB O&M Office", code: "TNEB-PRR-06", position: { lat: 13.0390, lng: 80.1565 }, status: "Online", engineers: 5, openTickets: 1, cityId: "chennai", zoneId: "ambattur" },
];

// TANTRANSCO / TANGEDCO Substations
export const substations: Substation[] = [
  { id: "SS-AVD-110", name: "Avadi 110/33 kV Substation", code: "SS-AVD-110", voltage: "110 / 33 kV", position: { lat: 13.1215, lng: 80.0935 }, health: "Healthy", connectedFeeders: 8, connectedTransformers: 12, cityId: "chennai", zoneId: "avadi" },
  { id: "SS-PNM-230", name: "Poonamallee 230/110 kV Substation", code: "SS-PNM-230", voltage: "230 / 110 kV Grid", position: { lat: 13.0530, lng: 80.0890 }, health: "Healthy", connectedFeeders: 14, connectedTransformers: 24, cityId: "chennai", zoneId: "avadi" },
  { id: "SS-PRR-110", name: "Porur 110/33 kV Substation", code: "SS-PRR-110", voltage: "110 / 33 kV", position: { lat: 13.0370, lng: 80.1590 }, health: "Healthy", connectedFeeders: 10, connectedTransformers: 16, cityId: "chennai", zoneId: "ambattur" },
  { id: "SS-KRT-110", name: "Korattur 110/33 kV Substation", code: "SS-KRT-110", voltage: "110 / 33 kV", position: { lat: 13.1070, lng: 80.1530 }, health: "Healthy", connectedFeeders: 6, connectedTransformers: 10, cityId: "chennai", zoneId: "ambattur" },
];

// 11kV Feeder Lines (Substation -> Transformer -> Consumer)
export const feederLines: FeederLine[] = [
  {
    id: "FEEDER-LIVE-SAEC",
    name: "11kV Feeder 027 (SAEC Campus Dedicated)",
    color: "#00FF66",
    status: "live_mqtt",
    path: [
      [13.1215, 80.0935], // Avadi 110kV Substation
      [13.0980, 80.0940],
      [13.0750, 80.0960],
      [13.0620, 80.0975], // AVD-TX-027 Transformer
      [13.0612, 80.0988], // S.A. Engineering College
    ],
  },
  {
    id: "FEEDER-AVD-NORTH",
    name: "11kV Avadi North Feeder",
    color: "#10b981",
    status: "healthy",
    path: [
      [13.1215, 80.0935],
      [13.1202, 80.0829], // AVD-TX-014
      [13.1261, 80.0933], // AVD-TX-052
      [13.1305, 80.1042], // AVD-TX-084
    ],
  },
  {
    id: "FEEDER-AVD-HIGH-LOAD",
    name: "11kV Tank Factory Feeder",
    color: "#f59e0b",
    status: "high_load",
    path: [
      [13.1215, 80.0935],
      [13.1165, 80.1054], // AVD-TX-031
      [13.0988, 80.1005], // AVD-TX-061
    ],
  },
  {
    id: "FEEDER-AMT-FAULT",
    name: "11kV Ambattur Industrial Feeder",
    color: "#ef4444",
    status: "fault",
    path: [
      [13.1070, 80.1530], // Korattur Substation
      [13.1043, 80.1531], // AMT-TX-019
      [13.0964, 80.1662], // AMT-TX-008 (Fault)
    ],
  },
  {
    id: "FEEDER-AMT-MAINT",
    name: "11kV Mogappair Feeder",
    color: "#f97316",
    status: "maintenance",
    path: [
      [13.1070, 80.1530],
      [13.1073, 80.1637], // AMT-TX-042
      [13.0856, 80.1579], // AMT-TX-067
    ],
  },
];
