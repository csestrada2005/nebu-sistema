import { useState } from "react";
import { Globe, TrendingUp, BarChart3, Target, FileText, Plus, ExternalLink, Eye, MousePointer, ShoppingCart, DollarSign, Gauge } from "lucide-react";

type Tab = "web" | "meta" | "rendimiento" | "forecast" | "reportes";

const MetricasPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("web");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "web", label: "Web Analytics", icon: <Globe size={16} /> },
    { id: "meta", label: "Meta Ads", icon: <Target size={16} /> },
    { id: "rendimiento", label: "Rendimiento", icon: <Gauge size={16} /> },
    { id: "forecast", label: "Forecast", icon: <TrendingUp size={16} /> },
    { id: "reportes", label: "Reportes", icon: <FileText size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Métricas</h1>
          <p className="text-sm text-muted-foreground mt-1">Analytics, rendimiento y proyecciones</p>
        </div>
        <select className="bg-secondary border border-border text-foreground text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-ring">
          <option>Este mes</option>
          <option>Último trimestre</option>
          <option>Este año</option>
          <option>Personalizado</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-lg border border-border w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Web Analytics */}
      {activeTab === "web" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Sitios web monitoreados</h2>
            <button className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground text-sm px-4 py-2 rounded-lg transition-colors">
              <Plus size={14} />
              Agregar sitio
            </button>
          </div>
          <div className="bg-muted/30 border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4">
              <Globe size={28} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Sin sitios web</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Agrega los sitios web de tus clientes para monitorear SEO, rendimiento, CRO y métricas clave en tiempo real.
            </p>
            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              <Plus size={16} />
              Agregar primer sitio web
            </button>
          </div>
        </div>
      )}

      {/* Meta Ads */}
      {activeTab === "meta" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Gasto total", value: "$0", icon: <DollarSign size={16} className="text-red-400" /> },
              { label: "Impresiones", value: "0", icon: <Eye size={16} className="text-blue-400" /> },
              { label: "Clicks", value: "0", icon: <MousePointer size={16} className="text-green-400" /> },
              { label: "Conversiones", value: "0", icon: <ShoppingCart size={16} className="text-purple-400" /> },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-muted/50 border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground uppercase">{kpi.label}</span>
                  {kpi.icon}
                </div>
                <p className="text-xl font-bold text-foreground">{kpi.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-muted/30 border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
              <Target size={28} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Conecta Meta Ads</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Conecta tu cuenta de Meta Ads para ver el rendimiento de tus campañas, ROAS, CTR y optimizar tu inversión publicitaria.
            </p>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              <ExternalLink size={16} />
              Conectar Meta Ads
            </button>
          </div>
        </div>
      )}

      {/* Rendimiento */}
      {activeTab === "rendimiento" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Tiempo promedio entrega", value: "0 días" },
              { label: "Proyectos en tiempo", value: "0%" },
              { label: "NPS Score", value: "—" },
              { label: "Satisfacción cliente", value: "—" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-muted/50 border border-border rounded-xl p-4">
                <span className="text-xs text-muted-foreground uppercase">{kpi.label}</span>
                <p className="text-xl font-bold text-foreground mt-2">{kpi.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-muted/30 border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4">
              <Gauge size={28} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Sin datos de rendimiento</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Completa proyectos para ver métricas de rendimiento como tiempos de entrega, satisfacción del cliente y NPS.
            </p>
          </div>
        </div>
      )}

      {/* Forecast */}
      {activeTab === "forecast" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Confirmado", value: "$0", color: "text-green-400" },
              { label: "Probable", value: "$0", color: "text-yellow-400" },
              { label: "Posible", value: "$0", color: "text-muted-foreground" },
              { label: "Total proyectado", value: "$0", color: "text-foreground" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-muted/50 border border-border rounded-xl p-4">
                <span className="text-xs text-muted-foreground uppercase">{kpi.label}</span>
                <p className={`text-xl font-bold mt-2 ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-muted/30 border border-border rounded-xl p-4">
            <div className="w-full bg-secondary rounded-full h-3">
              <div className="bg-gradient-to-r from-green-500 to-yellow-500 h-3 rounded-full" style={{ width: "0%" }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">0% de la meta mensual</p>
          </div>
          <div className="bg-muted/30 border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp size={28} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Define tu meta</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Establece tu meta mensual de ingresos y agrega prospectos al pipeline para ver proyecciones de cierre.
            </p>
            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              <Target size={16} />
              Establecer meta
            </button>
          </div>
        </div>
      )}

      {/* Reportes */}
      {activeTab === "reportes" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Reportes generados</h2>
            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors">
              <Plus size={14} />
              Generar reporte
            </button>
          </div>
          <div className="bg-muted/30 border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4">
              <FileText size={28} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Sin reportes</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Genera reportes mensuales, trimestrales o personalizados para tus clientes con métricas y resultados.
            </p>
            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              <Plus size={16} />
              Generar primer reporte
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricasPage;
