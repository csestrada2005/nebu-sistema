import StatsCard from "@/components/StatsCard";
import ProjectTable from "@/components/ProjectTable";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-5xl tracking-tight">DASHBOARD</h1>
        <p className="font-mono text-xs text-nebu-text-dim mt-1">
          NEBU STUDIO · FEB 2026 · OPERACIONES ACTIVAS
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatsCard label="Ingresos Activos" value="$60K" sub="3 proyectos activos" />
        <StatsCard label="Pendiente Cobro" value="$12.5K" sub="Bazar Centenario" color="amber" />
        <StatsCard label="En Pipeline" value="5" sub="leads activos" />
        <StatsCard label="Comisión Olivia" value="$6K" sub="↑ 10% sobre ventas" color="green" />
      </div>

      {/* Table */}
      <ProjectTable />
    </div>
  );
};

export default DashboardPage;
