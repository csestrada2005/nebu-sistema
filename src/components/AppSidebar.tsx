import { Home, Briefcase, GitBranch, Wrench, DollarSign, Linkedin, Mail, Bot, BarChart2 } from "lucide-react";

export type Page = "dashboard" | "proyectos" | "pipeline" | "linkedin" | "herramientas" | "mis-webs" | "email" | "finanzas" | "novy";

interface AppSidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  open: boolean;
  onClose: () => void;
}

const navItems: { id: Page; label: string; icon: React.ElementType; badge?: number }[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "proyectos", label: "Proyectos", icon: Briefcase },
  { id: "pipeline", label: "Pipeline", icon: GitBranch },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "herramientas", label: "Herramientas", icon: Wrench },
  { id: "mis-webs", label: "Mis Webs", icon: BarChart2 },
  { id: "email", label: "Email", icon: Mail },
  { id: "finanzas", label: "Finanzas", icon: DollarSign },
  { id: "novy", label: "NOVY", icon: Bot, badge: 7 },
];

const AppSidebar = ({ activePage, onNavigate, open, onClose }: AppSidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 z-50
          h-full w-[240px] flex flex-col
          border-r
          transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          backgroundColor: "var(--nebu-surface)",
          borderColor: "var(--nebu-border)",
        }}
      >
        {/* Logo */}
        <div
          className="h-16 flex items-center px-6 shrink-0"
          style={{ borderBottom: "1px solid var(--nebu-border)" }}
        >
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--nebu-accent)" }}
          >
            NEBU
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150"
                style={{
                  backgroundColor: active ? "var(--nebu-active-bg)" : "transparent",
                  color: active ? "var(--nebu-accent)" : "var(--nebu-text-secondary)",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "var(--nebu-card)";
                    e.currentTarget.style.color = "var(--nebu-text)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--nebu-text-secondary)";
                  }
                }}
              >
                <item.icon size={18} />
                <span className={active ? "font-semibold" : "font-normal"}>
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "#E53E3E",
                      color: "#FFFFFF",
                      minWidth: "18px",
                      textAlign: "center",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="px-6 py-4 shrink-0 space-y-1"
          style={{
            borderTop: "1px solid var(--nebu-border)",
          }}
        >
          <p
            className="text-xs font-semibold tracking-wide"
            style={{ color: "var(--nebu-text-secondary)" }}
          >
            NEBU STUDIO
          </p>
          <p
            className="text-[10px]"
            style={{ color: "#555555" }}
          >
            v1.0 — Uso interno
          </p>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
