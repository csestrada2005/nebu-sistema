import { useState } from "react";
import Topbar from "@/components/Topbar";
import AppSidebar from "@/components/AppSidebar";
import BottomNav from "@/components/BottomNav";
import RestrictedPage from "@/components/RestrictedPage";
import LoginPage from "@/pages/LoginPage";
import type { Page } from "@/components/AppSidebar";
import DashboardPage from "@/pages/DashboardPage";
import ProyectosPage from "@/pages/ProyectosPage";
import PagosPage from "@/pages/PagosPage";
import MetricasPage from "@/pages/MetricasPage";
import AIStudioPage from "@/pages/AIStudioPage";
import SettingsPage from "@/pages/SettingsPage";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CrmProvider } from "@/contexts/CrmContext";

const CRMApp = () => {
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { hasAccess, isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm animate-pulse">Cargando...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const pages: Record<Page, React.ComponentType> = {
    dashboard: DashboardPage,
    proyectos: ProyectosPage,
    pagos: PagosPage,
    metricas: MetricasPage,
    "ai-studio": AIStudioPage,
    settings: SettingsPage,
  };

  const canAccess = hasAccess(activePage);
  const ActiveComponent = canAccess ? pages[activePage] : () => <RestrictedPage onGoBack={() => setActivePage("dashboard")} />;

  return (
    <CrmProvider>
      <div className="h-screen flex overflow-hidden bg-background">
        <AppSidebar
          activePage={activePage}
          onNavigate={(page) => { setActivePage(page); setSidebarOpen(false); }}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar onToggleSidebar={() => setSidebarOpen((p) => !p)} activePage={activePage} />
          <main className="flex-1 overflow-y-auto p-6 md:p-8 pb-20 lg:pb-8">
            <div key={activePage} className="animate-fade-in">
              <ActiveComponent />
            </div>
          </main>
        </div>
        <BottomNav activePage={activePage} onNavigate={setActivePage} />
      </div>
    </CrmProvider>
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
