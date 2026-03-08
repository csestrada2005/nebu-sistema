import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bot, Send, Loader2, Zap, TrendingUp, AlertTriangle, Users,
  BarChart3, DollarSign, Briefcase, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle2, XCircle, Activity, MessageSquare, Sparkles,
  Target, PieChart, ChevronRight, Globe
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCrm } from "@/contexts/CrmContext";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ReactMarkdown from "react-markdown";

/* ──────────────────── Types ──────────────────── */
type RichBlock =
  | { type: "text"; content: string }
  | { type: "projects" }
  | { type: "pipeline" }
  | { type: "kpis" }
  | { type: "alerts" }
  | { type: "forecast" };

interface ChatMessage {
  id: number;
  role: "user" | "novy";
  text: string;
  time: string;
  blocks?: RichBlock[];
}

/* ──────────────────── Quick Commands ──────────────────── */
const QUICK_COMMANDS_ES = [
  { label: "📊 Estado proyectos", cmd: "estado proyectos" },
  { label: "🔔 Alertas", cmd: "alertas y riesgos" },
  { label: "💰 Finanzas", cmd: "resumen financiero" },
  { label: "📈 Pipeline", cmd: "estado pipeline" },
  { label: "📝 Cotización", cmd: "cotización" },
  { label: "⏰ Deadlines", cmd: "deadlines" },
];
const QUICK_COMMANDS_EN = [
  { label: "📊 Project status", cmd: "project status" },
  { label: "🔔 Alerts", cmd: "alerts and risks" },
  { label: "💰 Finances", cmd: "financial summary" },
  { label: "📈 Pipeline", cmd: "pipeline status" },
  { label: "📝 Quote", cmd: "quote" },
  { label: "⏰ Deadlines", cmd: "deadlines" },
];

/* ──────────────────── Rich Visual Components ──────────────────── */

