import { useState, useEffect } from "react";
import { User, Building, Users, Shield, Plug, Bell, CreditCard, Key, Palette, Download, Plus, Check, X, Upload, Moon, Sun, Trash2 } from "lucide-react";
import { useAuth, Role } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Section = "perfil" | "negocio" | "equipo" | "roles" | "integraciones" | "notificaciones" | "billing" | "apikeys" | "apariencia" | "exportar";

interface UserWithRole {
  user_id: string;
  role: string;
  email: string;
  full_name: string;
}

const SettingsPage = () => {
  const { role, profile, user } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>("perfil");
  const [usersWithRoles, setUsersWithRoles] = useState<UserWithRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("cliente");

  const sections: { id: Section; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    { id: "perfil", label: "Perfil", icon: <User size={16} /> },
    { id: "negocio", label: "Negocio", icon: <Building size={16} /> },
    { id: "equipo", label: "Equipo", icon: <Users size={16} /> },
    { id: "roles", label: "Roles y permisos", icon: <Shield size={16} />, adminOnly: true },
    { id: "integraciones", label: "Integraciones", icon: <Plug size={16} /> },
    { id: "notificaciones", label: "Notificaciones", icon: <Bell size={16} /> },
    { id: "billing", label: "Billing", icon: <CreditCard size={16} /> },
    { id: "apikeys", label: "API Keys", icon: <Key size={16} /> },
    { id: "apariencia", label: "Apariencia", icon: <Palette size={16} /> },
    { id: "exportar", label: "Exportar datos", icon: <Download size={16} /> },
  ];

  const visibleSections = sections.filter(s => !s.adminOnly || role === "admin");

  const fetchUsersWithRoles = async () => {
    if (role !== "admin") return;
    setLoadingRoles(true);
    // Fetch all user_roles (admin can see all)
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");
    if (!roles) { setLoadingRoles(false); return; }
    
    // Fetch profiles for those users
    const userIds = roles.map(r => r.user_id);
    const { data: profiles } = await supabase.from("profiles").select("id, full_name, email").in("id", userIds);
    
    const merged = roles.map(r => {
      const p = profiles?.find(p => p.id === r.user_id);
      return { user_id: r.user_id, role: r.role, email: p?.email || "", full_name: p?.full_name || "" };
    });
    setUsersWithRoles(merged);
    setLoadingRoles(false);
  };

  useEffect(() => {
    if (activeSection === "roles" && role === "admin") {
      fetchUsersWithRoles();
    }
  }, [activeSection, role]);

  const handleChangeRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole } as any)
      .eq("user_id", userId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Role updated");
      fetchUsersWithRoles();
    }
  };

  const handleDeleteRole = async (userId: string) => {
    if (userId === user?.id) {
      toast.error("Cannot remove your own role");
      return;
    }
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("User role removed");
      fetchUsersWithRoles();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configuración general de tu cuenta y plataforma</p>
      </div>

      <div className="flex gap-6">
        <div className="w-56 shrink-0 space-y-1">
          {visibleSections.map((section) => (
            <button key={section.id} onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === section.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}>
              {section.icon} {section.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-muted/30 border border-border rounded-xl p-6">
          {activeSection === "perfil" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Perfil</h2>
              <div className="flex items-center gap-4">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
                    <User size={32} className="text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">{profile?.full_name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{profile?.email || user?.email || "—"}</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "roles" && role === "admin" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Roles y permisos</h2>
              </div>
              
              {loadingRoles ? (
                <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
              ) : usersWithRoles.length === 0 ? (
                <div className="bg-secondary/30 border border-border rounded-xl p-8 text-center">
                  <Shield size={32} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No users found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-muted-foreground font-medium py-3 px-2">User</th>
                        <th className="text-left text-muted-foreground font-medium py-3 px-2">Email</th>
                        <th className="text-left text-muted-foreground font-medium py-3 px-2">Role</th>
                        <th className="text-left text-muted-foreground font-medium py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersWithRoles.map((u) => (
                        <tr key={u.user_id} className="border-b border-border/50">
                          <td className="py-3 px-2 text-foreground font-medium">{u.full_name || "—"}</td>
                          <td className="py-3 px-2 text-muted-foreground">{u.email}</td>
                          <td className="py-3 px-2">
                            <select
                              value={u.role}
                              onChange={(e) => handleChangeRole(u.user_id, e.target.value)}
                              className="bg-secondary border border-border rounded-lg px-2 py-1 text-xs text-foreground outline-none"
                              disabled={u.user_id === user?.id}
                            >
                              <option value="admin">Admin</option>
                              <option value="vendedor">Vendedor</option>
                              <option value="dev">Dev</option>
                              <option value="cliente">Cliente</option>
                            </select>
                          </td>
                          <td className="py-3 px-2">
                            {u.user_id !== user?.id && (
                              <button onClick={() => handleDeleteRole(u.user_id)} className="p-1.5 rounded text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Permission matrix */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-foreground mb-4">Matriz de permisos</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-muted-foreground font-medium py-3 px-2">Módulo</th>
                        <th className="text-center text-muted-foreground font-medium py-3 px-2">Admin</th>
                        <th className="text-center text-muted-foreground font-medium py-3 px-2">Vendedor</th>
                        <th className="text-center text-muted-foreground font-medium py-3 px-2">Dev</th>
                        <th className="text-center text-muted-foreground font-medium py-3 px-2">Cliente</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { mod: "Dashboard", admin: true, vendedor: true, dev: true, cliente: true },
                        { mod: "Proyectos", admin: true, vendedor: true, dev: true, cliente: true },
                        { mod: "Pagos", admin: true, vendedor: true, dev: false, cliente: false },
                        { mod: "Métricas", admin: true, vendedor: true, dev: false, cliente: false },
                        { mod: "AI Studio", admin: true, vendedor: true, dev: true, cliente: false },
                        { mod: "Settings", admin: true, vendedor: false, dev: true, cliente: false },
                      ].map((row) => (
                        <tr key={row.mod} className="border-b border-border/50">
                          <td className="py-3 px-2 text-foreground">{row.mod}</td>
                          {["admin", "vendedor", "dev", "cliente"].map(r => (
                            <td key={r} className="py-3 px-2 text-center">
                              {(row as any)[r] ? <Check size={16} className="text-green-400 mx-auto" /> : <X size={16} className="text-muted-foreground mx-auto" />}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === "negocio" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Negocio</h2>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-secondary rounded-xl flex items-center justify-center border-2 border-dashed border-border"><Upload size={24} className="text-muted-foreground" /></div>
                <div><p className="text-sm text-foreground">Logo de tu estudio</p><p className="text-xs text-muted-foreground">PNG, SVG (max 2MB)</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-xs text-muted-foreground block mb-1">Nombre del estudio</label><input className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring" placeholder="Mi Estudio" /></div>
                <div><label className="text-xs text-muted-foreground block mb-1">Website</label><input className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring" placeholder="https://..." /></div>
              </div>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors">Guardar</button>
            </div>
          )}

          {activeSection === "equipo" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Equipo</h2>
                <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors"><Plus size={14} />Invitar miembro</button>
              </div>
              <div className="bg-secondary/30 border border-border rounded-xl p-8 text-center">
                <Users size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Sin miembros del equipo. Invita colaboradores para trabajar juntos.</p>
              </div>
            </div>
          )}

          {activeSection === "integraciones" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Integraciones</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{ name: "Stripe", desc: "Pagos" }, { name: "Meta Ads", desc: "Ads" }, { name: "Google Analytics", desc: "Analytics" }, { name: "WhatsApp", desc: "Mensajería" }].map((int) => (
                  <div key={int.name} className="bg-secondary/30 border border-border rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center"><Plug size={18} className="text-muted-foreground" /></div>
                      <div><p className="text-sm font-medium text-foreground">{int.name}</p><p className="text-xs text-muted-foreground">{int.desc}</p></div>
                    </div>
                    <button className="text-xs bg-secondary hover:bg-secondary/80 text-foreground px-3 py-1.5 rounded-lg transition-colors">Conectar</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "notificaciones" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Notificaciones</h2>
              <p className="text-sm text-muted-foreground">Configuración de notificaciones próximamente.</p>
            </div>
          )}

          {activeSection === "billing" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Billing</h2>
              <div className="bg-secondary/30 border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div><p className="text-sm font-semibold text-foreground">Plan Free</p><p className="text-xs text-muted-foreground">Funcionalidad básica incluida</p></div>
                  <button className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors">Upgrade a Pro</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "apikeys" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">API Keys</h2>
              <div className="bg-secondary/30 border border-border rounded-xl p-8 text-center">
                <Key size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">Sin API keys generadas</p>
                <button className="text-xs bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-lg transition-colors">+ Generar API Key</button>
              </div>
            </div>
          )}

          {activeSection === "apariencia" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Apariencia</h2>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-secondary border border-border text-foreground px-4 py-3 rounded-xl text-sm"><Moon size={16} /> Oscuro</button>
                <button className="flex items-center gap-2 bg-muted/30 border border-border text-muted-foreground px-4 py-3 rounded-xl text-sm"><Sun size={16} /> Claro</button>
              </div>
            </div>
          )}

          {activeSection === "exportar" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Exportar datos</h2>
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
