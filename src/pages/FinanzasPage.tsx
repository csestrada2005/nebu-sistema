import React from "react";
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";

// ── Financial data per project ──
const PROJECTS = [
  {
    id: "P01",
    nombre: "RAWPAW",
    precioTotal: 20000,
    pagado: 10000,
    saldo: 0,
    creditos: 0,
    dominio: 699,
    hosting: 0,
    comision15: 3000,
    costoTotal: 3699,
    utilidad: 16301,
    mensualidad: true,
    montoMensual: 250,
    estadoPago: "Completo",
    estadoColor: "green",
  },
  {
    id: "P02",
    nombre: "PAPACHOA",
    precioTotal: 15000,
    pagado: 0,
    saldo: 15000,
    creditos: 520,
    dominio: 299,
    hosting: 0,
    comision15: 2250,
    costoTotal: 3069,
    utilidad: 11931,
    mensualidad: true,
    montoMensual: 0,
    estadoPago: "Sin anticipo",
    estadoColor: "red",
  },
  {
    id: "P03",
    nombre: "BAZAR CENTENARIO",
    precioTotal: 25000,
    pagado: 12500,
    saldo: 12500,
    creditos: 0,
    dominio: 0,
    hosting: 0,
    comision15: 3750,
    costoTotal: 3750,
    utilidad: 21250,
    mensualidad: false,
    montoMensual: 0,
    estadoPago: "Anticipo OK",
    estadoColor: "yellow",
  },
];

// ── Computed totals ──
const TOTALS = {
  contratado: PROJECTS.reduce((s, p) => s + p.precioTotal, 0),
  cobrado: PROJECTS.reduce((s, p) => s + p.pagado, 0),
  pendiente: PROJECTS.reduce((s, p) => s + p.saldo, 0),
  comisiones: PROJECTS.reduce((s, p) => s + p.comision15, 0),
  costos: PROJECTS.reduce((s, p) => s + p.costoTotal, 0),
  utilidad: PROJECTS.reduce((s, p) => s + p.utilidad, 0),
};

const fmt = (n: number) =>
  "$" + n.toLocaleString("es-MX", { minimumFractionDigits: 0 });

const ALERTS = [
  {
    type: "warning" as const,
    message:
      "PAPACHOA \u2014 Sin anticipo pagado. $15,000 pendientes desde 06/02/2026",
  },
  {
    type: "warning" as const,
    message:
      "BAZAR CENTENARIO \u2014 Saldo de $12,500 pendiente contra entrega",
  },
  {
    type: "success" as const,
    message:
      "RAWPAW \u2014 Proyecto liquidado. Mensualidad activa $250/mes",
  },
];

const FinanzasPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          FINANZAS
        </h1>
        <p className="text-sm text-[#888888] mt-1">
          Dashboard financiero — Nebu Studio
        </p>
      </div>

      {/* ═══════════ SECTION 1: RESUMEN EJECUTIVO ═══════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ingresos Totales Contratados */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-[#888888]" />
            <span className="text-[10px] text-[#E53E3E] font-bold uppercase tracking-widest">
              Ingresos Contratados
            </span>
          </div>
          <p className="text-3xl font-bold font-mono text-white">
            {fmt(TOTALS.contratado)}
          </p>
          <p className="text-xs text-[#888888] mt-1">3 proyectos activos</p>
        </div>

        {/* Cobrado Hasta Hoy */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-[#22c55e]" />
            <span className="text-[10px] text-[#E53E3E] font-bold uppercase tracking-widest">
              Cobrado Hasta Hoy
            </span>
          </div>
          <p className="text-3xl font-bold font-mono text-[#22c55e]">
            {fmt(TOTALS.cobrado)}
          </p>
          <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium rounded bg-green-900/40 text-green-400 border border-green-700/40">
            Al corriente
          </span>
        </div>

        {/* Por Cobrar */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-[#ef4444]" />
            <span className="text-[10px] text-[#E53E3E] font-bold uppercase tracking-widest">
              Por Cobrar
            </span>
          </div>
          <p className="text-3xl font-bold font-mono text-[#ef4444]">
            {fmt(TOTALS.pendiente)}
          </p>
          <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium rounded bg-red-900/40 text-red-400 border border-red-700/40">
            Pendiente
          </span>
        </div>

        {/* Utilidad Estimada Total */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-[#22c55e]" />
            <span className="text-[10px] text-[#E53E3E] font-bold uppercase tracking-widest">
              Utilidad Estimada
            </span>
          </div>
          <p className="text-3xl font-bold font-mono text-[#22c55e]">
            {fmt(TOTALS.utilidad)}
          </p>
          <p className="text-xs text-[#888888] mt-1">
            Precio total - costos operativos
          </p>
        </div>
      </div>

      {/* ═══════════ SECTION 2: TABLA FINANCIERA ═══════════ */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#2a2a2a]">
          <h2 className="text-xs text-[#E53E3E] font-bold uppercase tracking-widest">
            Desglose Financiero por Proyecto
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1f1f1f]">
                {[
                  "Proyecto",
                  "Precio Total",
                  "Pagado",
                  "Saldo",
                  "Créditos",
                  "Dominio",
                  "Hosting",
                  "Comisión 15%",
                  "Costo Total",
                  "Utilidad",
                  "Mensualidad",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[10px] font-bold text-[#E53E3E] uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROJECTS.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-t border-[#2a2a2a] hover:bg-[#222222] transition-colors ${
                    i % 2 === 0 ? "bg-[#0f0f0f]" : "bg-[#1a1a1a]"
                  }`}
                >
                  <td className="px-4 py-3 font-bold text-white whitespace-nowrap">
                    {p.nombre}
                    <span
                      className={`ml-2 inline-block px-2 py-0.5 text-[9px] font-medium rounded ${
                        p.estadoColor === "green"
                          ? "bg-green-900/40 text-green-400 border border-green-700/40"
                          : p.estadoColor === "red"
                          ? "bg-red-900/40 text-red-400 border border-red-700/40"
                          : "bg-yellow-900/40 text-yellow-400 border border-yellow-700/40"
                      }`}
                    >
                      {p.estadoPago}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-white">
                    {fmt(p.precioTotal)}
                  </td>
                  <td className="px-4 py-3 font-mono text-[#22c55e]">
                    {fmt(p.pagado)}
                  </td>
                  <td
                    className={`px-4 py-3 font-mono ${
                      p.saldo > 0 ? "text-[#ef4444]" : "text-[#888888]"
                    }`}
                  >
                    {fmt(p.saldo)}
                  </td>
                  <td className="px-4 py-3 font-mono text-[#888888]">
                    {p.creditos > 0 ? fmt(p.creditos) : "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-[#888888]">
                    {p.dominio > 0 ? fmt(p.dominio) : "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-[#888888]">
                    {p.hosting > 0 ? fmt(p.hosting) : "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-[#f97316]">
                    {fmt(p.comision15)}
                  </td>
                  <td className="px-4 py-3 font-mono text-white">
                    {fmt(p.costoTotal)}
                  </td>
                  <td className="px-4 py-3 font-mono text-[#22c55e] font-bold">
                    {fmt(p.utilidad)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {p.mensualidad && p.montoMensual > 0 ? (
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-green-900/40 text-green-400 border border-green-700/40">
                        {fmt(p.montoMensual)}/mes
                      </span>
                    ) : p.mensualidad ? (
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-gray-800 text-gray-400 border border-gray-700">
                        Por definir
                      </span>
                    ) : (
                      <span className="text-[#555555]">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {/* TOTAL ROW */}
              <tr className="border-t-2 border-[#E53E3E] bg-[#1f1f1f]">
                <td className="px-4 py-3 font-bold text-white text-xs uppercase tracking-wider">
                  TOTAL
                </td>
                <td className="px-4 py-3 font-mono font-bold text-white">
                  {fmt(TOTALS.contratado)}
                </td>
                <td className="px-4 py-3 font-mono font-bold text-[#22c55e]">
                  {fmt(TOTALS.cobrado)}
                </td>
                <td className="px-4 py-3 font-mono font-bold text-[#ef4444]">
                  {fmt(TOTALS.pendiente)}
                </td>
                <td className="px-4 py-3 font-mono text-[#888888]">—</td>
                <td className="px-4 py-3 font-mono text-[#888888]">—</td>
                <td className="px-4 py-3 font-mono text-[#888888]">—</td>
                <td className="px-4 py-3 font-mono font-bold text-[#f97316]">
                  {fmt(TOTALS.comisiones)}
                </td>
                <td className="px-4 py-3 font-mono font-bold text-white">
                  {fmt(TOTALS.costos)}
                </td>
                <td className="px-4 py-3 font-mono font-bold text-[#22c55e]">
                  {fmt(TOTALS.utilidad)}
                </td>
                <td className="px-4 py-3" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════ SECTION 3: MRR ═══════════ */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        <h2 className="text-xs text-[#E53E3E] font-bold uppercase tracking-widest mb-5">
          Ingresos Mensuales Recurrentes (MRR)
        </h2>

        <div className="space-y-3">
          {/* RAWPAW */}
          <div className="flex items-center justify-between py-2 border-b border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span className="text-sm font-medium text-white">RAWPAW</span>
            </div>
            <span className="font-mono text-sm font-bold text-[#22c55e]">
              $250/mes
            </span>
          </div>

          {/* PAPACHOA */}
          <div className="flex items-center justify-between py-2 border-b border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#555555]" />
              <span className="text-sm font-medium text-white">PAPACHOA</span>
            </div>
            <span className="font-mono text-sm text-[#888888]">
              Por definir
            </span>
          </div>

          {/* BAZAR CENTENARIO */}
          <div className="flex items-center justify-between py-2 border-b border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#555555]" />
              <span className="text-sm font-medium text-white">
                BAZAR CENTENARIO
              </span>
            </div>
            <span className="font-mono text-sm text-[#555555]">—</span>
          </div>
        </div>

        {/* MRR Totals */}
        <div className="mt-5 pt-4 border-t border-[#2a2a2a] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#888888]">MRR actual</p>
            <p className="text-2xl font-bold font-mono text-[#22c55e]">
              $250/mes
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#888888]">
              Proyectado (si todos activan)
            </p>
            <p className="text-2xl font-bold font-mono text-white">
              $250+/mes
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════ SECTION 4: ALERTAS FINANCIERAS ═══════════ */}
      <div className="space-y-3">
        <h2 className="text-xs text-[#E53E3E] font-bold uppercase tracking-widest mb-2">
          Alertas Financieras
        </h2>

        {ALERTS.map((alert, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 ${
              alert.type === "warning"
                ? "border-l-4 border-l-[#ef4444]"
                : "border-l-4 border-l-[#22c55e]"
            }`}
          >
            {alert.type === "warning" ? (
              <AlertTriangle className="w-4 h-4 text-[#ef4444] mt-0.5 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
            )}
            <p
              className={`text-sm ${
                alert.type === "warning" ? "text-[#fca5a5]" : "text-[#86efac]"
              }`}
            >
              {alert.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinanzasPage;
