import { Plug } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EmptyState from "@/components/EmptyState";

const IntegracionesPage = () => {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: "#FFFFFF" }}>
          {lang === "es" ? "Integraciones" : "Integrations"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#71717A" }}>
          {lang === "es" ? "Servicios conectados a tu CRM" : "Services connected to your CRM"}
        </p>
      </div>

      <div className="rounded-xl" style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
        <EmptyState
          icon={Plug}
          title={{ es: "Integraciones vacío", en: "Integrations empty" }}
          subtitle={{ es: "Conecta tu primer servicio externo.", en: "Connect your first external service." }}
          ctaLabel={{ es: "+ Agregar integración", en: "+ Add integration" }}
        />
      </div>
    </div>
  );
};

export default IntegracionesPage;
