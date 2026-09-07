export type Severity = "watch" | "high" | "critical";
export type TransformerState = "healthy" | "watch" | "fault" | "offline";

export type City = { id: string; name: string; code: string; center: google.maps.LatLngLiteral; zoom: number; transformerCount: number; zoneCount: number; activeAlerts: number; };
export type Zone = { id: string; cityId: string; name: string; code: string; center: google.maps.LatLngLiteral; boundary: google.maps.LatLngLiteral[]; serviceArea: string; transformerCount: number; healthy: number; activeAlerts: number; note: string; };
export type Transformer = { id: string; zoneId: string; name: string; position: google.maps.LatLngLiteral; health: number; state: TransformerState; coverage: string; voltage: string; load: string; temperature: string; powerFactor: string; heartbeat: string; lastUpdate: string; issue?: string; };

export const cities: City[] = [
  { id: "chennai", name: "Chennai", code: "CHN", center: { lat: 13.106, lng: 80.125 }, zoom: 11, transformerCount: 16, zoneCount: 2, activeAlerts: 3 },
  { id: "coimbatore", name: "Coimbatore", code: "CBE", center: { lat: 11.0168, lng: 76.9558 }, zoom: 12, transformerCount: 9, zoneCount: 3, activeAlerts: 3 },
];

export const zones: Zone[] = [
  { id: "avadi", cityId: "chennai", name: "Avadi", code: "CHN-AVD", center: { lat: 13.0910, lng: 80.0940 }, serviceArea: "24.2 km²", transformerCount: 8, healthy: 6, activeAlerts: 1, note: "Rail corridor, SAEC campus & Poonamallee High Road feeders", boundary: [{ lat: 13.138, lng: 80.068 }, { lat: 13.139, lng: 80.112 }, { lat: 13.094, lng: 80.118 }, { lat: 13.050, lng: 80.108 }, { lat: 13.050, lng: 80.082 }, { lat: 13.096, lng: 80.072 }] },
  { id: "ambattur", cityId: "chennai", name: "Ambattur", code: "CHN-AMT", center: { lat: 13.09978, lng: 80.15804 }, serviceArea: "23.1 km²", transformerCount: 8, healthy: 5, activeAlerts: 2, note: "Industrial estate and mixed urban demand", boundary: [{ lat: 13.121, lng: 80.141 }, { lat: 13.121, lng: 80.177 }, { lat: 13.094, lng: 80.181 }, { lat: 13.079, lng: 80.164 }, { lat: 13.085, lng: 80.142 }, { lat: 13.102, lng: 80.135 }] },
  { id: "rs-puram", cityId: "coimbatore", name: "R.S. Puram", code: "CBE-RSP", center: { lat: 11.0086, lng: 76.9464 }, serviceArea: "12.8 km²", transformerCount: 3, healthy: 2, activeAlerts: 1, note: "Central civic and commercial distribution", boundary: [{ lat: 11.024, lng: 76.928 }, { lat: 11.027, lng: 76.954 }, { lat: 11.009, lng: 76.965 }, { lat: 10.994, lng: 76.955 }, { lat: 10.995, lng: 76.935 }, { lat: 11.010, lng: 76.927 }] },
  { id: "peelamedu", cityId: "coimbatore", name: "Peelamedu", code: "CBE-PLM", center: { lat: 11.0266, lng: 76.9958 }, serviceArea: "15.2 km²", transformerCount: 3, healthy: 2, activeAlerts: 1, note: "Airport corridor and institutional feeders", boundary: [{ lat: 11.043, lng: 76.977 }, { lat: 11.046, lng: 77.012 }, { lat: 11.026, lng: 77.022 }, { lat: 11.009, lng: 77.007 }, { lat: 11.012, lng: 76.983 }, { lat: 11.027, lng: 76.975 }] },
  { id: "singanallur", cityId: "coimbatore", name: "Singanallur", code: "CBE-SNG", center: { lat: 10.9996, lng: 77.0326 }, serviceArea: "16.4 km²", transformerCount: 3, healthy: 2, activeAlerts: 1, note: "Southern residential and industrial feeders", boundary: [{ lat: 11.012, lng: 77.016 }, { lat: 11.017, lng: 77.050 }, { lat: 10.997, lng: 77.060 }, { lat: 10.982, lng: 77.040 }, { lat: 10.985, lng: 77.020 }, { lat: 10.998, lng: 77.014 }] },
];

