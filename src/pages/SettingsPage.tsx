import { useState } from "react";
import { User, Building, Users, Shield, Plug, Bell, CreditCard, Key, Palette, Download, Plus, ExternalLink, Check, X, Upload, ChevronRight, Globe, Moon, Sun } from "lucide-react";

type Section = "perfil" | "negocio" | "equipo" | "roles" | "integraciones" | "notificaciones" | "billing" | "apikeys" | "apariencia" | "exportar";

const SettingsPage = () => {
    const [activeSection, setActiveSection] = useState<Section>("perfil");

    const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
      { id: "perfil", label: "Perfil", icon: <User size={16} /> },
      { id: "negocio", label: "Negocio", icon: <Building size={16} /> },
      { id: "equipo", label: "Equipo", icon: <Users size={16} /> },
      { id: "roles", label: "Roles y permisos", icon: <Shield size={16} /> },
      { id: "integraciones", label: "Integraciones", icon: <Plug size={16} /> },
      { id: "notificaciones", label: "Notificaciones", icon: <Bell size={16} /> },
      { id: "billing", label: "Billing", icon: <CreditCard size={16} /> },
      { id: "apikeys", label: "API Keys", icon: <Key size={16} /> },
      { id: "apariencia", label: "Apariencia", icon: <Palette size={16} /> },
      { id: "exportar", label: "Exportar datos", icon: <Download size={16} /> },
        ];

    return (
          <div className="space-y-6">
                <div>
                        <h1 className="text-2xl font-bold text-white">Settings</h1>h1>
                        <p className="text-sm text-zinc-400 mt-1">Configuración general de tu cuenta y plataforma</p>p>
                </div>div>
          
                <div className="flex gap-6">
                  {/* Sidebar */}
                        <div className="w-56 shrink-0 space-y-1">
                          {sections.map((section) => (
                        <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                                          activeSection === section.id ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
                                        }`}
                                      >
                          {section.icon}
                          {section.label}
                        </button>button>
                      ))}
                        </div>div>
                
                  {/* Content */}
                        <div className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
                          {activeSection === "perfil" && (
                        <div className="space-y-6">
                                      <h2 className="text-lg font-semibold text-white">Perfil</h2>h2>
                                      <div className="flex items-center gap-4">
                                                      <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center">
                                                                        <User size={32} className="text-zinc-500" />
                                                      </div>div>
                                                      <button className="text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors">Cambiar foto</button>button>
                                      </div>div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                      <div>
                                                                        <label className="text-xs text-zinc-400 block mb-1">Nombre</label>label>
                                                                        <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600" placeholder="Tu nombre" />
                                                      </div>div>
                                                      <div>
                                                                        <label className="text-xs text-zinc-400 block mb-1">Email</label>label>
                                                                        <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600" placeholder="tu@email.com" />
                                                      </div>div>
                                                      <div>
                                                                        <label className="text-xs text-zinc-400 block mb-1">Teléfono</label>label>
                                                                        <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600" placeholder="+52 ..." />
                                                      </div>div>
                                                      <div>
                                                                        <label className="text-xs text-zinc-400 block mb-1">Bio</label>label>
                                                                        <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600" placeholder="Freelancer de diseño web" />
                                                      </div>div>
                                      </div>div>
                                      <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">Guardar cambios</button>button>
                        </div>div>
                                  )}
                        
                          {activeSection === "negocio" && (
                        <div className="space-y-6">
                                      <h2 className="text-lg font-semibold text-white">Negocio</h2>h2>
                                      <div className="flex items-center gap-4">
                                                      <div className="w-20 h-20 bg-zinc-800 rounded-xl flex items-center justify-center border-2 border-dashed border-zinc-700">
                                                                        <Upload size={24} className="text-zinc-500" />
                                                      </div>div>
                                                      <div>
                                                                        <p className="text-sm text-white">Logo de tu estudio</p>p>
                                                                        <p className="text-xs text-zinc-500">PNG, SVG (max 2MB)</p>p>
                                                      </div>div>
                                      </div>div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                      <div>
                                                                        <label className="text-xs text-zinc-400 block mb-1">Nombre del estudio/agencia</label>label>
                                                                        <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600" placeholder="Mi Estudio" />
                                                      </div>div>
                                                      <div>
                                                                        <label className="text-xs text-zinc-400 block mb-1">Website</label>label>
                                                                        <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600" placeholder="https://..." />
                                                      </div>div>
                                                      <div>
                                                                        <label className="text-xs text-zinc-400 block mb-1">Color primario</label>label>
                                                                        <div className="flex gap-2">
                                                                                            <div className="w-10 h-10 bg-red-500 rounded-lg border border-zinc-700 cursor-pointer"></div>div>
                                                                                            <input className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-600" defaultValue="#EF4444" />
                                                                        </div>div>
                                                      </div>div>
                                                      <div className="md:col-span-2">
                                                                        <label className="text-xs text-zinc-400 block mb-1">Descripción</label>label>
                                                                        <textarea className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none h-20" placeholder="Diseño web, branding y marketing digital..." />
                                                      </div>div>
                                      </div>div>
                                      <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">Guardar</button>button>
                        </div>div>
                                  )}
                        
                          {activeSection === "equipo" && (
                        <div className="space-y-6">
                                      <div className="flex items-center justify-between">
                                                      <h2 className="text-lg font-semibold text-white">Equipo</h2>h2>
                                                      <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                                                                        <Plus size={14} />
                                                                        Invitar miembro
                                                      </button>button>
                                      </div>div>
                                      <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-8 text-center">
                                                      <Users size={32} className="text-zinc-600 mx-auto mb-3" />
                                                      <p className="text-sm text-zinc-400">Sin miembros del equipo. Invita colaboradores para trabajar juntos.</p>p>
                                      </div>div>
                        </div>div>
                                  )}
                        
                          {activeSection === "roles" && (
                        <div className="space-y-6">
                                      <h2 className="text-lg font-semibold text-white">Roles y permisos</h2>h2>
                                      <div className="overflow-x-auto">
                                                      <table className="w-full text-sm">
                                                                        <thead>
                                                                                            <tr className="border-b border-zinc-800">
                                                                                                                  <th className="text-left text-zinc-400 font-medium py-3 px-2">Módulo</th>th>
                                                                                                                  <th className="text-center text-zinc-400 font-medium py-3 px-2">Admin</th>th>
                                                                                                                  <th className="text-center text-zinc-400 font-medium py-3 px-2">Editor</th>th>
                                                                                                                  <th className="text-center text-zinc-400 font-medium py-3 px-2">Viewer</th>th>
                                                                                              </tr>tr>
                                                                        </thead>thead>
                                                                        <tbody>
                                                                          {["Dashboard", "Proyectos", "Pagos", "Métricas", "AI Studio", "Settings"].map((mod) => (
                                                <tr key={mod} className="border-b border-zinc-800/50">
                                                                        <td className="py-3 px-2 text-white">{mod}</td>td>
                                                                        <td className="py-3 px-2 text-center"><Check size={16} className="text-green-400 mx-auto" /></td>td>
                                                                        <td className="py-3 px-2 text-center">{mod !== "Settings" ? <Check size={16} className="text-green-400 mx-auto" /> : <X size={16} className="text-zinc-600 mx-auto" />}</td>td>
                                                                        <td className="py-3 px-2 text-center">{mod === "Dashboard" || mod === "Proyectos" ? <Check size={16} className="text-green-400 mx-auto" /> : <X size={16} className="text-zinc-600 mx-auto" />}</td>td>
                                                </tr>tr>
                                              ))}
                                                                        </tbody>tbody>
                                                      </table>table>
                                      </div>div>
                        </div>div>
                                  )}
                        
                          {activeSection === "integraciones" && (
                        <div className="space-y-6">
                                      <h2 className="text-lg font-semibold text-white">Integraciones</h2>h2>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                          { name: "Stripe", desc: "Procesamiento de pagos", color: "purple", connected: false },
                          { name: "Meta Ads", desc: "Campañas publicitarias", color: "blue", connected: false },
                          { name: "Google Analytics", desc: "Analítica web", color: "yellow", connected: false },
                          { name: "WhatsApp API", desc: "Mensajería directa", color: "green", connected: false },
                          { name: "Make / Zapier", desc: "Automatización de flujos", color: "orange", connected: false },
                          { name: "Slack", desc: "Notificaciones de equipo", color: "pink", connected: false },
                          { name: "Notion", desc: "Base de conocimiento", color: "zinc", connected: false },
                          { name: "Mailchimp", desc: "Email marketing", color: "amber", connected: false },
                                          ].map((int) => (
                                                              <div key={int.name} className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-4 flex items-center justify-between">
                                                                                  <div className="flex items-center gap-3">
                                                                                                        <div className={`w-10 h-10 bg-${int.color}-500/10 rounded-lg flex items-center justify-center`}>
                                                                                                                                <Plug size={18} className="text-zinc-400" />
                                                                                                          </div>div>
                                                                                                        <div>
                                                                                                                                <p className="text-sm font-medium text-white">{int.name}</p>p>
                                                                                                                                <p className="text-xs text-zinc-500">{int.desc}</p>p>
                                                                                                          </div>div>
                                                                                    </div>div>
                                                                                  <button className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1.5 rounded-lg transition-colors">
                                                                                                        Conectar
                                                                                    </button>button>
                                                              </div>div>
                                                            ))}
                                      </div>div>
                        </div>div>
                                  )}
                        
                          {activeSection === "notificaciones" && (
                        <div className="space-y-6">
                                      <h2 className="text-lg font-semibold text-white">Notificaciones</h2>h2>
                                      <div className="space-y-4">
                                        {[
                          { label: "Notificaciones por email", desc: "Recibe alertas de nuevos prospectos y pagos", enabled: true },
                          { label: "Notificaciones push", desc: "Alertas en tiempo real en el navegador", enabled: false },
                          { label: "Reporte semanal", desc: "Resumen de actividad cada lunes", enabled: true },
                          { label: "Alertas de pago", desc: "Cuando un cliente realiza un pago", enabled: true },
                          { label: "Recordatorios de tareas", desc: "Notificar tareas próximas a vencer", enabled: false },
                                          ].map((n) => (
                                                              <div key={n.label} className="flex items-center justify-between py-3 border-b border-zinc-800/50">
                                                                                  <div>
                                                                                                        <p className="text-sm text-white">{n.label}</p>p>
                                                                                                        <p className="text-xs text-zinc-500">{n.desc}</p>p>
                                                                                    </div>div>
                                                                                  <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${n.enabled ? "bg-red-500" : "bg-zinc-700"}`}>
                                                                                                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${n.enabled ? "right-0.5" : "left-0.5"}`}></div>div>
                                                                                    </div>div>
                                                              </div>div>
                                                            ))}
                                      </div>div>
                        </div>div>
                                  )}
                        
                          {activeSection === "billing" && (
                        <div className="space-y-6">
                                      <h2 className="text-lg font-semibold text-white">Billing</h2>h2>
                                      <div className="bg-gradient-to-r from-zinc-800 to-zinc-800/50 border border-zinc-700 rounded-xl p-6">
                                                      <div className="flex items-center justify-between mb-4">
                                                                        <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full">Plan actual</span>span>
                                                                        <span className="text-lg font-bold text-white">Free</span>span>
                                                      </div>div>
                                                      <p className="text-sm text-zinc-400 mb-4">3 proyectos, 50 créditos IA/mes, 1 usuario</p>p>
                                                      <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">Upgrade a Pro</button>button>
                                      </div>div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                      <div className="border border-zinc-700 rounded-xl p-5">
                                                                        <h3 className="text-white font-semibold mb-1">Pro</h3>h3>
                                                                        <p className="text-2xl font-bold text-white mb-2">$29<span className="text-sm text-zinc-400 font-normal">/mes</span>span></p>p>
                                                                        <ul className="text-xs text-zinc-400 space-y-1.5">
                                                                                            <li>Proyectos ilimitados</li>li>
                                                                                            <li>500 créditos IA/mes</li>li>
                                                                                            <li>5 usuarios</li>li>
                                                                                            <li>Integraciones premium</li>li>
                                                                        </ul>ul>
                                                      </div>div>
                                                      <div className="border border-zinc-700 rounded-xl p-5">
                                                                        <h3 className="text-white font-semibold mb-1">Enterprise</h3>h3>
                                                                        <p className="text-2xl font-bold text-white mb-2">$79<span className="text-sm text-zinc-400 font-normal">/mes</span>span></p>p>
                                                                        <ul className="text-xs text-zinc-400 space-y-1.5">
                                                                                            <li>Todo de Pro</li>li>
                                                                                            <li>Créditos IA ilimitados</li>li>
                                                                                            <li>Usuarios ilimitados</li>li>
                                                                                            <li>Soporte prioritario</li>li>
                                                                        </ul>ul>
                                                      </div>div>
                                      </div>div>
                        </div>div>
                                  )}
                        
                          {activeSection === "apikeys" && (
                        <div className="space-y-6">
                                      <h2 className="text-lg font-semibold text-white">API Keys</h2>h2>
                                      <p className="text-sm text-zinc-400">Conecta tus propios modelos de IA y servicios externos.</p>p>
                                      <div className="space-y-4">
                                        {[
                          { name: "OpenAI", placeholder: "sk-..." },
                          { name: "Anthropic (Claude)", placeholder: "sk-ant-..." },
                          { name: "Stability AI", placeholder: "sk-..." },
                          { name: "Meta API", placeholder: "EAA..." },
                          { name: "Google Analytics", placeholder: "UA-..." },
                                          ].map((api) => (
                                                              <div key={api.name} className="flex items-center gap-3">
                                                                                  <div className="w-40 shrink-0">
                                                                                                        <label className="text-sm text-zinc-300">{api.name}</label>label>
                                                                                    </div>div>
                                                                                  <input type="password" className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600" placeholder={api.placeholder} />
                                                                                  <button className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded-lg transition-colors">Guardar</button>button>
                                                              </div>div>
                                                            ))}
                                      </div>div>
                        </div>div>
                                  )}
                        
                          {activeSection === "apariencia" && (
                        <div className="space-y-6">
                                      <h2 className="text-lg font-semibold text-white">Apariencia</h2>h2>
                                      <div className="space-y-4">
                                                      <div>
                                                                        <label className="text-sm text-zinc-300 block mb-2">Tema</label>label>
                                                                        <div className="flex gap-3">
                                                                                            <button className="flex items-center gap-2 bg-zinc-800 text-white px-4 py-2.5 rounded-lg border-2 border-red-500 text-sm">
                                                                                                                  <Moon size={16} />
                                                                                                                  Oscuro
                                                                                              </button>button>
                                                                                            <button className="flex items-center gap-2 bg-zinc-800 text-zinc-400 px-4 py-2.5 rounded-lg border border-zinc-700 text-sm hover:border-zinc-600">
                                                                                                                  <Sun size={16} />
                                                                                                                  Claro
                                                                                              </button>button>
                                                                        </div>div>
                                                      </div>div>
                                                      <div>
                                                                        <label className="text-sm text-zinc-300 block mb-2">Idioma</label>label>
                                                                        <select className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-600">
                                                                                            <option>Español</option>option>
                                                                                            <option>English</option>option>
                                                                        </select>select>
                                                      </div>div>
                                                      <div>
                                                                        <label className="text-sm text-zinc-300 block mb-2">Densidad</label>label>
                                                                        <select className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-600">
                                                                                            <option>Comfortable</option>option>
                                                                                            <option>Compact</option>option>
                                                                        </select>select>
                                                      </div>div>
                                      </div>div>
                        </div>div>
                                  )}
                        
                          {activeSection === "exportar" && (
                        <div className="space-y-6">
                                      <h2 className="text-lg font-semibold text-white">Exportar datos</h2>h2>
                                      <p className="text-sm text-zinc-400">Descarga todos tus datos en formato CSV para respaldo o migración.</p>p>
                                      <div className="space-y-3">
                                        {["Proyectos", "Contactos", "Transacciones", "Métricas", "Todos los datos"].map((item) => (
                                            <div key={item} className="flex items-center justify-between py-3 border-b border-zinc-800/50">
                                                                <span className="text-sm text-white">{item}</span>span>
                                                                <button className="flex items-center gap-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors">
                                                                                      <Download size={14} />
                                                                                      Exportar CSV
                                                                </button>button>
                                            </div>div>
                                          ))}
                                      </div>div>
                        </div>div>
                                  )}
                        </div>div>
                </div>div>
          </div>div>
        );
};

export default SettingsPage;</div>
