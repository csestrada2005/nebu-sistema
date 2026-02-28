import { useCrm } from "@/contexts/CrmContext";

const columns = [
  { id: "prospecto" as const, label: "PROSPECTO" },
  { id: "contacto" as const, label: "CONTACTO" },
  { id: "propuesta" as const, label: "PROPUESTA" },
  { id: "cerrado" as const, label: "CERRADO" },
];

const PipelinePage = () => {
  const { state } = useCrm();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-5xl tracking-tight">PIPELINE</h1>
        <p className="font-mono text-xs text-nebu-text-dim mt-1">
          VENTAS · KANBAN VIEW
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {columns.map((col) => {
          const leads = state.leads.filter((l) => l.etapa === col.id);
          return (
            <div key={col.id} className="space-y-2">
              <div className="flex items-center justify-between px-1 mb-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-nebu-muted">
                  {col.label}
                </span>
                <span className="font-mono text-[10px] text-nebu-muted">{leads.length}</span>
              </div>

              {leads.length === 0 ? (
                <div className="border border-dashed border-nebu-border rounded-md p-6 text-center">
                  <span className="font-mono text-[10px] text-nebu-muted">Sin leads</span>
                </div>
              ) : (
                leads.map((lead) => (
                  <div
                    key={lead.id}
                    className={`
                      bg-nebu-surface border rounded-md p-3 hover:border-primary/30 transition-colors animate-fade-up
                      ${col.id === "cerrado" ? "border-nebu-green/20" : "border-nebu-border"}
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{lead.nombre}</span>
                      <span className="font-mono text-[10px] text-nebu-muted">{lead.id}</span>
                    </div>
                    <p className="text-xs text-nebu-text-dim mb-2">{lead.servicio}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-primary">${lead.precio.toLocaleString()}</span>
                      <span className="font-mono text-[10px] text-nebu-muted">{lead.owner}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelinePage;