export const transformers: Transformer[] = [
  { id: "AVD-TX-014", zoneId: "avadi", name: "HV Service Point 014", position: { lat: 13.1202, lng: 80.0829 }, health: 96, state: "healthy", coverage: "1,260 services", voltage: "414 V", load: "61%", temperature: "0°C", powerFactor: "0.94", heartbeat: "0.8 sec", lastUpdate: "10:42:16 IST" },
  { id: "AVD-TX-027", zoneId: "avadi", name: "Poonamallee Road 027 (SAEC)", position: { lat: 13.0620, lng: 80.0975 }, health: 78, state: "watch", coverage: "910 services", voltage: "410 V", load: "84%", temperature: "0°C", powerFactor: "0.91", heartbeat: "1.1 sec", lastUpdate: "10:41:52 IST", issue: "Load trend under review" },
  { id: "AVD-TX-031", zoneId: "avadi", name: "Tank Factory Estate 031", position: { lat: 13.1165, lng: 80.1054 }, health: 93, state: "healthy", coverage: "740 services", voltage: "416 V", load: "58%", temperature: "0°C", powerFactor: "0.95", heartbeat: "0.7 sec", lastUpdate: "10:42:01 IST" },
  { id: "AVD-TX-044", zoneId: "avadi", name: "MTH Road West 044", position: { lat: 13.1064, lng: 80.0864 }, health: 89, state: "healthy", coverage: "1,090 services", voltage: "413 V", load: "71%", temperature: "0°C", powerFactor: "0.92", heartbeat: "1.0 sec", lastUpdate: "10:41:45 IST" },
  { id: "AVD-TX-052", zoneId: "avadi", name: "Paruthipattu 052", position: { lat: 13.1261, lng: 80.0933 }, health: 91, state: "healthy", coverage: "880 services", voltage: "415 V", load: "66%", temperature: "0°C", powerFactor: "0.93", heartbeat: "0.9 sec", lastUpdate: "10:42:05 IST" },
  { id: "AVD-TX-061", zoneId: "avadi", name: "Pattabiram Link 061", position: { lat: 13.0988, lng: 80.1005 }, health: 82, state: "watch", coverage: "1,010 services", voltage: "408 V", load: "79%", temperature: "0°C", powerFactor: "0.90", heartbeat: "1.1 sec", lastUpdate: "10:41:49 IST", issue: "Load trend approaching review band" },
  { id: "AVD-TX-073", zoneId: "avadi", name: "Avadi Market 073", position: { lat: 13.1143, lng: 80.0772 }, health: 95, state: "healthy", coverage: "670 services", voltage: "416 V", load: "54%", temperature: "0°C", powerFactor: "0.96", heartbeat: "0.7 sec", lastUpdate: "10:42:09 IST" },
  { id: "AVD-TX-084", zoneId: "avadi", name: "Kovilpathagai 084", position: { lat: 13.1305, lng: 80.1042 }, health: 88, state: "healthy", coverage: "940 services", voltage: "411 V", load: "73%", temperature: "0°C", powerFactor: "0.92", heartbeat: "0.9 sec", lastUpdate: "10:42:00 IST" },
  { id: "AMT-TX-008", zoneId: "ambattur", name: "Industrial Estate 008", position: { lat: 13.0964, lng: 80.1662 }, health: 74, state: "fault", coverage: "1,840 services", voltage: "403 V", load: "76%", temperature: "0°C", powerFactor: "0.84", heartbeat: "0.9 sec", lastUpdate: "10:42:09 IST", issue: "Low power factor detected" },
  { id: "AMT-TX-019", zoneId: "ambattur", name: "Korattur Link 019", position: { lat: 13.1043, lng: 80.1531 }, health: 94, state: "healthy", coverage: "1,120 services", voltage: "415 V", load: "55%", temperature: "0°C", powerFactor: "0.95", heartbeat: "0.8 sec", lastUpdate: "10:42:12 IST" },
  { id: "AMT-TX-026", zoneId: "ambattur", name: "Mogappair West 026", position: { lat: 13.0942, lng: 80.1504 }, health: 90, state: "healthy", coverage: "960 services", voltage: "412 V", load: "68%", temperature: "0°C", powerFactor: "0.93", heartbeat: "1.0 sec", lastUpdate: "10:41:58 IST" },
  { id: "AMT-TX-042", zoneId: "ambattur", name: "Ambattur Lake Road 042", position: { lat: 13.1073, lng: 80.1637 }, health: 86, state: "watch", coverage: "1,080 services", voltage: "409 V", load: "81%", temperature: "0°C", powerFactor: "0.90", heartbeat: "1.2 sec", lastUpdate: "10:41:50 IST", issue: "Loading threshold approaching" },
  { id: "AMT-TX-055", zoneId: "ambattur", name: "Menambedu 055", position: { lat: 13.1152, lng: 80.1477 }, health: 92, state: "healthy", coverage: "760 services", voltage: "414 V", load: "63%", temperature: "0°C", powerFactor: "0.94", heartbeat: "0.8 sec", lastUpdate: "10:42:03 IST" },
  { id: "AMT-TX-067", zoneId: "ambattur", name: "Oragadam 067", position: { lat: 13.0856, lng: 80.1579 }, health: 83, state: "watch", coverage: "1,360 services", voltage: "407 V", load: "82%", temperature: "0°C", powerFactor: "0.89", heartbeat: "1.3 sec", lastUpdate: "10:41:43 IST", issue: "Power factor review required" },
  { id: "AMT-TX-074", zoneId: "ambattur", name: "Padi Junction 074", position: { lat: 13.1097, lng: 80.1741 }, health: 96, state: "healthy", coverage: "1,280 services", voltage: "416 V", load: "60%", temperature: "0°C", powerFactor: "0.96", heartbeat: "0.7 sec", lastUpdate: "10:42:07 IST" },
  { id: "AMT-TX-089", zoneId: "ambattur", name: "Kallikuppam 089", position: { lat: 13.0825, lng: 80.1695 }, health: 91, state: "healthy", coverage: "890 services", voltage: "413 V", load: "69%", temperature: "0°C", powerFactor: "0.93", heartbeat: "1.0 sec", lastUpdate: "10:41:56 IST" },
  { id: "RSP-TX-006", zoneId: "rs-puram", name: "R.S. Puram 006", position: { lat: 11.0122, lng: 76.9431 }, health: 95, state: "healthy", coverage: "1,040 services", voltage: "414 V", load: "57%", temperature: "0°C", powerFactor: "0.95", heartbeat: "0.8 sec", lastUpdate: "10:42:11 IST" },
  { id: "RSP-TX-018", zoneId: "rs-puram", name: "Town Hall Link 018", position: { lat: 11.0034, lng: 76.9554 }, health: 79, state: "watch", coverage: "1,170 services", voltage: "409 V", load: "83%", temperature: "0°C", powerFactor: "0.91", heartbeat: "1.0 sec", lastUpdate: "10:41:54 IST", issue: "Baseline review scheduled" },
  { id: "RSP-TX-029", zoneId: "rs-puram", name: "Saibaba Colony 029", position: { lat: 11.0208, lng: 76.9497 }, health: 92, state: "healthy", coverage: "830 services", voltage: "415 V", load: "64%", temperature: "0°C", powerFactor: "0.94", heartbeat: "0.8 sec", lastUpdate: "10:42:02 IST" },
  { id: "PLM-TX-011", zoneId: "peelamedu", name: "Peelamedu 011", position: { lat: 11.0287, lng: 76.9924 }, health: 96, state: "healthy", coverage: "1,410 services", voltage: "416 V", load: "59%", temperature: "0°C", powerFactor: "0.96", heartbeat: "0.7 sec", lastUpdate: "10:42:08 IST" },
  { id: "PLM-TX-024", zoneId: "peelamedu", name: "Airport Corridor 024", position: { lat: 11.0376, lng: 77.0064 }, health: 73, state: "fault", coverage: "1,680 services", voltage: "401 V", load: "88%", temperature: "0°C", powerFactor: "0.87", heartbeat: "0.9 sec", lastUpdate: "10:41:47 IST", issue: "Overload and voltage deviation" },
  { id: "PLM-TX-037", zoneId: "peelamedu", name: "Hopes College 037", position: { lat: 11.0187, lng: 76.9838 }, health: 90, state: "healthy", coverage: "920 services", voltage: "413 V", load: "70%", temperature: "0°C", powerFactor: "0.93", heartbeat: "1.0 sec", lastUpdate: "10:41:59 IST" },
  { id: "SNG-TX-004", zoneId: "singanallur", name: "Singanallur 004", position: { lat: 11.0022, lng: 77.0316 }, health: 94, state: "healthy", coverage: "1,100 services", voltage: "415 V", load: "62%", temperature: "0°C", powerFactor: "0.95", heartbeat: "0.8 sec", lastUpdate: "10:42:10 IST" },
  { id: "SNG-TX-021", zoneId: "singanallur", name: "Ondipudur Link 021", position: { lat: 10.9901, lng: 77.0413 }, health: 82, state: "watch", coverage: "1,020 services", voltage: "408 V", load: "80%", temperature: "0°C", powerFactor: "0.90", heartbeat: "1.1 sec", lastUpdate: "10:41:51 IST", issue: "Loading threshold approaching" },
  { id: "SNG-TX-033", zoneId: "singanallur", name: "Trichy Road 033", position: { lat: 11.0091, lng: 77.0504 }, health: 91, state: "healthy", coverage: "780 services", voltage: "414 V", load: "66%", temperature: "0°C", powerFactor: "0.94", heartbeat: "0.9 sec", lastUpdate: "10:42:04 IST" },
];

