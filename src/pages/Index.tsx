import { useState } from "react";
import Topbar from "@/components/Topbar";
import AppSidebar from "@/components/AppSidebar";
import AgentPanel from "@/components/AgentPanel";
import DashboardPage from "@/pages/DashboardPage";
import ProyectosPage from "@/pages/ProyectosPage";
import PipelinePage from "@/pages/PipelinePage";
import CotizacionesPage from "@/pages/CotizacionesPage";
import { CrmProvider } from "@/contexts/CrmContext";

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

  const ActiveComponent = pages[activePage];

  return (
    <CrmProvider>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <Topbar onToggleSidebar={() => setSidebarOpen((p) => !p)} />

        <div className="flex-1 flex overflow-hidden">
          <AppSidebar
            activePage={activePage}
            onNavigate={setActivePage}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <main className="flex-1 overflow-y-auto p-5 md:p-7">
            <ActiveComponent />
          </main>
        </div>

        {/* Floating agent chat */}
        <AgentPanel />
      </div>
    </CrmProvider>
  );
};

export default Index;
