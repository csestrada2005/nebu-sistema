import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Project {
  id: string;
  name: string;
  client_name: string;
  project_type: string;
  value: number;
  status: string;
  due_date: string | null;
  notes: string;
  created_at: string;
  user_id: string;
}

export interface Lead {
  id: string;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  servicio: string;
  valor_estimado: number;
  fuente: string;
  estado: string;
  notas: string;
  linkedin_url: string;
  ultimo_contacto: string | null;
  created_at: string;
  user_id: string;
}

export interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  due_date: string | null;
  created_at: string;
  user_id: string;
}

interface CrmContextValue {
  projects: Project[];
  leads: Lead[];
  tasks: Task[];
  loading: boolean;
  refreshProjects: () => Promise<void>;
  refreshLeads: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  refreshAll: () => Promise<void>;
  buildContextSummary: () => string;
}

const CrmContext = createContext<CrmContextValue | null>(null);

export function CrmProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProjects = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (data) setProjects(data as unknown as Project[]);
  }, [user]);

  const refreshLeads = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (data) setLeads(data as unknown as Lead[]);
  }, [user]);

  const refreshTasks = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
    if (data) setTasks(data as unknown as Task[]);
  }, [user]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([refreshProjects(), refreshLeads(), refreshTasks()]);
    setLoading(false);
  }, [refreshProjects, refreshLeads, refreshTasks]);

  useEffect(() => {
    if (user) {
      refreshAll();
    } else {
      setProjects([]);
      setLeads([]);
      setTasks([]);
      setLoading(false);
    }
  }, [user]);

  const buildContextSummary = useCallback((): string => {
    const projSummary = projects.length > 0
      ? projects.map(p => `— ${p.name} (${p.client_name}): ${p.project_type} · $${p.value.toLocaleString()} · Status: ${p.status} · Due: ${p.due_date || "N/A"}`).join("\n")
      : "No projects yet.";

    const leadSummary = leads.length > 0
      ? leads.map(l => `— ${l.nombre} (${l.empresa}): ${l.servicio} · $${l.valor_estimado.toLocaleString()} · ${l.estado}`).join("\n")
      : "No leads yet.";

    const taskSummary = tasks.length > 0
      ? tasks.map(t => `— ${t.title}: ${t.status} · ${t.priority} priority · Assigned: ${t.assignee || "Unassigned"}`).join("\n")
      : "No tasks yet.";

    return `## Projects (${projects.length})\n${projSummary}\n\n## Leads (${leads.length})\n${leadSummary}\n\n## Tasks (${tasks.length})\n${taskSummary}`;
  }, [projects, leads, tasks]);

  return (
    <CrmContext.Provider value={{ projects, leads, tasks, loading, refreshProjects, refreshLeads, refreshTasks, refreshAll, buildContextSummary }}>
      {children}
    </CrmContext.Provider>
  );
}

export function useCrm() {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error("useCrm must be used within CrmProvider");
  return ctx;
}
