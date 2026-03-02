import { LayoutDashboard, FolderKanban, TrendingUp, FileText, Users, Settings, Linkedin, Mail, Calendar, DollarSign, BarChart2, Lightbulb, Bot } from "lucide-react";

type Page = "dashboard" | "proyectos" | "pipeline" | "cotizaciones" | "clientes" | "linkedin" | "emails" | "agenda" | "finanzas" | "seo" | "inspiracion" | "tareas-ai";

interface AppSidebarProps {
    activePage: Page;
    onNavigate: (page: Page) => void;
    open: boolean;
    onClose: () => void;
}

const mainNav: { id: Page; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "proyectos", label: "Proyectos", icon: FolderKanban, badge: "3" },
  { id: "pipeline", label: "Pipeline", icon: TrendingUp },
  { id: "cotizaciones", label: "Cotizaciones", icon: FileText },
  { id: "clientes", label: "Clientes", icon: Users },
  ];

const ventasNav: { id: Page; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "emails", label: "Emails", icon: Mail },
  { id: "agenda", label: "Agenda", icon: Calendar },
  ];

const finanzasNav: { id: Page; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "finanzas", label: "Finanzas", icon: DollarSign },
  { id: "seo", label: "Analytics", icon: BarChart2 },
  { id: "inspiracion", label: "Inspiración", icon: Lightbulb },
  { id: "tareas-ai", label: "Tareas AI", icon: Bot, badge: "3" },
  ];

const teamNav = [
  { label: "Olivia R.", role: "Ventas" },
  { label: "Diego M.", role: "Diseño" },
  ];

const NavSection = ({ title, items, activePage, onNavigate, onClose }: {
    title: string;
    items: typeof mainNav;
    activePage: Page;
    onNavigate: (page: Page) => void;
    onClose: () => void;
}) => (
    <>
        <div className="px-4 mt-6 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-nebu-muted">{title}</span>span>
        </div>div>
      {items.map((item) => {
            const active = activePage === item.id;
            return (
                      <button
                                  key={item.id}
                                  onClick={() => { onNavigate(item.id); onClose(); }}
                                  className={`
                                              w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-all
                                                          ${active
                                                                          ? "text-primary border-l-2 border-primary bg-primary/5 font-medium"
                                                                          : "text-nebu-text-dim hover:text-foreground hover:bg-nebu-surface border-l-2 border-transparent"
                                                          }
                                                                    `}
                                >
                                <item.icon size={16} />
                                <span>{item.label}</span>span>
                        {item.badge && (
                                              <span className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded ${active ? "bg-primary text-primary-foreground" : "bg-nebu-surface text-nebu-text-dim"}`}>
                                                {item.badge}
                                              </span>span>
                                )}
                      </button>button>
                    );
    })}
    </>>
  );

const AppSidebar = ({ activePage, onNavigate, open, onClose }: AppSidebarProps) => {
    return (
          <>
            {open && (
                    <div
                                className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                                onClick={onClose}
                              />
                  )}
          
                <aside
                          className={`
                                    fixed lg:static top-0 left-0 z-50 h-full w-[220px] bg-nebu-carbon border-r border-nebu-border
                                              flex flex-col transition-transform duration-200
                                                        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                                                                `}
                        >
                        <div className="h-14 flex items-center px-4 border-b border-nebu-border lg:hidden">
                                  <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                                  <span className="font-display text-lg tracking-wider">NEBU STUDIO</span>span>
                        </div>div>
                
                        <nav className="flex-1 overflow-y-auto py-4">
                                  <NavSection title="Principal" items={mainNav} activePage={activePage} onNavigate={onNavigate} onClose={onClose} />
                                  <NavSection title="Ventas" items={ventasNav} activePage={activePage} onNavigate={onNavigate} onClose={onClose} />
                                  <NavSection title="Operaciones" items={finanzasNav} activePage={activePage} onNavigate={onNavigate} onClose={onClose} />
                        
                                  <div className="px-4 mt-6 mb-2">
                                              <span className="font-mono text-[10px] uppercase tracking-widest text-nebu-muted">Equipo</span>span>
                                  </div>div>
                          {teamNav.map((member) => (
                                      <div key={member.label} className="flex items-center gap-2.5 px-4 py-2 text-sm text-nebu-text-dim">
                                                    <Users size={14} />
                                                    <span>{member.label}</span>span>
                                                    <span className="ml-auto text-[10px] font-mono text-nebu-muted">{member.role}</span>span>
                                      </div>div>
                                    ))}
                        </nav>nav>
                
                        <div className="p-4 border-t border-nebu-border">
                                  <button className="flex items-center gap-2 text-xs text-nebu-text-dim hover:text-foreground transition-colors">
                                              <Settings size={14} />
                                              <span>Configuración</span>span>
                                  </button>button>
                        </div>div>
                </aside>aside>
          </>>
        );
};

export default AppSidebar;</></>
