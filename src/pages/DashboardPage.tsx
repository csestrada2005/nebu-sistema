import { Briefcase, DollarSign, Clock, Users, FolderOpen, ListChecks, Activity, Bot, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCrm } from "@/contexts/CrmContext";
import EmptyState from "@/components/EmptyState";

const DashboardPage = () => {
  const { lang } = useLanguage();
  const { profile } = useAuth();
  const { projects, leads, tasks } = useCrm();

  const now = new Date();
  const hour = now.getHours();
  const greeting = lang === "es"
    ? hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches"
    : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const userName = profile?.full_name || (lang === "es" ? "Usuario" : "User");

  const dateStr = now.toLocaleDateString(lang === "es" ? "es-MX" : "en-US", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const activeProjects = projects.filter(p => p.status !== "completado").length;
  const totalRevenue = projects.filter(p => p.status === "completado").reduce((sum, p) => sum + Number(p.value), 0);
  const pendingPayments = projects.filter(p => p.status !== "completado").reduce((sum, p) => sum + Number(p.value), 0);
  const pipelineLeads = leads.length;
  const pendingTasks = tasks.filter(t => t.status === "pending").length;

  const kpis = [
    { label: { es: "Proyectos activos", en: "Active projects" }, value: String(activeProjects), icon: Briefcase },
    { label: { es: "Ingresos totales", en: "Total revenue" }, value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign },
    { label: { es: "Pipeline pendiente", en: "Pending pipeline" }, value: `$${pendingPayments.toLocaleString()}`, icon: Clock },
    { label: { es: "Leads en pipeline", en: "Pipeline leads" }, value: String(pipelineLeads), icon: Users },
  ];

  const recentProjects = projects.slice(0, 5);
  const recentTasks = tasks.filter(t => t.status === "pending").slice(0, 5);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          {greeting}, {userName} 👋
        </h1>
        <p className="text-sm mt-0.5 text-muted-foreground capitalize">{dateStr}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label.es} className="rounded-xl p-5 bg-card border border-border group hover:border-primary/20 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {kpi.label[lang]}
              </span>
              <kpi.icon size={15} strokeWidth={1.5} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-card border border-border">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              {lang === "es" ? "Proyectos recientes" : "Recent projects"}
            </h2>
            <button className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              {lang === "es" ? "Ver todos" : "View all"} <ArrowRight size={12} />
            </button>
          </div>
          {recentProjects.length === 0 ? (
            <div className="p-2">
              <EmptyState
                icon={FolderOpen}
                title={{ es: "Sin proyectos aún", en: "No projects yet" }}
                subtitle={{ es: "Crea tu primer proyecto para verlo aquí.", en: "Create your first project to see it here." }}
              />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentProjects.map((p) => (
                <div key={p.id} className="px-5 py-3 flex items-center justify-between hover:bg-accent/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.client_name} · {p.project_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">${Number(p.value).toLocaleString()}</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      p.status === "completado" ? "bg-green-500/10 text-green-400" :
                      p.status === "en-proceso" ? "bg-blue-500/10 text-blue-400" :
                      "bg-yellow-500/10 text-yellow-400"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-card border border-border p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/10">
              <Bot size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">NOVY</h3>
              <p className="text-[11px] text-muted-foreground">
                {lang === "es" ? "Tu asistente IA" : "Your AI assistant"}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-4 flex-1">
            {lang === "es"
              ? "Pregúntale por el estado de tus proyectos, genera cotizaciones o redacta mensajes."
              : "Ask about your project status, generate quotes or draft messages."}
          </p>
          <button className="w-full py-2.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/15 transition-colors flex items-center justify-center gap-2">
            <Bot size={14} />
            {lang === "es" ? "Abrir NOVY" : "Open NOVY"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-card border border-border">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">
              {lang === "es" ? `Tareas pendientes (${pendingTasks})` : `Pending tasks (${pendingTasks})`}
            </h2>
          </div>
          {recentTasks.length === 0 ? (
            <div className="p-2">
              <EmptyState
                icon={ListChecks}
                title={{ es: "Sin tareas pendientes", en: "No pending tasks" }}
                subtitle={{ es: "Tus próximos pasos aparecerán aquí.", en: "Your next steps will appear here." }}
              />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentTasks.map((t) => (
                <div key={t.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.assignee || "Unassigned"}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    t.priority === "high" ? "bg-red-500/10 text-red-400" :
                    t.priority === "medium" ? "bg-yellow-500/10 text-yellow-400" :
                    "bg-green-500/10 text-green-400"
                  }`}>
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-card border border-border">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">
              {lang === "es" ? "Actividad reciente" : "Recent activity"}
            </h2>
          </div>
          <div className="p-2">
            <EmptyState
              icon={Activity}
              title={{ es: "Sin actividad aún", en: "No activity yet" }}
              subtitle={{ es: "Tu timeline de actividad aparecerá aquí.", en: "Your activity timeline will appear here." }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
