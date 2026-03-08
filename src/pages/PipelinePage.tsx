import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const STEPS = {
  es: [
    { num: 1, name: "Prospección" }, { num: 2, name: "Nuevo Contacto" }, { num: 3, name: "Reunión Agendada" },
    { num: 4, name: "Propuesta Enviada" }, { num: 5, name: "Negociación" }, { num: 6, name: "Cerrado Ganado" },
  ],
  en: [
    { num: 1, name: "Prospecting" }, { num: 2, name: "New Contact" }, { num: 3, name: "Meeting Scheduled" },
    { num: 4, name: "Proposal Sent" }, { num: 5, name: "Negotiation" }, { num: 6, name: "Closed Won" },
  ],
};

interface PipelineProject {
  id: string;
  nombre: string;
  servicio: { es: string; en: string };
  valor: number;
  dias: number;
  paso: number;
  responsable: string;
}

const PIPELINE_PROJECTS: PipelineProject[] = [
  { id: "P01", nombre: "Café Revolución", servicio: { es: "Sitio Web", en: "Website" }, valor: 18000, dias: 3, paso: 2, responsable: "Josep" },
  { id: "P02", nombre: "Dr. Martínez Dental", servicio: { es: "Landing Page", en: "Landing Page" }, valor: 12000, dias: 1, paso: 2, responsable: "Emilio" },
  { id: "P03", nombre: "Boutique Amara", servicio: { es: "E-commerce", en: "E-commerce" }, valor: 45000, dias: 8, paso: 3, responsable: "Josep" },
  { id: "P04", nombre: "Gym PowerFit", servicio: { es: "Sitio + SEO", en: "Site + SEO" }, valor: 28000, dias: 12, paso: 3, responsable: "Emilio" },
  { id: "P05", nombre: "Restaurante Umami", servicio: { es: "Rediseño Web", en: "Web Redesign" }, valor: 22000, dias: 15, paso: 4, responsable: "Josep" },
  { id: "P06", nombre: "Estudio Legal Vega", servicio: { es: "Web + CRM", en: "Web + CRM" }, valor: 55000, dias: 5, paso: 5, responsable: "Josep" },
  { id: "P07", nombre: "RAWPAW", servicio: { es: "Branding + Web", en: "Branding + Web" }, valor: 35000, dias: 0, paso: 6, responsable: "Josep" },
];

const urgencyBorder = (dias: number) => {
  if (dias < 7) return "border-l-green-500";
  if (dias <= 14) return "border-l-yellow-500";
  return "border-l-red-500";
};

const urgencyBadgeBg = (dias: number) => {
  if (dias < 7) return "bg-green-500/20 text-green-400";
  if (dias <= 14) return "bg-yellow-500/20 text-yellow-400";
  return "bg-red-500/20 text-red-400";
};

interface PipelinePageProps { onViewProject?: (projectId: string) => void; }

