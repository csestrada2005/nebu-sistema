import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bot, Send, TrendingUp, AlertTriangle, Users, BarChart3, DollarSign,
  Briefcase, ArrowUpRight, Clock, Activity, Sparkles, Target, Plus,
  MessageSquare, Paperclip, CheckCircle2, Zap, FileText, ChevronRight,
  ExternalLink
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCrm } from "@/contexts/CrmContext";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ReactMarkdown from "react-markdown";

/* ══════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════ */
type RichBlockType = "executive-summary" | "client-registered" | "linkedin-metrics" | "automation-created" | "quote-generated" | "forecast";

interface RichBlock {
  type: RichBlockType;
  data?: Record<string, unknown>;
}

interface ChatMessage {
  id: number;
  role: "user" | "novy";
  text: string;
  time: string;
  blocks?: RichBlock[];
  actions?: { label: string; icon?: React.ReactNode }[];
}

interface Conversation {
  id: string;
  title: string;
  date: string;
  active?: boolean;
}

/* ══════════════════════════════════════════════
   CONVERSATION HISTORY (sidebar)
   ══════════════════════════════════════════════ */
const CONVERSATIONS: Conversation[] = [
  { id: "today", title: "Sesión CRM completa", date: "Hoy", active: true },
  { id: "yesterday", title: "Cotización Estudio Legal Vega", date: "Ayer" },
  { id: "mar7", title: "Follow-up LinkedIn Q1", date: "07 Mar" },
  { id: "mar6", title: "Reporte semanal ventas", date: "06 Mar" },
  { id: "mar5", title: "Setup automatización emails", date: "05 Mar" },
  { id: "mar3", title: "Análisis web Papachoa", date: "03 Mar" },
  { id: "feb28", title: "Revisión pipeline febrero", date: "28 Feb" },
  { id: "feb25", title: "Onboarding Raw Paw", date: "25 Feb" },
];

/* ══════════════════════════════════════════════
   RICH VISUAL CARD COMPONENTS
   ══════════════════════════════════════════════ */

