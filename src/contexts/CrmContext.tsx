import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  Project,
  PipelineLead,
  projects as initialProjects,
  pipelineLeads as initialLeads,
  funnelSteps,
  servicios,
} from "@/data/mock";

export interface CrmState {
  projects: Project[];
  leads: PipelineLead[];
  funnelSteps: string[];
  servicios: typeof servicios;
}

export interface CrmActions {
  updateProjectStatus: (projectId: string, status: Project["estado"]) => string;
  advanceFunnel: (projectId: string) => string;
  addLead: (lead: Omit<PipelineLead, "id">) => string;
  moveLead: (leadId: string, etapa: PipelineLead["etapa"]) => string;
  addProject: (project: Omit<Project, "id">) => string;
  updateProject: (projectId: string, updates: Partial<Project>) => string;
}

interface CrmContextValue {
  state: CrmState;
  actions: CrmActions;
  buildContextSummary: () => string;
}

const CrmContext = createContext<CrmContextValue | null>(null);

export function CrmProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [leads, setLeads] = useState<PipelineLead[]>(initialLeads);

  const updateProjectStatus = useCallback((projectId: string, status: Project["estado"]): string => {
    let found = false;
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          found = true;
          return { ...p, estado: status };
        }
        return p;
      })
    );
    return found
      ? `✅ Proyecto ${projectId} actualizado a "${status}".`
      : `⚠ Proyecto ${projectId} no encontrado.`;
  }, []);

  const advanceFunnel = useCallback((projectId: string): string => {
    let result = "";
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          if (p.pasoFunnel >= 12) {
            result = `⚠ ${p.cliente} ya está en el último paso (${funnelSteps[11]}).`;
            return p;
          }
          const newStep = p.pasoFunnel + 1;
          result = `✅ ${p.cliente} avanzó al paso ${newStep}/12 (${funnelSteps[newStep - 1]}).`;
          return { ...p, pasoFunnel: newStep };
        }
        return p;
      })
    );
    return result || `⚠ Proyecto ${projectId} no encontrado.`;
  }, []);

  const addLead = useCallback((lead: Omit<PipelineLead, "id">): string => {
    const newId = `L-${String(leads.length + 1).padStart(3, "0")}`;
    const newLead: PipelineLead = { ...lead, id: newId };
    setLeads((prev) => [...prev, newLead]);
    return `✅ Lead "${lead.nombre}" agregado como ${newId} en etapa "${lead.etapa}".`;
  }, [leads.length]);

  const moveLead = useCallback((leadId: string, etapa: PipelineLead["etapa"]): string => {
    let found = false;
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          found = true;
          return { ...l, etapa };
        }
        return l;
      })
    );
    return found
      ? `✅ Lead ${leadId} movido a "${etapa}".`
      : `⚠ Lead ${leadId} no encontrado.`;
  }, []);

  const addProject = useCallback((project: Omit<Project, "id">): string => {
    const newId = `NB-${String(projects.length + 1).padStart(3, "0")}`;
    setProjects((prev) => [...prev, { ...project, id: newId }]);
    return `✅ Proyecto "${project.cliente}" creado como ${newId}.`;
  }, [projects.length]);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>): string => {
    let found = false;
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          found = true;
          return { ...p, ...updates };
        }
        return p;
      })
    );
    return found
      ? `✅ Proyecto ${projectId} actualizado.`
      : `⚠ Proyecto ${projectId} no encontrado.`;
  }, []);

  const buildContextSummary = useCallback((): string => {
    const projSummary = projects
      .map(
        (p) =>
          `— ${p.id} ${p.cliente}: ${p.servicio} · $${p.precio.toLocaleString()} MXN · Paso ${p.pasoFunnel}/12 (${funnelSteps[p.pasoFunnel - 1]}) · Estado: ${p.estado} · Entrega: ${p.entregaEst} · Responsable: ${p.responsable}${p.estado === "revisión" ? " ⚠ En revisión" : ""}`
      )
      .join("\n");

    const leadSummary = leads
      .map(
        (l) =>
          `— ${l.id} ${l.nombre}: ${l.servicio} · $${l.precio.toLocaleString()} · ${l.etapa} (${l.owner})`
      )
      .join("\n");

    return `## Proyectos activos (${projects.length})\n${projSummary}\n\n## Pipeline de ventas (${leads.length} leads)\n${leadSummary}`;
  }, [projects, leads]);

  return (
    <CrmContext.Provider
      value={{
        state: { projects, leads, funnelSteps, servicios },
        actions: { updateProjectStatus, advanceFunnel, addLead, moveLead, addProject, updateProject },
        buildContextSummary,
      }}
    >
      {children}
    </CrmContext.Provider>
  );
}

export function useCrm() {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error("useCrm must be used within CrmProvider");
  return ctx;
}
