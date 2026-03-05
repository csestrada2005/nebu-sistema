import { useState } from "react";
import MetricasTab from "./linkedin/MetricasTab";
import ProspectosTab from "./linkedin/ProspectosTab";
import MensajesTab from "./linkedin/MensajesTab";
import ContenidoTab from "./linkedin/ContenidoTab";
import { useLanguage } from "@/contexts/LanguageContext";

type Tab = "metricas" | "prospectos" | "mensajes" | "contenido";

const LinkedInPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("metricas");
  const { lang } = useLanguage();

  const tabs: { id: Tab; label: string }[] = [
    { id: "metricas", label: lang === "es" ? "Métricas" : "Metrics" },
    { id: "prospectos", label: lang === "es" ? "Prospectos" : "Prospects" },
    { id: "mensajes", label: lang === "es" ? "Mensajes" : "Messages" },
    { id: "contenido", label: lang === "es" ? "Contenido" : "Content" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold" style={{ color: "var(--nebu-text)" }}>LinkedIn — NEBU STUDIO</h1>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#38A16922", color: "#38A169" }}>
              <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#38A169" }} />
              {lang === "es" ? "Agente activo" : "Agent active"}
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: "var(--nebu-text-secondary)" }}>
            {lang === "es" ? "Prospección activa · Sales Navigator · Contenido viral" : "Active prospecting · Sales Navigator · Viral content"}
          </p>
        </div>
        <button className="px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap" style={{ backgroundColor: "var(--nebu-accent)", color: "#fff" }}>
          {lang === "es" ? "Nueva Campaña +" : "New Campaign +"}
        </button>
      </div>

      <div className="flex gap-0" style={{ borderBottom: "1px solid var(--nebu-border)" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className="px-5 py-2.5 text-sm font-medium transition-colors relative"
            style={{ color: activeTab === t.id ? "var(--nebu-text)" : "var(--nebu-text-secondary)" }}>
            {t.label}
            {activeTab === t.id && <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: "var(--nebu-accent)" }} />}
          </button>
        ))}
      </div>

      <div className="animate-fade-in" key={activeTab}>
        {activeTab === "metricas" && <MetricasTab />}
        {activeTab === "prospectos" && <ProspectosTab />}
        {activeTab === "mensajes" && <MensajesTab />}
        {activeTab === "contenido" && <ContenidoTab />}
      </div>
    </div>
  );
};

export default LinkedInPage;
