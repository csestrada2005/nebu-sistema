import { FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EmptyState from "@/components/EmptyState";

const CotizacionesPage = () => {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "#FFFFFF" }}>
            {lang === "es" ? "Cotizaciones" : "Quotes"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#71717A" }}>
            {lang === "es" ? "Propuestas y presupuestos" : "Proposals and budgets"}
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
          style={{ backgroundColor: "#E63946", color: "#FFFFFF" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C62828")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E63946")}
        >
          + {lang === "es" ? "Nueva cotización" : "New quote"}
        </button>
      </div>

      <div className="rounded-xl" style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
        <EmptyState
          icon={FileText}
          title={{ es: "Cotizaciones vacío", en: "Quotes empty" }}
          subtitle={{ es: "Agrega tu primera cotización para comenzar.", en: "Add your first quote to get started." }}
          ctaLabel={{ es: "+ Agregar cotización", en: "+ Add quote" }}
        />
      </div>
    </div>
  );
};

export default CotizacionesPage;
