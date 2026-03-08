import { TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const t = {
  title: { es: "FORECAST", en: "FORECAST" },
  subtitle: { es: "Proyección de ingresos", en: "Revenue projection" },
  confirmed: { es: "Confirmado", en: "Confirmed" },
  probable: { es: "Probable", en: "Probable" },
  possible: { es: "Posible", en: "Possible" },
  totalProjected: { es: "Total proyectado", en: "Total projected" },
  cols: {
    prospect: { es: "Prospecto", en: "Prospect" },
    project: { es: "Proyecto", en: "Project" },
    amount: { es: "Monto", en: "Amount" },
    probability: { es: "Probabilidad", en: "Probability" },
    weighted: { es: "Ingreso ponderado", en: "Weighted revenue" },
  },
  chartTitle: { es: "Proyección mensual", en: "Monthly projection" },
};

const pipeline = [
  { prospect: "Gym PowerFit", project: { es: "Sitio web + SEO", en: "Website + SEO" }, amount: 8000, probability: 75 },
  { prospect: "Boutique Maré", project: "E-commerce", amount: 12000, probability: 50 },
  { prospect: "Café Orgánico MX", project: "Landing Page", amount: 3500, probability: 60 },
  { prospect: "Dr. López Clínica", project: { es: "Sitio web médico", en: "Medical website" }, amount: 6500, probability: 40 },
];

const monthlyData = [
  { month: "Mar", confirmed: 22500, probable: 8000 },
  { month: "Abr", confirmed: 15000, probable: 12000 },
  { month: "May", confirmed: 8000, probable: 18000 },
  { month: "Jun", confirmed: 5000, probable: 22000 },
];

const ForecastPage = () => {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <TrendingUp size={22} style={{ color: "var(--nebu-accent)" }} />
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--nebu-text)" }}>{t.title[lang]}</h1>
        </div>
        <p className="text-sm" style={{ color: "var(--nebu-text-secondary)" }}>{t.subtitle[lang]}</p>
      </div>

      {/* Big projection card */}
      <div className="rounded-lg p-6" style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--nebu-text-secondary)" }}>{t.confirmed[lang]}</p>
            <p className="text-2xl font-bold" style={{ color: "#4ADB7A" }}>$22,500</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--nebu-text-secondary)" }}>{t.probable[lang]}</p>
            <p className="text-2xl font-bold" style={{ color: "#D4A84B" }}>$15,000</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--nebu-text-secondary)" }}>{t.possible[lang]}</p>
            <p className="text-2xl font-bold" style={{ color: "#888888" }}>$8,500</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--nebu-text-secondary)" }}>{t.totalProjected[lang]}</p>
            <p className="text-2xl font-bold" style={{ color: "var(--nebu-text)" }}>$46,000</p>
          </div>
        </div>
        {/* Stacked bar visual */}
        <div className="mt-5 w-full h-3 rounded-full flex overflow-hidden" style={{ backgroundColor: "var(--nebu-surface)" }}>
          <div className="h-full" style={{ width: "48.9%", backgroundColor: "#4ADB7A" }} />
          <div className="h-full" style={{ width: "32.6%", backgroundColor: "#D4A84B" }} />
          <div className="h-full" style={{ width: "18.5%", backgroundColor: "#555555" }} />
        </div>
      </div>

      {/* Pipeline table */}
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--nebu-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--nebu-surface)" }}>
                {Object.values(t.cols).map((col, i) => (
                  <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--nebu-text-secondary)", borderBottom: "1px solid var(--nebu-border)" }}>{col[lang]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pipeline.map((row, i) => {
                const weighted = Math.round(row.amount * row.probability / 100);
                return (
                  <tr key={i} style={{ backgroundColor: "var(--nebu-card)", borderBottom: "1px solid var(--nebu-border)" }}>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--nebu-text)" }}>{row.prospect}</td>
                    <td className="px-4 py-3" style={{ color: "var(--nebu-text-secondary)" }}>{typeof row.project === "string" ? row.project : row.project[lang]}</td>
                    <td className="px-4 py-3" style={{ color: "var(--nebu-text)" }}>${row.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: row.probability >= 70 ? "#1a3a2a" : row.probability >= 50 ? "#3a3a1a" : "#3a1a1a", color: row.probability >= 70 ? "#4ADB7A" : row.probability >= 50 ? "#D4A84B" : "#E53E3E" }}>{row.probability}%</span>
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: "#4ADB7A" }}>${weighted.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-lg p-5" style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--nebu-text)" }}>{t.chartTitle[lang]}</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" tick={{ fill: "#888888", fontSize: 11 }} />
            <YAxis tick={{ fill: "#888888", fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff" }} />
            <Legend wrapperStyle={{ color: "#888" }} />
            <Bar dataKey="confirmed" name={t.confirmed[lang]} stackId="a" fill="#4ADB7A" radius={[0, 0, 0, 0]} />
            <Bar dataKey="probable" name={t.probable[lang]} stackId="a" fill="#D4A84B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ForecastPage;