const PipelinePage: React.FC<PipelinePageProps> = ({ onViewProject }) => {
  const [view, setView] = useState<"kanban" | "timeline">("kanban");
  const { lang } = useLanguage();
  const steps = STEPS[lang];

  const tt = {
    es: { title: "PIPELINE DE VENTAS", sub: "Funnel de ventas — Nebu Studio", viewProject: "Ver proyecto →", step: "Paso", of: "de", currentStep: "Paso actual", days: "días", day: "día", new: "Nuevo" },
    en: { title: "SALES PIPELINE", sub: "Sales funnel — Nebu Studio", viewProject: "View project →", step: "Step", of: "of", currentStep: "Current step", days: "days", day: "day", new: "New" },
  }[lang];

  const formatMXN = (v: number) => `$${v.toLocaleString("es-MX")} MXN`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{tt.title}</h1>
          <p className="text-sm text-[#888888] mt-1">{tt.sub}</p>
        </div>
        <div className="flex items-center gap-1 bg-[#111111] border border-[#2a2a2a] rounded-lg p-1">
          <button onClick={() => setView("kanban")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === "kanban" ? "bg-[#E53E3E] text-white" : "text-[#888888] hover:text-white"}`}>Kanban</button>
          <button onClick={() => setView("timeline")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === "timeline" ? "bg-[#E53E3E] text-white" : "text-[#888888] hover:text-white"}`}>Timeline</button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3" style={{ minWidth: "1200px" }}>
            {steps.map((step) => {
              const projects = PIPELINE_PROJECTS.filter((p) => p.paso === step.num);
              const hasProjects = projects.length > 0;
              const totalValue = projects.reduce((s, p) => s + p.valor, 0);
              return (
                <div key={step.num} className="flex-1 min-w-[200px] rounded-xl" style={{ background: "#111111", borderTop: hasProjects ? "2px solid #E53E3E" : "2px solid #2a2a2a" }}>
                  <div className="p-3 border-b border-[#2a2a2a] flex items-center justify-between">
                    <div>
                      <span className={`text-xs font-bold ${hasProjects ? "text-[#E53E3E]" : "text-[#555555]"}`}>{String(step.num).padStart(2, "0")}</span>
                      <p className={`text-xs font-semibold mt-1 leading-tight ${hasProjects ? "text-white" : "text-[#555555]"}`}>{step.name}</p>
                    </div>
                    {hasProjects && (
                      <span className="text-[10px] bg-[#E53E3E]/20 text-[#E53E3E] px-2 py-0.5 rounded-full font-bold">{projects.length}</span>
                    )}
                  </div>
                  {hasProjects && (
                    <div className="px-3 py-1.5 border-b border-[#2a2a2a]">
                      <p className="text-[10px] text-[#666666]">{formatMXN(totalValue)}</p>
                    </div>
                  )}
                  <div className="p-2 space-y-2 overflow-y-auto max-h-[500px]">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className={`bg-[#1a1a1a] border border-[#2a2a2a] border-l-4 ${urgencyBorder(proj.dias)} rounded-lg p-3 hover:shadow-[0_0_15px_rgba(229,62,62,0.1)] transition-all cursor-pointer`}
                        onClick={() => onViewProject?.(proj.id)}
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-bold text-white">{proj.nombre}</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${urgencyBadgeBg(proj.dias)}`}>
                            {proj.dias === 0 ? tt.new : `${proj.dias}d`}
                          </span>
                        </div>
                        <p className="text-xs text-[#888888] mt-1.5">{proj.servicio[lang]}</p>
                        <p className="text-sm font-semibold text-white mt-2">{formatMXN(proj.valor)}</p>
                        <p className="text-[10px] text-[#666666] mt-2">{proj.responsable}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {PIPELINE_PROJECTS.map((proj) => {
            const currentStep = steps.find((s) => s.num === proj.paso);
            const progress = ((proj.paso - 1) / (steps.length - 1)) * 100;
            return (
              <div key={proj.id} className={`bg-[#1a1a1a] border border-[#2a2a2a] border-l-4 ${urgencyBorder(proj.dias)} rounded-xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">{proj.nombre}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${urgencyBadgeBg(proj.dias)}`}>
                      {proj.dias === 0 ? tt.new : `${proj.dias} ${proj.dias === 1 ? tt.day : tt.days}`}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{formatMXN(proj.valor)}</p>
                    <span className="text-xs text-[#888888]">{tt.step} {proj.paso} {tt.of} {steps.length}</span>
                  </div>
                </div>
                <div className="relative mb-3">
                  <div className="h-2 bg-[#222222] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #22c55e 0%, #E53E3E 100%)" }} />
                  </div>
                  <div className="flex justify-between mt-2">
                    {steps.map((step) => {
                      const isCompleted = step.num < proj.paso;
                      const isCurrent = step.num === proj.paso;
                      return (
                        <div key={step.num} className="flex flex-col items-center" style={{ width: `calc(100% / ${steps.length})` }}>
                          <div className={`w-3 h-3 rounded-full border-2 transition-all ${isCurrent ? "bg-[#E53E3E] border-[#E53E3E] scale-125 shadow-[0_0_8px_rgba(229,62,62,0.5)]" : isCompleted ? "bg-[#22c55e] border-[#22c55e]" : "bg-[#333333] border-[#444444]"}`} />
                          <span className={`text-[9px] mt-1 text-center leading-tight ${isCurrent ? "text-[#E53E3E] font-bold" : isCompleted ? "text-[#22c55e]" : "text-[#555555]"}`}>{step.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2a2a2a]">
                  <div>
                    <p className="text-xs text-[#E53E3E] font-bold uppercase tracking-widest">{tt.currentStep}</p>
                    <p className="text-sm text-white mt-1 font-medium">{String(proj.paso).padStart(2, "0")} — {currentStep?.name}</p>
                  </div>
                  <p className="text-xs text-[#888888]">{proj.servicio[lang]} · {proj.responsable}</p>
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
