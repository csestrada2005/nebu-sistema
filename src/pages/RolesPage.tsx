import { Check, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const users = [
  { name: "Josep Cuatrecasas", role: { es: "Admin", en: "Admin" }, access: [true, true, true, true, true, true] },
  { name: "Olivia", role: { es: "Ventas", en: "Sales" }, access: [false, true, false, false, false, false] },
  { name: "Samuel", role: { es: "Proyectos", en: "Projects" }, access: [true, false, false, false, false, false] },
  { name: "Emilio", role: { es: "Proyectos", en: "Projects" }, access: [true, false, false, false, false, false] },
];

const modules = {
  es: ["Dashboard", "Pipeline", "Contactos", "Finanzas", "Configuración", "NOVY"],
  en: ["Dashboard", "Pipeline", "Contacts", "Finances", "Settings", "NOVY"],
};

const RolesPage = () => {
  const { lang } = useLanguage();
  const tt = {
    es: { title: "Roles y Accesos", subtitle: "Gestión visual de permisos por usuario", user: "Usuario", role: "Rol" },
    en: { title: "Roles & Access", subtitle: "Visual permission management by user", user: "User", role: "Role" },
  }[lang];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{tt.title}</h1>
        <p className="text-sm mt-1" style={{ color: "#888" }}>{tt.subtitle}</p>
      </div>
      <div className="rounded-lg overflow-x-auto" style={{ border: "1px solid #2a2a2a" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#111" }}>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#E53E3E" }}>{tt.user}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#E53E3E" }}>{tt.role}</th>
              {modules[lang].map(m => (
                <th key={m} className="text-center px-4 py-3 text-xs font-semibold" style={{ color: "#E53E3E" }}>{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} style={{ borderTop: "1px solid #1a1a1a" }}>
                <td className="px-4 py-3 text-white font-medium text-xs">{u.name}</td>
                <td className="px-4 py-3">
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                    style={u.role.es === "Admin" ? { backgroundColor: "rgba(229,62,62,0.1)", color: "#E53E3E" } : { backgroundColor: "#1a1a1a", color: "#888" }}>
                    {u.role[lang]}
                  </span>
                </td>
                {u.access.map((has, j) => (
                  <td key={j} className="text-center px-4 py-3">
                    {has ? <Check size={16} className="inline-block" style={{ color: "#22c55e" }} /> : <X size={16} className="inline-block" style={{ color: "#ef4444" }} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolesPage;
