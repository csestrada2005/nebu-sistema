import { Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const t = {
  title: { es: "LOG DE LLAMADAS", en: "CALL LOG" },
  subtitle: { es: "Registro de llamadas de venta", en: "Sales call records" },
  cols: {
    date: { es: "Fecha", en: "Date" },
    client: { es: "Cliente", en: "Client" },
    duration: { es: "Duración", en: "Duration" },
    result: { es: "Resultado", en: "Result" },
    seller: { es: "Vendedor", en: "Seller" },
    next: { es: "Próximo paso", en: "Next step" },
  },
};

type Result = "Interesado" | "No interesado" | "Agendar follow-up";

const resultStyles: Record<Result, { bg: string; color: string; en: string }> = {
  "Interesado": { bg: "#1a3a2a", color: "#4ADB7A", en: "Interested" },
  "No interesado": { bg: "#3a1a1a", color: "#E53E3E", en: "Not interested" },
  "Agendar follow-up": { bg: "#1a3a5c", color: "#4A9EDB", en: "Schedule follow-up" },
};

const calls = [
  { date: "07/03/2026", client: "Panadería La Abuela", duration: "18 min", result: "Interesado" as Result, seller: "Olivia", next: { es: "Enviar cotización", en: "Send quote" } },
  { date: "06/03/2026", client: "Gym PowerFit", duration: "12 min", result: "Agendar follow-up" as Result, seller: "Ali", next: { es: "Llamar el viernes", en: "Call on Friday" } },
  { date: "05/03/2026", client: "Boutique Maré", duration: "25 min", result: "Interesado" as Result, seller: "Olivia", next: { es: "Agendar demo", en: "Schedule demo" } },
  { date: "04/03/2026", client: "Taller Mecánico Ruíz", duration: "8 min", result: "No interesado" as Result, seller: "Rodrigo", next: { es: "Archivar", en: "Archive" } },
  { date: "03/03/2026", client: "Dr. López Clínica", duration: "22 min", result: "Agendar follow-up" as Result, seller: "Rodrigo", next: { es: "Enviar caso de éxito", en: "Send case study" } },
];

const LlamadasPage = () => {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Phone size={22} style={{ color: "var(--nebu-accent)" }} />
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--nebu-text)" }}>{t.title[lang]}</h1>
        </div>
        <p className="text-sm" style={{ color: "var(--nebu-text-secondary)" }}>{t.subtitle[lang]}</p>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--nebu-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--nebu-surface)" }}>
                {Object.values(t.cols).map((col, i) => (
                  <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--nebu-text-secondary)", borderBottom: "1px solid var(--nebu-border)" }}>
                    {col[lang]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calls.map((call, i) => {
                const rs = resultStyles[call.result];
                return (
                  <tr key={i} style={{ backgroundColor: "var(--nebu-card)", borderBottom: "1px solid var(--nebu-border)" }}>
                    <td className="px-4 py-3" style={{ color: "var(--nebu-text-secondary)" }}>{call.date}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--nebu-text)" }}>{call.client}</td>
                    <td className="px-4 py-3" style={{ color: "var(--nebu-text-secondary)" }}>{call.duration}</td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: rs.bg, color: rs.color }}>
                        {lang === "es" ? call.result : rs.en}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--nebu-text)" }}>{call.seller}</td>
                    <td className="px-4 py-3" style={{ color: "var(--nebu-text-secondary)" }}>{call.next[lang]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LlamadasPage;
