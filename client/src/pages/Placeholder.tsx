/** Design philosophy: Maintain a complete shell and an explicit route destination for planned government dashboard modules. */
import { ClipboardCheck, Construction } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";

export default function Placeholder({ kind }: { kind: "Reports & audit" | "Operations guide" }) {
  const icon = kind === "Reports & audit" ? <ClipboardCheck size={26} /> : <Construction size={26} />;
  return <DashboardShell eyebrow="TNEB / SOUTH ZONE / CONTROL ROOM" title={kind}><section className="placeholder-panel"><div className="placeholder-icon">{icon}</div><span className="eyebrow">Dashboard module</span><h2>{kind} workspace</h2><p>This page is reserved in the information architecture so audit evidence and operator guidance remain accessible from the same command environment.</p><span className="status-tag watch">Planned module</span></section></DashboardShell>;
}
