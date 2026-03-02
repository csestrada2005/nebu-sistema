import React, { useState } from "react";

// ── 12 Funnel Steps ──
const STEPS = [
  { num: 1, name: "Prospección" },
  { num: 2, name: "Primer Contacto" },
  { num: 3, name: "Cuestionario de Inicio" },
  { num: 4, name: "Plan del Proyecto" },
  { num: 5, name: "Cuestionario de Implementación" },
  { num: 6, name: "PDF / Propuesta Final" },
  { num: 7, name: "Contrato + 50% Anticipo" },
  { num: 8, name: "Inicio + Lista Semanal" },
  { num: 9, name: "Avances Semanales" },
  { num: 10, name: "Ronda Final de Cambios" },
  { num: 11, name: "Entrega Final + Cobro 50%" },
  { num: 12, name: "Mantenimiento Mensual" },
];

// ── Project data in funnel ──
const PIPELINE_PROJECTS = [
  {
    id: "P01",
    nombre: "RAWPAW",
    cliente: "Emma Rawson",
    tipo: "E-commerce",
    responsable: "Josep",
    paso: 11,
    nota: "Entregado, en revisión cliente. Saldo $0.",
  },
  {
    id: "P02",
    nombre: "PAPACHOA",
    cliente: "Cesar Padilla",
    tipo: "E-commerce",
    responsable: "Josep, Emilio",
    paso: 9,
    nota: "En proceso. Sin anticipo pagado. Responsable: Josep, Emilio.",
  },
  {
    id: "P03",
    nombre: "BAZAR CENTENARIO",
    cliente: "BAZAR CENTENARIO",
    tipo: "Sistema",
    responsable: "Josep",
    paso: 8,
    nota: "Anticipo pagado $12,500. Saldo pendiente $12,500.",
  },
];

const tipoBadge = (tipo: string) => {
  const colors: Record<string, string> = {
    "E-commerce": "bg-purple-900/40 text-purple-400 border-purple-700/40",
    SaaS: "bg-blue-900/40 text-blue-400 border-blue-700/40",
    Sistema: "bg-amber-900/40 text-amber-400 border-amber-700/40",
  };
  return colors[tipo] || "bg-gray-800 text-gray-400 border-gray-700";
};

interface PipelinePageProps {
  onViewProject?: (projectId: string) => void;
}

