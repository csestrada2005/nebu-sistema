import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const kpis = [
  { label: "Tasa de Conexión", value: "43%", goal: ">40%", badge: "✓ On track", badgeColor: "#38A169" },
  { label: "Mensajes Enviados", value: "18", goal: "15-20", progress: 90, badgeColor: "#38A169" },
  { label: "Respuestas Positivas", value: "6", goal: ">5", badge: "✓ Meta alcanzada", badgeColor: "#38A169" },
  { label: "Llamadas Agendadas", value: "2", goal: "2-3", badge: "⚡ En objetivo", badgeColor: "#D69E2E" },
];

const weeklyData = [
  { name: "Sem 1", Conexiones: 18, Respuestas: 3, Llamadas: 1 },
  { name: "Sem 2", Conexiones: 22, Respuestas: 5, Llamadas: 1 },
  { name: "Sem 3", Conexiones: 24, Respuestas: 6, Llamadas: 2 },
  { name: "Sem 4", Conexiones: 27, Respuestas: 8, Llamadas: 2 },
];

const funnel = [
  { label: "Perfiles visitados", value: 120, pct: 100 },
  { label: "Solicitudes enviadas", value: 24, pct: 20 },
  { label: "Conexiones aceptadas", value: 10, pct: 43 },
  { label: "Mensajes enviados", value: 18, pct: 75 },
  { label: "Respuestas positivas", value: 6, pct: 33 },
  { label: "Llamadas agendadas", value: 2, pct: 33 },
  { label: "Proyectos cerrados", value: 0, pct: 0 },
];

const MetricasTab = () => (
  <div className="space-y-6">
    {/* KPI Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((k) => (
        <div
          key={k.label}
          className="rounded-lg p-5 transition-shadow hover:shadow-[0_0_20px_rgba(229,62,62,0.15)]"
          style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}
        >
          <p className="text-xs mb-1" style={{ color: "var(--nebu-text-secondary)" }}>{k.label}</p>
          <p className="text-3xl font-bold" style={{ color: "var(--nebu-text)" }}>{k.value}</p>
          <p className="text-[11px] mt-1" style={{ color: "var(--nebu-text-secondary)" }}>Meta: {k.goal}</p>
          {k.progress ? (
            <div className="mt-2 h-1.5 rounded-full" style={{ backgroundColor: "var(--nebu-border)" }}>
              <div className="h-full rounded-full" style={{ width: `${k.progress}%`, backgroundColor: "#38A169" }} />
            </div>
          ) : null}
          {k.badge && (
            <span
              className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${k.badgeColor}22`, color: k.badgeColor }}
            >
              {k.badge}
            </span>
          )}
        </div>
      ))}
    </div>

    {/* Chart + Funnel */}
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Bar Chart – 60% */}
      <div
        className="lg:col-span-3 rounded-lg p-5"
        style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}
      >
        <p className="text-sm font-semibold mb-4" style={{ color: "var(--nebu-text)" }}>
          ACTIVIDAD SEMANAL — últimas 4 semanas
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={weeklyData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} />
            <YAxis tick={{ fill: "#888", fontSize: 12 }} axisLine={false} domain={[0, 30]} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff" }}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: "#888" }} />
            <Bar dataKey="Conexiones" fill="#3B82F6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Respuestas" fill="#38A169" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Llamadas" fill="#E53E3E" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Funnel – 40% */}
      <div
        className="lg:col-span-2 rounded-lg p-5"
        style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}
      >
        <p className="text-sm font-semibold mb-4" style={{ color: "var(--nebu-text)" }}>
          EMBUDO DE CONVERSIÓN LinkedIn
        </p>
        <div className="space-y-3">
          {funnel.map((f, i) => (
            <div key={f.label}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: "var(--nebu-text-secondary)" }}>{f.label}</span>
                <span style={{ color: "var(--nebu-text)" }}>
                  {f.value} {i > 0 && <span style={{ color: "var(--nebu-text-secondary)" }}>({f.pct}%)</span>}
                </span>
              </div>
              <div className="h-2 rounded-full" style={{ backgroundColor: "var(--nebu-border)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max(f.pct, 2)}%`,
                    backgroundColor: f.value === 0 ? "var(--nebu-border)" : "var(--nebu-accent)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default MetricasTab;
