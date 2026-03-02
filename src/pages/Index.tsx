import { useState } from "react";
import Topbar from "@/components/Topbar";
import AppSidebar from "@/components/AppSidebar";
import type { Page } from "@/components/AppSidebar";
import DashboardPage from "@/pages/DashboardPage";
import ProyectosPage from "@/pages/ProyectosPage";
import HerramientasPage from "@/pages/HerramientasPage";
import PipelinePage from "@/pages/PipelinePage";

// Placeholder page for Finanzas (not yet built)
const PlaceholderPage = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center h-full animate-fade-in">
    <div
      className="rounded-lg p-12 text-center"
      style={{
        backgroundColor: "var(--nebu-card)",
        border: "1px solid var(--nebu-border)",
      }}
    >
      <h2
        className="text-xl font-bold tracking-tight mb-2"
        style={{ color: "var(--nebu-text)" }}
      >
        {name}
      </h2>
      <p className="text-sm" style={{ color: "var(--nebu-text-secondary)" }}>
        Modulo en construccion
      </p>
    </div>
  </div>
);

const FinanzasPage = () => <PlaceholderPage name="Finanzas" />;

const Index = () => {
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Wrapper for PipelinePage to handle "Ver proyecto" navigation
  const PipelineWrapper = () => (
    <PipelinePage
      onViewProject={(projectId) => {
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
