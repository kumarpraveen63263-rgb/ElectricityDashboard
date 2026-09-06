import { LockKeyhole, ShieldCheck } from "lucide-react";
import { startLogin } from "@/const";
import { GovEmblem, TnebLogo } from "@/components/Logos";

const govMark = "/gov-logo.png";
const tnebMark = "/tneb-logo.png";

export default function Login() {
  return <div className="login-page"><section className="login-brand"><div className="login-emblem-row"><div className="login-seal"><GovEmblem src={govMark} /></div><div className="login-tneb-mark w-12 h-12"><TnebLogo src={tnebMark} /></div></div><span>Government of Tamil Nadu · Tamil Nadu Electricity Board</span><h1>Transformer<br />Health Command</h1><p>Government control-room access for city, zone and transformer operations.</p><div className="login-trust"><ShieldCheck size={18} /> Role-scoped operational access</div></section><section className="login-panel"><div className="login-panel-inner"><span className="section-label">Employee access</span><h2>Sign in to the control room</h2><p>Use your authorised employee account. Your available cities, zones, transformers and work queues are determined by your assignment.</p><button onClick={() => startLogin()} className="primary-action large"><LockKeyhole size={18} /> Continue with employee sign-in</button><small>Access attempts and ticket actions are recorded in the operational audit trail.</small></div></section></div>;
}
