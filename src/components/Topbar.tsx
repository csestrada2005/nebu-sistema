import { Menu, ChevronRight } from "lucide-react";
import type { Page } from "./AppSidebar";

interface TopbarProps {
  onToggleSidebar: () => void;
  activePage: Page;
  projectName?: string;
}

const pageLabels: Record<Page, string> = {
  dashboard: "Dashboard",
  proyectos: "Proyectos",
  pipeline: "Pipeline",
  herramientas: "Herramientas",
  finanzas: "Finanzas",
};

const Topbar = ({ onToggleSidebar, activePage, projectName }: TopbarProps) => {
  const today = new Date().toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <header
      className="h-14 flex items-center justify-between px-6 z-50 shrink-0"
      style={{
        backgroundColor: "var(--nebu-surface)",
        borderBottom: "1px solid var(--nebu-border)",
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded hover:opacity-80 transition-opacity"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} style={{ color: "var(--nebu-text)" }} />
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm">
          <span style={{ color: "var(--nebu-text-secondary)" }}>CRM</span>
          <ChevronRight
            size={14}
            style={{ color: "var(--nebu-text-secondary)" }}
          />
          <span
            className={`font-semibold ${
              projectName ? "" : ""
            }`}
            style={{
              color: projectName
                ? "var(--nebu-text-secondary)"
                : "var(--nebu-text)",
            }}
          >
            {pageLabels[activePage]}
          </span>
          {projectName && (
            <>
              <ChevronRight
                size={14}
                style={{ color: "var(--nebu-text-secondary)" }}
              />
              <span
                className="font-semibold"
                style={{ color: "var(--nebu-text)" }}
              >
                {projectName}
              </span>
            </>
          )}
        </nav>
      </div>

      <span
        className="text-sm hidden sm:block"
        style={{ color: "var(--nebu-text-secondary)" }}
      >
        {today}
      </span>
    </header>
  );
};

export default Topbar;
