import { Home, Briefcase, GitBranch, Wrench, DollarSign, Linkedin, Mail, Bot, BarChart2, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export type Page = "dashboard" | "proyectos" | "pipeline" | "linkedin" | "herramientas" | "mis-webs" | "contactos" | "email" | "finanzas" | "novy";

interface AppSidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  open: boolean;
  onClose: () => void;
}

const navItems: { id: Page; label: Record<"es" | "en", string>; icon: React.ElementType; badge?: number }[] = [
  { id: "dashboard", label: { es: "Dashboard", en: "Dashboard" }, icon: Home },
  { id: "proyectos", label: { es: "Proyectos", en: "Projects" }, icon: Briefcase },
  { id: "pipeline", label: { es: "Pipeline", en: "Pipeline" }, icon: GitBranch },
  { id: "linkedin", label: { es: "LinkedIn", en: "LinkedIn" }, icon: Linkedin },
  { id: "herramientas", label: { es: "Herramientas", en: "Tools" }, icon: Wrench },
  { id: "mis-webs", label: { es: "Mis Webs", en: "My Webs" }, icon: BarChart2 },
  { id: "contactos", label: { es: "Contactos", en: "Contacts" }, icon: Users },
  { id: "email", label: { es: "Email", en: "Email" }, icon: Mail },
  { id: "finanzas", label: { es: "Finanzas", en: "Finances" }, icon: DollarSign },
  { id: "novy", label: { es: "NOVY", en: "NOVY" }, icon: Bot, badge: 7 },
];

const AppSidebar = ({ activePage, onNavigate, open, onClose }: AppSidebarProps) => {
  const { lang } = useLanguage();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full w-[240px] flex flex-col border-r transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ backgroundColor: "var(--nebu-surface)", borderColor: "var(--nebu-border)" }}
      >
        <div className="h-16 flex items-center px-6 shrink-0" style={{ borderBottom: "1px solid var(--nebu-border)" }}>
          <span className="text-2xl font-bold tracking-tight" style={{ color: "var(--nebu-accent)" }}>NEBU</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150"
                style={{
                  backgroundColor: active ? "var(--nebu-active-bg)" : "transparent",
                  color: active ? "var(--nebu-accent)" : "var(--nebu-text-secondary)",
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.backgroundColor = "var(--nebu-card)"; e.currentTarget.style.color = "var(--nebu-text)"; }}}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--nebu-text-secondary)"; }}}
              >
                <item.icon size={18} />
                <span className={active ? "font-semibold" : "font-normal"}>{item.label[lang]}</span>
                {item.badge && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#E53E3E", color: "#FFFFFF", minWidth: "18px", textAlign: "center" }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="px-6 py-4 shrink-0 space-y-1" style={{ borderTop: "1px solid var(--nebu-border)" }}>
          <p className="text-xs font-semibold tracking-wide" style={{ color: "var(--nebu-text-secondary)" }}>NEBU STUDIO</p>
          <p className="text-[10px]" style={{ color: "#555555" }}>
            {lang === "es" ? "v1.0 — Uso interno" : "v1.0 — Internal use"}
          </p>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
