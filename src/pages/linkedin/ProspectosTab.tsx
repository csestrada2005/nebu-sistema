import { useState } from "react";
import { X, Send, Phone, ArrowRight, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Prospect {
  name: string; company: string; role: Record<"es"|"en",string>; location: string;
  web: Record<"es"|"en",string>; status: Record<"es"|"en",string>; signal: Record<"es"|"en",string>;
}

const prospects: Prospect[] = [
  { name: "Carlos M.", company: "Clínica Dental Sonrisa", role: { es: "Director", en: "Director" }, location: "México", web: { es: "Sin web", en: "No website" }, status: { es: "Solicitud enviada", en: "Request sent" }, signal: { es: "🔴 Sin web", en: "🔴 No website" } },
  { name: "Ana R.", company: "Restaurante La Hacienda", role: { es: "Dueña", en: "Owner" }, location: "México", web: { es: "Web vieja", en: "Old website" }, status: { es: "Conectado", en: "Connected" }, signal: { es: "🟡 Web vieja", en: "🟡 Old website" } },
  { name: "Miguel T.", company: "Despacho Fiscal MTL", role: { es: "Socio", en: "Partner" }, location: "México", web: { es: "Solo IG", en: "IG only" }, status: { es: "Mensaje enviado", en: "Message sent" }, signal: { es: "🔴 Sin web", en: "🔴 No website" } },
  { name: "Laura V.", company: "Boutique Flores", role: { es: "Fundadora", en: "Founder" }, location: "México", web: { es: "Sin web", en: "No website" }, status: { es: "Follow-up", en: "Follow-up" }, signal: { es: "🔴 Sin web", en: "🔴 No website" } },
  { name: "Roberto S.", company: "Constructora SB", role: { es: "Director", en: "Director" }, location: "México", web: { es: "Web lenta", en: "Slow website" }, status: { es: "Respuesta positiva ✓", en: "Positive reply ✓" }, signal: { es: "🟡 Web lenta", en: "🟡 Slow website" } },
  { name: "Diana K.", company: "Coach de Negocios", role: { es: "Coach", en: "Coach" }, location: "México", web: { es: "Sin web", en: "No website" }, status: { es: "Llamada agendada 📅", en: "Call scheduled 📅" }, signal: { es: "🔴 Sin web", en: "🔴 No website" } },
];

const timeline = {
  es: [
    { date: "28 Feb", icon: "👁️", text: "Perfil visitado" },
    { date: "28 Feb", icon: "📤", text: "Solicitud de conexión enviada" },
    { date: "01 Mar", icon: "✅", text: "Conexión aceptada" },
    { date: "01 Mar", icon: "💬", text: "Primer mensaje enviado" },
    { date: "02 Mar", icon: "📞", text: "Llamada agendada para 05 Mar" },
  ],
  en: [
    { date: "Feb 28", icon: "👁️", text: "Profile visited" },
    { date: "Feb 28", icon: "📤", text: "Connection request sent" },
    { date: "Mar 01", icon: "✅", text: "Connection accepted" },
    { date: "Mar 01", icon: "💬", text: "First message sent" },
    { date: "Mar 02", icon: "📞", text: "Call scheduled for Mar 05" },
  ],
};

const ProspectosTab = () => {
  const [selected, setSelected] = useState<Prospect | null>(null);
  const { lang } = useLanguage();

  const headers = lang === "es"
    ? ["Nombre", "Empresa", "Cargo", "País", "Estado", "Señal"]
    : ["Name", "Company", "Role", "Country", "Status", "Signal"];

  const actions = lang === "es"
    ? [{ label: "Enviar mensaje", icon: Send }, { label: "Agendar llamada", icon: Phone }, { label: "Mover a CRM", icon: ArrowRight }, { label: "Descartar", icon: Trash2 }]
    : [{ label: "Send message", icon: Send }, { label: "Schedule call", icon: Phone }, { label: "Move to CRM", icon: ArrowRight }, { label: "Discard", icon: Trash2 }];

  return (
    <div className="flex gap-4 h-[calc(100vh-220px)]">
      <div className="flex-1 overflow-auto rounded-lg" style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--nebu-border)" }}>
              {headers.map((h) => (<th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--nebu-text-secondary)" }}>{h}</th>))}
            </tr>
          </thead>
          <tbody>
            {prospects.map((p) => (
              <tr key={p.name} onClick={() => setSelected(p)} className="cursor-pointer transition-colors" style={{ borderBottom: "1px solid var(--nebu-border)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--nebu-active-bg)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                <td className="px-4 py-3 font-medium" style={{ color: "var(--nebu-text)" }}>{p.name}</td>
                <td className="px-4 py-3" style={{ color: "var(--nebu-text-secondary)" }}>{p.company}</td>
                <td className="px-4 py-3" style={{ color: "var(--nebu-text-secondary)" }}>{p.role[lang]}</td>
                <td className="px-4 py-3" style={{ color: "var(--nebu-text-secondary)" }}>{p.location}</td>
                <td className="px-4 py-3" style={{ color: "var(--nebu-text-secondary)" }}>{p.status[lang]}</td>
                <td className="px-4 py-3 text-xs">{p.signal[lang]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="w-[340px] shrink-0 rounded-lg p-5 overflow-y-auto space-y-5" style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-bold" style={{ color: "var(--nebu-text)" }}>{selected.name}</p>
              <p className="text-xs" style={{ color: "var(--nebu-text-secondary)" }}>{selected.role[lang]} · {selected.company}</p>
            </div>
            <button onClick={() => setSelected(null)} className="p-1 rounded hover:opacity-70"><X size={16} style={{ color: "var(--nebu-text-secondary)" }} /></button>
          </div>
          <div className="rounded-md px-3 py-2 text-xs" style={{ backgroundColor: "var(--nebu-active-bg)", color: "var(--nebu-accent)" }}>
            {lang === "es" ? "Señal de oportunidad" : "Opportunity signal"}: {selected.signal[lang]} — {selected.web[lang]}
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--nebu-text-secondary)" }}>{lang === "es" ? "Notas" : "Notes"}</p>
            <textarea className="w-full rounded-md p-2 text-xs resize-none h-16" style={{ backgroundColor: "var(--nebu-bg)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}
              placeholder={lang === "es" ? "Agregar notas..." : "Add notes..."} />
          </div>
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--nebu-text-secondary)" }}>Timeline</p>
            <div className="space-y-2">
              {timeline[lang].map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span style={{ color: "var(--nebu-text-secondary)" }}>{t.date}</span>
                  <span>{t.icon}</span>
                  <span style={{ color: "var(--nebu-text)" }}>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {actions.map((a) => (
              <button key={a.label} className="flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-md transition-colors"
                style={{ backgroundColor: a.label.includes("Descartar") || a.label.includes("Discard") ? "transparent" : "var(--nebu-active-bg)", color: a.label.includes("Descartar") || a.label.includes("Discard") ? "var(--nebu-text-secondary)" : "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}>
                <a.icon size={13} />{a.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProspectosTab;
