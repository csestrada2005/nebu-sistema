import { DollarSign, Briefcase, Users, TrendingUp, FolderOpen, ListChecks } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EmptyState from "@/components/EmptyState";

const DashboardPage = () => {
  const { lang } = useLanguage();

  const kpis = [
    { label: { es: "Ingresos del mes", en: "Monthly revenue" }, value: "$0", icon: DollarSign },
    { label: { es: "Proyectos activos", en: "Active projects" }, value: "0", icon: Briefcase },
    { label: { es: "Leads activos", en: "Active leads" }, value: "0", icon: Users },
    { label: { es: "Tasa de cierre", en: "Close rate" }, value: "0%", icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm mt-1 text-muted-foreground">
          {lang === "es" ? "Resumen general de tu estudio" : "General overview of your studio"}
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label.es}
            className="rounded-xl p-5 bg-card border border-border"
          >
            <div className="flex items-center gap-2 mb-3">
              <kpi.icon size={15} strokeWidth={1.5} className="text-muted-foreground" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {kpi.label[lang]}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Recent projects */}
      <div className="rounded-xl bg-card border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {lang === "es" ? "Proyectos recientes" : "Recent projects"}
          </h2>
        </div>
        <EmptyState
          icon={FolderOpen}
          title={{ es: "Sin proyectos aún", en: "No projects yet" }}
          subtitle={{ es: "Agrega tu primer proyecto para comenzar.", en: "Add your first project to get started." }}
        />
      </div>

      {/* Next steps */}
      <div className="rounded-xl bg-card border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {lang === "es" ? "Próximos pasos" : "Next steps"}
          </h2>
        </div>
        <EmptyState
          icon={ListChecks}
          title={{ es: "Sin tareas pendientes", en: "No pending tasks" }}
          subtitle={{ es: "Tus próximos pasos aparecerán aquí.", en: "Your next steps will appear here." }}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
