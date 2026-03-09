import { useState } from "react";
import { Shield, Plus, X, Users, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EmptyState from "@/components/EmptyState";
import type { Role } from "@/contexts/AuthContext";

const ROLE_COLORS: Record<Role, string> = {
  admin: "#E63946",
  vendedor: "#3B82F6",
  dev: "#10B981",
  cliente: "#71717A",
};

const ROLE_LABELS: Record<Role, Record<"es" | "en", string>> = {
  admin: { es: "Admin", en: "Admin" },
  vendedor: { es: "Vendedor", en: "Sales" },
  dev: { es: "Dev", en: "Dev" },
  cliente: { es: "Cliente", en: "Client" },
};

const PERMISSIONS = {
  es: ["Dashboard", "Pipeline", "Leads", "Cotizaciones", "Proyectos", "Contactos", "Finanzas", "NOVY", "Sistema"],
  en: ["Dashboard", "Pipeline", "Leads", "Quotes", "Projects", "Contacts", "Finances", "NOVY", "System"],
};

const PERM_MATRIX: Record<Role, boolean[]> = {
  admin:    [true, true, true, true, true, true, true, true, true],
  vendedor: [true, true, true, true, false, true, false, true, false],
  dev:      [true, false, false, false, true, true, false, true, false],
  cliente:  [false, false, false, true, true, false, false, false, false],
};

const RolesPage = () => {
  const { lang } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<Role>("vendedor");

  const tt = {
    es: {
      title: "Roles y Accesos", subtitle: "Gestión de usuarios y permisos",
      invite: "+ Invitar usuario", name: "Nombre", email: "Email", role: "Rol",
      status: "Estado", actions: "Acciones", save: "Guardar", cancel: "Cancelar",
      matrix: "Matriz de permisos", module: "Módulo",
    },
    en: {
      title: "Roles & Access", subtitle: "User and permission management",
      invite: "+ Invite user", name: "Name", email: "Email", role: "Role",
      status: "Status", actions: "Actions", save: "Save", cancel: "Cancel",
      matrix: "Permissions matrix", module: "Module",
    },
  }[lang];

  const inputStyle: React.CSSProperties = { backgroundColor: "#1A1A1A", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "#FFFFFF" }}>{tt.title}</h1>
          <p className="text-sm mt-1" style={{ color: "#71717A" }}>{tt.subtitle}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
          style={{ backgroundColor: "#E63946", color: "#FFFFFF" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C62828")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E63946")}
        >
          <Plus size={16} /> {tt.invite}
        </button>
      </div>

      {/* Users table - empty */}
      <div className="rounded-xl" style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
        <EmptyState
          icon={Users}
          title={{ es: "Sin usuarios registrados", en: "No registered users" }}
          subtitle={{ es: "Invita a tu primer usuario para comenzar.", en: "Invite your first user to get started." }}
          ctaLabel={{ es: "+ Invitar usuario", en: "+ Invite user" }}
          onCta={() => setShowModal(true)}
        />
      </div>

      {/* Permissions matrix */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>{tt.matrix}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#71717A" }}>{tt.module}</th>
                {(["admin", "vendedor", "dev", "cliente"] as Role[]).map((r) => (
                  <th key={r} className="text-center px-4 py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: ROLE_COLORS[r] + "20", color: ROLE_COLORS[r] }}>
                      {ROLE_LABELS[r][lang]}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS[lang].map((mod, i) => (
                <tr key={mod} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: "#FFFFFF" }}>{mod}</td>
                  {(["admin", "vendedor", "dev", "cliente"] as Role[]).map((r) => (
                    <td key={r} className="text-center px-4 py-3">
                      <div className="flex justify-center">
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center"
                          style={{
                            backgroundColor: PERM_MATRIX[r][i] ? ROLE_COLORS[r] + "20" : "rgba(255,255,255,0.03)",
                            border: `1px solid ${PERM_MATRIX[r][i] ? ROLE_COLORS[r] + "40" : "rgba(255,255,255,0.06)"}`,
                          }}
                        >
                          {PERM_MATRIX[r][i] && <Check size={12} style={{ color: ROLE_COLORS[r] }} />}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-xl p-6 space-y-4" style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>{tt.invite}</h3>
                <button onClick={() => setShowModal(false)} style={{ color: "#71717A" }}><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium" style={{ color: "#71717A" }}>{tt.name}</label>
                  <input value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full rounded-lg px-3 py-2.5 text-sm outline-none" style={inputStyle} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium" style={{ color: "#71717A" }}>{tt.email}</label>
                  <input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} type="email" className="w-full rounded-lg px-3 py-2.5 text-sm outline-none" style={inputStyle} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium" style={{ color: "#71717A" }}>{tt.role}</label>
                  <select value={formRole} onChange={(e) => setFormRole(e.target.value as Role)} className="w-full rounded-lg px-3 py-2.5 text-sm outline-none" style={inputStyle}>
                    {(["admin", "vendedor", "dev", "cliente"] as Role[]).map((r) => (
                      <option key={r} value={r}>{ROLE_LABELS[r][lang]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={{ backgroundColor: "#E63946", color: "#FFFFFF" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C62828")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E63946")}
                >
                  {tt.save}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.06)", color: "#71717A" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#71717A")}
                >
                  {tt.cancel}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RolesPage;
