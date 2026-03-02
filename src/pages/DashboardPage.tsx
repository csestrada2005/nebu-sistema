import { AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import StatsCard from "@/components/StatsCard";

const ALERTS = [
  {
    type: "warning" as const,
    text: "PAPACHOA \u2014 Sin anticipo pagado",
  },
  {
    type: "warning" as const,
    text: "BAZAR CENTENARIO \u2014 Entrega estimada 23/02/2026 vencida",
  },
  {
    type: "success" as const,
    text: "RAWPAW \u2014 Entregado y liquidado",
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
    <div className="space-y-8 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard label="Proyectos Activos" value="3" />
        <StatsCard
          label="Por cobrar (MXN)"
          value="$27,500"
          sub="Saldos pendientes"
        />
        <StatsCard
          label="Entregados este mes"
          value="1"
          sub="RAWPAW"
        />
        <StatsCard
          label="Canal de ventas"
          value="LinkedIn"
          sub="Canal principal activo"
        />
      </div>

      {/* ── Alertas R\u00e1pidas ── */}
      <div className="space-y-3">
        <h2 className="text-xs text-[#E53E3E] font-bold uppercase tracking-widest">
          Alertas R\u00e1pidas
        </h2>
        {ALERTS.map((a, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 transition-all hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(229,62,62,0.08)] ${
              a.type === "warning"
                ? "border-l-4 border-l-[#ef4444]"
                : "border-l-4 border-l-[#22c55e]"
            }`}
          >
            {a.type === "warning" ? (
              <AlertTriangle className="w-4 h-4 text-[#ef4444] mt-0.5 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
            )}
            <p
              className={`text-sm ${
                a.type === "warning" ? "text-[#fca5a5]" : "text-[#86efac]"
              }`}
            >
              {a.text}
            </p>
          </div>
        ))}
      </div>

      {/* ── Pr\u00f3ximos Pasos Sugeridos ── */}
      <div className="space-y-3">
        <h2 className="text-xs text-[#E53E3E] font-bold uppercase tracking-widest">
          Pr\u00f3ximos Pasos Sugeridos
        </h2>
        {NEXT_STEPS.map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 transition-all hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(229,62,62,0.08)]"
          >
            <ArrowRight className="w-4 h-4 text-[#E53E3E] flex-shrink-0" />
            <div>
              <span className="text-sm font-bold text-white">
                {step.project}
              </span>
              <span className="text-sm text-[#888888]">
                {" "}
                \u2014 {step.action}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
