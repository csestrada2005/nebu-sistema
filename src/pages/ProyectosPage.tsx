import { useState } from "react";
import { FolderOpen, List, Kanban, Clock, Plus, Search, X, FileText, CheckSquare, Upload, CreditCard, Eye, StickyNote, ArrowLeft, MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCrm, Project } from "@/contexts/CrmContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EmptyState from "@/components/EmptyState";

type ViewMode = "list" | "kanban" | "timeline";

const KANBAN_COLS = [
  { id: "lead", label: { es: "Lead", en: "Lead" } },
  { id: "propuesta", label: { es: "Propuesta", en: "Proposal" } },
  { id: "en-proceso", label: { es: "En proceso", en: "In progress" } },
  { id: "revision", label: { es: "Revisión", en: "Review" } },
  { id: "completado", label: { es: "Completado", en: "Completed" } },
];

const PROJECT_TYPES = [
  { es: "Web", en: "Web" },
  { es: "E-commerce", en: "E-commerce" },
  { es: "Branding", en: "Branding" },
  { es: "Marketing", en: "Marketing" },
  { es: "SEO", en: "SEO" },
];

type DetailTab = "general" | "tareas" | "archivos" | "pagos" | "portal" | "notas";

const DETAIL_TABS: { id: DetailTab; label: Record<"es" | "en", string>; icon: React.ElementType }[] = [
  { id: "general", label: { es: "General", en: "General" }, icon: FileText },
  { id: "tareas", label: { es: "Tareas", en: "Tasks" }, icon: CheckSquare },
  { id: "archivos", label: { es: "Archivos", en: "Files" }, icon: Upload },
  { id: "pagos", label: { es: "Pagos", en: "Payments" }, icon: CreditCard },
  { id: "portal", label: { es: "Portal", en: "Portal" }, icon: Eye },
  { id: "notas", label: { es: "Notas", en: "Notes" }, icon: StickyNote },
];

