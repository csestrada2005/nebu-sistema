import { Home, Briefcase, GitBranch, Wrench, DollarSign, Linkedin, Mail, Bot, BarChart2, BarChart3, Users, FileText, Receipt, MessageSquare, Target, Phone, TrendingUp, Activity, CalendarDays, Settings, CheckSquare, UserPlus, UserCheck, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export type Page = "dashboard" | "proyectos" | "pipeline" | "linkedin" | "herramientas" | "mis-webs" | "contactos" | "contratos" | "cotizaciones" | "email" | "finanzas" | "novy" | "plantillas" | "vendedores" | "oportunidades" | "llamadas" | "reportes" | "forecast" | "rendimiento" | "calendario" | "configuracion" | "tareas" | "leads" | "portal-cliente" | "automatizaciones";

interface AppSidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  open: boolean;
  onClose: () => void;
}

type NavEntry =
  | { type: "item"; id: Page; label: Record<"es" | "en", string>; icon: React.ElementType; badge?: number }
  | { type: "label"; text: Record<"es" | "en", string> };

const navEntries: NavEntry[] = [
  { type: "label", text: { es: "PRINCIPAL", en: "MAIN" } },
  { type: "item", id: "dashboard", label: { es: "Dashboard", en: "Dashboard" }, icon: Home },
  { type: "item", id: "proyectos", label: { es: "Proyectos", en: "Projects" }, icon: Briefcase },
  { type: "item", id: "pipeline", label: { es: "Pipeline", en: "Pipeline" }, icon: GitBranch },
  { type: "item", id: "linkedin", label: { es: "LinkedIn", en: "LinkedIn" }, icon: Linkedin },
  { type: "label", text: { es: "CRM", en: "CRM" } },
  { type: "item", id: "leads", label: { es: "Leads", en: "Leads" }, icon: UserPlus },
  { type: "item", id: "contactos", label: { es: "Contactos", en: "Contacts" }, icon: Users },
  { type: "item", id: "contratos", label: { es: "Contratos", en: "Contracts" }, icon: FileText },
  { type: "item", id: "cotizaciones", label: { es: "Cotizaciones", en: "Quotes" }, icon: Receipt },
  { type: "item", id: "plantillas", label: { es: "Plantillas", en: "Templates" }, icon: MessageSquare },
  { type: "label", text: { es: "HERRAMIENTAS", en: "TOOLS" } },
  { type: "item", id: "herramientas", label: { es: "Herramientas", en: "Tools" }, icon: Wrench },
  { type: "item", id: "mis-webs", label: { es: "Mis Webs", en: "My Webs" }, icon: BarChart2 },
  { type: "label", text: { es: "CLIENTES", en: "CLIENTS" } },
  { type: "item", id: "portal-cliente", label: { es: "Portal Cliente", en: "Client Portal" }, icon: UserCheck },
  { type: "label", text: { es: "VENTAS", en: "SALES" } },
  { type: "item", id: "vendedores", label: { es: "Vendedores", en: "Sellers" }, icon: Users },
  { type: "item", id: "oportunidades", label: { es: "Oportunidades", en: "Opportunities" }, icon: Target },
  { type: "item", id: "llamadas", label: { es: "Llamadas", en: "Calls" }, icon: Phone },
  { type: "label", text: { es: "ANÁLISIS", en: "ANALYSIS" } },
  { type: "item", id: "reportes", label: { es: "Reportes", en: "Reports" }, icon: BarChart3 },
  { type: "item", id: "forecast", label: { es: "Forecast", en: "Forecast" }, icon: TrendingUp },
  { type: "item", id: "rendimiento", label: { es: "Rendimiento", en: "Performance" }, icon: Activity },
  { type: "item", id: "email", label: { es: "Email", en: "Email" }, icon: Mail },
  { type: "item", id: "finanzas", label: { es: "Finanzas", en: "Finances" }, icon: DollarSign },
  { type: "label", text: { es: "GESTIÓN", en: "MANAGEMENT" } },
  { type: "item", id: "calendario", label: { es: "Calendario", en: "Calendar" }, icon: CalendarDays },
  { type: "item", id: "tareas", label: { es: "Tareas", en: "Tasks" }, icon: CheckSquare },
  { type: "item", id: "configuracion", label: { es: "Configuración", en: "Settings" }, icon: Settings },
  { type: "item", id: "novy", label: { es: "NOVY", en: "NOVY" }, icon: Bot, badge: 7 },
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
          {navEntries.map((entry, i) => {
            if (entry.type === "label") {
              return (
                <div key={i} className="pt-4 pb-1 px-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--nebu-text-secondary)" }}>{entry.text[lang]}</span>
                </div>
              );
            }
            const active = activePage === entry.id;
            return (
              <button
                key={entry.id}
                onClick={() => { onNavigate(entry.id); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150"
                style={{
                  backgroundColor: active ? "var(--nebu-active-bg)" : "transparent",
                  color: active ? "var(--nebu-accent)" : "var(--nebu-text-secondary)",
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.backgroundColor = "var(--nebu-card)"; e.currentTarget.style.color = "var(--nebu-text)"; }}}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--nebu-text-secondary)"; }}}
              >
                <entry.icon size={18} />
                <span className={active ? "font-semibold" : "font-normal"}>{entry.label[lang]}</span>
                {entry.badge && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#E53E3E", color: "#FFFFFF", minWidth: "18px", textAlign: "center" }}>
                    {entry.badge}
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
