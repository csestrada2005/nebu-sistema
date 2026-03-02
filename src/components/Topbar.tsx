import { Menu } from "lucide-react";
import type { Page } from "./AppSidebar";

interface TopbarProps {
  onToggleSidebar: () => void;
    activePage: Page;
    }

    const pageLabels: Record<Page, string> = {
      dashboard: "Dashboard",
        proyectos: "Proyectos",
          pipeline: "Pipeline",
            herramientas: "Herramientas",
              finanzas: "Finanzas",
              };

              const Topbar = ({ onToggleSidebar, activePage }: TopbarProps) => {
                const today = new Date().toLocaleDateString("es-MX", {
                    weekday: "long",
                        year: "numeric",
                            month: "long",
                                day: "numeric",
                                  });

                                    return (
                                        <header
                                              className="h-14 flex items-center justify-between px-6 z-50 shrink-0"
                                                    style={{
                                                            backgroundColor: "var(--nebu-surface)",
                                                                    borderBottom: "1px solid var(--nebu-border)",
                                                                          }}
                                                                              >
                                                                                    <div className="flex items-center gap-4">
                                                                                            <button
                                                                                                      onClick={onToggleSidebar}
                                                                                                                className="lg:hidden p-1.5 rounded hover:opacity-80 transition-opacity"
                                                                                                                          aria-label="Toggle sidebar"
                                                                                                                                  >
                                                                                                                                            <Menu size={20} style={{ color: "var(--nebu-text)" }} />
                                                                                                                                                    </button>
                                                                                                                                                            <h1
                                                                                                                                                                      className="text-lg font-bold tracking-tight"
                                                                                                                                                                                style={{ color: "var(--nebu-text)" }}
                                                                                                                                                                                        >
                                                                                                                                                                                                  {pageLabels[activePage]}
                                                                                                                                                                                                          </h1>
                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                      <span
                                                                                                                                                                                                                              className="text-sm hidden sm:block capitalize"
                                                                                                                                                                                                                                      style={{ color: "var(--nebu-text-secondary)" }}
                                                                                                                                                                                                                                            >
                                                                                                                                                                                                                                                    {today}
                                                                                                                                                                                                                                                          </span>
                                                                                                                                                                                                                                                              </header>
                                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                                };

                                                                                                                                                                                                                                                                export default Topbar;