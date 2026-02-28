import { useCrm } from "@/contexts/CrmContext";

const estadoColors: Record<string, string> = {
  activo: "bg-nebu-green/10 text-nebu-green border-nebu-green/20",
  revisión: "bg-nebu-amber/10 text-nebu-amber border-nebu-amber/20",
  completado: "bg-primary/10 text-primary border-primary/20",
  pausado: "bg-nebu-surface text-nebu-muted border-nebu-border",
};

const ProyectosPage = () => {
  const { state } = useCrm();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-5xl tracking-tight">PROYECTOS</h1>
        <p className="font-mono text-xs text-nebu-text-dim mt-1">
          DETALLE FUNNEL · 12 PASOS
        </p>
      </div>

      <div className="grid gap-4">
        {state.projects.map((project) => (
          <div
            key={project.id}
            className="bg-nebu-surface border border-nebu-border rounded-md p-5 hover:border-primary/30 transition-colors animate-fade-up"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] text-nebu-muted">{project.id}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${estadoColors[project.estado]}`}>
                    {project.estado}
                  </span>
                </div>
                <h3 className="font-display text-2xl">{project.cliente}</h3>
                <p className="text-xs text-nebu-text-dim">{project.servicio}</p>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl text-primary">${project.precio.toLocaleString()}</div>
                <div className="font-mono text-[10px] text-nebu-muted">MXN</div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-1.5 mb-3">
              {state.funnelSteps.map((step, i) => (
                <div
                  key={i}
                  className={`
                    h-7 rounded-sm flex items-center justify-center text-[8px] font-mono
                    ${i < project.pasoFunnel
                      ? "bg-primary text-primary-foreground"
                      : "bg-nebu-carbon border border-nebu-border text-nebu-muted"
                    }
                  `}
                  title={step}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="font-mono text-xs text-nebu-text-dim">
              Paso actual: {project.pasoFunnel} — {state.funnelSteps[project.pasoFunnel - 1]}
              {project.stack && <span className="ml-3 text-nebu-muted">· Stack: {project.stack}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProyectosPage;
