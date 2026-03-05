import { AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { useLanguage } from "@/contexts/LanguageContext";

const t = {
  es: {
    alertas: "ALERTAS RÁPIDAS",
    pasos: "PRÓXIMOS PASOS SUGERIDOS",
    proyActivos: "Proyectos Activos",
    porCobrar: "Por cobrar (MXN)",
    saldosPend: "Saldos pendientes",
    entregados: "Entregados este mes",
    canalVentas: "Canal de ventas",
    canalSub: "Canal principal activo",
  },
  en: {
    alertas: "QUICK ALERTS",
    pasos: "SUGGESTED NEXT STEPS",
    proyActivos: "Active Projects",
    porCobrar: "Outstanding (MXN)",
    saldosPend: "Pending balances",
    entregados: "Delivered this month",
    canalVentas: "Sales channel",
    canalSub: "Main active channel",
  },
};

const ALERTS = {
  es: [
    { type: "warning" as const, text: "PAPACHOA — Sin anticipo pagado" },
    { type: "warning" as const, text: "BAZAR CENTENARIO — Entrega estimada 23/02/2026 vencida" },
    { type: "success" as const, text: "RAWPAW — Entregado y liquidado" },
  ],
  en: [
    { type: "warning" as const, text: "PAPACHOA — No advance payment received" },
    { type: "warning" as const, text: "BAZAR CENTENARIO — Estimated delivery 23/02/2026 overdue" },
    { type: "success" as const, text: "RAWPAW — Delivered and paid in full" },
  ],
};

const NEXT_STEPS = {
  es: [
    { project: "PAPACHOA", action: "Cobrar anticipo antes de continuar" },
    { project: "BAZAR CENTENARIO", action: "Confirmar entrega y cobrar $12,500 MXN" },
    { project: "RAWPAW", action: "Confirmar cierre con cliente y activar mensualidad" },
  ],
  en: [
    { project: "PAPACHOA", action: "Collect advance payment before continuing" },
    { project: "BAZAR CENTENARIO", action: "Confirm delivery and collect $12,500 MXN" },
    { project: "RAWPAW", action: "Confirm closure with client and activate monthly plan" },
  ],
};

const DashboardPage = () => {
  const { lang } = useLanguage();
  const s = t[lang];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label={s.proyActivos} value="3" />
        <StatsCard label={s.porCobrar} value="$27,500" sub={s.saldosPend} />
        <StatsCard label={s.entregados} value="1" sub="RAWPAW" />
        <StatsCard label={s.canalVentas} value="LinkedIn" sub={s.canalSub} />
      </div>

      <section>
        <h2 className="text-sm font-bold tracking-wider mb-3" style={{ color: "var(--nebu-accent)" }}>{s.alertas}</h2>
        <div className="space-y-2">
          {ALERTS[lang].map((a, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-md text-sm" style={{ backgroundColor: "var(--nebu-card)", borderLeft: `4px solid ${a.type === "success" ? "#48BB78" : "var(--nebu-accent)"}`, color: "var(--nebu-text)" }}>
              {a.type === "success" ? <CheckCircle size={18} className="text-green-400 shrink-0" /> : <AlertTriangle size={18} className="text-red-400 shrink-0" />}
              <span>{a.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold tracking-wider mb-3" style={{ color: "var(--nebu-accent)" }}>{s.pasos}</h2>
        <div className="space-y-2">
          {NEXT_STEPS[lang].map((step, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-md text-sm" style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)" }}>
              <ArrowRight size={18} style={{ color: "var(--nebu-accent)" }} className="shrink-0" />
              <span><strong>{step.project}</strong> — {step.action}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
