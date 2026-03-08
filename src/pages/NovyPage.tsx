import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bot, Send, TrendingUp, AlertTriangle, Users, BarChart3, DollarSign,
  Briefcase, Clock, Sparkles, Plus, Paperclip, CheckCircle2, Zap,
  FileText, ChevronRight, History, PanelLeftClose
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCrm } from "@/contexts/CrmContext";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

/* ══════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════ */
type RichBlockType = "executive-summary" | "client-registered" | "linkedin-metrics" | "automation-created" | "quote-generated" | "forecast";

interface RichBlock { type: RichBlockType; }

interface ChatMessage {
  id: number;
  role: "user" | "novy";
  text: string;
  time: string;
  blocks?: RichBlock[];
}

interface ConversationItem { id: string; title: string; }
interface ConversationGroup { label: string; items: ConversationItem[]; }

/* ══════════════════════════════════════════════════════
   HISTORY SIDEBAR DATA
   ══════════════════════════════════════════════════════ */
const HISTORY_GROUPS_ES: ConversationGroup[] = [
  { label: "Hoy", items: [
    { id: "today-1", title: "Resumen ejecutivo y nuevos clientes" },
    { id: "today-2", title: "Métricas LinkedIn semanal" },
  ]},
  { label: "Ayer", items: [
    { id: "yday-1", title: "Follow-up Papachoa" },
    { id: "yday-2", title: "Cotización Bazar Centenario" },
  ]},
  { label: "Esta semana", items: [
    { id: "week-1", title: "Configuración automatizaciones" },
    { id: "week-2", title: "Reporte mensual Febrero" },
  ]},
];
const HISTORY_GROUPS_EN: ConversationGroup[] = [
  { label: "Today", items: [
    { id: "today-1", title: "Executive summary & new clients" },
    { id: "today-2", title: "Weekly LinkedIn metrics" },
  ]},
  { label: "Yesterday", items: [
    { id: "yday-1", title: "Papachoa follow-up" },
    { id: "yday-2", title: "Bazar Centenario quote" },
  ]},
  { label: "This week", items: [
    { id: "week-1", title: "Automation setup" },
    { id: "week-2", title: "February monthly report" },
  ]},
];

/* ══════════════════════════════════════════════════════
   SHARED ACTION BUTTON (red outline, hover solid)
   ══════════════════════════════════════════════════════ */
const ActionBtn = ({ label, primary }: { label: string; primary?: boolean }) => (
  <button className={`text-xs px-3.5 py-1.5 rounded-lg border font-medium transition-all duration-200 ${
    primary
      ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
      : "border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary"
  }`}>
    {label}
  </button>
);

/* ══════════════════════════════════════════════════════
   RICH CARD COMPONENTS
   ══════════════════════════════════════════════════════ */

