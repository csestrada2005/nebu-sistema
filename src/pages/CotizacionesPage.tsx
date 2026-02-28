import { useState } from "react";
import { servicios, projects } from "@/data/mock";

function mockCotizacion(data: { cliente: string; negocio: string; servicio: string; dolor: string; notas: string }): string {
  return `■ COTIZACIÓN — ${data.negocio.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━

— Cliente: ${data.cliente}
— Negocio: ${data.negocio}
— Servicio: ${data.servicio}

— Problema principal:
  "${data.dolor}"

— Propuesta de valor:
  — Diagnóstico completo del negocio y competencia
  — Diseño estratégico alineado a objetivos comerciales
  — Implementación técnica con stack moderno
  — Soporte post-entrega por 30 días

— Inversión estimada:
  ${servicios.find((s) => s.label === data.servicio)?.rango || "$10,000 — $20,000 MXN"}

— Tiempo de entrega: 4–6 semanas
— Incluye: 2 rondas de revisión

${data.notas ? `— Notas adicionales:\n  ${data.notas}` : ""}

— Generado por Agente NEBU · ${new Date().toLocaleDateString("es-MX")}`;
}

function mockUpdate(data: { proyecto: string; cliente: string; completado: string; proxima: string; necesito: string }): string {
  return `■ UPDATE SEMANAL — ${data.proyecto}
━━━━━━━━━━━━━━━━━━━━━━━━━━

■ Cliente: ${data.cliente}
■ Fecha: ${new Date().toLocaleDateString("es-MX")}

■ Completado esta semana:
  ${data.completado.split("\n").map((l) => `— ${l}`).join("\n  ")}

■ Plan próxima semana:
  ${data.proxima.split("\n").map((l) => `— ${l}`).join("\n  ")}

■ Necesito del cliente:
  ${data.necesito.split("\n").map((l) => `⚠ ${l}`).join("\n  ")}

— Generado por Agente NEBU · Operaciones`;
}

