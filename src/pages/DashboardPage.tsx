import { DollarSign, Briefcase, Users, TrendingUp, FolderOpen, ListChecks } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EmptyState from "@/components/EmptyState";

const DashboardPage = () => {
  const { lang } = useLanguage();

  const kpis = [
    { label: { es: "Ingresos del mes", en: "Monthly revenue" }, value: "$0", icon: DollarSign },
    { label: { es: "Proyectos activos", en: "Active projects" }, value: "0", icon: Briefcase },
    { label: { es: "Leads en pipeline", en: "Pipeline leads" }, value: "0", icon: Users },
    { label: { es: "Tasa de cierre", en: "Close rate" }, value: "0%", icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: "#FFFFFF" }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "#71717A" }}>
          {lang === "es" ? "Resumen general de tu CRM" : "General overview of your CRM"}
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label.es}
            className="rounded-xl p-5"
            style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <kpi.icon size={16} strokeWidth={1.5} style={{ color: "#71717A" }} />
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#71717A" }}>
                {kpi.label[lang]}
              </span>
            </div>
            <p className="text-3xl font-bold" style={{ color: "#FFFFFF" }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Recent projects - empty */}
      <div className="rounded-xl" style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>
            {lang === "es" ? "Proyectos recientes" : "Recent projects"}
          </h2>
        </div>
        <EmptyState
          icon={FolderOpen}
          title={{ es: "Sin proyectos aún", en: "No projects yet" }}
          subtitle={{ es: "Agrega tu primer proyecto para comenzar.", en: "Add your first project to get started." }}
        />
      </div>

      {/* Next steps - empty */}
      <div className="rounded-xl" style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>
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
