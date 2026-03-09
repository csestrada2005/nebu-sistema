import { useState } from "react";
import { CreditCard, Link2, FileText, ArrowUpDown, Plus, Copy, ExternalLink, CheckCircle2, Clock, XCircle, DollarSign, TrendingUp, Wallet, BarChart3 } from "lucide-react";

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
                                  <h1 className="text-2xl font-bold text-white">Pagos</h1>h1>
                                  <p className="text-sm text-zinc-400 mt-1">Gestiona cobros, cotizaciones y métodos de pago</p>p>
                        </div>div>
                        <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                                  <Plus size={16} />
                          {activeTab === "links" ? "Crear link de pago" : activeTab === "cotizaciones" ? "Nueva cotización" : "Registrar pago"}
                        </button>button>
                </div>div>
          
            {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
            { label: "Ingresos totales", value: "$0", icon: <DollarSign size={18} className="text-green-400" />, sub: "Este mes" },
            { label: "Cobrado", value: "$0", icon: <CheckCircle2 size={18} className="text-emerald-400" />, sub: "Confirmado" },
            { label: "Pendiente", value: "$0", icon: <Clock size={18} className="text-yellow-400" />, sub: "Por cobrar" },
            { label: "MRR", value: "$0/mes", icon: <TrendingUp size={18} className="text-blue-400" />, sub: "Recurrente" },
                    ].map((kpi) => (
                                <div key={kpi.label} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                          <span className="text-xs text-zinc-500 uppercase tracking-wide">{kpi.label}</span>span>
                                              {kpi.icon}
                                            </div>div>
                                            <p className="text-2xl font-bold text-white">{kpi.value}</p>p>
                                            <p className="text-xs text-zinc-500 mt-1">{kpi.sub}</p>p>
                                </div>div>
                              ))}
                </div>div>
          
            {/* Tabs */}
                <div className="flex gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800 w-fit">
                  {tabs.map((tab) => (
                      <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                    activeTab === tab.id
                                                      ? "bg-zinc-800 text-white"
                                                      : "text-zinc-400 hover:text-zinc-300"
                                    }`}
                                  >
                        {tab.icon}
                        {tab.label}
                      </button>button>
                    ))}
                </div>div>
          
            {/* Tab Content */}
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl">
                  {activeTab === "links" && (
                      <div className="p-12 flex flex-col items-center justify-center text-center">
                                  <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
                                                <Link2 size={28} className="text-zinc-500" />
                                  </div>div>
                                  <h3 className="text-lg font-semibold text-white mb-2">Sin links de pago</h3>h3>
                                  <p className="text-sm text-zinc-400 max-w-md mb-6">
                                                Crea links de pago personalizados para enviar a tus clientes. Comparte por WhatsApp, email o redes sociales y cobra al instante.
                                  </p>p>
                                  <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
                                                <Plus size={16} />
                                                Crear primer link de pago
                                  </button>button>
                      </div>div>
                        )}
                
                  {activeTab === "cotizaciones" && (
                      <div className="p-12 flex flex-col items-center justify-center text-center">
                                  <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
                                                <FileText size={28} className="text-zinc-500" />
                                  </div>div>
                                  <h3 className="text-lg font-semibold text-white mb-2">Sin cotizaciones</h3>h3>
                                  <p className="text-sm text-zinc-400 max-w-md mb-6">
                                                Genera cotizaciones profesionales con tu branding. Envíalas a tus clientes y haz seguimiento del estado.
                                  </p>p>
                                  <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
                                                <Plus size={16} />
                                                Crear primera cotización
                                  </button>button>
                      </div>div>
                        )}
                
                  {activeTab === "transacciones" && (
                      <div className="p-12 flex flex-col items-center justify-center text-center">
                                  <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
                                                <ArrowUpDown size={28} className="text-zinc-500" />
                                  </div>div>
                                  <h3 className="text-lg font-semibold text-white mb-2">Sin transacciones</h3>h3>
                                  <p className="text-sm text-zinc-400 max-w-md mb-6">
                                                Aquí aparecerá el historial de todos tus cobros, pagos y movimientos financieros.
                                  </p>p>
                      </div>div>
                        )}
                
                  {activeTab === "metodos" && (
                      <div className="p-6 space-y-4">
                                  <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Métodos de cobro</h3>h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                        { name: "Stripe", desc: "Tarjetas de crédito y débito", color: "bg-purple-500/10 border-purple-500/20", connected: false },
                        { name: "PayPal", desc: "Pagos internacionales", color: "bg-blue-500/10 border-blue-500/20", connected: false },
                        { name: "Transferencia", desc: "Transferencia bancaria directa", color: "bg-green-500/10 border-green-500/20", connected: false },
                        { name: "Otro", desc: "Método personalizado", color: "bg-zinc-500/10 border-zinc-500/20", connected: false },
                                      ].map((method) => (
                                                        <div key={method.name} className={`${method.color} border rounded-xl p-4 flex items-center justify-between`}>
                                                                          <div>
                                                                                              <p className="text-sm font-semibold text-white">{method.name}</p>p>
                                                                                              <p className="text-xs text-zinc-400">{method.desc}</p>p>
                                                                          </div>div>
                                                                          <button className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors">
                                                                                              Configurar
                                                                          </button>button>
                                                        </div>div>
                                                      ))}
                                  </div>div>
                      
                                  <div className="border-t border-zinc-800 pt-6 mt-6">
                                                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-4">Tu tarjeta</h3>h3>
                                                <div className="bg-zinc-800/50 border border-zinc-700 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center">
                                                                <CreditCard size={32} className="text-zinc-500 mb-3" />
                                                                <p className="text-sm text-zinc-400 mb-4">Agrega una tarjeta para recibir pagos directamente</p>p>
                                                                <button className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg transition-colors">
                                                                                  + Agregar tarjeta
                                                                </button>button>
                                                </div>div>
                                  </div>div>
                      </div>div>
                        )}
                </div>div>
          </div>div>
        );
};

export default PagosPage;</div>
