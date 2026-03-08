import React from "react";
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock, Repeat, Users as UsersIcon, Briefcase } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

const PROJECTS = [
  { id: "P01", nombre: "RAWPAW", precioTotal: 20000, pagado: 10000, saldo: 0, creditos: 0, dominio: 699, hosting: 0, comision15: 3000, costoTotal: 3699, utilidad: 16301, mensualidad: true, montoMensual: 250,
    estadoPago: { es: "Completo", en: "Complete" }, estadoColor: "green" },
  { id: "P02", nombre: "PAPACHOA", precioTotal: 15000, pagado: 0, saldo: 15000, creditos: 520, dominio: 299, hosting: 0, comision15: 2250, costoTotal: 3069, utilidad: 11931, mensualidad: true, montoMensual: 0,
    estadoPago: { es: "Sin anticipo", en: "No advance" }, estadoColor: "red" },
  { id: "P03", nombre: "BAZAR CENTENARIO", precioTotal: 25000, pagado: 12500, saldo: 12500, creditos: 0, dominio: 0, hosting: 0, comision15: 3750, costoTotal: 3750, utilidad: 21250, mensualidad: false, montoMensual: 0,
    estadoPago: { es: "Anticipo OK", en: "Advance OK" }, estadoColor: "yellow" },
];

const TOTALS = {
  contratado: PROJECTS.reduce((s, p) => s + p.precioTotal, 0),
  cobrado: PROJECTS.reduce((s, p) => s + p.pagado, 0),
  pendiente: PROJECTS.reduce((s, p) => s + p.saldo, 0),
  comisiones: PROJECTS.reduce((s, p) => s + p.comision15, 0),
  costos: PROJECTS.reduce((s, p) => s + p.costoTotal, 0),
  utilidad: PROJECTS.reduce((s, p) => s + p.utilidad, 0),
};

const fmt = (n: number) => "$" + n.toLocaleString("es-MX", { minimumFractionDigits: 0 });

const ALERTS = {
  es: [
    { type: "warning" as const, message: "PAPACHOA — Sin anticipo pagado. $15,000 pendientes desde 06/02/2026" },
    { type: "warning" as const, message: "BAZAR CENTENARIO — Saldo de $12,500 pendiente contra entrega" },
    { type: "success" as const, message: "RAWPAW — Proyecto liquidado. Mensualidad activa $250/mes" },
  ],
  en: [
    { type: "warning" as const, message: "PAPACHOA — No advance payment. $15,000 pending since 06/02/2026" },
    { type: "warning" as const, message: "BAZAR CENTENARIO — $12,500 balance pending upon delivery" },
    { type: "success" as const, message: "RAWPAW — Project paid in full. Active monthly $250/mo" },
  ],
};