const PipelinePage: React.FC<PipelinePageProps> = ({ onViewProject }) => {
  const [view, setView] = useState<"kanban" | "timeline">("kanban");

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            PIPELINE DE VENTAS
          </h1>
          <p className="text-sm text-[#888888] mt-1">
            Funnel de 12 pasos — Nebu Studio
          </p>
        </div>

        {/* Toggle Kanban / Timeline */}
        <div className="flex items-center gap-1 bg-[#111111] border border-[#2a2a2a] rounded-lg p-1">
          <button
            onClick={() => setView("kanban")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === "kanban"
                ? "bg-[#E53E3E] text-white"
                : "text-[#888888] hover:text-white"
            }`}
          >
            Kanban
          </button>
          <button
            onClick={() => setView("timeline")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === "timeline"
                ? "bg-[#E53E3E] text-white"
                : "text-[#888888] hover:text-white"
            }`}
          >
            Timeline
          </button>
        </div>
      </div>

      {view === "kanban" ? (
        /* ═══════════════ KANBAN VIEW ═══════════════ */
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3" style={{ minWidth: "2400px" }}>
            {STEPS.map((step) => {
              const projects = PIPELINE_PROJECTS.filter(
                (p) => p.paso === step.num
              );
              const hasProjects = projects.length > 0;

              return (
                <div
                  key={step.num}
                  className={`flex-1 min-w-[200px] rounded-xl ${
                    hasProjects ? "opacity-100" : "opacity-50"
                  }`}
                  style={{
                    background: "#111111",
                    borderTop: hasProjects
                      ? "2px solid #E53E3E"
                      : "2px solid #2a2a2a",
                  }}
                >
                  {/* Column header */}
                  <div className="p-3 border-b border-[#2a2a2a]">
                    <span
                      className={`text-xs font-bold ${
                        hasProjects ? "text-[#E53E3E]" : "text-[#555555]"
                      }`}
                    >
                      {String(step.num).padStart(2, "0")}
                    </span>
                    <p
                      className={`text-xs font-semibold mt-1 leading-tight ${
                        hasProjects ? "text-[#E53E3E]" : "text-[#555555]"
                      }`}
                    >
                      {step.name}
                    </p>
                  </div>

                  {/* Cards */}
                  <div className="p-2 space-y-2 overflow-y-auto max-h-[500px]">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 hover:shadow-[0_0_15px_rgba(229,62,62,0.1)] transition-all"
                      >
                        <p className="text-sm font-bold text-white">
                          {proj.nombre}
                        </p>
                        <p className="text-xs text-[#888888] mt-1">
                          {proj.cliente}
                        </p>
                        <span
                          className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-medium rounded border ${tipoBadge(
                            proj.tipo
                          )}`}
                        >
                          {proj.tipo}
                        </span>
                        <p className="text-[10px] text-[#666666] mt-2">
                          {proj.responsable}
                        </p>
                        <p className="text-[11px] text-[#888888] italic mt-2 leading-snug">
                          {proj.nota}
                        </p>
                        <button
                          onClick={() => onViewProject?.(proj.id)}
                          className="mt-3 text-[11px] text-[#E53E3E] hover:text-red-300 font-medium transition-colors"
                        >
                          Ver proyecto →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ═══════════════ TIMELINE VIEW ═══════════════ */
        <div className="space-y-6">
          {PIPELINE_PROJECTS.map((proj) => {
            const currentStep = STEPS.find((s) => s.num === proj.paso);
            const progress = ((proj.paso - 1) / (STEPS.length - 1)) * 100;

            return (
              <div
                key={proj.id}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6"
              >
                {/* Project header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">
                      {proj.nombre}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-medium rounded border ${tipoBadge(
                        proj.tipo
                      )}`}
                    >
                      {proj.tipo}
                    </span>
                  </div>
                  <span className="text-xs text-[#888888]">
                    Paso {proj.paso} de 12
                  </span>
                </div>

                {/* Progress bar */}
                <div className="relative mb-3">
                  {/* Track */}
                  <div className="h-2 bg-[#222222] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        background:
                          "linear-gradient(90deg, #22c55e 0%, #E53E3E 100%)",
                      }}
                    />
                  </div>

                  {/* Step dots */}
                  <div className="flex justify-between mt-2">
                    {STEPS.map((step) => {
                      const isCompleted = step.num < proj.paso;
                      const isCurrent = step.num === proj.paso;

                      return (
                        <div
                          key={step.num}
                          className="flex flex-col items-center"
                          style={{ width: "calc(100% / 12)" }}
                        >
                          <div
                            className={`w-3 h-3 rounded-full border-2 transition-all ${
                              isCurrent
                                ? "bg-[#E53E3E] border-[#E53E3E] scale-125 shadow-[0_0_8px_rgba(229,62,62,0.5)]"
                                : isCompleted
                                ? "bg-[#22c55e] border-[#22c55e]"
                                : "bg-[#333333] border-[#444444]"
                            }`}
                          />
                          <span
                            className={`text-[9px] mt-1 text-center leading-tight ${
                              isCurrent
                                ? "text-[#E53E3E] font-bold"
                                : isCompleted
                                ? "text-[#22c55e]"
                                : "text-[#555555]"
                            }`}
                          >
                            {String(step.num).padStart(2, "0")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Current step label */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2a2a2a]">
                  <div>
                    <p className="text-xs text-[#E53E3E] font-bold uppercase tracking-widest">
                      Paso actual
                    </p>
                    <p className="text-sm text-white mt-1 font-medium">
                      {String(proj.paso).padStart(2, "0")} —{" "}
                      {currentStep?.name}
                    </p>
                  </div>
                  <p className="text-xs text-[#888888] italic max-w-sm text-right">
                    {proj.nota}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PipelinePage;