const ProjectCards = ({ lang }: { lang: "es" | "en" }) => {
  const { state } = useCrm();
  const statusColors: Record<string, string> = {
    activo: "hsl(var(--primary))",
    revisión: "#f59e0b",
    completado: "#22c55e",
    pausado: "#6b7280",
  };
  const statusLabels: Record<string, Record<string, string>> = {
    activo: { es: "Activo", en: "Active" },
    revisión: { es: "En revisión", en: "In review" },
    completado: { es: "Completado", en: "Completed" },
    pausado: { es: "Pausado", en: "Paused" },
  };
  return (
    <div className="grid gap-3 mt-2">
      {state.projects.map((p) => (
        <div key={p.id} className="rounded-lg border border-border bg-card p-4 hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Briefcase size={14} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">{p.cliente}</span>
              <span className="text-xs text-muted-foreground">({p.id})</span>
            </div>
            <Badge variant="outline" className="text-[10px] border-0 px-2 py-0.5" style={{ backgroundColor: `${statusColors[p.estado]}15`, color: statusColors[p.estado] }}>
              {statusLabels[p.estado]?.[lang] || p.estado}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-3">{p.servicio} · {p.responsable}</p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground">Funnel {p.pasoFunnel}/12</span>
                <span className="text-[10px] text-primary font-medium">{Math.round((p.pasoFunnel / 12) * 100)}%</span>
              </div>
              <Progress value={(p.pasoFunnel / 12) * 100} className="h-1.5" />
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-foreground">${p.precio.toLocaleString()}</span>
              <span className="text-[10px] text-muted-foreground block">{lang === "es" ? "Entrega" : "Due"}: {p.entregaEst}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const PipelineView = ({ lang }: { lang: "es" | "en" }) => {
  const { state } = useCrm();
  const stageLabels: Record<string, Record<string, string>> = {
    prospecto: { es: "Prospecto", en: "Prospect" },
    contacto: { es: "Contacto", en: "Contact" },
    propuesta: { es: "Propuesta", en: "Proposal" },
    cerrado: { es: "Cerrado", en: "Closed" },
  };
  const stageColors: Record<string, string> = {
    prospecto: "#3b82f6",
    contacto: "#f59e0b",
    propuesta: "#8b5cf6",
    cerrado: "#22c55e",
  };
  const stages = ["prospecto", "contacto", "propuesta", "cerrado"] as const;
  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      {stages.map((stage) => {
        const leads = state.leads.filter((l) => l.etapa === stage);
        const total = leads.reduce((s, l) => s + l.precio, 0);
        return (
          <div key={stage} className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stageColors[stage] }} />
              <span className="text-xs font-semibold text-foreground">{stageLabels[stage][lang]}</span>
              <span className="text-[10px] text-muted-foreground ml-auto">{leads.length}</span>
            </div>
            {leads.map((l) => (
              <div key={l.id} className="flex items-center justify-between py-1.5 border-t border-border">
                <span className="text-xs text-foreground">{l.nombre}</span>
                <span className="text-[10px] text-muted-foreground">${l.precio.toLocaleString()}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-border mt-1">
              <span className="text-xs font-bold text-foreground">${total.toLocaleString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const KPICards = ({ lang }: { lang: "es" | "en" }) => {
  const { state } = useCrm();
  const totalRevenue = state.projects.reduce((s, p) => s + p.precio, 0);
  const pipelineValue = state.leads.reduce((s, l) => s + l.precio, 0);
  const kpis = [
    {
      icon: DollarSign,
      label: lang === "es" ? "Ingresos proyectos" : "Project revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "+12%",
      up: true,
    },
    {
      icon: Target,
      label: "Pipeline",
      value: `$${pipelineValue.toLocaleString()}`,
      change: `${state.leads.length} leads`,
      up: true,
    },
    {
      icon: Briefcase,
      label: lang === "es" ? "Proyectos activos" : "Active projects",
      value: String(state.projects.filter((p) => p.estado === "activo").length),
      change: lang === "es" ? "en curso" : "in progress",
      up: true,
    },
    {
      icon: Activity,
      label: lang === "es" ? "Tasa cierre" : "Close rate",
      value: "68%",
      change: "+5%",
      up: true,
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      {kpis.map((kpi, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <kpi.icon size={14} className="text-primary" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-lg font-bold text-foreground">{kpi.value}</span>
            <span className={`text-[10px] flex items-center gap-0.5 ${kpi.up ? "text-green-500" : "text-red-500"}`}>
              {kpi.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              {kpi.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const AlertsPanel = ({ lang }: { lang: "es" | "en" }) => {
  const alerts = lang === "es"
    ? [
        { level: "high", text: "Papachoa — Deadline vencido (10 Feb). Contactar a Miriam.", icon: AlertTriangle },
        { level: "high", text: "Bazar Centenario — Saldo pendiente $12,500. Iñigo espera update.", icon: DollarSign },
        { level: "medium", text: "Raw Paw — En revisión cliente. Sin respuesta hace 3 días.", icon: Clock },
        { level: "low", text: "Café Ritual — Prospecto nuevo. Hacer seguimiento esta semana.", icon: Users },
      ]
    : [
        { level: "high", text: "Papachoa — Deadline overdue (Feb 10). Contact Miriam.", icon: AlertTriangle },
        { level: "high", text: "Bazar Centenario — Pending balance $12,500. Iñigo awaiting update.", icon: DollarSign },
        { level: "medium", text: "Raw Paw — In client review. No response for 3 days.", icon: Clock },
        { level: "low", text: "Café Ritual — New prospect. Follow up this week.", icon: Users },
      ];
  const levelColors: Record<string, string> = {
    high: "hsl(var(--destructive))",
    medium: "#f59e0b",
    low: "#3b82f6",
  };
  return (
    <div className="space-y-2 mt-2">
      {alerts.map((a, i) => (
        <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
          <a.icon size={14} className="mt-0.5 shrink-0" style={{ color: levelColors[a.level] }} />
          <span className="text-xs text-foreground leading-relaxed">{a.text}</span>
          <div className="ml-auto w-2 h-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: levelColors[a.level] }} />
        </div>
      ))}
    </div>
  );
};

/* ──────────────────── NOVY Smart Reply (pattern matching for visual blocks) ──────────────────── */
function generateSmartReply(input: string, lang: "es" | "en"): ChatMessage {
  const lower = input.toLowerCase();
  const time = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  const base = { id: Date.now() + 1, role: "novy" as const, time };

  if (lower.includes("estado") || lower.includes("proyecto") || lower.includes("project") || lower.includes("status")) {
    return {
      ...base,
      text: lang === "es"
        ? "Aquí tienes el estado actual de todos los proyectos:"
        : "Here's the current status of all projects:",
      blocks: [{ type: "projects" }],
    };
  }
  if (lower.includes("pipeline") || lower.includes("lead") || lower.includes("ventas") || lower.includes("sales")) {
    return {
      ...base,
      text: lang === "es"
        ? "Este es el estado actual del pipeline de ventas:"
        : "Here's the current sales pipeline:",
      blocks: [{ type: "pipeline" }],
    };
  }
  if (lower.includes("finanz") || lower.includes("financ") || lower.includes("ingreso") || lower.includes("revenue") || lower.includes("kpi")) {
    return {
      ...base,
      text: lang === "es"
        ? "Resumen financiero y KPIs del negocio:"
        : "Financial summary and business KPIs:",
      blocks: [{ type: "kpis" }],
    };
  }
  if (lower.includes("alerta") || lower.includes("riesgo") || lower.includes("alert") || lower.includes("risk") || lower.includes("deadline")) {
    return {
      ...base,
      text: lang === "es"
        ? "⚠ Alertas y riesgos activos que requieren tu atención:"
        : "⚠ Active alerts and risks requiring your attention:",
      blocks: [{ type: "alerts" }],
    };
  }
  if (lower.includes("cotiza") || lower.includes("quote")) {
    return {
      ...base,
      text: lang === "es"
        ? "Para generar una cotización necesito:\n— **Nombre del cliente**\n— **Servicio** (Landing, E-commerce, Branding, Web App, etc.)\n— **Detalles adicionales** (funcionalidades, urgencia)\n\n¿Me los proporcionas?"
        : "To generate a quote I need:\n— **Client name**\n— **Service** (Landing, E-commerce, Branding, Web App, etc.)\n— **Additional details** (features, urgency)\n\nCan you provide them?",
    };
  }
  if (lower.includes("resumen") || lower.includes("summary") || lower.includes("general") || lower.includes("todo") || lower.includes("overview")) {
    return {
      ...base,
      text: lang === "es"
        ? "Resumen general del CRM — aquí tienes la vista completa:"
        : "CRM overview — here's the full picture:",
      blocks: [{ type: "kpis" }, { type: "alerts" }, { type: "projects" }],
    };
  }

  // Default: connect to edge function later
  return {
    ...base,
    text: lang === "es"
      ? "Entendido. Procesando tu solicitud...\n\nEsta funcionalidad se conectará al backend de IA próximamente. Por ahora, prueba los comandos rápidos para ver respuestas visuales."
      : "Got it. Processing your request...\n\nThis feature will connect to the AI backend soon. For now, try the quick commands for visual responses.",
  };
}

/* ──────────────────── Main Component ──────────────────── */
const NovyPage = () => {
  const { lang } = useLanguage();
  const { state, buildContextSummary } = useCrm();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const welcomeMsg: ChatMessage = {
    id: 0,
    role: "novy",
    time: "—",
    text: lang === "es"
      ? "Soy **NOVY**, tu centro de comando. Pregúntame cualquier cosa sobre tus proyectos, pipeline, finanzas o alertas. Usa los comandos rápidos o escribe en lenguaje natural."
      : "I'm **NOVY**, your command center. Ask me anything about your projects, pipeline, finances, or alerts. Use quick commands or type in natural language.",
    blocks: [{ type: "kpis" }, { type: "alerts" }],
  };

  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMsg]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickCmds = lang === "es" ? QUICK_COMMANDS_ES : QUICK_COMMANDS_EN;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const time = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
      const userMsg: ChatMessage = { id: Date.now(), role: "user", text, time };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      setTimeout(() => {
        const reply = generateSmartReply(text, lang);
        setMessages((prev) => [...prev, reply]);
        setIsTyping(false);
      }, 800 + Math.random() * 600);
    },
    [lang]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Live stats
  const activeProjects = state.projects.filter((p) => p.estado === "activo").length;
  const totalRevenue = state.projects.reduce((s, p) => s + p.precio, 0);
  const overdueCount = 2; // mock

  const tt = {
    es: {
      title: "NOVY",
      subtitle: "Centro de Comando · IA",
      online: "En línea",
      projects: "Proyectos",
      revenue: "Ingresos",
      alerts: "Alertas",
      placeholder: "Escribe un comando o pregunta...",
      quickLabel: "Comandos rápidos",
    },
    en: {
      title: "NOVY",
      subtitle: "Command Center · AI",
      online: "Online",
      projects: "Projects",
      revenue: "Revenue",
      alerts: "Alerts",
      placeholder: "Type a command or question...",
      quickLabel: "Quick commands",
    },
  }[lang];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* ──── Header ──── */}
      <div className="flex items-center justify-between px-1 pb-4 border-b border-border shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
              <Bot size={24} className="text-primary" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground tracking-tight">{tt.title}</h1>
              <Sparkles size={14} className="text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">{tt.subtitle} · <span className="text-green-500">{tt.online}</span></p>
          </div>
        </div>

        {/* Mini stats */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-lg font-bold text-foreground">{activeProjects}</span>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{tt.projects}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <span className="text-lg font-bold text-foreground">${(totalRevenue / 1000).toFixed(0)}k</span>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{tt.revenue}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <span className="text-lg font-bold text-destructive">{overdueCount}</span>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{tt.alerts}</p>
          </div>
        </div>
      </div>

      {/* ──── Chat Area ──── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-4 min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] ${msg.role === "user" ? "" : "flex items-start gap-3"}`}>
              {msg.role === "novy" && (
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <Bot size={14} className="text-primary" />
                </div>
              )}
              <div>
                <div
                  className={`text-sm leading-relaxed rounded-xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>

                {/* Rich blocks */}
                {msg.blocks?.map((block, bi) => (
                  <div key={bi} className="mt-2">
                    {block.type === "projects" && <ProjectCards lang={lang} />}
                    {block.type === "pipeline" && <PipelineView lang={lang} />}
                    {block.type === "kpis" && <KPICards lang={lang} />}
                    {block.type === "alerts" && <AlertsPanel lang={lang} />}
                  </div>
                ))}

                <span className="text-[10px] text-muted-foreground mt-1 block">{msg.time}</span>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Bot size={14} className="text-primary" />
            </div>
            <div className="bg-card border border-border rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ──── Quick Commands ──── */}
      <div className="shrink-0 pb-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">{tt.quickLabel}</p>
        <div className="flex flex-wrap gap-1.5">
          {quickCmds.map((cmd) => (
            <button
              key={cmd.cmd}
              onClick={() => sendMessage(cmd.cmd)}
              className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              {cmd.label}
            </button>
          ))}
        </div>
      </div>

      {/* ──── Input ──── */}
      <form onSubmit={handleSubmit} className="shrink-0 flex items-center gap-2 pt-3 border-t border-border">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tt.placeholder}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            disabled={isTyping}
          />
        </div>
        <button
          type="submit"
          disabled={isTyping || !input.trim()}
          className="w-11 h-11 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-30 flex items-center justify-center transition-all"
        >
          <Send size={16} className="text-primary-foreground" />
        </button>
      </form>
    </div>
  );
};

export default NovyPage;
