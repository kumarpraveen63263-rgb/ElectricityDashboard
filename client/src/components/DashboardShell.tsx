/**
 * Design philosophy: Civic Command Centre — institutional navy, gold authority accents,
 * and a persistent operations rail so the user always retains location and system context.
 */
import { Link, useLocation } from "wouter";
import {
  Activity,
  AlertTriangle,
  Bell,
  ChevronDown,
  CircleHelp,
  FileText,
  LayoutDashboard,
  MapPinned,
  PanelLeftClose,
  RadioTower,
  Search,
  ShieldCheck,
  LocateFixed,
} from "lucide-react";
import { toast } from "sonner";
import type { ComponentType, ReactNode } from "react";
import { GovEmblem, TnebLogo } from "@/components/Logos";

const governmentEmblem = "/gov-logo.png";
const productMark = "/tneb-logo.png";

type NavItem = {
  href: string;
  label: string;
  Icon: ComponentType<{ size?: number; strokeWidth?: number }>;
};

const primaryNav: NavItem[] = [
  { href: "/", label: "Situation map", Icon: LayoutDashboard },
  { href: "/monitor", label: "Zone monitor", Icon: LocateFixed },
  { href: "/network", label: "Coverage register", Icon: MapPinned },
  { href: "/alerts", label: "Alert ledger", Icon: AlertTriangle },
];

const secondaryNav: NavItem[] = [
  { href: "/reports", label: "Reports & audit", Icon: FileText },
  { href: "/help", label: "Operations guide", Icon: CircleHelp },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const { Icon } = item;
  return (
    <Link href={item.href} className={`nav-link ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined}>
      <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
      <span>{item.label}</span>
      {item.label === "Alert ledger" && <span className="nav-count">3</span>}
    </Link>
  );
}

export default function DashboardShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  const [location] = useLocation();
  const activePath = location === "/" ? "/" : location.split("/").slice(0, 2).join("/");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="side-brand">
          <div className="emblem-wrap">
            <GovEmblem src={governmentEmblem} />
          </div>
          <div>
            <span className="side-kicker">Government of Tamil Nadu</span>
            <strong>Energy Department</strong>
          </div>
        </div>

        <div className="department-mark">
          <div className="department-bolt">ϟ</div>
          <div>
            <span>TNEB</span>
            <small>Tamil Nadu Electricity Board</small>
          </div>
        </div>

        <nav className="side-nav" aria-label="Dashboard navigation">
          <span className="nav-section-label">Operations</span>
          {primaryNav.map((item) => (
            <NavLink key={item.href} item={item} active={activePath === item.href} />
          ))}
          <span className="nav-section-label nav-section-lower">Records</span>
          {secondaryNav.map((item) => (
            <NavLink key={item.href} item={item} active={activePath === item.href} />
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="network-health"><span className="status-dot live" />Secure telemetry bridge</div>
          <p>Monitoring prototype<br />v2.0 · South Zone</p>
        </div>
      </aside>

      <main className="main-canvas">
        <header className="masthead">
          <div className="masthead-title">
            <div className="product-mark"><TnebLogo src={productMark} /></div>
            <div>
              <div className="eyebrow">{eyebrow}</div>
              <h1>{title}</h1>
            </div>
          </div>
          <div className="masthead-tools">
            <div className="simulation-chip"><ShieldCheck size={15} /> Live operations view</div>
            <button className="icon-button" aria-label="Search dashboard"><Search size={18} /></button>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => toast.warning("3 active fault notices require review", { description: "Avadi: 1 · Ambattur: 2" })}><Bell size={18} /><span /></button>
            <button className="operator-button" aria-label="Open operator menu">
              <span className="operator-initial">RK</span>
              <span className="operator-name">R. Kannan<small>Shift Engineer</small></span>
              <ChevronDown size={15} />
            </button>
          </div>
        </header>

        <div className="system-ribbon">
          <div><RadioTower size={16} /><span>Telemetry</span><strong>Live · 02 sec</strong></div>
          <i />
          <div><Activity size={16} /><span>Zone health</span><strong className="text-jade">Stable</strong></div>
          <i />
          <div><PanelLeftClose size={16} /><span>Zones online</span><strong>Avadi · Ambattur</strong></div>
          <i />
          <div><AlertTriangle size={16} /><span>Open alerts</span><strong className="text-amber">03</strong></div>
        </div>

        <section className="page-content">{children}</section>
      </main>
    </div>
  );
}
