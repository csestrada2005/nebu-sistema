import { Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EmptyState from "@/components/EmptyState";

const ConfiguracionPage = () => {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: "#FFFFFF" }}>
          {lang === "es" ? "Configuración" : "Settings"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#71717A" }}>
          {lang === "es" ? "Ajustes del sistema" : "System settings"}
        </p>
      </div>

      <div className="rounded-xl" style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
        <EmptyState
          icon={Settings}
          title={{ es: "Configuración vacía", en: "Settings empty" }}
          subtitle={{ es: "Las opciones de configuración se habilitarán próximamente.", en: "Configuration options will be available soon." }}
        />
      </div>
    </div>
  );
};

export default ConfiguracionPage;