const FinanzasPage: React.FC = () => {
  const { lang } = useLanguage();

  const tt = {
    es: {
      title: "FINANZAS", sub: "Dashboard financiero — Nebu Studio",
      ingContratados: "Ingresos Contratados", proyActivos: "3 proyectos activos",
      cobradoHoy: "Cobrado Hasta Hoy", alCorriente: "Al corriente",
      porCobrar: "Por Cobrar", pendiente: "Pendiente",
      utilidadEst: "Utilidad Estimada", utilidadSub: "Precio total - costos operativos",
      desglose: "Desglose Financiero por Proyecto",
      headers: ["Proyecto", "Precio Total", "Pagado", "Saldo", "Créditos", "Dominio", "Hosting", "Comisión 15%", "Costo Total", "Utilidad", "Mensualidad"],
      mrr: "Ingresos Mensuales Recurrentes (MRR)", mrrActual: "MRR actual", mrrProy: "Proyectado (si todos activan)",
      porDefinir: "Por definir", alertas: "Alertas Financieras",
    },
    en: {
      title: "FINANCES", sub: "Financial dashboard — Nebu Studio",
      ingContratados: "Contracted Revenue", proyActivos: "3 active projects",
      cobradoHoy: "Collected To Date", alCorriente: "Up to date",
      porCobrar: "Outstanding", pendiente: "Pending",
      utilidadEst: "Estimated Profit", utilidadSub: "Total price - operating costs",
      desglose: "Financial Breakdown by Project",
      headers: ["Project", "Total Price", "Paid", "Balance", "Credits", "Domain", "Hosting", "Commission 15%", "Total Cost", "Profit", "Monthly"],
      mrr: "Monthly Recurring Revenue (MRR)", mrrActual: "Current MRR", mrrProy: "Projected (if all activate)",
      porDefinir: "To be defined", alertas: "Financial Alerts",
    },
  }[lang];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{tt.title}</h1>
        <p className="text-sm text-[#888888] mt-1">{tt.sub}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3"><DollarSign className="w-4 h-4 text-[#888888]" /><span className="text-[10px] text-[#E53E3E] font-bold uppercase tracking-widest">{tt.ingContratados}</span></div>
          <p className="text-3xl font-bold font-mono text-white">{fmt(TOTALS.contratado)}</p>
          <p className="text-xs text-[#888888] mt-1">{tt.proyActivos}</p>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3"><CheckCircle className="w-4 h-4 text-[#22c55e]" /><span className="text-[10px] text-[#E53E3E] font-bold uppercase tracking-widest">{tt.cobradoHoy}</span></div>
          <p className="text-3xl font-bold font-mono text-[#22c55e]">{fmt(TOTALS.cobrado)}</p>
          <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium rounded bg-green-900/40 text-green-400 border border-green-700/40">{tt.alCorriente}</span>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3"><Clock className="w-4 h-4 text-[#ef4444]" /><span className="text-[10px] text-[#E53E3E] font-bold uppercase tracking-widest">{tt.porCobrar}</span></div>
          <p className="text-3xl font-bold font-mono text-[#ef4444]">{fmt(TOTALS.pendiente)}</p>
          <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium rounded bg-red-900/40 text-red-400 border border-red-700/40">{tt.pendiente}</span>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3"><TrendingUp className="w-4 h-4 text-[#22c55e]" /><span className="text-[10px] text-[#E53E3E] font-bold uppercase tracking-widest">{tt.utilidadEst}</span></div>
          <p className="text-3xl font-bold font-mono text-[#22c55e]">{fmt(TOTALS.utilidad)}</p>
          <p className="text-xs text-[#888888] mt-1">{tt.utilidadSub}</p>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#2a2a2a]"><h2 className="text-xs text-[#E53E3E] font-bold uppercase tracking-widest">{tt.desglose}</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1f1f1f]">
                {tt.headers.map((h) => (<th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-[#E53E3E] uppercase tracking-wider whitespace-nowrap">{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {PROJECTS.map((p, i) => (
                <tr key={p.id} className={`border-t border-[#2a2a2a] hover:bg-[#222222] transition-colors ${i % 2 === 0 ? "bg-[#0f0f0f]" : "bg-[#1a1a1a]"}`}>
                  <td className="px-4 py-3 font-bold text-white whitespace-nowrap">{p.nombre}
                    <span className={`ml-2 inline-block px-2 py-0.5 text-[9px] font-medium rounded ${p.estadoColor === "green" ? "bg-green-900/40 text-green-400 border border-green-700/40" : p.estadoColor === "red" ? "bg-red-900/40 text-red-400 border border-red-700/40" : "bg-yellow-900/40 text-yellow-400 border border-yellow-700/40"}`}>{p.estadoPago[lang]}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-white">{fmt(p.precioTotal)}</td>
                  <td className="px-4 py-3 font-mono text-[#22c55e]">{fmt(p.pagado)}</td>
                  <td className={`px-4 py-3 font-mono ${p.saldo > 0 ? "text-[#ef4444]" : "text-[#888888]"}`}>{fmt(p.saldo)}</td>
                  <td className="px-4 py-3 font-mono text-[#888888]">{p.creditos > 0 ? fmt(p.creditos) : "—"}</td>
                  <td className="px-4 py-3 font-mono text-[#888888]">{p.dominio > 0 ? fmt(p.dominio) : "—"}</td>
                  <td className="px-4 py-3 font-mono text-[#888888]">{p.hosting > 0 ? fmt(p.hosting) : "—"}</td>
                  <td className="px-4 py-3 font-mono text-[#f97316]">{fmt(p.comision15)}</td>
                  <td className="px-4 py-3 font-mono text-white">{fmt(p.costoTotal)}</td>
                  <td className="px-4 py-3 font-mono text-[#22c55e] font-bold">{fmt(p.utilidad)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {p.mensualidad && p.montoMensual > 0 ? (
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-green-900/40 text-green-400 border border-green-700/40">{fmt(p.montoMensual)}/{lang === "es" ? "mes" : "mo"}</span>
                    ) : p.mensualidad ? (
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-gray-800 text-gray-400 border border-gray-700">{tt.porDefinir}</span>
                    ) : <span className="text-[#555555]">—</span>}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-[#E53E3E] bg-[#1f1f1f]">
                <td className="px-4 py-3 font-bold text-white text-xs uppercase tracking-wider">TOTAL</td>
                <td className="px-4 py-3 font-mono font-bold text-white">{fmt(TOTALS.contratado)}</td>
                <td className="px-4 py-3 font-mono font-bold text-[#22c55e]">{fmt(TOTALS.cobrado)}</td>
                <td className="px-4 py-3 font-mono font-bold text-[#ef4444]">{fmt(TOTALS.pendiente)}</td>
                <td className="px-4 py-3 font-mono text-[#888888]">—</td>
                <td className="px-4 py-3 font-mono text-[#888888]">—</td>
                <td className="px-4 py-3 font-mono text-[#888888]">—</td>
                <td className="px-4 py-3 font-mono font-bold text-[#f97316]">{fmt(TOTALS.comisiones)}</td>
                <td className="px-4 py-3 font-mono font-bold text-white">{fmt(TOTALS.costos)}</td>
                <td className="px-4 py-3 font-mono font-bold text-[#22c55e]">{fmt(TOTALS.utilidad)}</td>
                <td className="px-4 py-3" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        <h2 className="text-xs text-[#E53E3E] font-bold uppercase tracking-widest mb-5">{tt.mrr}</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-[#2a2a2a]"><div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#22c55e]" /><span className="text-sm font-medium text-white">RAWPAW</span></div><span className="font-mono text-sm font-bold text-[#22c55e]">$250/{lang === "es" ? "mes" : "mo"}</span></div>
          <div className="flex items-center justify-between py-2 border-b border-[#2a2a2a]"><div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#555555]" /><span className="text-sm font-medium text-white">PAPACHOA</span></div><span className="font-mono text-sm text-[#888888]">{tt.porDefinir}</span></div>
          <div className="flex items-center justify-between py-2 border-b border-[#2a2a2a]"><div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#555555]" /><span className="text-sm font-medium text-white">BAZAR CENTENARIO</span></div><span className="font-mono text-sm text-[#555555]">—</span></div>
        </div>
        <div className="mt-5 pt-4 border-t border-[#2a2a2a] flex items-center justify-between">
          <div><p className="text-xs text-[#888888]">{tt.mrrActual}</p><p className="text-2xl font-bold font-mono text-[#22c55e]">$250/{lang === "es" ? "mes" : "mo"}</p></div>
          <div className="text-right"><p className="text-xs text-[#888888]">{tt.mrrProy}</p><p className="text-2xl font-bold font-mono text-white">$250+/{lang === "es" ? "mes" : "mo"}</p></div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs text-[#E53E3E] font-bold uppercase tracking-widest mb-2">{tt.alertas}</h2>
        {ALERTS[lang].map((alert, i) => (
          <div key={i} className={`flex items-start gap-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 ${alert.type === "warning" ? "border-l-4 border-l-[#ef4444]" : "border-l-4 border-l-[#22c55e]"}`}>
            {alert.type === "warning" ? <AlertTriangle className="w-4 h-4 text-[#ef4444] mt-0.5 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 text-[#22c55e] mt-0.5 flex-shrink-0" />}
            <p className={`text-sm ${alert.type === "warning" ? "text-[#fca5a5]" : "text-[#86efac]"}`}>{alert.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinanzasPage;
