import { Menu, ChevronRight, Globe } from "lucide-react";
import type { Page } from "./AppSidebar";
import { useLanguage } from "@/contexts/LanguageContext";

interface TopbarProps {
  onToggleSidebar: () => void;
  activePage: Page;
}

const pageLabels: Record<Page, Record<"es" | "en", string>> = {
  dashboard: { es: "Dashboard", en: "Dashboard" },
  pipeline: { es: "Pipeline", en: "Pipeline" },
  leads: { es: "Leads", en: "Leads" },
  cotizaciones: { es: "Cotizaciones", en: "Quotes" },
  proyectos: { es: "Proyectos", en: "Projects" },
  contactos: { es: "Contactos", en: "Contacts" },
  finanzas: { es: "Finanzas", en: "Finances" },
  novy: { es: "NOVY", en: "NOVY" },
  configuracion: { es: "Configuración", en: "Settings" },
  roles: { es: "Roles y Accesos", en: "Roles & Access" },
  integraciones: { es: "Integraciones", en: "Integrations" },
};

const Topbar = ({ onToggleSidebar, activePage }: TopbarProps) => {
  const { lang, toggleLang } = useLanguage();

  return (
    <header
      className="h-14 flex items-center justify-between px-6 z-50 shrink-0"
      style={{ backgroundColor: "#0D0D0D", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="lg:hidden p-1.5 rounded transition-opacity hover:opacity-80" aria-label="Toggle sidebar">
          <Menu size={20} style={{ color: "#FFFFFF" }} />
        </button>
        <nav className="flex items-center gap-1.5 text-sm">
          <span style={{ color: "#71717A" }}>CRM</span>
          <ChevronRight size={14} style={{ color: "#71717A" }} />
          <span className="font-semibold" style={{ color: "#FFFFFF" }}>
            {pageLabels[activePage]?.[lang] || activePage}
          </span>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
          style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)", color: "#FFFFFF" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#E63946")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
        >
          <Globe size={13} style={{ color: "#71717A" }} />
          {lang === "es" ? "EN" : "ES"}
        </button>
      </div>
    </header>
  );
};

export default Topbar;
