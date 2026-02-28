import { useState } from "react";
import { Plus } from "lucide-react";
import { Project, funnelSteps } from "@/data/mock";
import { useCrm } from "@/contexts/CrmContext";

const estadoColors: Record<string, string> = {
  activo: "bg-nebu-green/10 text-nebu-green border-nebu-green/20",
  revisión: "bg-nebu-amber/10 text-nebu-amber border-nebu-amber/20",
  completado: "bg-primary/10 text-primary border-primary/20",
  pausado: "bg-nebu-surface text-nebu-muted border-nebu-border",
};

const editableColumns = ["cliente", "servicio", "precio", "entregaEst", "responsable"] as const;
type EditableCol = typeof editableColumns[number];

const ProjectTable = () => {
  const { state, actions } = useCrm();
  const [editing, setEditing] = useState<{ row: number; col: EditableCol } | null>(null);

  const handleEdit = (projectId: string, col: EditableCol, value: string) => {
    actions.updateProject(projectId, {
      [col]: col === "precio" ? Number(value) || 0 : value,
    });
    setEditing(null);
  };

  const addProject = () => {
    actions.addProject({
      cliente: "Nuevo Cliente",
      servicio: "Servicio pendiente",
      precio: 0,
      estado: "activo",
      pasoFunnel: 1,
      entregaEst: "—",
      responsable: "—",
    });
  };

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-mono text-[10px] uppercase tracking-widest text-nebu-muted">
          Proyectos Activos
        </h3>
      </div>

      <div className="overflow-x-auto border border-nebu-border rounded-md">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-nebu-border bg-nebu-surface/50">
              {["ID", "Cliente", "Servicio", "Precio", "Estado", "Funnel", "Entrega", "Resp."].map(
                (h) => (
                  <th key={h} className="text-left px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-nebu-muted font-normal">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {state.projects.map((project, rowIdx) => (
              <tr
                key={project.id}
                className="border-b border-nebu-border last:border-0 hover:bg-nebu-surface/30 transition-colors"
              >
                <td className="px-3 py-2.5 font-mono text-nebu-text-dim">{project.id}</td>
                {(["cliente", "servicio"] as EditableCol[]).map((col) => (
                  <td
                    key={col}
                    className="px-3 py-2.5 cursor-pointer"
                    onDoubleClick={() => setEditing({ row: rowIdx, col })}
                  >
                    {editing?.row === rowIdx && editing.col === col ? (
                      <input
                        autoFocus
                        defaultValue={project[col] as string}
                        onBlur={(e) => handleEdit(project.id, col, e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                        className="bg-nebu-surface border border-primary/30 rounded px-1.5 py-0.5 text-xs w-full focus:outline-none"
                      />
                    ) : (
                      <span>{project[col] as string}</span>
                    )}
                  </td>
                ))}
                <td
                  className="px-3 py-2.5 font-mono cursor-pointer"
                  onDoubleClick={() => setEditing({ row: rowIdx, col: "precio" })}
                >
                  {editing?.row === rowIdx && editing.col === "precio" ? (
                    <input
                      autoFocus
                      type="number"
                      defaultValue={project.precio}
                      onBlur={(e) => handleEdit(project.id, "precio", e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                      className="bg-nebu-surface border border-primary/30 rounded px-1.5 py-0.5 text-xs w-20 focus:outline-none"
                    />
                  ) : (
                    `$${project.precio.toLocaleString()}`
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-full border ${estadoColors[project.estado]}`}>
                    {project.estado}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex gap-0.5" title={`Paso ${project.pasoFunnel}/12 — ${funnelSteps[project.pasoFunnel - 1]}`}>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-3 rounded-[1px] ${i < project.pasoFunnel ? "bg-primary" : "bg-nebu-surface border border-nebu-border"}`}
                      />
                    ))}
                  </div>
                </td>
                <td
                  className="px-3 py-2.5 font-mono text-nebu-text-dim cursor-pointer"
                  onDoubleClick={() => setEditing({ row: rowIdx, col: "entregaEst" })}
                >
                  {editing?.row === rowIdx && editing.col === "entregaEst" ? (
                    <input
                      autoFocus
                      defaultValue={project.entregaEst}
                      onBlur={(e) => handleEdit(project.id, "entregaEst", e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                      className="bg-nebu-surface border border-primary/30 rounded px-1.5 py-0.5 text-xs w-24 focus:outline-none"
                    />
                  ) : (
                    project.entregaEst
                  )}
                </td>
                <td
                  className="px-3 py-2.5 cursor-pointer"
                  onDoubleClick={() => setEditing({ row: rowIdx, col: "responsable" })}
                >
                  {editing?.row === rowIdx && editing.col === "responsable" ? (
                    <input
                      autoFocus
                      defaultValue={project.responsable}
                      onBlur={(e) => handleEdit(project.id, "responsable", e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                      className="bg-nebu-surface border border-primary/30 rounded px-1.5 py-0.5 text-xs w-20 focus:outline-none"
                    />
                  ) : (
                    project.responsable
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addProject}
        className="mt-3 flex items-center gap-1.5 text-xs font-mono text-nebu-text-dim hover:text-primary transition-colors"
      >
        <Plus size={14} /> Agregar proyecto
      </button>
    </div>
  );
};

export default ProjectTable;
