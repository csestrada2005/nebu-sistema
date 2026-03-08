import { AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const t = {
  es: {
    alertas: "ALERTAS RÁPIDAS",
    pasos: "PRÓXIMOS PASOS SUGERIDOS",
    proyActivos: "Proyectos Activos",
    porCobrar: "Por cobrar (MXN)",
    saldosPend: "Saldos pendientes",
    entregados: "Entregados este mes",
    canalVentas: "Canal de ventas",
    canalSub: "Canal principal activo",
    ingresosMes: "INGRESOS POR MES",
    servicios: "SERVICIOS MÁS VENDIDOS",
    forecast: "FORECAST DEL MES",
    confirmados: "Ingresos confirmados",
    probables: "Ingresos probables",
    totalProy: "Total proyectado",
    ecommerce: "E-commerce",
    sistema: "Sistema/SaaS",
    landing: "Landing Page",
    mantenimiento: "Mantenimiento",
  },
  en: {
    alertas: "QUICK ALERTS",
    pasos: "SUGGESTED NEXT STEPS",
    proyActivos: "Active Projects",
    porCobrar: "Outstanding (MXN)",
    saldosPend: "Pending balances",
    entregados: "Delivered this month",
    canalVentas: "Sales channel",
    canalSub: "Main active channel",
    ingresosMes: "REVENUE BY MONTH",
    servicios: "TOP SELLING SERVICES",
    forecast: "MONTH FORECAST",
    confirmados: "Confirmed revenue",
    probables: "Probable revenue",
    totalProy: "Total projected",
    ecommerce: "E-commerce",
    sistema: "System/SaaS",
    landing: "Landing Page",
    mantenimiento: "Maintenance",
  },
};

const ALERTS = {
  es: [
    { type: "warning" as const, text: "PAPACHOA — Sin anticipo pagado" },
    { type: "warning" as const, text: "BAZAR CENTENARIO — Entrega estimada 23/02/2026 vencida" },
    { type: "success" as const, text: "RAWPAW — Entregado y liquidado" },
  ],
  en: [
    { type: "warning" as const, text: "PAPACHOA — No advance payment received" },
    { type: "warning" as const, text: "BAZAR CENTENARIO — Estimated delivery 23/02/2026 overdue" },
    { type: "success" as const, text: "RAWPAW — Delivered and paid in full" },
  ],
};

const NEXT_STEPS = {
  es: [
    { project: "PAPACHOA", action: "Cobrar anticipo antes de continuar" },
    { project: "BAZAR CENTENARIO", action: "Confirmar entrega y cobrar $12,500 MXN" },
    { project: "RAWPAW", action: "Confirmar cierre con cliente y activar mensualidad" },
  ],
  en: [
    { project: "PAPACHOA", action: "Collect advance payment before continuing" },
    { project: "BAZAR CENTENARIO", action: "Confirm delivery and collect $12,500 MXN" },
    { project: "RAWPAW", action: "Confirm closure with client and activate monthly plan" },
  ],
};

const revenueData = [
  { month: "Oct", value: 8000 },
  { month: "Nov", value: 12000 },
  { month: "Dic", value: 15000 },
  { month: "Ene", value: 20000 },
  { month: "Feb", value: 22500 },
  { month: "Mar", value: 25000 },
];

const revenueDataEN = [
  { month: "Oct", value: 8000 },
  { month: "Nov", value: 12000 },
  { month: "Dec", value: 15000 },
  { month: "Jan", value: 20000 },
  { month: "Feb", value: 22500 },
  { month: "Mar", value: 25000 },
];

const PIE_COLORS = ["#E63946", "#F97316", "#EAB308", "#22C55E"];

const DashboardPage = () => {
  const { lang } = useLanguage();
  const s = t[lang];

  const servicesData = [
    { name: s.ecommerce, value: 45 },
    { name: s.sistema, value: 30 },
    { name: s.landing, value: 15 },
    { name: s.mantenimiento, value: 10 },
  ];

  const barData = lang === "es" ? revenueData : revenueDataEN;

  const confirmed = 22500;
  const probable = 15000;
  const total = confirmed + probable;
  const progressPct = Math.round((confirmed / total) * 100);

  return (
    <div className="space-y-8">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label={s.proyActivos} value="3" />
        <StatsCard label={s.porCobrar} value="$27,500" sub={s.saldosPend} />
        <StatsCard label={s.entregados} value="1" sub="RAWPAW" />
        <StatsCard label={s.canalVentas} value="LinkedIn" sub={s.canalSub} />
      </div>

      {/* Alerts */}
      <section>
        <h2 className="text-sm font-bold tracking-wider mb-3" style={{ color: "var(--nebu-accent)" }}>{s.alertas}</h2>
        <div className="space-y-2">
          {ALERTS[lang].map((a, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-md text-sm" style={{ backgroundColor: "var(--nebu-card)", borderLeft: `4px solid ${a.type === "success" ? "#48BB78" : "var(--nebu-accent)"}`, color: "var(--nebu-text)" }}>
              {a.type === "success" ? <CheckCircle size={18} className="text-green-400 shrink-0" /> : <AlertTriangle size={18} className="text-red-400 shrink-0" />}
              <span>{a.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Next steps */}
      <section>
        <h2 className="text-sm font-bold tracking-wider mb-3" style={{ color: "var(--nebu-accent)" }}>{s.pasos}</h2>
        <div className="space-y-2">
          {NEXT_STEPS[lang].map((step, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-md text-sm" style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)" }}>
              <ArrowRight size={18} style={{ color: "var(--nebu-accent)" }} className="shrink-0" />
              <span><strong>{step.project}</strong> — {step.action}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Charts row: bar left, pie right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue bar chart */}
        <div className="rounded-xl p-6" style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A" }}>
          <h2 className="text-sm font-bold tracking-wider mb-4" style={{ color: "var(--nebu-accent)" }}>{s.ingresosMes}</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="month" tick={{ fill: "#888888", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#888888", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: 8, color: "#FFF", fontSize: 13 }}
                formatter={(value: number) => [`$${value.toLocaleString()} MXN`, lang === "es" ? "Ingreso" : "Revenue"]}
                cursor={{ fill: "rgba(230,57,70,0.1)" }}
              />
              <Bar dataKey="value" fill="#E63946" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Services pie chart */}
        <div className="rounded-xl p-6" style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A" }}>
          <h2 className="text-sm font-bold tracking-wider mb-4" style={{ color: "var(--nebu-accent)" }}>{s.servicios}</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={servicesData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3} stroke="none">
                {servicesData.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx]} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => <span style={{ color: "#CCCCCC", fontSize: 12 }}>{value}</span>}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #333", borderRadius: 8, color: "#FFF", fontSize: 13 }}
                formatter={(value: number) => [`${value}%`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecast card full width */}
      <div className="rounded-xl p-6" style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A" }}>
        <h2 className="text-sm font-bold tracking-wider mb-5" style={{ color: "var(--nebu-accent)" }}>{s.forecast}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="rounded-lg p-4" style={{ backgroundColor: "#111111", border: "1px solid #333333" }}>
            <p className="text-[11px] mb-1" style={{ color: "#888888" }}>{s.confirmados}</p>
            <p className="text-xl font-bold" style={{ color: "#22C55E" }}>$22,500</p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: "#111111", border: "1px solid #333333" }}>
            <p className="text-[11px] mb-1" style={{ color: "#888888" }}>{s.probables}</p>
            <p className="text-xl font-bold" style={{ color: "#EAB308" }}>$15,000</p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: "#111111", border: "1px solid #333333" }}>
            <p className="text-[11px] mb-1" style={{ color: "#888888" }}>{s.totalProy}</p>
            <p className="text-xl font-bold" style={{ color: "#FFFFFF" }}>$37,500</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full rounded-full h-3 overflow-hidden" style={{ backgroundColor: "#2A2A2A" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, background: "linear-gradient(90deg, #22C55E, #E63946)" }}
          />
        </div>
        <p className="text-[11px] mt-2" style={{ color: "#888888" }}>
          {progressPct}% {lang === "es" ? "confirmado" : "confirmed"}
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