export const alerts = [
  { id: "ALT-104", transformerId: "AVD-TX-027", zoneId: "avadi", category: "Loading", severity: "watch" as Severity, status: "Open", title: "Load trend under review", detail: "Feeder loading level operating at peak band.", raisedAt: "10:41 IST" },
  { id: "ALT-105", transformerId: "AMT-TX-008", zoneId: "ambattur", category: "Electrical", severity: "high" as Severity, status: "Open", title: "Low power factor detected", detail: "PF is below the 0.90 operating reference.", raisedAt: "10:42 IST" },
  { id: "ALT-106", transformerId: "AMT-TX-042", zoneId: "ambattur", category: "Loading", severity: "watch" as Severity, status: "Open", title: "Loading threshold approaching", detail: "Load has remained above 80% for the last cycle.", raisedAt: "10:41 IST" },
  { id: "ALT-131", transformerId: "PLM-TX-024", zoneId: "peelamedu", category: "Electrical", severity: "critical" as Severity, status: "Open", title: "Overload and voltage deviation", detail: "Voltage and load have crossed the immediate-review operating band.", raisedAt: "10:43 IST" },
  { id: "ALT-132", transformerId: "RSP-TX-018", zoneId: "rs-puram", category: "Loading", severity: "watch" as Severity, status: "Open", title: "Baseline review scheduled", detail: "Feeder load status under routine monitoring.", raisedAt: "10:42 IST" },
  { id: "ALT-133", transformerId: "SNG-TX-021", zoneId: "singanallur", category: "Loading", severity: "watch" as Severity, status: "Open", title: "Loading threshold approaching", detail: "Load remains at the review threshold.", raisedAt: "10:41 IST" },
];