const ProyectosPage = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const { projects, refreshProjects } = useCrm();
  const [view, setView] = useState<ViewMode>("list");
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("general");
  const [showNewModal, setShowNewModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", client: "", type: "Web", value: "", dueDate: "" });

  const handleSaveProject = async () => {
    if (!newProject.name.trim() || !user) return;
    setSaving(true);
    const { error } = await supabase.from("projects").insert({
      name: newProject.name,
      client_name: newProject.client,
      project_type: newProject.type,
      value: Number(newProject.value) || 0,
      due_date: newProject.dueDate || null,
      user_id: user.id,
      status: "lead",
    } as any);
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(lang === "es" ? "Proyecto creado" : "Project created");
      setShowNewModal(false);
      setNewProject({ name: "", client: "", type: "Web", value: "", dueDate: "" });
      refreshProjects();
    }
  };

  const handleDeleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) {
      toast.success(lang === "es" ? "Proyecto eliminado" : "Project deleted");
      refreshProjects();
      if (selectedProject?.id === id) setSelectedProject(null);
    }
  };

  const q = search.toLowerCase();
  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(q) || p.client_name.toLowerCase().includes(q)
  );

  // Detail view
  if (selectedProject) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedProject(null)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">{selectedProject.name}</h1>
            <p className="text-xs text-muted-foreground">{selectedProject.client_name} · {selectedProject.project_type}</p>
          </div>
          <button onClick={() => handleDeleteProject(selectedProject.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {DETAIL_TABS.map((tab) => (
            <button key={tab.id} onClick={() => setDetailTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs whitespace-nowrap transition-colors ${
                detailTab === tab.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}>
              <tab.icon size={14} strokeWidth={1.5} />
              {tab.label[lang]}
            </button>
          ))}
        </div>
        <div className="rounded-xl bg-card border border-border min-h-[400px]">
          {detailTab === "general" && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-xs text-muted-foreground">{lang === "es" ? "Valor" : "Value"}</span><p className="text-lg font-bold text-foreground">${Number(selectedProject.value).toLocaleString()}</p></div>
                <div><span className="text-xs text-muted-foreground">Status</span><p className="text-lg font-bold text-foreground capitalize">{selectedProject.status}</p></div>
                <div><span className="text-xs text-muted-foreground">{lang === "es" ? "Fecha entrega" : "Due date"}</span><p className="text-sm text-foreground">{selectedProject.due_date || "—"}</p></div>
                <div><span className="text-xs text-muted-foreground">{lang === "es" ? "Tipo" : "Type"}</span><p className="text-sm text-foreground">{selectedProject.project_type}</p></div>
              </div>
              {selectedProject.notes && <div><span className="text-xs text-muted-foreground">{lang === "es" ? "Notas" : "Notes"}</span><p className="text-sm text-foreground mt-1">{selectedProject.notes}</p></div>}
            </div>
          )}
          {detailTab !== "general" && (
            <EmptyState
              icon={FileText}
              title={{ es: "Próximamente", en: "Coming soon" }}
              subtitle={{ es: "Esta sección estará disponible pronto.", en: "This section will be available soon." }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{lang === "es" ? "Proyectos" : "Projects"}</h1>
          <p className="text-sm mt-0.5 text-muted-foreground">{lang === "es" ? "Gestiona tus proyectos, entregas y clientes" : "Manage your projects, deliveries and clients"}</p>
        </div>
        <button onClick={() => setShowNewModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors self-start">
          <Plus size={16} /> {lang === "es" ? "Nuevo proyecto" : "New project"}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center bg-card border border-border rounded-lg p-0.5">
          {([
            { id: "list" as ViewMode, icon: List, label: lang === "es" ? "Lista" : "List" },
            { id: "kanban" as ViewMode, icon: Kanban, label: "Kanban" },
            { id: "timeline" as ViewMode, icon: Clock, label: "Timeline" },
          ]).map((v) => (
            <button key={v.id} onClick={() => setView(v.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors ${view === v.id ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              <v.icon size={14} /><span className="hidden sm:inline">{v.label}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 rounded-lg text-xs bg-card border border-border text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors w-full sm:w-48"
            placeholder={lang === "es" ? "Buscar proyecto..." : "Search project..."} />
        </div>
      </div>

      {view === "list" && (
        filtered.length === 0 ? (
          <div className="rounded-xl bg-card border border-border">
            <EmptyState icon={FolderOpen}
              title={{ es: "Crea tu primer proyecto", en: "Create your first project" }}
              subtitle={{ es: "Gestiona proyectos, tareas, entregas y pagos desde un solo lugar.", en: "Manage projects, tasks, deliveries and payments from one place." }}
              ctaLabel={{ es: "+ Nuevo proyecto", en: "+ New project" }}
              onCta={() => setShowNewModal(true)} />
          </div>
        ) : (
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{lang === "es" ? "Proyecto" : "Project"}</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{lang === "es" ? "Cliente" : "Client"}</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{lang === "es" ? "Tipo" : "Type"}</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{lang === "es" ? "Valor" : "Value"}</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} onClick={() => setSelectedProject(p)} className="border-b border-border/50 hover:bg-accent/30 cursor-pointer transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.client_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.project_type}</td>
                    <td className="px-4 py-3 font-semibold text-green-400">${Number(p.value).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === "completado" ? "bg-green-500/10 text-green-400" :
                        p.status === "en-proceso" ? "bg-blue-500/10 text-blue-400" :
                        "bg-yellow-500/10 text-yellow-400"
                      }`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {view === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {KANBAN_COLS.map((col) => {
            const colProjects = filtered.filter(p => p.status === col.id);
            return (
              <div key={col.id} className="min-w-[260px] w-[260px] shrink-0 rounded-xl bg-card border border-border flex flex-col">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{col.label[lang]}</span>
                  <span className="text-[10px] font-medium text-muted-foreground bg-accent px-1.5 py-0.5 rounded-full">{colProjects.length}</span>
                </div>
                <div className="flex-1 min-h-[280px] p-2 space-y-2">
                  {colProjects.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-[11px] text-muted-foreground/50 text-center">{lang === "es" ? "Arrastra proyectos aquí" : "Drag projects here"}</p>
                    </div>
                  ) : colProjects.map(p => (
                    <div key={p.id} onClick={() => setSelectedProject(p)} className="p-3 rounded-lg bg-background border border-border hover:border-primary/30 cursor-pointer transition-colors">
                      <p className="text-xs font-medium text-foreground">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{p.client_name}</p>
                      <p className="text-[10px] font-semibold text-green-400 mt-1">${Number(p.value).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "timeline" && (
        <div className="rounded-xl bg-card border border-border">
          <EmptyState icon={Clock}
            title={{ es: "Timeline vacío", en: "Empty timeline" }}
            subtitle={{ es: "Crea proyectos con fechas de entrega para verlos en el timeline.", en: "Create projects with due dates to see them on the timeline." }}
            ctaLabel={{ es: "+ Nuevo proyecto", en: "+ New project" }}
            onCta={() => setShowNewModal(true)} />
        </div>
      )}

      {/* New project modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNewModal(false)} />
          <div className="relative w-full max-w-md rounded-xl bg-card border border-border p-6 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">{lang === "es" ? "Nuevo proyecto" : "New project"}</h2>
              <button onClick={() => setShowNewModal(false)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{lang === "es" ? "Nombre del proyecto" : "Project name"}</label>
                <input value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg text-sm bg-background border border-border text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                  placeholder={lang === "es" ? "Ej: Rediseño web Acme" : "e.g. Acme website redesign"} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{lang === "es" ? "Cliente" : "Client"}</label>
                <input value={newProject.client} onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg text-sm bg-background border border-border text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                  placeholder={lang === "es" ? "Nombre del cliente" : "Client name"} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">{lang === "es" ? "Tipo" : "Type"}</label>
                  <select value={newProject.type} onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg text-sm bg-background border border-border text-foreground outline-none focus:border-primary transition-colors">
                    {PROJECT_TYPES.map((t) => <option key={t.es} value={t[lang]}>{t[lang]}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">{lang === "es" ? "Valor ($)" : "Value ($)"}</label>
                  <input type="number" value={newProject.value} onChange={(e) => setNewProject({ ...newProject, value: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg text-sm bg-background border border-border text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50" placeholder="0" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{lang === "es" ? "Fecha de entrega" : "Due date"}</label>
                <input type="date" value={newProject.dueDate} onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg text-sm bg-background border border-border text-foreground outline-none focus:border-primary transition-colors" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setShowNewModal(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                {lang === "es" ? "Cancelar" : "Cancel"}
              </button>
              <button onClick={handleSaveProject} disabled={saving || !newProject.name.trim()}
                className="px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40">
                {saving ? "..." : lang === "es" ? "Guardar" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProyectosPage;
