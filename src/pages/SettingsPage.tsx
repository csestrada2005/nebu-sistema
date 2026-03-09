import { useState } from "react";
import { User, Building, Users, Shield, Plug, Bell, CreditCard, Key, Palette, Download, Plus, Check, X, Upload, Moon, Sun } from "lucide-react";

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
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configuración general de tu cuenta y plataforma</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-56 shrink-0 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === section.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-muted/30 border border-border rounded-xl p-6">
          {activeSection === "perfil" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Perfil</h2>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
                  <User size={32} className="text-muted-foreground" />
                </div>
                <button className="text-sm bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-lg transition-colors">Cambiar foto</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Nombre", placeholder: "Tu nombre" },
                  { label: "Email", placeholder: "tu@email.com" },
                  { label: "Teléfono", placeholder: "+52 ..." },
                  { label: "Bio", placeholder: "Freelancer de diseño web" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-xs text-muted-foreground block mb-1">{field.label}</label>
                    <input className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring" placeholder={field.placeholder} />
                  </div>
                ))}
              </div>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors">Guardar cambios</button>
            </div>
          )}

          {activeSection === "negocio" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Negocio</h2>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-secondary rounded-xl flex items-center justify-center border-2 border-dashed border-border">
                  <Upload size={24} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-foreground">Logo de tu estudio</p>
                  <p className="text-xs text-muted-foreground">PNG, SVG (max 2MB)</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Nombre del estudio/agencia</label>
                  <input className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring" placeholder="Mi Estudio" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Website</label>
                  <input className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring" placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-muted-foreground block mb-1">Descripción</label>
                  <textarea className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring resize-none h-20" placeholder="Diseño web, branding y marketing digital..." />
                </div>
              </div>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors">Guardar</button>
            </div>
          )}

          {activeSection === "equipo" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Equipo</h2>
                <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors">
                  <Plus size={14} />
                  Invitar miembro
                </button>
              </div>
              <div className="bg-secondary/30 border border-border rounded-xl p-8 text-center">
                <Users size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Sin miembros del equipo. Invita colaboradores para trabajar juntos.</p>
              </div>
            </div>
          )}

          {activeSection === "roles" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Roles y permisos</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-muted-foreground font-medium py-3 px-2">Módulo</th>
                      <th className="text-center text-muted-foreground font-medium py-3 px-2">Admin</th>
                      <th className="text-center text-muted-foreground font-medium py-3 px-2">Editor</th>
                      <th className="text-center text-muted-foreground font-medium py-3 px-2">Viewer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Dashboard", "Proyectos", "Pagos", "Métricas", "AI Studio", "Settings"].map((mod) => (
                      <tr key={mod} className="border-b border-border/50">
                        <td className="py-3 px-2 text-foreground">{mod}</td>
                        <td className="py-3 px-2 text-center"><Check size={16} className="text-green-400 mx-auto" /></td>
                        <td className="py-3 px-2 text-center">{mod !== "Settings" ? <Check size={16} className="text-green-400 mx-auto" /> : <X size={16} className="text-muted-foreground mx-auto" />}</td>
                        <td className="py-3 px-2 text-center">{mod === "Dashboard" || mod === "Proyectos" ? <Check size={16} className="text-green-400 mx-auto" /> : <X size={16} className="text-muted-foreground mx-auto" />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === "integraciones" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Integraciones</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Stripe", desc: "Procesamiento de pagos" },
                  { name: "Meta Ads", desc: "Campañas publicitarias" },
                  { name: "Google Analytics", desc: "Analítica web" },
                  { name: "WhatsApp API", desc: "Mensajería directa" },
                  { name: "Make / Zapier", desc: "Automatización de flujos" },
                  { name: "Slack", desc: "Notificaciones de equipo" },
                  { name: "Notion", desc: "Base de conocimiento" },
                  { name: "Mailchimp", desc: "Email marketing" },
                ].map((int) => (
                  <div key={int.name} className="bg-secondary/30 border border-border rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Plug size={18} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{int.name}</p>
                        <p className="text-xs text-muted-foreground">{int.desc}</p>
                      </div>
                    </div>
                    <button className="text-xs bg-secondary hover:bg-secondary/80 text-foreground px-3 py-1.5 rounded-lg transition-colors">
                      Conectar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "notificaciones" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Notificaciones</h2>
              <div className="space-y-4">
                {[
                  { label: "Notificaciones por email", desc: "Recibe alertas de nuevos prospectos y pagos", enabled: true },
                  { label: "Notificaciones push", desc: "Alertas en tiempo real en el navegador", enabled: false },
                  { label: "Reporte semanal", desc: "Resumen de actividad cada lunes", enabled: true },
                  { label: "Alertas de pago", desc: "Cuando un cliente realiza un pago", enabled: true },
                ].map((notif) => (
                  <div key={notif.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{notif.label}</p>
                      <p className="text-xs text-muted-foreground">{notif.desc}</p>
                    </div>
                    <div className={`w-9 h-5 rounded-full relative cursor-pointer ${notif.enabled ? "bg-primary" : "bg-secondary"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${notif.enabled ? "right-0.5" : "left-0.5"}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "billing" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Billing</h2>
              <div className="bg-secondary/30 border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Plan Free</p>
                    <p className="text-xs text-muted-foreground">Funcionalidad básica incluida</p>
                  </div>
                  <button className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors">
                    Upgrade a Pro
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold text-foreground">3</p>
                    <p className="text-xs text-muted-foreground">Proyectos</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">1</p>
                    <p className="text-xs text-muted-foreground">Miembro</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">100</p>
                    <p className="text-xs text-muted-foreground">Créditos IA</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "apikeys" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">API Keys</h2>
              <p className="text-sm text-muted-foreground">Gestiona tus API keys para integraciones externas y acceso a la API de NEBU.</p>
              <div className="bg-secondary/30 border border-border rounded-xl p-8 text-center">
                <Key size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">Sin API keys generadas</p>
                <button className="text-xs bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-lg transition-colors">
                  + Generar API Key
                </button>
              </div>
            </div>
          )}

          {activeSection === "apariencia" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Apariencia</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-3">Tema</label>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-secondary border border-border text-foreground px-4 py-3 rounded-xl text-sm">
                      <Moon size={16} /> Oscuro
                    </button>
                    <button className="flex items-center gap-2 bg-muted/30 border border-border text-muted-foreground px-4 py-3 rounded-xl text-sm">
                      <Sun size={16} /> Claro
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "exportar" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Exportar datos</h2>
              <p className="text-sm text-muted-foreground">Descarga toda tu información en formato CSV o JSON.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Proyectos", "Clientes", "Pagos", "Métricas"].map((item) => (
                  <button key={item} className="flex items-center justify-between bg-secondary/30 border border-border rounded-xl p-4 hover:bg-secondary/50 transition-colors">
                    <span className="text-sm text-foreground">{item}</span>
                    <Download size={16} className="text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