export const tickets = [
  { id: "TNEB-2026-041", transformerId: "AMT-TX-008", zone: "Ambattur", title: "Review low PF at Industrial Estate", severity: "high" as Severity, status: "Assigned", assignee: "K. Suresh", due: "Today, 14:00", updated: "8 min ago" },
  { id: "TNEB-2026-042", transformerId: "AVD-TX-027", zone: "Avadi", title: "Perform baseline scan", severity: "watch" as Severity, status: "Open", assignee: "Unassigned", due: "Today, 16:30", updated: "12 min ago" },
  { id: "TNEB-2026-037", transformerId: "AMT-TX-042", zone: "Ambattur", title: "Assess loading redistribution", severity: "watch" as Severity, status: "In progress", assignee: "S. Deepa", due: "Tomorrow, 10:00", updated: "24 min ago" },
  { id: "TNEB-2026-046", transformerId: "PLM-TX-024", zone: "Peelamedu", title: "Dispatch overload inspection", severity: "critical" as Severity, status: "Assigned", assignee: "M. Pravin", due: "Today, 13:15", updated: "3 min ago" },
];

export type LoadAction = "Capacity survey" | "Load balancing" | "Feeder augmentation" | "Transformer upgrade";
export type ZoneLoadAnalysis = {
  zoneId: string; cityId: string; sanctionedKva: number; demandHistory: number[]; demandForecast: number[];
  householdGrowth: string; apartmentGrowth: string; commercialGrowth: string; headroom: number; horizon: string; action: LoadAction;
  rationale: string; priority: "Immediate" | "Plan" | "Monitor";
};

