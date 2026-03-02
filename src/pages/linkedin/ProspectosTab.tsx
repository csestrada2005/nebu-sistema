import { useState } from "react";
import { X, Send, Phone, ArrowRight, Trash2 } from "lucide-react";

interface Prospect {
  name: string;
  company: string;
  role: string;
  location: string;
  web: string;
  status: string;
  signal: string;
}

const prospects: Prospect[] = [
  { name: "Carlos M.", company: "Clínica Dental Sonrisa", role: "Director", location: "México", web: "Sin web", status: "Solicitud enviada", signal: "🔴 Sin web" },
  { name: "Ana R.", company: "Restaurante La Hacienda", role: "Dueña", location: "México", web: "Web vieja", status: "Conectado", signal: "🟡 Web vieja" },
  { name: "Miguel T.", company: "Despacho Fiscal MTL", role: "Socio", location: "México", web: "Solo IG", status: "Mensaje enviado", signal: "🔴 Sin web" },
  { name: "Laura V.", company: "Boutique Flores", role: "Fundadora", location: "México", web: "Sin web", status: "Follow-up", signal: "🔴 Sin web" },
  { name: "Roberto S.", company: "Constructora SB", role: "Director", location: "México", web: "Web lenta", status: "Respuesta positiva ✓", signal: "🟡 Web lenta" },
  { name: "Diana K.", company: "Coach de Negocios", role: "Coach", location: "México", web: "Sin web", status: "Llamada agendada 📅", signal: "🔴 Sin web" },
];

const timeline = [
  { date: "28 Feb", icon: "👁️", text: "Perfil visitado" },
  { date: "28 Feb", icon: "📤", text: "Solicitud de conexión enviada" },
  { date: "01 Mar", icon: "✅", text: "Conexión aceptada" },
  { date: "01 Mar", icon: "💬", text: "Primer mensaje enviado" },
  { date: "02 Mar", icon: "📞", text: "Llamada agendada para 05 Mar" },
];

const ProspectosTab = () => {
  const [selected, setSelected] = useState<Prospect | null>(null);

  return (
    <div className="flex gap-4 h-[calc(100vh-220px)]">
      {/* Table */}
      <div className="flex-1 overflow-auto rounded-lg" style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--nebu-border)" }}>
              {["Nombre", "Empresa", "Cargo", "País", "Estado", "Señal"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--nebu-text-secondary)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prospects.map((p) => (
              <tr
                key={p.name}
                onClick={() => setSelected(p)}
                className="cursor-pointer transition-colors"
                style={{ borderBottom: "1px solid var(--nebu-border)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--nebu-active-bg)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <td className="px-4 py-3 font-medium" style={{ color: "var(--nebu-text)" }}>{p.name}</td>
                <td className="px-4 py-3" style={{ color: "var(--nebu-text-secondary)" }}>{p.company}</td>
                <td className="px-4 py-3" style={{ color: "var(--nebu-text-secondary)" }}>{p.role}</td>
                <td className="px-4 py-3" style={{ color: "var(--nebu-text-secondary)" }}>{p.location}</td>
                <td className="px-4 py-3" style={{ color: "var(--nebu-text-secondary)" }}>{p.status}</td>
                <td className="px-4 py-3 text-xs">{p.signal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div
          className="w-[340px] shrink-0 rounded-lg p-5 overflow-y-auto space-y-5"
          style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-bold" style={{ color: "var(--nebu-text)" }}>{selected.name}</p>
              <p className="text-xs" style={{ color: "var(--nebu-text-secondary)" }}>{selected.role} · {selected.company}</p>
            </div>
            <button onClick={() => setSelected(null)} className="p-1 rounded hover:opacity-70">
              <X size={16} style={{ color: "var(--nebu-text-secondary)" }} />
            </button>
          </div>

          {/* Signal */}
          <div className="rounded-md px-3 py-2 text-xs" style={{ backgroundColor: "var(--nebu-active-bg)", color: "var(--nebu-accent)" }}>
            Señal de oportunidad: {selected.signal} — {selected.web}
          </div>

          {/* Notes */}
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--nebu-text-secondary)" }}>Notas</p>
            <textarea
              className="w-full rounded-md p-2 text-xs resize-none h-16"
              style={{ backgroundColor: "var(--nebu-bg)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}
              placeholder="Agregar notas..."
            />
          </div>

          {/* Timeline */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--nebu-text-secondary)" }}>Timeline</p>
            <div className="space-y-2">
              {timeline.map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span style={{ color: "var(--nebu-text-secondary)" }}>{t.date}</span>
                  <span>{t.icon}</span>
                  <span style={{ color: "var(--nebu-text)" }}>{t.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Enviar mensaje", icon: Send },
              { label: "Agendar llamada", icon: Phone },
              { label: "Mover a CRM", icon: ArrowRight },
              { label: "Descartar", icon: Trash2 },
            ].map((a) => (
              <button
                key={a.label}
                className="flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-md transition-colors"
                style={{
                  backgroundColor: a.label === "Descartar" ? "transparent" : "var(--nebu-active-bg)",
                  color: a.label === "Descartar" ? "var(--nebu-text-secondary)" : "var(--nebu-text)",
                  border: `1px solid var(--nebu-border)`,
                }}
              >
                <a.icon size={13} />
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProspectosTab;