/* Card 1: Executive Summary */
const ExecutiveSummaryCard = ({ lang }: { lang: "es" | "en" }) => {
  const kpis = [
    { icon: Users, label: lang === "es" ? "Prospectos activos" : "Active prospects", value: "5" },
    { icon: DollarSign, label: "Pipeline", value: "$127,500 MXN" },
    { icon: AlertTriangle, label: lang === "es" ? "Proyectos en riesgo" : "At-risk projects", value: "2" },
    { icon: Clock, label: lang === "es" ? "Tareas pendientes" : "Pending tasks", value: "7" },
  ];
  const alerts = lang === "es"
    ? ["PAPACHOA — Deadline vencido desde 10 Feb. Sin respuesta de Miriam.", "BAZAR CENTENARIO — Deadline 23 Feb superado. Saldo pendiente $12,500."]
    : ["PAPACHOA — Deadline overdue since Feb 10. No response from Miriam.", "BAZAR CENTENARIO — Feb 23 deadline passed. Pending balance $12,500."];
  const wins = lang === "es"
    ? ["RAWPAW — Entregado y en revisión cliente. Mantenimiento activo.", "3 mensajes LinkedIn enviados con 2 respuestas positivas."]
    : ["RAWPAW — Delivered and in client review. Active maintenance.", "3 LinkedIn messages sent with 2 positive responses."];
  const actionLabels = lang === "es"
    ? ["Ver Pipeline completo", "Ir a Proyectos", "Ver Finanzas"]
    : ["View full Pipeline", "Go to Projects", "View Finances"];
  return (
    <div className="mt-3 rounded-2xl border border-border overflow-hidden" style={{ backgroundColor: "#1a1a2e" }}>
      <div className="px-4 py-3 border-b border-border flex items-center gap-2" style={{ background: "linear-gradient(90deg, hsl(var(--primary) / 0.12), transparent)" }}>
        <Sparkles size={15} className="text-primary" />
        <span className="text-sm font-bold text-foreground">{lang === "es" ? "RESUMEN EJECUTIVO — 09/03/2026" : "EXECUTIVE SUMMARY — 03/09/2026"}</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 p-4">
        {kpis.map((k, i) => (
          <div key={i} className="rounded-xl border border-border p-3" style={{ backgroundColor: "#12122280" }}>
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest block mb-1">{k.label}</span>
            <div className="flex items-center gap-2">
              <k.icon size={16} className="text-primary" />
              <span className="text-xl font-extrabold text-foreground">{k.value}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-3">
        <p className="text-[10px] text-destructive font-bold uppercase tracking-widest mb-2">{lang === "es" ? "⚠️ Requiere atención" : "⚠️ Needs attention"}</p>
        {alerts.map((a, i) => (
          <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
            <AlertTriangle size={11} className="text-destructive shrink-0 mt-0.5" />
            <span className="text-xs text-foreground/90">{a}</span>
          </div>
        ))}
      </div>
      <div className="px-4 pb-3">
        <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest mb-2">{lang === "es" ? "✅ Logros del día" : "✅ Today's wins"}</p>
        {wins.map((w, i) => (
          <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
            <CheckCircle2 size={11} className="text-green-500 shrink-0 mt-0.5" />
            <span className="text-xs text-foreground/90">{w}</span>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-border flex gap-2 flex-wrap">
        {actionLabels.map((l) => <ActionBtn key={l} label={l} />)}
      </div>
    </div>
  );
};

/* Card 2: Client Registered */
const ClientRegisteredCard = ({ lang }: { lang: "es" | "en" }) => {
  const fields = lang === "es"
    ? [["Nombre","Mario López"],["Empresa","Restaurante La Barca"],["Teléfono","55-1234-5678"],["Email","mario@labarca.mx"],["Servicio","Sitio web + Menú digital"],["Presupuesto","$35,000 MXN"]]
    : [["Name","Mario López"],["Company","Restaurante La Barca"],["Phone","55-1234-5678"],["Email","mario@labarca.mx"],["Service","Website + Digital menu"],["Budget","$35,000 MXN"]];
  const badges = lang === "es" ? ["Contacto creado", "Oportunidad creada"] : ["Contact created", "Opportunity created"];
  const note = lang === "es"
    ? "He creado el lead, contacto y oportunidad automáticamente. También agenté un recordatorio para follow-up en 3 días."
    : "I've created the lead, contact and opportunity automatically. I also scheduled a follow-up reminder in 3 days.";
  const actions = lang === "es" ? ["Ver en Contactos","Ver en Pipeline","Editar datos"] : ["View in Contacts","View in Pipeline","Edit data"];
  return (
    <div className="mt-3 rounded-2xl border border-border overflow-hidden" style={{ backgroundColor: "#1a1a2e" }}>
      <div className="px-4 py-3 border-b border-border flex items-center gap-2" style={{ background: "linear-gradient(90deg, rgba(34,197,94,0.1), transparent)" }}>
        <CheckCircle2 size={15} className="text-green-500" />
        <span className="text-sm font-bold text-foreground">{lang === "es" ? "✅ CLIENTE REGISTRADO" : "✅ CLIENT REGISTERED"}</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
          {fields.map(([label, value]) => (
            <div key={label}>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest">{label}</span>
              <p className="text-xs font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          {badges.map((b) => <Badge key={b} variant="outline" className="text-[10px] border-green-500/30 text-green-500 bg-green-500/10">{b}</Badge>)}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{note}</p>
      </div>
      <div className="px-4 py-3 border-t border-border flex gap-2 flex-wrap">
        {actions.map((l) => <ActionBtn key={l} label={l} />)}
      </div>
    </div>
  );
};

/* Card 3: LinkedIn Metrics — RED bars */
const LinkedInMetricsCard = ({ lang }: { lang: "es" | "en" }) => {
  const days = [
    { day: lang === "es" ? "Lun" : "Mon", val: 5 },
    { day: lang === "es" ? "Mar" : "Tue", val: 3 },
    { day: lang === "es" ? "Mié" : "Wed", val: 8 },
    { day: lang === "es" ? "Jue" : "Thu", val: 2 },
    { day: lang === "es" ? "Vie" : "Fri", val: 6 },
  ];
  const max = 8;
  const metrics = [
    { label: lang === "es" ? "Tasa de conexión" : "Connection rate", value: "43%" },
    { label: lang === "es" ? "Mensajes enviados" : "Messages sent", value: "18" },
    { label: lang === "es" ? "Respuestas positivas" : "Positive replies", value: "6" },
  ];
  const insight = lang === "es"
    ? "💡 Tu mejor día fue miércoles con 8 conexiones. Recomiendo aumentar la actividad los jueves."
    : "💡 Your best day was Wednesday with 8 connections. I recommend increasing Thursday activity.";
  const actions = lang === "es" ? ["Ver detalle completo","Ajustar estrategia"] : ["View full details","Adjust strategy"];
  return (
    <div className="mt-3 rounded-2xl border border-border overflow-hidden" style={{ backgroundColor: "#1a1a2e" }}>
      <div className="px-4 py-3 border-b border-border flex items-center gap-2" style={{ background: "linear-gradient(90deg, hsl(var(--primary) / 0.1), transparent)" }}>
        <BarChart3 size={15} className="text-primary" />
        <span className="text-sm font-bold text-foreground">{lang === "es" ? "📊 MÉTRICAS LINKEDIN — Semana 09/03/2026" : "📊 LINKEDIN METRICS — Week 03/09/2026"}</span>
      </div>
      <div className="p-4">
        <div className="flex items-end gap-3 h-28 mb-4">
          {days.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[11px] text-foreground font-bold">{d.val}</span>
              <div className="w-full rounded-t-lg overflow-hidden" style={{ height: `${(d.val / max) * 100}%` }}>
                <div className="w-full h-full" style={{
                  background: d.val === max
                    ? "linear-gradient(180deg, hsl(var(--primary)), hsl(var(--destructive)))"
                    : "linear-gradient(180deg, hsl(var(--primary) / 0.7), hsl(var(--primary) / 0.3))"
                }} />
              </div>
              <span className="text-[10px] text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {metrics.map((m, i) => (
            <div key={i} className="rounded-xl border border-border p-2.5 text-center" style={{ backgroundColor: "#12122280" }}>
              <span className="text-lg font-extrabold text-primary block">{m.value}</span>
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest">{m.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{insight}</p>
      </div>
      <div className="px-4 py-3 border-t border-border flex gap-2">
        {actions.map((l) => <ActionBtn key={l} label={l} />)}
      </div>
    </div>
  );
};

/* Card 4: Automation — dot connectors with lines */
const AutomationCreatedCard = ({ lang }: { lang: "es" | "en" }) => {
  const steps = lang === "es"
    ? [{ icon: "📋", label: "Formulario recibido" }, { icon: "📧", label: "Email bienvenida" }, { icon: "✅", label: "Tarea follow-up 24h" }]
    : [{ icon: "📋", label: "Form received" }, { icon: "📧", label: "Welcome email" }, { icon: "✅", label: "Follow-up task 24h" }];
  const note = lang === "es"
    ? 'Automatización configurada. Usará la plantilla "Bienvenida Nebu Studio" para el email.'
    : 'Automation configured. Will use the "Welcome Nebu Studio" template for the email.';
  const actions = lang === "es" ? ["Editar flujo","Ver en Automatizaciones","Pausar"] : ["Edit flow","View in Automations","Pause"];
  return (
    <div className="mt-3 rounded-2xl border border-border overflow-hidden" style={{ backgroundColor: "#1a1a2e" }}>
      <div className="px-4 py-3 border-b border-border flex items-center gap-2" style={{ background: "linear-gradient(90deg, rgba(245,158,11,0.1), transparent)" }}>
        <Zap size={15} className="text-yellow-500" />
        <span className="text-sm font-bold text-foreground">{lang === "es" ? "⚡ AUTOMATIZACIÓN CREADA" : "⚡ AUTOMATION CREATED"}</span>
      </div>
      <div className="p-4">
        {/* Flow with dot connectors */}
        <div className="flex items-center mb-4">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex-1 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border-2 border-primary/40 flex items-center justify-center mb-2" style={{ backgroundColor: "#12122280" }}>
                  <span className="text-base">{s.icon}</span>
                </div>
                <span className="text-[10px] text-foreground font-medium text-center leading-tight">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex items-center gap-1 mx-1 -mt-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                  <div className="w-4 h-px bg-primary/30" />
                  <div className="w-1 h-1 rounded-full bg-primary/40" />
                  <div className="w-4 h-px bg-primary/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-500 bg-green-500/10">🟢 {lang === "es" ? "Activa" : "Active"}</Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{note}</p>
      </div>
      <div className="px-4 py-3 border-t border-border flex gap-2 flex-wrap">
        {actions.map((l) => <ActionBtn key={l} label={l} />)}
      </div>
    </div>
  );
};

/* Card 5: Quote Generated */
const QuoteGeneratedCard = ({ lang }: { lang: "es" | "en" }) => {
  const items = [
    { name: lang === "es" ? "Diseño UI/UX" : "UI/UX Design", price: "$12,000" },
    { name: lang === "es" ? "Desarrollo Frontend" : "Frontend Development", price: "$18,000" },
    { name: "Backend + CMS", price: "$15,000" },
    { name: lang === "es" ? "Integración pagos" : "Payment integration", price: "$8,000" },
  ];
  const note = lang === "es"
    ? "Cotización basada en la plantilla E-commerce Standard. Incluye 3 revisiones y soporte 30 días."
    : "Quote based on E-commerce Standard template. Includes 3 revisions and 30-day support.";
  const actions = lang === "es" ? ["Descargar PDF","Enviar al cliente","Editar cotización"] : ["Download PDF","Send to client","Edit quote"];
  return (
    <div className="mt-3 rounded-2xl border border-border overflow-hidden" style={{ backgroundColor: "#1a1a2e" }}>
      <div className="px-4 py-3 border-b border-border flex items-center gap-2" style={{ background: "linear-gradient(90deg, hsl(var(--primary) / 0.1), transparent)" }}>
        <FileText size={15} className="text-primary" />
        <span className="text-sm font-bold text-foreground">{lang === "es" ? "📄 COTIZACIÓN GENERADA" : "📄 QUOTE GENERATED"}</span>
      </div>
      <div className="p-4">
        <div className="rounded-xl border border-border overflow-hidden mb-3">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ backgroundColor: "#12122280" }}>
                <th className="text-left px-3 py-2.5 text-muted-foreground font-medium text-[10px] uppercase tracking-widest">{lang === "es" ? "Concepto" : "Item"}</th>
                <th className="text-right px-3 py-2.5 text-muted-foreground font-medium text-[10px] uppercase tracking-widest">{lang === "es" ? "Precio" : "Price"}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-3 py-2.5 text-foreground">{it.name}</td>
                  <td className="px-3 py-2.5 text-foreground text-right font-medium">{it.price}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-primary/30" style={{ background: "linear-gradient(90deg, hsl(var(--primary) / 0.08), transparent)" }}>
                <td className="px-3 py-2.5 font-bold text-foreground">Total</td>
                <td className="px-3 py-2.5 font-extrabold text-primary text-right text-sm">$53,000 MXN</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{note}</p>
      </div>
      <div className="px-4 py-3 border-t border-border flex gap-2 flex-wrap">
        <ActionBtn label={actions[0]} primary />
        {actions.slice(1).map((l) => <ActionBtn key={l} label={l} />)}
      </div>
    </div>
  );
};

/* Card 6: Forecast — red gradient progress */
const ForecastCard = ({ lang }: { lang: "es" | "en" }) => {
  const pct = 63.75;
  const rows = lang === "es"
    ? [{ label: "Cerrado", value: "$85,000", color: "#22c55e" },{ label: "En negociación", value: "$42,500", color: "#f59e0b" },{ label: "Proyección cierre", value: "$155,000", color: "hsl(var(--primary))" }]
    : [{ label: "Closed", value: "$85,000", color: "#22c55e" },{ label: "In negotiation", value: "$42,500", color: "#f59e0b" },{ label: "Projected close", value: "$155,000", color: "hsl(var(--primary))" }];
  const insight = lang === "es"
    ? "💡 Vas al 63.75% de tu meta trimestral. Si cierras Estudio Legal Vega ($55,000) y Restaurante La Barca ($35,000) alcanzas el 87.5%."
    : "💡 You're at 63.75% of your quarterly goal. If you close Estudio Legal Vega ($55,000) and Restaurante La Barca ($35,000) you'll reach 87.5%.";
  const actions = lang === "es" ? ["Ver Forecast completo","Ajustar meta"] : ["View full Forecast","Adjust goal"];
  return (
    <div className="mt-3 rounded-2xl border border-border overflow-hidden" style={{ backgroundColor: "#1a1a2e" }}>
      <div className="px-4 py-3 border-b border-border flex items-center gap-2" style={{ background: "linear-gradient(90deg, hsl(var(--primary) / 0.12), transparent)" }}>
        <TrendingUp size={15} className="text-primary" />
        <span className="text-sm font-bold text-foreground">📈 FORECAST Q1 2026</span>
      </div>
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest block mb-0.5">{lang === "es" ? "Meta trimestral" : "Quarterly goal"}</span>
            <span className="text-2xl font-extrabold text-foreground">$200,000</span>
            <span className="text-xs text-muted-foreground ml-1">MXN</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest block mb-0.5">{lang === "es" ? "Actual" : "Current"}</span>
            <span className="text-xl font-extrabold text-primary">$127,500</span>
            <span className="text-xs text-muted-foreground ml-1">(63.75%)</span>
          </div>
        </div>
        <div className="w-full h-3.5 rounded-full bg-secondary mt-1 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--destructive) / 0.9))" }} />
        </div>
      </div>
      <div className="px-4 py-3 space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
              <span className="text-xs text-muted-foreground">{r.label}</span>
            </div>
            <span className="text-xs font-bold text-foreground">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-border" style={{ background: "linear-gradient(90deg, hsl(var(--primary) / 0.05), transparent)" }}>
        <p className="text-xs text-foreground/90 leading-relaxed">{insight}</p>
      </div>
      <div className="px-4 py-3 border-t border-border flex gap-2">
        {actions.map((l) => <ActionBtn key={l} label={l} />)}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   BLOCK RENDERER
   ══════════════════════════════════════════════════════ */
const RichBlockRenderer = ({ block, lang }: { block: RichBlock; lang: "es" | "en" }) => {
  switch (block.type) {
    case "executive-summary": return <ExecutiveSummaryCard lang={lang} />;
    case "client-registered": return <ClientRegisteredCard lang={lang} />;
    case "linkedin-metrics": return <LinkedInMetricsCard lang={lang} />;
    case "automation-created": return <AutomationCreatedCard lang={lang} />;
    case "quote-generated": return <QuoteGeneratedCard lang={lang} />;
    case "forecast": return <ForecastCard lang={lang} />;
    default: return null;
  }
};

/* ══════════════════════════════════════════════════════
   MOCK CONVERSATION
   ══════════════════════════════════════════════════════ */
const MOCK_MESSAGES_ES: ChatMessage[] = [
  { id: 1, role: "user", text: "Resumen ejecutivo de hoy", time: "09:00" },
  { id: 2, role: "novy", text: "Aquí tienes tu resumen ejecutivo del día:", time: "09:00", blocks: [{ type: "executive-summary" }] },
  { id: 3, role: "user", text: "Registra nuevo cliente: Restaurante La Barca, contacto Mario López, tel 55-1234-5678, email mario@labarca.mx, interesado en sitio web + menú digital, presupuesto estimado $35,000 MXN", time: "09:05" },
  { id: 4, role: "novy", text: "", time: "09:05", blocks: [{ type: "client-registered" }] },
  { id: 5, role: "user", text: "Muéstrame las métricas de LinkedIn de esta semana", time: "09:12" },
  { id: 6, role: "novy", text: "", time: "09:12", blocks: [{ type: "linkedin-metrics" }] },
  { id: 7, role: "user", text: "Crea una automatización: cuando un lead llene el formulario de contacto, enviar email de bienvenida y crear tarea de follow-up a 24hrs", time: "09:20" },
  { id: 8, role: "novy", text: "", time: "09:20", blocks: [{ type: "automation-created" }] },
  { id: 9, role: "user", text: "Genera una plantilla de cotización para sitio web e-commerce", time: "09:28" },
  { id: 10, role: "novy", text: "", time: "09:28", blocks: [{ type: "quote-generated" }] },
  { id: 11, role: "user", text: "¿Cómo va el forecast del trimestre?", time: "09:35" },
  { id: 12, role: "novy", text: "", time: "09:35", blocks: [{ type: "forecast" }] },
];
const MOCK_MESSAGES_EN: ChatMessage[] = [
  { id: 1, role: "user", text: "Today's executive summary", time: "09:00" },
  { id: 2, role: "novy", text: "Here's your executive summary for today:", time: "09:00", blocks: [{ type: "executive-summary" }] },
  { id: 3, role: "user", text: "Register new client: Restaurante La Barca, contact Mario López, tel 55-1234-5678, email mario@labarca.mx, interested in website + digital menu, estimated budget $35,000 MXN", time: "09:05" },
  { id: 4, role: "novy", text: "", time: "09:05", blocks: [{ type: "client-registered" }] },
  { id: 5, role: "user", text: "Show me this week's LinkedIn metrics", time: "09:12" },
  { id: 6, role: "novy", text: "", time: "09:12", blocks: [{ type: "linkedin-metrics" }] },
  { id: 7, role: "user", text: "Create an automation: when a lead fills the contact form, send welcome email and create follow-up task at 24hrs", time: "09:20" },
  { id: 8, role: "novy", text: "", time: "09:20", blocks: [{ type: "automation-created" }] },
  { id: 9, role: "user", text: "Generate a quote template for an e-commerce website", time: "09:28" },
  { id: 10, role: "novy", text: "", time: "09:28", blocks: [{ type: "quote-generated" }] },
  { id: 11, role: "user", text: "How's the quarterly forecast going?", time: "09:35" },
  { id: 12, role: "novy", text: "", time: "09:35", blocks: [{ type: "forecast" }] },
];

const QUICK_CHIPS_ES = ["📊 Resumen del día","➕ Nuevo cliente","📈 Métricas","📋 Tareas pendientes","💰 Forecast","📄 Nueva cotización","⚡ Nueva automatización","📧 Redactar email"];
const QUICK_CHIPS_EN = ["📊 Daily summary","➕ New client","📈 Metrics","📋 Pending tasks","💰 Forecast","📄 New quote","⚡ New automation","📧 Draft email"];

/* ══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════════════ */
const NovyPage = () => {
  const { lang } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const mockMessages = lang === "es" ? MOCK_MESSAGES_ES : MOCK_MESSAGES_EN;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeConv, setActiveConv] = useState("today-1");
  const [isTyping, setIsTyping] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const historyGroups = lang === "es" ? HISTORY_GROUPS_ES : HISTORY_GROUPS_EN;
  const quickChips = lang === "es" ? QUICK_CHIPS_ES : QUICK_CHIPS_EN;
  const pendingTasks = 7;

  // Simulate typing then show mock messages
  useEffect(() => {
    setMessages([]);
    setIsTyping(true);
    const timer = setTimeout(() => {
      setMessages(mockMessages);
      setIsTyping(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [lang]);

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
        id: Date.now() + 1, role: "novy",
        text: lang === "es"
          ? "Entendido. Procesando tu solicitud — esta funcionalidad se conectará al backend de IA próximamente."
          : "Got it. Processing — this will connect to the AI backend soon.",
        time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
      }]);
      setIsTyping(false);
    }, 2000);
  }, [input, isTyping, lang]);

  const handleNewConversation = () => {
    setMessages([]);
    setActiveConv(`new-${Date.now()}`);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -mx-2">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.05))", border: "1px solid hsl(var(--primary) / 0.3)" }}>
              <Bot size={20} className="text-primary" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              NOVY <Sparkles size={12} className="text-primary" />
            </h1>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
              {lang === "es" ? "En línea" : "Online"} · {lang === "es" ? "Centro de Comando CRM" : "CRM Command Center"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Clock size={12} />
            <span className="font-bold">{pendingTasks}</span>
            <span className="text-primary/70">{lang === "es" ? "pendientes" : "pending"}</span>
          </div>
          <button onClick={handleNewConversation} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-primary/5 hover:border-primary/30 transition-all">
            <Plus size={12} />
            {lang === "es" ? "Nueva conversación" : "New conversation"}
          </button>
          <button onClick={() => setShowHistory(!showHistory)} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${showHistory ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
            <History size={12} />
            {lang === "es" ? "Historial" : "History"}
          </button>
        </div>
      </div>

      {/* ─── Body ─── */}
      <div className="flex flex-1 min-h-0">
        {/* History sidebar */}
        {showHistory && (
          <div className="w-56 shrink-0 border-r border-border flex flex-col bg-background">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">{lang === "es" ? "Conversaciones" : "Conversations"}</span>
              <button onClick={() => setShowHistory(false)} className="text-muted-foreground hover:text-foreground transition-colors"><PanelLeftClose size={14} /></button>
            </div>
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {historyGroups.map((group) => (
                <div key={group.label}>
                  <div className="px-3 pt-3 pb-1">
                    <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">{group.label}</span>
                  </div>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveConv(item.id);
                        if (item.id === "today-1") { setMessages(mockMessages); setIsTyping(false); }
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                        activeConv === item.id
                          ? "bg-primary/10 text-foreground border-l-2 border-primary"
                          : "text-muted-foreground hover:bg-card hover:text-foreground border-l-2 border-transparent"
                      }`}
                    >
                      <span className="block truncate">{item.title}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Chat ─── */}
        <div className="flex-1 flex flex-col min-w-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] ${msg.role === "novy" ? "flex items-start gap-2.5" : ""}`}>
                  {msg.role === "novy" && (
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.05))", border: "1px solid hsl(var(--primary) / 0.3)" }}>
                      <Bot size={14} className="text-primary" />
                    </div>
                  )}
                  <div>
                    {msg.text && (
                      <div className={`text-sm leading-relaxed rounded-2xl px-4 py-2.5 ${
                        msg.role === "user"
                          ? "bg-foreground text-background"
                          : ""
                      }`} style={msg.role === "novy" ? { backgroundColor: "#1a1a2e", border: "1px solid hsl(var(--border))" } : undefined}>
                        <ReactMarkdown components={{
                          p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        }}>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                    {msg.blocks?.map((block, bi) => (
                      <RichBlockRenderer key={bi} block={block} lang={lang} />
                    ))}
                    <span className="text-[10px] text-muted-foreground mt-1 block">{msg.time}</span>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.05))", border: "1px solid hsl(var(--primary) / 0.3)" }}>
                  <Bot size={14} className="text-primary" />
                </div>
                <div className="rounded-2xl px-5 py-3" style={{ backgroundColor: "#1a1a2e", border: "1px solid hsl(var(--border))" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "200ms" }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "400ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick chips */}
          <div className="px-4 pb-2 shrink-0">
            <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {quickChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    const time = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
                    setMessages(prev => [...prev, { id: Date.now(), role: "user", text: chip, time }]);
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg border border-primary/20 text-primary/70 hover:text-primary hover:bg-primary/5 hover:border-primary/40 transition-all whitespace-nowrap shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="shrink-0 px-4 pb-3 pt-2 border-t border-border">
            <div className="flex items-end gap-2">
              <button type="button" className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors shrink-0 mb-0.5">
                <Paperclip size={14} />
              </button>
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder={lang === "es" ? "Escribe a NOVY... Controla todo tu CRM desde aquí" : "Write to NOVY... Control your entire CRM from here"}
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none min-h-[42px] max-h-[120px]"
                  rows={1}
                  disabled={isTyping}
                />
              </div>
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="w-9 h-9 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-30 flex items-center justify-center transition-all shrink-0 mb-0.5"
              >
                <Send size={14} className="text-primary-foreground" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NovyPage;
