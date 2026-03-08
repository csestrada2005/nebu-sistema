import { Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const t = {
  title: { es: "OPORTUNIDADES", en: "OPPORTUNITIES" },
  subtitle: { es: "Prospectos ideales detectados", en: "Ideal prospects detected" },
  cols: {
    company: { es: "Empresa", en: "Company" },
    industry: { es: "Industria", en: "Industry" },
    signal: { es: "Señal", en: "Signal" },
    city: { es: "Ciudad", en: "City" },
    seller: { es: "Vendedor asignado", en: "Assigned seller" },
    priority: { es: "Prioridad", en: "Priority" },
  },
  priorities: { Alta: { es: "Alta", en: "High" }, Media: { es: "Media", en: "Medium" }, Baja: { es: "Baja", en: "Low" } },
  signals: {
    "Sin web": { es: "Sin web", en: "No website", bg: "#3a1a1a", color: "#E53E3E" },
    "Web vieja": { es: "Web vieja", en: "Old website", bg: "#3a3a1a", color: "#D4A84B" },
    "Solo Instagram": { es: "Solo Instagram", en: "Instagram only", bg: "#3a2a1a", color: "#E8854A" },
  },
};

type Signal = "Sin web" | "Web vieja" | "Solo Instagram";
type Priority = "Alta" | "Media" | "Baja";

const priorityColors: Record<Priority, { bg: string; color: string }> = {
  Alta: { bg: "#3a1a1a", color: "#E53E3E" },
  Media: { bg: "#3a3a1a", color: "#D4A84B" },
  Baja: { bg: "#1a2a1a", color: "#4ADB7A" },
};

const opportunities = [
  { company: "Panadería La Abuela", industry: { es: "Alimentos", en: "Food" }, signal: "Sin web" as Signal, city: "CDMX", seller: "Olivia", priority: "Alta" as Priority },
  { company: "Gym PowerFit", industry: { es: "Fitness", en: "Fitness" }, signal: "Web vieja" as Signal, city: "Monterrey", seller: "Ali", priority: "Alta" as Priority },
  { company: "Boutique Maré", industry: { es: "Moda", en: "Fashion" }, signal: "Solo Instagram" as Signal, city: "Guadalajara", seller: "Olivia", priority: "Media" as Priority },
  { company: "Taller Mecánico Ruíz", industry: { es: "Automotriz", en: "Automotive" }, signal: "Sin web" as Signal, city: "Puebla", seller: "Rodrigo", priority: "Media" as Priority },
  { company: "Café Orgánico MX", industry: { es: "Alimentos", en: "Food" }, signal: "Solo Instagram" as Signal, city: "Querétaro", seller: "Ali", priority: "Baja" as Priority },
  { company: "Dr. López Clínica", industry: { es: "Salud", en: "Health" }, signal: "Web vieja" as Signal, city: "CDMX", seller: "Rodrigo", priority: "Alta" as Priority },
];

const OportunidadesPage = () => {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Target size={22} style={{ color: "var(--nebu-accent)" }} />
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
              {opportunities.map((opp, i) => {
                const sig = t.signals[opp.signal];
                const pri = priorityColors[opp.priority];
                return (
                  <tr key={i} style={{ backgroundColor: "var(--nebu-card)", borderBottom: "1px solid var(--nebu-border)" }}>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--nebu-text)" }}>{opp.company}</td>
                    <td className="px-4 py-3" style={{ color: "var(--nebu-text-secondary)" }}>{opp.industry[lang]}</td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: sig.bg, color: sig.color }}>{sig[lang]}</span>
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--nebu-text-secondary)" }}>{opp.city}</td>
                    <td className="px-4 py-3" style={{ color: "var(--nebu-text)" }}>{opp.seller}</td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: pri.bg, color: pri.color }}>{t.priorities[opp.priority][lang]}</span>
                    </td>
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

export default OportunidadesPage;