const CotizacionesPage = () => {
  const [cotForm, setCotForm] = useState({ cliente: "", negocio: "", servicio: servicios[0].label, dolor: "", notas: "" });
  const [cotOutput, setCotOutput] = useState("");
  const [updForm, setUpdForm] = useState({ proyecto: projects[0].id, cliente: projects[0].cliente, completado: "", proxima: "", necesito: "" });
  const [updOutput, setUpdOutput] = useState("");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-5xl tracking-tight">COTIZACIONES</h1>
        <p className="font-mono text-xs text-nebu-text-dim mt-1">
          GENERADOR CON IA · UPDATES SEMANALES
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Cotización */}
        <div className="space-y-4 animate-fade-up">
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-nebu-muted">Nueva Cotización</h2>
          <div className="space-y-3">
            <input
              placeholder="Nombre del cliente"
              value={cotForm.cliente}
              onChange={(e) => setCotForm((p) => ({ ...p, cliente: e.target.value }))}
              className="w-full bg-nebu-surface border border-nebu-border rounded px-3 py-2 text-xs font-mono placeholder:text-nebu-muted focus:border-primary focus:outline-none"
            />
            <input
              placeholder="Nombre del negocio"
              value={cotForm.negocio}
              onChange={(e) => setCotForm((p) => ({ ...p, negocio: e.target.value }))}
              className="w-full bg-nebu-surface border border-nebu-border rounded px-3 py-2 text-xs font-mono placeholder:text-nebu-muted focus:border-primary focus:outline-none"
            />
            <select
              value={cotForm.servicio}
              onChange={(e) => setCotForm((p) => ({ ...p, servicio: e.target.value }))}
              className="w-full bg-nebu-surface border border-nebu-border rounded px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
            >
              {servicios.map((s) => (
                <option key={s.label} value={s.label}>{s.label} — {s.rango}</option>
              ))}
            </select>
            <textarea
              placeholder="Dolor principal del cliente"
              value={cotForm.dolor}
              onChange={(e) => setCotForm((p) => ({ ...p, dolor: e.target.value }))}
              rows={2}
              className="w-full bg-nebu-surface border border-nebu-border rounded px-3 py-2 text-xs font-mono placeholder:text-nebu-muted focus:border-primary focus:outline-none resize-none"
            />
            <textarea
              placeholder="Notas adicionales"
              value={cotForm.notas}
              onChange={(e) => setCotForm((p) => ({ ...p, notas: e.target.value }))}
              rows={2}
              className="w-full bg-nebu-surface border border-nebu-border rounded px-3 py-2 text-xs font-mono placeholder:text-nebu-muted focus:border-primary focus:outline-none resize-none"
            />
            <button
              onClick={() => setCotOutput(mockCotizacion(cotForm))}
              disabled={!cotForm.cliente || !cotForm.negocio || !cotForm.dolor}
              className="w-full bg-primary text-primary-foreground font-mono text-xs py-2.5 rounded hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Generar Cotización con IA
            </button>
          </div>
          {cotOutput && (
            <pre className="bg-nebu-carbon border border-nebu-border rounded p-4 text-[11px] font-mono text-foreground whitespace-pre-wrap leading-relaxed animate-fade-up overflow-x-auto">
              {cotOutput}
            </pre>
          )}
        </div>

        {/* Updates */}
        <div className="space-y-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-nebu-muted">Update Semanal</h2>
          <div className="space-y-3">
            <select
              value={updForm.proyecto}
              onChange={(e) => {
                const p = projects.find((pr) => pr.id === e.target.value);
                setUpdForm((prev) => ({ ...prev, proyecto: e.target.value, cliente: p?.cliente || "" }));
              }}
              className="w-full bg-nebu-surface border border-nebu-border rounded px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.id} — {p.cliente}</option>
              ))}
            </select>
            <input
              placeholder="Cliente"
              value={updForm.cliente}
              readOnly
              className="w-full bg-nebu-carbon border border-nebu-border rounded px-3 py-2 text-xs font-mono text-nebu-text-dim"
            />
            <textarea
              placeholder="¿Qué se completó esta semana?"
              value={updForm.completado}
              onChange={(e) => setUpdForm((p) => ({ ...p, completado: e.target.value }))}
              rows={2}
              className="w-full bg-nebu-surface border border-nebu-border rounded px-3 py-2 text-xs font-mono placeholder:text-nebu-muted focus:border-primary focus:outline-none resize-none"
            />
            <textarea
              placeholder="Plan para próxima semana"
              value={updForm.proxima}
              onChange={(e) => setUpdForm((p) => ({ ...p, proxima: e.target.value }))}
              rows={2}
              className="w-full bg-nebu-surface border border-nebu-border rounded px-3 py-2 text-xs font-mono placeholder:text-nebu-muted focus:border-primary focus:outline-none resize-none"
            />
            <textarea
              placeholder="¿Qué necesitas del cliente?"
              value={updForm.necesito}
              onChange={(e) => setUpdForm((p) => ({ ...p, necesito: e.target.value }))}
              rows={2}
              className="w-full bg-nebu-surface border border-nebu-border rounded px-3 py-2 text-xs font-mono placeholder:text-nebu-muted focus:border-primary focus:outline-none resize-none"
            />
            <button
              onClick={() => setUpdOutput(mockUpdate(updForm))}
              disabled={!updForm.completado || !updForm.proxima}
              className="w-full bg-primary text-primary-foreground font-mono text-xs py-2.5 rounded hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Generar Update con IA
            </button>
          </div>
          {updOutput && (
            <pre className="bg-nebu-carbon border border-nebu-border rounded p-4 text-[11px] font-mono text-foreground whitespace-pre-wrap leading-relaxed animate-fade-up overflow-x-auto">
              {updOutput}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default CotizacionesPage;
