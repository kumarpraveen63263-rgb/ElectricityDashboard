import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Route, Switch } from "wouter";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Zones from "./pages/Zones";
import Transformers from "./pages/Transformers";
import Tickets from "./pages/Tickets";
import Assignments from "./pages/Assignments";
import Alerts from "./pages/Alerts";
import LoadAnalysis from "./pages/LoadAnalysis";

function Router() { return <Switch><Route path="/login" component={Login} /><Route path="/" component={Home} /><Route path="/zones" component={Zones} /><Route path="/transformers" component={Transformers} /><Route path="/tickets" component={Tickets} /><Route path="/assignments" component={Assignments} /><Route path="/alerts" component={Alerts} /><Route path="/load-analysis" component={LoadAnalysis} /><Route path="/reports" component={LoadAnalysis} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
