import { Kanban } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const COLUMNS = {
  es: ["Prospección", "Contactado", "Reunión", "Propuesta", "Negociación", "Cerrado"],
  en: ["Prospecting", "Contacted", "Meeting", "Proposal", "Negotiation", "Closed"],
};

const PipelinePage = () => {
  const { lang } = useLanguage();
  const columns = COLUMNS[lang];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "#FFFFFF" }}>Pipeline</h1>
          <p className="text-sm mt-1" style={{ color: "#71717A" }}>
            {lang === "es" ? "Funnel de ventas" : "Sales funnel"}
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
          style={{ backgroundColor: "#E63946", color: "#FFFFFF" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C62828")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E63946")}
        >
          + {lang === "es" ? "Agregar lead" : "Add lead"}
        </button>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3" style={{ minWidth: `${columns.length * 290}px` }}>
          {columns.map((col, i) => (
            <div
              key={col}
              className="flex-1 rounded-xl"
              style={{ minWidth: 280, backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Column header */}
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold" style={{ color: "#E63946" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xs font-semibold" style={{ color: "#FFFFFF" }}>{col}</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "#71717A" }}>
                  0
                </span>
              </div>

              {/* Empty column body */}
              <div className="p-4 flex flex-col items-center justify-center py-12">
                <Kanban size={20} strokeWidth={1.5} style={{ color: "#71717A", opacity: 0.4 }} />
                <p className="text-[11px] mt-2" style={{ color: "#71717A", opacity: 0.6 }}>
                  {lang === "es" ? "Sin leads" : "No leads"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PipelinePage;
