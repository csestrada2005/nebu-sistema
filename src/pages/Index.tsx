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
import NovyPage from "@/pages/NovyPage";
import EmailPage from "@/pages/EmailPage";
import MisWebsPage from "@/pages/MisWebsPage";
import ContactosPage from "@/pages/ContactosPage";
import { LanguageProvider } from "@/contexts/LanguageContext";

const Index = () => {
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const PipelineWrapper = () => (
    <PipelinePage onViewProject={() => setActivePage("proyectos")} />
  );

  const pages: Record<Page, React.ComponentType> = {
    dashboard: DashboardPage,
    proyectos: ProyectosPage,
    pipeline: PipelineWrapper,
    herramientas: HerramientasPage,
    "mis-webs": MisWebsPage,
    contactos: ContactosPage,
    email: EmailPage,
    finanzas: FinanzasPage,
    linkedin: LinkedInPage,
    novy: NovyPage,
  };

  const ActiveComponent = pages[activePage];

  return (
    <LanguageProvider>
      <div className="h-screen flex overflow-hidden" style={{ backgroundColor: "var(--nebu-bg)" }}>
        <AppSidebar
          activePage={activePage}
          onNavigate={(page) => { setActivePage(page); setSidebarOpen(false); }}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar onToggleSidebar={() => setSidebarOpen((p) => !p)} activePage={activePage} />
          <main className="flex-1 overflow-y-auto p-6 md:p-8" style={{ backgroundColor: "var(--nebu-bg)" }}>
            <div key={activePage} className="animate-fade-in">
              <ActiveComponent />
            </div>
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
};

export default Index;
