import StatsCard from "@/components/StatsCard";
import ProjectTable from "@/components/ProjectTable";
import { useCrm } from "@/contexts/CrmContext";

const DashboardPage = () => {
  const { state } = useCrm();
  const totalIngresos = state.projects.reduce((s, p) => s + p.precio, 0);
  const pendiente = state.projects.find((p) => p.estado === "activo" && p.pasoFunnel <= 3);
  const pendienteCobro = pendiente ? pendiente.precio : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-5xl tracking-tight">DASHBOARD</h1>
        <p className="font-mono text-xs text-nebu-text-dim mt-1">
          NEBU STUDIO · FEB 2026 · OPERACIONES ACTIVAS
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatsCard label="Ingresos Activos" value={`$${(totalIngresos / 1000).toFixed(0)}K`} sub={`${state.projects.length} proyectos activos`} />
        <StatsCard label="Pendiente Cobro" value={`$${(pendienteCobro / 1000).toFixed(1)}K`} sub={pendiente?.cliente || "—"} color="amber" />
        <StatsCard label="En Pipeline" value={String(state.leads.length)} sub="leads activos" />
        <StatsCard label="Comisión Olivia" value="$6K" sub="↑ 10% sobre ventas" color="green" />
      </div>

      <ProjectTable />
    </div>
  );
};

export default DashboardPage;
