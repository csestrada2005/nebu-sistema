import { Menu, ChevronRight, Globe } from "lucide-react";
import type { Page } from "./AppSidebar";
import { useLanguage } from "@/contexts/LanguageContext";

interface TopbarProps {
  onToggleSidebar: () => void;
  activePage: Page;
  projectName?: string;
}

const pageLabels: Record<Page, Record<"es" | "en", string>> = {
  dashboard: { es: "Dashboard", en: "Dashboard" },
  proyectos: { es: "Proyectos", en: "Projects" },
  pipeline: { es: "Pipeline", en: "Pipeline" },
  herramientas: { es: "Herramientas", en: "Tools" },
  "mis-webs": { es: "Mis Webs", en: "My Webs" },
  contactos: { es: "Contactos", en: "Contacts" },
  contratos: { es: "Contratos", en: "Contracts" },
  cotizaciones: { es: "Cotizaciones", en: "Quotes" },
  plantillas: { es: "Plantillas", en: "Templates" },
  vendedores: { es: "Vendedores", en: "Sellers" },
  oportunidades: { es: "Oportunidades", en: "Opportunities" },
  llamadas: { es: "Llamadas", en: "Calls" },
  reportes: { es: "Reportes", en: "Reports" },
  forecast: { es: "Forecast", en: "Forecast" },
  rendimiento: { es: "Rendimiento", en: "Performance" },
  finanzas: { es: "Finanzas", en: "Finances" },
  linkedin: { es: "LinkedIn", en: "LinkedIn" },
  novy: { es: "NOVY", en: "NOVY" },
  email: { es: "Email", en: "Email" },
  calendario: { es: "Calendario", en: "Calendar" },
  configuracion: { es: "Configuración", en: "Settings" },
  tareas: { es: "Tareas", en: "Tasks" },
};

const Topbar = ({ onToggleSidebar, activePage, projectName }: TopbarProps) => {
  const { lang, toggleLang } = useLanguage();
  const today = new Date().toLocaleDateString(lang === "es" ? "es-MX" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <header
      className="h-14 flex items-center justify-between px-6 z-50 shrink-0"
      style={{ backgroundColor: "var(--nebu-surface)", borderBottom: "1px solid var(--nebu-border)" }}
    >
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="lg:hidden p-1.5 rounded hover:opacity-80 transition-opacity" aria-label="Toggle sidebar">
          <Menu size={20} style={{ color: "var(--nebu-text)" }} />
        </button>
        <nav className="flex items-center gap-1.5 text-sm">
          <span style={{ color: "var(--nebu-text-secondary)" }}>CRM</span>
          <ChevronRight size={14} style={{ color: "var(--nebu-text-secondary)" }} />
          <span className="font-semibold" style={{ color: projectName ? "var(--nebu-text-secondary)" : "var(--nebu-text)" }}>
            {pageLabels[activePage][lang]}
          </span>
          {projectName && (
            <>
              <ChevronRight size={14} style={{ color: "var(--nebu-text-secondary)" }} />
              <span className="font-semibold" style={{ color: "var(--nebu-text)" }}>{projectName}</span>
            </>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
          style={{ backgroundColor: "#111111", border: "1px solid #333333", color: "#FFFFFF" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#E63946")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#333333")}
        >
          <Globe size={13} style={{ color: "#888888" }} />
          {lang === "es" ? "EN" : "ES"}
        </button>
        <span className="text-sm hidden sm:block" style={{ color: "var(--nebu-text-secondary)" }}>{today}</span>
      </div>
    </header>
  );
};

export default Topbar;
