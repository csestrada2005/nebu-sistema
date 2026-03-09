import { LayoutDashboard, Kanban, FolderOpen, DollarSign, Bot, Settings } from "lucide-react";
import type { Page } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";

interface BottomNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const items: { id: Page; icon: React.ElementType }[] = [
  { id: "dashboard", icon: LayoutDashboard },
  { id: "pipeline", icon: Kanban },
  { id: "proyectos", icon: FolderOpen },
  { id: "finanzas", icon: DollarSign },
  { id: "novy", icon: Bot },
  { id: "configuracion", icon: Settings },
];

const BottomNav = ({ activePage, onNavigate }: BottomNavProps) => {
  const { hasAccess } = useAuth();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-14 lg:hidden"
      style={{ backgroundColor: "#0D0D0D", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      {items.filter(item => hasAccess(item.id)).map((item) => {
        const active = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors"
          >
            <item.icon
              size={20}
              strokeWidth={active ? 2.5 : 1.5}
              style={{ color: active ? "#E63946" : "#71717A" }}
            />
            {item.id === "novy" && (
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#E63946" }} />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
