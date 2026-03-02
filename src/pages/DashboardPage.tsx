import { AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import StatsCard from "@/components/StatsCard";

const ALERTS = [
  {
    type: "warning" as const,
    text: "PAPACHOA — Sin anticipo pagado",
  },
  {
    type: "warning" as const,
    text: "BAZAR CENTENARIO — Entrega estimada 23/02/2026 vencida",
  },
  {
    type: "success" as const,
    text: "RAWPAW — Entregado y liquidado",
  },
];

const NEXT_STEPS = [
  {
    project: "PAPACHOA",
    action: "Cobrar anticipo antes de continuar",
  },
  {
    project: "BAZAR CENTENARIO",
    action: "Confirmar entrega y cobrar $12,500 MXN",
  },
  {
    project: "RAWPAW",
    action: "Confirmar cierre con cliente y activar mensualidad",
  },
];

const DashboardPage = () => {
  return (
    <div className="space-y-8">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Proyectos Activos" value="3" />
        <StatsCard
          label="Por cobrar (MXN)"
          value="$27,500"
          sub="Saldos pendientes"
        />
        <StatsCard label="Entregados este mes" value="1" sub="RAWPAW" />
        <StatsCard
          label="Canal de ventas"
          value="LinkedIn"
          sub="Canal principal activo"
        />
      </div>

      {/* Alertas Rápidas */}
      <section>
        <h2
          className="text-sm font-bold tracking-wider mb-3"
          style={{ color: "var(--nebu-accent)" }}
        >
          ALERTAS RÁPIDAS
        </h2>
        <div className="space-y-2">
          {ALERTS.map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-md text-sm"
              style={{
                backgroundColor: "var(--nebu-card)",
                borderLeft: `4px solid ${
                  a.type === "success" ? "#48BB78" : "var(--nebu-accent)"
                }`,
                color: "var(--nebu-text)",
              }}
            >
              {a.type === "success" ? (
                <CheckCircle size={18} className="text-green-400 shrink-0" />
              ) : (
                <AlertTriangle size={18} className="text-red-400 shrink-0" />
              )}
              <span>{a.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Próximos Pasos Sugeridos */}
      <section>
        <h2
          className="text-sm font-bold tracking-wider mb-3"
          style={{ color: "var(--nebu-accent)" }}
        >
          PRÓXIMOS PASOS SUGERIDOS
        </h2>
        <div className="space-y-2">
          {NEXT_STEPS.map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-md text-sm"
              style={{
                backgroundColor: "var(--nebu-card)",
                color: "var(--nebu-text)",
              }}
            >
              <ArrowRight size={18} style={{ color: "var(--nebu-accent)" }} className="shrink-0" />
              <span>
                <strong>{step.project}</strong> — {step.action}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
