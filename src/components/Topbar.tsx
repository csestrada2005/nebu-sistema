import { Menu } from "lucide-react";

interface TopbarProps {
  onToggleSidebar: () => void;
  onToggleAgent: () => void;
}

const Topbar = ({ onToggleSidebar, onToggleAgent }: TopbarProps) => {
  return (
    <header className="h-14 border-b border-nebu-border bg-nebu-carbon flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded hover:bg-nebu-surface transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="font-display text-lg tracking-wider">NEBU STUDIO</span>
          <span className="font-mono text-xs text-nebu-text-dim">/ CRM &amp; AGENTE</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-5 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-nebu-green animate-pulse-dot" />
          <span className="text-nebu-green">AGENTE ACTIVO</span>
        </div>
        <span className="text-nebu-text-dim">PROYECTOS: <span className="text-foreground">3</span></span>
        <span className="text-nebu-text-dim">PENDIENTES: <span className="text-nebu-amber">$12,500 MXN</span></span>
        <button
          onClick={onToggleAgent}
          className="lg:hidden p-1.5 rounded hover:bg-nebu-surface transition-colors text-foreground"
        >
          AGENTE
        </button>
      </div>
    </header>
  );
};

export default Topbar;
