import { DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EmptyState from "@/components/EmptyState";

const FinanzasPage = () => {
  const { lang } = useLanguage();

  const kpis = [
    { label: { es: "Ingresos contratados", en: "Contracted revenue" }, value: "$0" },
    { label: { es: "Cobrado hasta hoy", en: "Collected to date" }, value: "$0" },
    { label: { es: "Por cobrar", en: "Outstanding" }, value: "$0" },
    { label: { es: "Utilidad estimada", en: "Estimated profit" }, value: "$0" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: "#FFFFFF" }}>
          {lang === "es" ? "Finanzas" : "Finances"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#71717A" }}>
          {lang === "es" ? "Dashboard financiero" : "Financial dashboard"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label.es} className="rounded-xl p-5" style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#71717A" }}>{kpi.label[lang]}</span>
            <p className="text-3xl font-bold mt-2" style={{ color: "#FFFFFF" }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl" style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
        <EmptyState
          icon={DollarSign}
          title={{ es: "Sin movimientos", en: "No transactions" }}
          subtitle={{ es: "Los datos financieros aparecerán cuando registres proyectos.", en: "Financial data will appear when you register projects." }}
        />
      </div>
    </div>
  );
};

export default FinanzasPage;
