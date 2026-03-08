import { Activity } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const t = {
  title: { es: "RENDIMIENTO", en: "PERFORMANCE" },
  subtitle: { es: "Métricas internas del estudio", en: "Internal studio metrics" },
  stats: {
    avgDelivery: { es: "Tiempo promedio de entrega", en: "Avg delivery time" },
    onTime: { es: "Proyectos en tiempo", en: "Projects on time" },
    nps: { es: "NPS Score", en: "NPS Score" },
    satisfaction: { es: "Satisfacción cliente", en: "Client satisfaction" },
  },
  cols: {
    project: { es: "Proyecto", en: "Project" },
    estimated: { es: "Estimado", en: "Estimated" },
    actual: { es: "Real", en: "Actual" },
    diff: { es: "Diferencia", en: "Difference" },
    satisfaction: { es: "Satisfacción", en: "Satisfaction" },
  },
  days: { es: "días", en: "days" },
  chartTitle: { es: "Tiempo de entrega últimos 6 proyectos", en: "Delivery time last 6 projects" },
};

const statsData = [
  { label: t.stats.avgDelivery, value: { es: "28 días", en: "28 days" }, color: "#4A9EDB" },
  { label: t.stats.onTime, value: "67%", color: "#4ADB7A" },
  { label: t.stats.nps, value: "8.5/10", color: "#D4A84B" },
  { label: t.stats.satisfaction, value: "92%", color: "#E53E3E" },
];

const projects = [
  { project: "RAWPAW", estimated: { es: "30 días", en: "30 days" }, actual: { es: "28 días", en: "28 days" }, diff: -2, satisfaction: 95 },
  { project: "BAZAR CENTENARIO", estimated: { es: "25 días", en: "25 days" }, actual: { es: "32 días", en: "32 days" }, diff: 7, satisfaction: 85 },
  { project: "PAPACHOA", estimated: { es: "20 días", en: "20 days" }, actual: { es: "18 días", en: "18 days" }, diff: -2, satisfaction: 98 },
];

const chartData = [
  { name: "ANYA", days: 22 },
  { name: "FLORA", days: 35 },
  { name: "RAWPAW", days: 28 },
  { name: "VELOX", days: 18 },
  { name: "BAZAR", days: 32 },
  { name: "PAPACHOA", days: 18 },
];

const RendimientoPage = () => {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Activity size={22} style={{ color: "var(--nebu-accent)" }} />
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--nebu-text)" }}>{t.title[lang]}</h1>
        </div>
        <p className="text-sm" style={{ color: "var(--nebu-text-secondary)" }}>{t.subtitle[lang]}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((s, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--nebu-text-secondary)" }}>{s.label[lang]}</p>
            <p className="text-xl font-bold" style={{ color: s.color }}>{typeof s.value === "string" ? s.value : s.value[lang]}</p>
          </div>
        ))}
      </div>

      {/* Projects table */}
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
              {projects.map((p, i) => (
                <tr key={i} style={{ backgroundColor: "var(--nebu-card)", borderBottom: "1px solid var(--nebu-border)" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--nebu-text)" }}>{p.project}</td>
                  <td className="px-4 py-3" style={{ color: "var(--nebu-text-secondary)" }}>{p.estimated[lang]}</td>
                  <td className="px-4 py-3" style={{ color: "var(--nebu-text)" }}>{p.actual[lang]}</td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: p.diff <= 0 ? "#1a3a2a" : "#3a1a1a", color: p.diff <= 0 ? "#4ADB7A" : "#E53E3E" }}>
                      {p.diff <= 0 ? p.diff : `+${p.diff}`} {t.days[lang]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: p.satisfaction >= 90 ? "#1a3a2a" : "#3a3a1a", color: p.satisfaction >= 90 ? "#4ADB7A" : "#D4A84B" }}>{p.satisfaction}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-lg p-5" style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--nebu-text)" }}>{t.chartTitle[lang]}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" tick={{ fill: "#888888", fontSize: 11 }} />
            <YAxis tick={{ fill: "#888888", fontSize: 11 }} />
            <Tooltip formatter={(v: number) => [`${v} ${t.days[lang]}`, ""]} contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff" }} />
            <Line type="monotone" dataKey="days" stroke="#E53E3E" strokeWidth={2} dot={{ fill: "#E53E3E", r: 5 }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RendimientoPage;
