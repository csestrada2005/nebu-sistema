import { useState } from "react";
import { CreditCard, Link2, FileText, ArrowUpDown, Plus, CheckCircle2, Clock, DollarSign, TrendingUp, Plug } from "lucide-react";

type Tab = "links" | "cotizaciones" | "transacciones" | "metodos";

const PagosPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("links");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "links", label: "Links de pago", icon: <Link2 size={16} /> },
    { id: "cotizaciones", label: "Cotizaciones", icon: <FileText size={16} /> },
    { id: "transacciones", label: "Transacciones", icon: <ArrowUpDown size={16} /> },
    { id: "metodos", label: "Métodos de pago", icon: <CreditCard size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pagos</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestiona cobros, cotizaciones y métodos de pago</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={16} />
          {activeTab === "links" ? "Crear link de pago" : activeTab === "cotizaciones" ? "Nueva cotización" : "Registrar pago"}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Ingresos totales", value: "$0", icon: <DollarSign size={18} className="text-green-400" />, sub: "Este mes" },
          { label: "Cobrado", value: "$0", icon: <CheckCircle2 size={18} className="text-emerald-400" />, sub: "Confirmado" },
          { label: "Pendiente", value: "$0", icon: <Clock size={18} className="text-yellow-400" />, sub: "Por cobrar" },
          { label: "MRR", value: "$0/mes", icon: <TrendingUp size={18} className="text-blue-400" />, sub: "Recurrente" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-muted/50 border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{kpi.label}</span>
              {kpi.icon}
            </div>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-lg border border-border w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-muted/30 border border-border rounded-xl">
        {activeTab === "links" && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4">
              <Link2 size={28} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Sin links de pago</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Crea links de pago personalizados para enviar a tus clientes. Comparte por WhatsApp, email o redes sociales y cobra al instante.
            </p>
            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              <Plus size={16} />
              Crear primer link de pago
            </button>
          </div>
        )}

        {activeTab === "cotizaciones" && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4">
              <FileText size={28} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Sin cotizaciones</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Genera cotizaciones profesionales con tu branding. Envíalas a tus clientes y haz seguimiento del estado.
            </p>
            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              <Plus size={16} />
              Crear primera cotización
            </button>
          </div>
        )}

        {activeTab === "transacciones" && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4">
              <ArrowUpDown size={28} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Sin transacciones</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Aquí aparecerá el historial de todos tus cobros, pagos y movimientos financieros.
            </p>
          </div>
        )}

        {activeTab === "metodos" && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Métodos de cobro</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Stripe", desc: "Tarjetas de crédito y débito", color: "bg-purple-500/10 border-purple-500/20" },
                { name: "PayPal", desc: "Pagos internacionales", color: "bg-blue-500/10 border-blue-500/20" },
                { name: "Transferencia", desc: "Transferencia bancaria directa", color: "bg-green-500/10 border-green-500/20" },
                { name: "Otro", desc: "Método personalizado", color: "bg-muted/50 border-border" },
              ].map((method) => (
                <div key={method.name} className={`${method.color} border rounded-xl p-4 flex items-center justify-between`}>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{method.name}</p>
                    <p className="text-xs text-muted-foreground">{method.desc}</p>
                  </div>
                  <button className="text-xs bg-secondary hover:bg-secondary/80 text-foreground px-3 py-1.5 rounded-lg transition-colors">
                    Configurar
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6 mt-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Tu tarjeta</h3>
              <div className="bg-secondary/50 border border-border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <CreditCard size={32} className="text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-4">Agrega una tarjeta para recibir pagos directamente</p>
                <button className="text-xs bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-lg transition-colors">
                  + Agregar tarjeta
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagosPage;
