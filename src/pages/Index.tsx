import { useState } from "react";
import Topbar from "@/components/Topbar";
import AppSidebar from "@/components/AppSidebar";
import type { Page } from "@/components/AppSidebar";
import DashboardPage from "@/pages/DashboardPage";
import ProyectosPage from "@/pages/ProyectosPage";
import HerramientasPage from "@/pages/HerramientasPage";
import PipelinePage from "@/pages/PipelinePage";
import FinanzasPage from "@/pages/FinanzasPage";
import LinkedInPage from "@/pages/LinkedInPage";

const Index = () => {
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Wrapper for PipelinePage to handle "Ver proyecto" navigation
  const PipelineWrapper = () => (
    <PipelinePage
      onViewProject={() => {
        setActivePage("proyectos");
      }}
    />
  );

  const pages: Record<Page, React.ComponentType> = {
    dashboard: DashboardPage,
    proyectos: ProyectosPage,
    pipeline: PipelineWrapper,
    herramientas: HerramientasPage,
    finanzas: FinanzasPage,
    linkedin: LinkedInPage,
  };

  const ActiveComponent = pages[activePage];

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ backgroundColor: "var(--nebu-bg)" }}
    >
      {/* Fixed Sidebar */}
      <AppSidebar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          setSidebarOpen(false);
        }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Topbar
          onToggleSidebar={() => setSidebarOpen((p) => !p)}
          activePage={activePage}
        />

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto p-6 md:p-8"
          style={{ backgroundColor: "var(--nebu-bg)" }}
        >
          <div key={activePage} className="animate-fade-in">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
