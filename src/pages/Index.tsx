import { useState } from "react";
import Topbar from "@/components/Topbar";
import AppSidebar from "@/components/AppSidebar";
import AgentPanel from "@/components/AgentPanel";
import DashboardPage from "@/pages/DashboardPage";
import ProyectosPage from "@/pages/ProyectosPage";
import PipelinePage from "@/pages/PipelinePage";
import CotizacionesPage from "@/pages/CotizacionesPage";

type Page = "dashboard" | "proyectos" | "pipeline" | "cotizaciones";

const pages: Record<Page, React.ComponentType> = {
  dashboard: DashboardPage,
  proyectos: ProyectosPage,
  pipeline: PipelinePage,
  cotizaciones: CotizacionesPage,
};

const Index = () => {
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);

  const ActiveComponent = pages[activePage];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Topbar */}
      <Topbar
        onToggleSidebar={() => setSidebarOpen((p) => !p)}
        onToggleAgent={() => setAgentOpen((p) => !p)}
      />

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AppSidebar
          activePage={activePage}
          onNavigate={setActivePage}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          <ActiveComponent />
        </main>

        {/* Agent Panel */}
        <AgentPanel
          open={agentOpen}
          onClose={() => setAgentOpen(false)}
        />
      </div>
    </div>
  );
};

export default Index;