/* Card 1: Executive Summary */
const ExecutiveSummaryCard = () => {
  const kpis = [
    { icon: Users, label: "Prospectos activos", value: "5", color: "text-blue-400" },
    { icon: DollarSign, label: "Pipeline", value: "$127,500 MXN", color: "text-primary" },
    { icon: AlertTriangle, label: "Proyectos en riesgo", value: "2", color: "text-destructive" },
    { icon: Clock, label: "Tareas pendientes", value: "7", color: "text-yellow-500" },
  ];
  const alerts = [
    { text: "PAPACHOA — Deadline vencido desde 10 Feb. Sin respuesta de Miriam.", level: "high" },
    { text: "BAZAR CENTENARIO — Deadline 23 Feb superado. Saldo pendiente $12,500.", level: "high" },
  ];
  const wins = [
    "RAWPAW — Entregado y en revisión cliente. Mantenimiento activo.",
    "3 mensajes LinkedIn enviados con 2 respuestas positivas.",
  ];
  return (
    <div className="mt-2 rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-primary/5 flex items-center gap-2">
        <Sparkles size={16} className="text-primary" />
        <span className="text-sm font-bold text-foreground">RESUMEN EJECUTIVO — 09/03/2026</span>
      </div>
      <div className="grid grid-cols-2 gap-2 p-4">
        {kpis.map((k, i) => (
          <div key={i} className="rounded-lg border border-border bg-secondary/50 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <k.icon size={12} className={k.color} />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{k.label}</span>
            </div>
            <span className="text-base font-bold text-foreground">{k.value}</span>
          </div>
        ))}
      </div>
      <div className="px-4 pb-3">
        <p className="text-[10px] text-destructive font-semibold uppercase tracking-wider mb-2">⚠️ Requiere atención</p>
        {alerts.map((a, i) => (
          <div key={i} className="flex items-start gap-2 mb-2">
            <AlertTriangle size={12} className="text-destructive shrink-0 mt-0.5" />
            <span className="text-xs text-foreground">{a.text}</span>
          </div>
        ))}
      </div>
      <div className="px-4 pb-3">
        <p className="text-[10px] text-green-500 font-semibold uppercase tracking-wider mb-2">✅ Logros del día</p>
        {wins.map((w, i) => (
          <div key={i} className="flex items-start gap-2 mb-2">
            <CheckCircle2 size={12} className="text-green-500 shrink-0 mt-0.5" />
            <span className="text-xs text-foreground">{w}</span>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-border flex gap-2 flex-wrap">
        <ActionBtn label="Ver Pipeline completo" />
        <ActionBtn label="Ir a Proyectos" />
        <ActionBtn label="Ver Finanzas" />
      </div>
    </div>
  );
};

/* Card 2: Client Registered */
const ClientRegisteredCard = () => (
  <div className="mt-2 rounded-xl border border-border bg-card overflow-hidden">
    <div className="px-4 py-3 border-b border-border bg-green-500/5 flex items-center gap-2">
      <CheckCircle2 size={16} className="text-green-500" />
      <span className="text-sm font-bold text-foreground">✅ CLIENTE REGISTRADO</span>
    </div>
    <div className="p-4 space-y-3">
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {[
          ["Nombre", "Mario López"],
          ["Empresa", "Restaurante La Barca"],
          ["Teléfono", "55-1234-5678"],
          ["Email", "mario@labarca.mx"],
          ["Servicio", "Sitio web + Menú digital"],
          ["Presupuesto", "$35,000 MXN"],
        ].map(([label, value]) => (
          <div key={label}>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
            <p className="text-xs font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2 pt-1">
        <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-500 bg-green-500/10">Contacto creado</Badge>
        <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-500 bg-green-500/10">Oportunidad creada</Badge>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        He creado el lead, contacto y oportunidad automáticamente. También agenté un recordatorio para follow-up en 3 días.
      </p>
    </div>
    <div className="px-4 py-3 border-t border-border flex gap-2 flex-wrap">
      <ActionBtn label="Ver en Contactos" />
      <ActionBtn label="Ver en Pipeline" />
      <ActionBtn label="Editar datos" />
    </div>
  </div>
);

/* Card 3: LinkedIn Metrics */
const LinkedInMetricsCard = () => {
  const days = [
    { day: "Lun", val: 5, max: 8 },
    { day: "Mar", val: 3, max: 8 },
    { day: "Mié", val: 8, max: 8 },
    { day: "Jue", val: 2, max: 8 },
    { day: "Vie", val: 6, max: 8 },
  ];
  const metrics = [
    { label: "Tasa de conexión", value: "43%", color: "text-blue-400" },
    { label: "Mensajes enviados", value: "18", color: "text-foreground" },
    { label: "Respuestas positivas", value: "6", color: "text-green-500" },
  ];
  return (
    <div className="mt-2 rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-blue-500/5 flex items-center gap-2">
        <BarChart3 size={16} className="text-blue-400" />
        <span className="text-sm font-bold text-foreground">📊 MÉTRICAS LINKEDIN — Semana 09/03/2026</span>
      </div>
      <div className="p-4">
        {/* Bar chart */}
        <div className="flex items-end gap-3 h-24 mb-4">
          {days.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-foreground font-medium">{d.val}</span>
              <div className="w-full rounded-t-md bg-blue-500/20 relative" style={{ height: `${(d.val / d.max) * 100}%` }}>
                <div
                  className="absolute inset-0 rounded-t-md"
                  style={{ background: d.val === d.max ? "linear-gradient(180deg, #3b82f6, #1d4ed8)" : "linear-gradient(180deg, #3b82f680, #3b82f640)" }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {metrics.map((m, i) => (
            <div key={i} className="rounded-lg border border-border bg-secondary/50 p-2 text-center">
              <span className={`text-base font-bold ${m.color}`}>{m.value}</span>
              <p className="text-[10px] text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          💡 Tu mejor día fue miércoles con 8 conexiones. Recomiendo aumentar la actividad los jueves.
        </p>
      </div>
      <div className="px-4 py-3 border-t border-border flex gap-2">
        <ActionBtn label="Ver detalle completo" />
        <ActionBtn label="Ajustar estrategia" />
      </div>
    </div>
  );
};

/* Card 4: Automation Created */
const AutomationCreatedCard = () => {
  const steps = [
    { icon: "📋", label: "Formulario recibido" },
    { icon: "📧", label: "Email bienvenida" },
    { icon: "✅", label: "Tarea follow-up 24h" },
  ];
  return (
    <div className="mt-2 rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-yellow-500/5 flex items-center gap-2">
        <Zap size={16} className="text-yellow-500" />
        <span className="text-sm font-bold text-foreground">⚡ AUTOMATIZACIÓN CREADA</span>
      </div>
      <div className="p-4">
        {/* Flow steps with arrows */}
        <div className="flex items-center justify-between gap-1 mb-4">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-1 flex-1">
              <div className="flex-1 rounded-lg border border-border bg-secondary/50 p-3 text-center">
                <span className="text-lg block mb-1">{s.icon}</span>
                <span className="text-[10px] text-foreground font-medium">{s.label}</span>
              </div>
              {i < steps.length - 1 && <ChevronRight size={14} className="text-muted-foreground shrink-0" />}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-500 bg-green-500/10">🟢 Activa</Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Automatización configurada. Usará la plantilla "Bienvenida Nebu Studio" para el email.
        </p>
      </div>
      <div className="px-4 py-3 border-t border-border flex gap-2 flex-wrap">
        <ActionBtn label="Editar flujo" />
        <ActionBtn label="Ver en Automatizaciones" />
        <ActionBtn label="Pausar" variant="muted" />
      </div>
    </div>
  );
};

/* Card 5: Quote Generated */
const QuoteGeneratedCard = () => {
  const items = [
    { name: "Diseño UI/UX", price: "$12,000" },
    { name: "Desarrollo Frontend", price: "$18,000" },
    { name: "Backend + CMS", price: "$15,000" },
    { name: "Integración pagos", price: "$8,000" },
  ];
  return (
    <div className="mt-2 rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-primary/5 flex items-center gap-2">
        <FileText size={16} className="text-primary" />
        <span className="text-sm font-bold text-foreground">📄 COTIZACIÓN GENERADA</span>
      </div>
      <div className="p-4">
        <div className="rounded-lg border border-border overflow-hidden mb-3">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-secondary/50">
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Concepto</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">Precio</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-3 py-2 text-foreground">{it.name}</td>
                  <td className="px-3 py-2 text-foreground text-right">{it.price}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-primary/30 bg-primary/5">
                <td className="px-3 py-2 font-bold text-foreground">Total</td>
                <td className="px-3 py-2 font-bold text-primary text-right">$53,000 MXN</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Cotización basada en la plantilla E-commerce Standard. Incluye 3 revisiones y soporte 30 días.
        </p>
      </div>
      <div className="px-4 py-3 border-t border-border flex gap-2 flex-wrap">
        <ActionBtn label="Descargar PDF" primary />
        <ActionBtn label="Enviar al cliente" />
        <ActionBtn label="Editar cotización" />
      </div>
    </div>
  );
};

/* Card 6: Forecast (reused from before) */
const ForecastCard = () => {
  const pct = 63.75;
  const rows = [
    { label: "Cerrado", value: "$85,000", color: "#22c55e" },
    { label: "En negociación", value: "$42,500", color: "#f59e0b" },
    { label: "Proyección cierre", value: "$155,000", color: "#3b82f6" },
  ];
  return (
    <div className="mt-2 rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-primary/5 flex items-center gap-2">
        <TrendingUp size={16} className="text-primary" />
        <span className="text-sm font-bold text-foreground">📈 FORECAST Q1 2026</span>
      </div>
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-end justify-between mb-1">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Meta trimestral</p>
            <span className="text-2xl font-bold text-foreground">$200,000</span>
            <span className="text-xs text-muted-foreground ml-1">MXN</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Actual</p>
            <span className="text-lg font-bold text-primary">$127,500</span>
            <span className="text-xs text-muted-foreground ml-1">(63.75%)</span>
          </div>
        </div>
        <div className="w-full h-3 rounded-full bg-secondary mt-2 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--destructive)))" }} />
        </div>
      </div>
      <div className="px-4 py-3 space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
              <span className="text-xs text-muted-foreground">{r.label}</span>
            </div>
            <span className="text-xs font-semibold text-foreground">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-border bg-primary/5">
        <p className="text-xs text-foreground leading-relaxed">
          💡 Vas al 63.75% de tu meta trimestral. Si cierras Estudio Legal Vega ($55,000) y Restaurante La Barca ($35,000) alcanzas el 87.5%.
        </p>
      </div>
      <div className="px-4 py-3 border-t border-border flex gap-2">
        <ActionBtn label="Ver Forecast completo" />
        <ActionBtn label="Ajustar meta" />
      </div>
    </div>
  );
};

/* Shared action button */
const ActionBtn = ({ label, primary, variant }: { label: string; primary?: boolean; variant?: "muted" }) => (
  <button className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
    primary
      ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
      : variant === "muted"
        ? "border-border text-muted-foreground hover:text-foreground"
        : "border-primary/20 text-primary/80 hover:bg-primary/10 hover:text-primary"
  }`}>
    {label}
  </button>
);

/* ══════════════════════════════════════════════
   MOCK CONVERSATION (full CRM demo session)
   ══════════════════════════════════════════════ */
const MOCK_MESSAGES: ChatMessage[] = [
  // 1 — Executive Summary
  { id: 1, role: "user", text: "Resumen ejecutivo de hoy", time: "09:00" },
  { id: 2, role: "novy", text: "Aquí tienes tu resumen ejecutivo del día:", time: "09:00", blocks: [{ type: "executive-summary" }] },

  // 2 — Register Client
  { id: 3, role: "user", text: "Registra nuevo cliente: Restaurante La Barca, contacto Mario López, tel 55-1234-5678, email mario@labarca.mx, interesado en sitio web + menú digital, presupuesto estimado $35,000 MXN", time: "09:05" },
  { id: 4, role: "novy", text: "", time: "09:05", blocks: [{ type: "client-registered" }] },

  // 3 — LinkedIn Metrics
  { id: 5, role: "user", text: "Muéstrame las métricas de LinkedIn de esta semana", time: "09:12" },
  { id: 6, role: "novy", text: "", time: "09:12", blocks: [{ type: "linkedin-metrics" }] },

  // 4 — Automation
  { id: 7, role: "user", text: "Crea una automatización: cuando un lead llene el formulario de contacto, enviar email de bienvenida y crear tarea de follow-up a 24hrs", time: "09:20" },
  { id: 8, role: "novy", text: "", time: "09:20", blocks: [{ type: "automation-created" }] },

  // 5 — Quote
  { id: 9, role: "user", text: "Genera una plantilla de cotización para sitio web e-commerce", time: "09:28" },
  { id: 10, role: "novy", text: "", time: "09:28", blocks: [{ type: "quote-generated" }] },

  // 6 — Forecast
  { id: 11, role: "user", text: "¿Cómo va el forecast del trimestre?", time: "09:35" },
  { id: 12, role: "novy", text: "", time: "09:35", blocks: [{ type: "forecast" }] },
];

/* Quick commands */
const QUICK_CHIPS = [
  "📊 Resumen del día",
  "➕ Nuevo cliente",
  "📈 Métricas",
  "📋 Tareas pendientes",
  "💰 Forecast",
  "📄 Nueva cotización",
  "⚡ Nueva automatización",
  "📧 Redactar email",
];

/* ══════════════════════════════════════════════
   BLOCK RENDERER
   ══════════════════════════════════════════════ */
const RichBlockRenderer = ({ block }: { block: RichBlock }) => {
  switch (block.type) {
    case "executive-summary": return <ExecutiveSummaryCard />;
    case "client-registered": return <ClientRegisteredCard />;
    case "linkedin-metrics": return <LinkedInMetricsCard />;
    case "automation-created": return <AutomationCreatedCard />;
    case "quote-generated": return <QuoteGeneratedCard />;
    case "forecast": return <ForecastCard />;
    default: return null;
  }
};

/* ══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════ */
const NovyPage = () => {
  const { lang } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isTyping) return;
    const time = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { id: Date.now(), role: "user", text: input, time }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: "novy",
        text: lang === "es"
          ? "Entendido. Procesando tu solicitud — esta funcionalidad se conectará al backend de IA próximamente."
          : "Got it. Processing — this will connect to the AI backend soon.",
        time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
      }]);
      setIsTyping(false);
    }, 1000);
  }, [input, isTyping, lang]);

  const handleNewConversation = () => {
    setMessages([]);
    setConversations(prev => [
      { id: `new-${Date.now()}`, title: lang === "es" ? "Nueva conversación" : "New conversation", date: lang === "es" ? "Ahora" : "Now", active: true },
      ...prev.map(c => ({ ...c, active: false })),
    ]);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] gap-0 -mx-2">
      {/* ─── Sidebar: Conversations ─── */}
      <div className="w-56 shrink-0 border-r border-border flex flex-col">
        <div className="p-3 border-b border-border">
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center gap-2 text-xs font-medium px-3 py-2.5 rounded-lg border border-border bg-card text-foreground hover:bg-primary/5 hover:border-primary/30 transition-all"
          >
            <Plus size={14} />
            {lang === "es" ? "Nueva conversación" : "New conversation"}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: "none" }}>
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                if (c.id === "today") setMessages(MOCK_MESSAGES);
                setConversations(prev => prev.map(x => ({ ...x, active: x.id === c.id })));
              }}
              className={`w-full text-left px-3 py-2.5 text-xs transition-colors ${
                c.active
                  ? "bg-primary/10 text-foreground border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-card hover:text-foreground border-l-2 border-transparent"
              }`}
            >
              <span className="block font-medium truncate">{c.title}</span>
              <span className="text-[10px] text-muted-foreground">{c.date}</span>
            </button>
          ))}
        </div>
        {/* NOVY branding */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Bot size={14} className="text-primary" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">NOVY</span>
              <span className="text-[10px] text-muted-foreground">v1.0 · {lang === "es" ? "En línea" : "Online"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Chat Area ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
                <Bot size={18} className="text-primary" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                NOVY <Sparkles size={12} className="text-primary" />
              </h1>
              <p className="text-[10px] text-muted-foreground">{lang === "es" ? "Centro de Comando CRM · IA" : "CRM Command Center · AI"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            <span><strong className="text-foreground">5</strong> {lang === "es" ? "prospectos" : "prospects"}</span>
            <span><strong className="text-primary">$127.5k</strong> pipeline</span>
            <span><strong className="text-destructive">2</strong> {lang === "es" ? "alertas" : "alerts"}</span>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[90%] ${msg.role === "novy" ? "flex items-start gap-2.5" : ""}`}>
                {msg.role === "novy" && (
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={12} className="text-primary" />
                  </div>
                )}
                <div>
                  {msg.text && (
                    <div className={`text-sm leading-relaxed rounded-xl px-4 py-2.5 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground"
                    }`}>
                      <ReactMarkdown components={{
                        p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      }}>{msg.text}</ReactMarkdown>
                    </div>
                  )}
                  {msg.blocks?.map((block, bi) => (
                    <RichBlockRenderer key={bi} block={block} />
                  ))}
                  <span className="text-[10px] text-muted-foreground mt-1 block">{msg.time}</span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Bot size={12} className="text-primary" />
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

        {/* Quick chips (horizontal scroll) */}
        <div className="px-4 pb-2 shrink-0">
          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  const time = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
                  setMessages(prev => [...prev, { id: Date.now(), role: "user", text: chip, time }]);
                }}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all whitespace-nowrap shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="shrink-0 px-4 pb-3 pt-2 border-t border-border"
        >
          <div className="flex items-end gap-2">
            <button type="button" className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors shrink-0 mb-0.5">
              <Paperclip size={14} />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={lang === "es" ? "Escribe un comando o pregunta a NOVY..." : "Type a command or ask NOVY..."}
                className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none min-h-[42px] max-h-[120px]"
                rows={1}
                disabled={isTyping}
              />
            </div>
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="w-9 h-9 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-30 flex items-center justify-center transition-all shrink-0 mb-0.5"
            >
              <Send size={14} className="text-primary-foreground" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovyPage;
