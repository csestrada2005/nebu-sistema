import { useState } from "react";
import Topbar from "@/components/Topbar";
import AppSidebar from "@/components/AppSidebar";
import BottomNav from "@/components/BottomNav";
import RestrictedPage from "@/components/RestrictedPage";
import LoginPage from "@/pages/LoginPage";
import type { Page } from "@/components/AppSidebar";
import DashboardPage from "@/pages/DashboardPage";
import PipelinePage from "@/pages/PipelinePage";
import LeadsPage from "@/pages/LeadsPage";
import CotizacionesPage from "@/pages/CotizacionesPage";
import ProyectosPage from "@/pages/ProyectosPage";
import ContactosPage from "@/pages/ContactosPage";
import FinanzasPage from "@/pages/FinanzasPage";
import NovyPage from "@/pages/NovyPage";
import ConfiguracionPage from "@/pages/ConfiguracionPage";
import RolesPage from "@/pages/RolesPage";
import IntegracionesPage from "@/pages/IntegracionesPage";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const CRMApp = () => {
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { hasAccess, isLoggedIn, setIsLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const pages: Record<Page, React.ComponentType> = {
    dashboard: DashboardPage,
    pipeline: PipelinePage,
    leads: LeadsPage,
    cotizaciones: CotizacionesPage,
    proyectos: ProyectosPage,
    contactos: ContactosPage,
    finanzas: FinanzasPage,
    novy: NovyPage,
    configuracion: ConfiguracionPage,
    roles: RolesPage,
    integraciones: IntegracionesPage,
  };

  const canAccess = hasAccess(activePage);
  const ActiveComponent = canAccess ? pages[activePage] : () => <RestrictedPage onGoBack={() => setActivePage("dashboard")} />;

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: "#0D0D0D" }}>
      <AppSidebar
        activePage={activePage}
        onNavigate={(page) => { setActivePage(page); setSidebarOpen(false); }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onToggleSidebar={() => setSidebarOpen((p) => !p)} activePage={activePage} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 pb-20 lg:pb-8" style={{ backgroundColor: "#0D0D0D" }}>
          <div key={activePage} className="animate-fade-in">
            <ActiveComponent />
          </div>
        </main>
      </div>
      <BottomNav activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
};

const Index = () => (
  <LanguageProvider>
    <AuthProvider>
      <CRMApp />
    </AuthProvider>
  </LanguageProvider>
);

export default Index;
