import { LayoutDashboard, Kanban, Users, FileText, FolderOpen, Contact, DollarSign, Bot, Settings, Shield, Plug, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth, Role } from "@/contexts/AuthContext";
import { useState } from "react";

export type Page = "dashboard" | "pipeline" | "leads" | "cotizaciones" | "proyectos" | "contactos" | "finanzas" | "novy" | "configuracion" | "roles" | "integraciones";

interface AppSidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  open: boolean;
  onClose: () => void;
}

type NavEntry =
  | { type: "item"; id: Page; label: Record<"es" | "en", string>; icon: React.ElementType; badge?: string; adminOnly?: boolean }
  | { type: "label"; text: Record<"es" | "en", string>; adminOnly?: boolean };

const navEntries: NavEntry[] = [
  { type: "label", text: { es: "INICIO", en: "HOME" } },
  { type: "item", id: "dashboard", label: { es: "Dashboard", en: "Dashboard" }, icon: LayoutDashboard },
  { type: "label", text: { es: "VENTAS", en: "SALES" } },
  { type: "item", id: "pipeline", label: { es: "Pipeline", en: "Pipeline" }, icon: Kanban },
  { type: "item", id: "leads", label: { es: "Leads", en: "Leads" }, icon: Users },
  { type: "item", id: "cotizaciones", label: { es: "Cotizaciones", en: "Quotes" }, icon: FileText },
  { type: "label", text: { es: "CLIENTES", en: "CLIENTS" } },
  { type: "item", id: "proyectos", label: { es: "Proyectos", en: "Projects" }, icon: FolderOpen },
  { type: "item", id: "contactos", label: { es: "Contactos", en: "Contacts" }, icon: Contact },
  { type: "label", text: { es: "FINANZAS", en: "FINANCES" } },
  { type: "item", id: "finanzas", label: { es: "Finanzas", en: "Finances" }, icon: DollarSign },
  { type: "label", text: { es: "AGENTE IA", en: "AI AGENT" } },
  { type: "item", id: "novy", label: { es: "NOVY", en: "NOVY" }, icon: Bot, badge: "IA" },
  { type: "label", text: { es: "SISTEMA", en: "SYSTEM" }, adminOnly: true },
  { type: "item", id: "configuracion", label: { es: "Configuración", en: "Settings" }, icon: Settings, adminOnly: true },
  { type: "item", id: "roles", label: { es: "Roles y Accesos", en: "Roles & Access" }, icon: Shield, adminOnly: true },
  { type: "item", id: "integraciones", label: { es: "Integraciones", en: "Integrations" }, icon: Plug, adminOnly: true },
];

const ROLE_LABELS: Record<Role, Record<"es" | "en", string>> = {
  admin: { es: "Admin", en: "Admin" },
  vendedor: { es: "Vendedor", en: "Sales" },
  dev: { es: "Dev", en: "Dev" },
  cliente: { es: "Cliente", en: "Client" },
};

const ROLE_COLORS: Record<Role, string> = {
  admin: "#E63946",
  vendedor: "#3B82F6",
  dev: "#10B981",
  cliente: "#71717A",
};

const AppSidebar = ({ activePage, onNavigate, open, onClose }: AppSidebarProps) => {
  const { lang } = useLanguage();
  const { role, setRole, hasAccess, setIsLoggedIn } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 64 : 240;

  const visibleEntries = navEntries.filter((entry) => {
    if (entry.type === "item" && entry.adminOnly && role !== "admin") return false;
    if (entry.type === "label" && entry.adminOnly && role !== "admin") return false;
    if (entry.type === "item" && !hasAccess(entry.id)) return false;
    return true;
  });

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full flex flex-col transition-all duration-200 ease-in-out ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ width: sidebarWidth, backgroundColor: "#0D0D0D", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {!collapsed && <span className="text-xl font-bold tracking-tight" style={{ color: "#E63946" }}>NEBU</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-md transition-colors"
            style={{ color: "#71717A" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#71717A")}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Role selector (dev/demo) */}
        {!collapsed && (
          <div className="px-3 py-2 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <label className="text-[9px] font-medium uppercase tracking-widest block mb-1" style={{ color: "#71717A" }}>
              {lang === "es" ? "Vista como:" : "View as:"}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full px-2 py-1.5 rounded text-xs outline-none"
              style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)", color: "#71717A" }}
            >
              {(["admin", "vendedor", "dev", "cliente"] as Role[]).map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r][lang]}</option>
              ))}
            </select>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {visibleEntries.map((entry, i) => {
            if (entry.type === "label") {
              if (collapsed) return <div key={i} className="pt-4 pb-1" />;
              return (
                <div key={i} className="pt-5 pb-1.5 px-3">
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: "#71717A" }}>{entry.text[lang]}</span>
                </div>
              );
            }
            const active = activePage === entry.id;
            return (
              <button
                key={entry.id}
                onClick={() => { onNavigate(entry.id); onClose(); }}
                className={`w-full flex items-center gap-3 rounded-lg text-sm transition-all duration-150 ${collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"}`}
                style={{
                  backgroundColor: active ? "rgba(230,57,70,0.08)" : "transparent",
                  color: active ? "#E63946" : "#71717A",
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "#FFFFFF"; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#71717A"; } }}
                title={collapsed ? entry.label[lang] : undefined}
              >
                <entry.icon size={18} strokeWidth={active ? 2 : 1.5} />
                {!collapsed && <span className={active ? "font-semibold" : "font-normal"}>{entry.label[lang]}</span>}
                {!collapsed && entry.badge && (
                  <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#E63946", color: "#FFFFFF" }}>
                    {entry.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 py-3 shrink-0 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {!collapsed ? (
            <>
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "rgba(230,57,70,0.15)", color: "#E63946" }}>
                  JC
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "#FFFFFF" }}>Josep C.</p>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: ROLE_COLORS[role] + "20", color: ROLE_COLORS[role] }}>
                    {ROLE_LABELS[role][lang]}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors"
                style={{ color: "#71717A" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#E63946"; e.currentTarget.style.backgroundColor = "rgba(230,57,70,0.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#71717A"; e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <LogOut size={14} />
                {lang === "es" ? "Cerrar sesión" : "Log out"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsLoggedIn(false)}
              className="w-full flex items-center justify-center py-2 rounded-lg transition-colors"
              style={{ color: "#71717A" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#E63946")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#71717A")}
              title={lang === "es" ? "Cerrar sesión" : "Log out"}
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
