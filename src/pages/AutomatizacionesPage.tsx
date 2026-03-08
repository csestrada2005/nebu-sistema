import { Zap, MessageCircle, CreditCard, Clock, FileBarChart, FormInput, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type FlowStatus = "active" | "paused" | "error";

interface Flow {
  id: number;
  name: Record<"es"|"en", string>;
  description: Record<"es"|"en", string>;
  trigger: Record<"es"|"en", string>;
  status: FlowStatus;
  icon: React.ElementType;
}

const flows: Flow[] = [
  { id: 1, icon: MessageCircle, status: "active",
    name: { es: "Lead desde WhatsApp", en: "Lead from WhatsApp" },
    description: { es: "Cuando llega mensaje → crea lead en CRM", en: "When message arrives → creates lead in CRM" },
    trigger: { es: "Mensaje entrante WhatsApp", en: "Incoming WhatsApp message" } },
  { id: 2, icon: CreditCard, status: "active",
    name: { es: "Notificación de pago", en: "Payment notification" },
    description: { es: "Stripe webhook → actualiza factura + notifica Slack", en: "Stripe webhook → updates invoice + notifies Slack" },
    trigger: { es: "Stripe webhook", en: "Stripe webhook" } },
  { id: 3, icon: Clock, status: "active",
    name: { es: "Seguimiento automático", en: "Auto follow-up" },
    description: { es: "Si lead >7 días sin actividad → envía email recordatorio", en: "If lead >7 days inactive → sends reminder email" },
    trigger: { es: "Inactividad >7 días", en: "Inactivity >7 days" } },
  { id: 4, icon: FileBarChart, status: "paused",
    name: { es: "Reporte semanal", en: "Weekly report" },
    description: { es: "Cada lunes → genera PDF de métricas y envía por email", en: "Every Monday → generates metrics PDF and sends via email" },
    trigger: { es: "Cron: Lunes 8:00 AM", en: "Cron: Monday 8:00 AM" } },
  { id: 5, icon: FormInput, status: "active",
    name: { es: "Prospecto desde formulario", en: "Prospect from form" },
    description: { es: "Typeform submit → crea contacto + asigna vendedor", en: "Typeform submit → creates contact + assigns seller" },
    trigger: { es: "Typeform submission", en: "Typeform submission" } },
  { id: 6, icon: AlertTriangle, status: "error",
    name: { es: "Alerta de vencimiento", en: "Expiration alert" },
    description: { es: "Contrato por vencer en 15 días → notifica equipo", en: "Contract expiring in 15 days → notifies team" },
    trigger: { es: "15 días antes de vencimiento", en: "15 days before expiration" } },
];

const statusStyle: Record<FlowStatus, { bg: string; color: string; dot: string }> = {
  active: { bg: "rgba(34,197,94,0.1)", color: "#22c55e", dot: "#22c55e" },
  paused: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", dot: "#f59e0b" },
  error: { bg: "rgba(239,68,68,0.1)", color: "#ef4444", dot: "#ef4444" },
};

const AutomatizacionesPage = () => {
  const { lang } = useLanguage();

  const counts = { active: flows.filter(f => f.status === "active").length, paused: flows.filter(f => f.status === "paused").length, error: flows.filter(f => f.status === "error").length };

  const tt = {
    es: { title: "Automatizaciones", subtitle: "Mapa visual de flujos Make/n8n conectados a tu CRM", active: "Activos", paused: "Pausado", error: "Error", trigger: "Trigger", statusLabel: { active: "Activo", paused: "Pausado", error: "Error" } },
    en: { title: "Automations", subtitle: "Visual map of Make/n8n flows connected to your CRM", active: "Active", paused: "Paused", error: "Error", trigger: "Trigger", statusLabel: { active: "Active", paused: "Paused", error: "Error" } },
  }[lang];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{tt.title}</h1>
        <p className="text-sm mt-1" style={{ color: "#888" }}>{tt.subtitle}</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {([["active", tt.active, counts.active], ["paused", tt.paused, counts.paused], ["error", tt.error, counts.error]] as [FlowStatus, string, number][]).map(([status, label, count]) => (
          <div key={status} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: statusStyle[status].bg, color: statusStyle[status].color, border: `1px solid ${statusStyle[status].color}30` }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusStyle[status].dot }} />
            {count} {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {flows.map(flow => {
          const s = statusStyle[flow.status];
          return (
            <div key={flow.id} className="rounded-lg p-5 transition-all duration-200 hover:translate-y-[-2px]" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderLeftWidth: "4px", borderLeftColor: s.color }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                  <flow.icon size={18} style={{ color: s.color }} />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5" style={{ backgroundColor: s.bg, color: s.color }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
                  {tt.statusLabel[flow.status]}
                </span>
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{flow.name[lang]}</h3>
              <p className="text-xs mb-3" style={{ color: "#888" }}>{flow.description[lang]}</p>
              <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#555" }}>
                <Zap size={12} style={{ color: "#E53E3E" }} />
                <span>{tt.trigger}: {flow.trigger[lang]}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AutomatizacionesPage;