/** Illustrative demand-and-capacity planning figures for the demonstration release; not live EB records. */
export const zoneLoadAnalysis: ZoneLoadAnalysis[] = [
  { zoneId: "avadi", cityId: "chennai", sanctionedKva: 520, demandHistory: [318, 342, 371, 402, 438], demandForecast: [471, 503, 536, 572], householdGrowth: "+18%", apartmentGrowth: "+9 blocks", commercialGrowth: "+11%", headroom: 16, horizon: "FY 2028–29", action: "Capacity survey", rationale: "Residential densification is raising evening peak demand along the rail corridor.", priority: "Plan" },
  { zoneId: "ambattur", cityId: "chennai", sanctionedKva: 610, demandHistory: [401, 438, 477, 521, 566], demandForecast: [616, 663, 712, 761], householdGrowth: "+22%", apartmentGrowth: "+13 blocks", commercialGrowth: "+17%", headroom: 7, horizon: "FY 2026–27", action: "Transformer upgrade", rationale: "Industrial and apartment demand will exceed present sanctioned capacity in the next planning cycle.", priority: "Immediate" },
  { zoneId: "rs-puram", cityId: "coimbatore", sanctionedKva: 390, demandHistory: [248, 265, 287, 310, 333], demandForecast: [359, 386, 414, 445], householdGrowth: "+14%", apartmentGrowth: "+5 blocks", commercialGrowth: "+16%", headroom: 15, horizon: "FY 2028–29", action: "Load balancing", rationale: "Central commercial use is growing steadily; redistribute peak demand before asset augmentation.", priority: "Plan" },
  { zoneId: "peelamedu", cityId: "coimbatore", sanctionedKva: 470, demandHistory: [287, 324, 369, 418, 461], demandForecast: [510, 558, 606, 658], householdGrowth: "+25%", apartmentGrowth: "+16 blocks", commercialGrowth: "+21%", headroom: 2, horizon: "FY 2026–27", action: "Transformer upgrade", rationale: "Airport-corridor construction and institutional load are placing the present transformer portfolio at capacity.", priority: "Immediate" },
  { zoneId: "singanallur", cityId: "coimbatore", sanctionedKva: 430, demandHistory: [264, 286, 309, 335, 362], demandForecast: [391, 422, 455, 490], householdGrowth: "+17%", apartmentGrowth: "+7 blocks", commercialGrowth: "+10%", headroom: 16, horizon: "FY 2028–29", action: "Feeder augmentation", rationale: "A rising residential peak can be contained through feeder reinforcement ahead of transformer replacement.", priority: "Plan" },
];

export const technicians = [
  { name: "K. Suresh", zone: "Ambattur", load: "1 active job", availability: "On site" }, { name: "S. Deepa", zone: "Ambattur", load: "2 active jobs", availability: "Available after 13:00" }, { name: "V. Anand", zone: "Avadi", load: "0 active jobs", availability: "Available" }, { name: "M. Pravin", zone: "Coimbatore", load: "1 active job", availability: "Dispatched" }, { name: "R. Gowtham", zone: "Coimbatore", load: "0 active jobs", availability: "Available" },
];

export const getCity = (id: string) => cities.find((city) => city.id === id) ?? cities[0];
export const cityZones = (cityId: string) => zones.filter((zone) => zone.cityId === cityId);
export const getZone = (id: string) => zones.find((zone) => zone.id === id) ?? zones[0];
export const getTransformer = (id: string) => transformers.find((asset) => asset.id === id) ?? transformers[0];
export const zoneTransformers = (zoneId: string) => transformers.filter((asset) => asset.zoneId === zoneId);
export const cityLoadAnalysis = (cityId: string) => zoneLoadAnalysis.filter((item) => item.cityId === cityId);
