import { useState } from "react";
import { Plus, ExternalLink, ArrowLeft, Globe, FolderOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Proyecto {
  id: string; cliente: string; marca: string; proyecto: string; tipo: string;
  estado: Record<"es"|"en",string>; precioTotal: string; inicialPagado: Record<"es"|"en",string>;
  montoPagado: string; saldoPendiente: string; fechaInicio: string; entregaEst: string; entregaReal: string;
  responsable: string; dominio: string; mensualidad: string; montoMensual: string; creditosUsados: string;
  costoCreditos: string; costoDominio: string; costoHosting: string; comision15: string; costoTotal: string;
  utilidadEst: string; links: string; notas: Record<"es"|"en",string>; driveUrl: string; dominioUrl: string; canalVentas: string;
}

const proyectos: Proyecto[] = [
  {
    id: "P01-RA-SE-20260116", cliente: "Sebastian Bautista", marca: "RAWPAW", proyecto: "RAWPAW SMART ORDERING",
    tipo: "Sistema / SaaS, E-commerce", estado: { es: "Entregado — En revisión cliente", en: "Delivered — Under client review" },
    precioTotal: "$20,000 MXN", inicialPagado: { es: "Pagado", en: "Paid" }, montoPagado: "$10,000 MXN", saldoPendiente: "$0",
    fechaInicio: "15/01/2026", entregaEst: "10/02/2026", entregaReal: "12/02/2026", responsable: "Samuel, Josep",
    dominio: "rawpaw.mx", mensualidad: "Sí", montoMensual: "$250 MXN", creditosUsados: "$0", costoCreditos: "$0",
    costoDominio: "$299 MXN", costoHosting: "$0 (Vercel free)", comision15: "$3,000 MXN", costoTotal: "$3,299 MXN",
    utilidadEst: "$16,701 MXN", links: "Google Drive",
    notas: { es: "Proyecto entregado. Cliente en fase de revisión. Mensualidad activa por mantenimiento.", en: "Project delivered. Client in review phase. Active monthly maintenance." },
    driveUrl: "https://drive.google.com", dominioUrl: "https://rawpaw.mx", canalVentas: "LinkedIn",
  },
  {
    id: "P02-PA-EC-20260206", cliente: "Papachoa", marca: "PAPACHOA", proyecto: "E-commerce Papachoa",
    tipo: "E-commerce", estado: { es: "En proceso", en: "In progress" },
    precioTotal: "$15,000 MXN", inicialPagado: { es: "Sin pagar", en: "Unpaid" }, montoPagado: "$0", saldoPendiente: "$15,000 MXN",
    fechaInicio: "06/02/2026", entregaEst: "10/02/2026", entregaReal: "12/02/2026", responsable: "Josep, Emilio",
    dominio: "papachoa.mx", mensualidad: "Sí", montoMensual: "—", creditosUsados: "$520 MXN", costoCreditos: "—",
    costoDominio: "—", costoHosting: "—", comision15: "—", costoTotal: "—", utilidadEst: "—", links: "Google Drive",
    notas: { es: "Proyecto en desarrollo. Pendiente pago inicial del 50%.", en: "Project in development. Pending 50% initial payment." },
    driveUrl: "https://drive.google.com", dominioUrl: "https://papachoa.mx", canalVentas: "LinkedIn",
  },
  {
    id: "P03-BA-Iñ-20260204", cliente: "Iñigo", marca: "BAZAR CENTENARIO",
    proyecto: "Plataforma Digital Integral Bazar & Joyería Centenario",
    tipo: "E-commerce + Sistema/SaaS", estado: { es: "Aprobado — En proceso", en: "Approved — In progress" },
    precioTotal: "$25,000 MXN", inicialPagado: { es: "Pagado", en: "Paid" }, montoPagado: "$12,500", saldoPendiente: "$12,500",
    fechaInicio: "09/02/2026", entregaEst: "23/02/2026", entregaReal: "", responsable: "Josep",
    dominio: "—", mensualidad: "Sí", montoMensual: "$300 MXN", creditosUsados: "—", costoCreditos: "—",
    costoDominio: "—", costoHosting: "—", comision15: "—", costoTotal: "—", utilidadEst: "—", links: "—",
    notas: { es: "Proyecto aprobado, en fase inicial de desarrollo.", en: "Project approved, in initial development phase." },
    driveUrl: "", dominioUrl: "", canalVentas: "LinkedIn",
  },
];

const getEstadoBadge = (estado: string) => {
  let bg = ""; let text = "";
  if (estado.toLowerCase().includes("entregado") || estado.toLowerCase().includes("delivered")) { bg = "rgba(34,197,94,0.15)"; text = "#22c55e"; }
  else if (estado.toLowerCase().includes("en proceso") || estado.toLowerCase().includes("in progress")) { bg = "rgba(234,179,8,0.15)"; text = "#eab308"; }
  else if (estado.toLowerCase().includes("aprobado") || estado.toLowerCase().includes("approved")) { bg = "rgba(59,130,246,0.15)"; text = "#3b82f6"; }
  else if (estado.toLowerCase().includes("revisi") || estado.toLowerCase().includes("review")) { bg = "rgba(249,115,22,0.15)"; text = "#f97316"; }
  return <span className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap" style={{ backgroundColor: bg, color: text }}>{estado}</span>;
};

const parseDate = (d: string): Date | null => {
  if (!d || d === "—" || d === "") return null;
  const parts = d.split("/");
  if (parts.length !== 3) return null;
  return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
};

const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));

const ProyectoDetalle = ({ proyecto, onBack }: { proyecto: Proyecto; onBack: () => void }) => {
  const { lang } = useLanguage();
  const [notas, setNotas] = useState(proyecto.notas[lang]);

  const entregaEstDate = parseDate(proyecto.entregaEst);
  const entregaRealDate = parseDate(proyecto.entregaReal);
  let timelineStatus: "on-time" | "late" | "pending" = "pending";
  let diasRetraso = 0;
  if (entregaRealDate && entregaEstDate) { diasRetraso = daysBetween(entregaEstDate, entregaRealDate); timelineStatus = diasRetraso <= 0 ? "on-time" : "late"; }
  const saldoNum = parseFloat(proyecto.saldoPendiente.replace(/[^0-9.-]/g, ""));

  const tt = {
    es: {
      back: "← Volver a Proyectos", infoGeneral: "Información General", finanzas: "Finanzas", timeline: "Timeline",
      notasLinks: "Notas y Links", cliente: "Cliente", marca: "Marca / Empresa", tipo: "Tipo de proyecto",
      resp: "Responsable interno", dominio: "Dominio", canal: "Canal de ventas", precioTotal: "Precio Total",
      inicial: "50% Inicial", montoPagado: "Monto Pagado", saldo: "Saldo Pendiente", creditos: "Créditos Usados (MXN)",
      costoDom: "Costo Dominio", costoHost: "Costo Hosting", comision: "Comisión 15%", costoTotal: "Costo Total del Proyecto",
      utilidad: "Utilidad Estimada", fechaInicio: "Fecha Inicio", entregaEst: "Entrega Estimada", entregaReal: "Entrega Real",
      onTime: "✓ Entregado en fecha", late: "días de retraso", pending: "Entrega pendiente", mensActiva: "Mensualidad activa",
    },
    en: {
      back: "← Back to Projects", infoGeneral: "General Information", finanzas: "Finances", timeline: "Timeline",
      notasLinks: "Notes & Links", cliente: "Client", marca: "Brand / Company", tipo: "Project type",
      resp: "Internal owner", dominio: "Domain", canal: "Sales channel", precioTotal: "Total Price",
      inicial: "50% Initial", montoPagado: "Amount Paid", saldo: "Pending Balance", creditos: "Credits Used (MXN)",
      costoDom: "Domain Cost", costoHost: "Hosting Cost", comision: "Commission 15%", costoTotal: "Total Project Cost",
      utilidad: "Estimated Profit", fechaInicio: "Start Date", entregaEst: "Estimated Delivery", entregaReal: "Actual Delivery",
      onTime: "✓ Delivered on time", late: "days late", pending: "Delivery pending", mensActiva: "Active monthly plan",
    },
  }[lang];

  const sectionTitle = (t: string) => <h2 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#E53E3E" }}>{t}</h2>;
  const cardStyle: React.CSSProperties = { backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "0.75rem", padding: "1.5rem" };

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm mb-6 transition-colors" style={{ color: "#888" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")} onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}>
        <ArrowLeft size={16} />{tt.back}
      </button>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">{proyecto.proyecto}</h1>
          {getEstadoBadge(proyecto.estado[lang])}
        </div>
        <p className="text-sm" style={{ color: "#888" }}>{proyecto.id}</p>
      </div>
      <div className="space-y-6">
        <div style={cardStyle}>
          {sectionTitle(tt.infoGeneral)}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ label: tt.cliente, value: proyecto.cliente }, { label: tt.marca, value: proyecto.marca }, { label: tt.tipo, value: proyecto.tipo },
              { label: tt.resp, value: proyecto.responsable }, { label: tt.dominio, value: proyecto.dominio }, { label: tt.canal, value: proyecto.canalVentas },
            ].map((item) => (<div key={item.label}><p className="text-xs mb-1" style={{ color: "#888" }}>{item.label}</p><p className="text-sm text-white">{item.value}</p></div>))}
          </div>
        </div>
        <div style={cardStyle}>
          {sectionTitle(tt.finanzas)}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><p className="text-xs mb-1" style={{ color: "#888" }}>{tt.precioTotal}</p><p className="text-lg font-mono font-bold" style={{ color: saldoNum === 0 || isNaN(saldoNum) ? "#22c55e" : "#eab308" }}>{proyecto.precioTotal}</p></div>
            <div><p className="text-xs mb-1" style={{ color: "#888" }}>{tt.inicial}</p>
              <span className="inline-block px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: proyecto.inicialPagado[lang].toLowerCase().includes("pag") || proyecto.inicialPagado[lang].toLowerCase().includes("paid") ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: proyecto.inicialPagado[lang].toLowerCase().includes("pag") || proyecto.inicialPagado[lang].toLowerCase().includes("paid") ? "#22c55e" : "#ef4444" }}>{proyecto.inicialPagado[lang]}</span></div>
            <div><p className="text-xs mb-1" style={{ color: "#888" }}>{tt.montoPagado}</p><p className="text-lg font-mono text-white">{proyecto.montoPagado}</p></div>
            <div><p className="text-xs mb-1" style={{ color: "#888" }}>{tt.saldo}</p><p className="text-lg font-mono font-bold" style={{ color: saldoNum > 0 ? "#ef4444" : "#d1d5db" }}>{proyecto.saldoPendiente}</p></div>
            <div><p className="text-xs mb-1" style={{ color: "#888" }}>{tt.creditos}</p><p className="text-sm font-mono text-white">{proyecto.creditosUsados}</p></div>
            <div><p className="text-xs mb-1" style={{ color: "#888" }}>{tt.costoDom}</p><p className="text-sm font-mono text-white">{proyecto.costoDominio}</p></div>
            <div><p className="text-xs mb-1" style={{ color: "#888" }}>{tt.costoHost}</p><p className="text-sm font-mono text-white">{proyecto.costoHosting}</p></div>
            <div><p className="text-xs mb-1" style={{ color: "#888" }}>{tt.comision}</p><p className="text-sm font-mono text-white">{proyecto.comision15}</p></div>
            <div><p className="text-xs mb-1" style={{ color: "#888" }}>{tt.costoTotal}</p><p className="text-sm font-mono text-white">{proyecto.costoTotal}</p></div>
            <div className="md:col-span-3 pt-2 border-t border-[#2a2a2a]"><p className="text-xs mb-1" style={{ color: "#888" }}>{tt.utilidad}</p><p className="text-2xl font-mono font-bold" style={{ color: "#22c55e" }}>{proyecto.utilidadEst}</p></div>
          </div>
        </div>
        <div style={cardStyle}>
          {sectionTitle(tt.timeline)}
          <div className="flex items-center justify-between mb-6 relative">
            <div className="absolute top-4 left-0 right-0 h-0.5" style={{ backgroundColor: "#2a2a2a" }} />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2" style={{ backgroundColor: "rgba(59,130,246,0.2)", color: "#3b82f6" }}>1</div>
              <p className="text-xs font-medium text-white">{tt.fechaInicio}</p><p className="text-xs" style={{ color: "#888" }}>{proyecto.fechaInicio}</p>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2" style={{ backgroundColor: "rgba(234,179,8,0.2)", color: "#eab308" }}>2</div>
              <p className="text-xs font-medium text-white">{tt.entregaEst}</p><p className="text-xs" style={{ color: "#888" }}>{proyecto.entregaEst}</p>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2" style={{ backgroundColor: proyecto.entregaReal ? "rgba(34,197,94,0.2)" : "rgba(136,136,136,0.2)", color: proyecto.entregaReal ? "#22c55e" : "#888" }}>3</div>
              <p className="text-xs font-medium text-white">{tt.entregaReal}</p><p className="text-xs" style={{ color: proyecto.entregaReal ? "#888" : "#555" }}>{proyecto.entregaReal || tt.pending}</p>
            </div>
          </div>
          {timelineStatus === "on-time" && <p className="text-sm font-medium" style={{ color: "#22c55e" }}>{tt.onTime}</p>}
          {timelineStatus === "late" && <p className="text-sm font-medium" style={{ color: "#ef4444" }}>⚠ {diasRetraso} {tt.late}</p>}
          {timelineStatus === "pending" && <p className="text-sm" style={{ color: "#888" }}>{tt.pending}</p>}
        </div>
        <div style={cardStyle}>
          {sectionTitle(tt.notasLinks)}
          <textarea className="w-full rounded-lg p-3 text-sm mb-4 resize-y min-h-[100px]" style={{ backgroundColor: "#111111", border: "1px solid #2a2a2a", color: "#d1d5db" }} value={notas} onChange={(e) => setNotas(e.target.value)} />
          <div className="flex flex-wrap gap-3 mb-4">
            {proyecto.driveUrl && <a href={proyecto.driveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)" }}><FolderOpen size={16} /> Google Drive</a>}
            {proyecto.dominioUrl && <a href={proyecto.dominioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}><Globe size={16} /> {tt.dominio}</a>}
          </div>
          {proyecto.mensualidad === "Sí" && proyecto.montoMensual !== "—" && (
            <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
              {tt.mensActiva}: {proyecto.montoMensual}/{lang === "es" ? "mes" : "mo"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProyectosPage = () => {
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);
  const { lang } = useLanguage();

  if (selectedProyecto) return <ProyectoDetalle proyecto={selectedProyecto} onBack={() => setSelectedProyecto(null)} />;

  const headers: { key: keyof Proyecto; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "cliente", label: lang === "es" ? "Cliente" : "Client" },
    { key: "marca", label: lang === "es" ? "Marca" : "Brand" },
    { key: "proyecto", label: lang === "es" ? "Proyecto" : "Project" },
    { key: "tipo", label: lang === "es" ? "Tipo" : "Type" },
    { key: "estado", label: lang === "es" ? "Estado" : "Status" },
    { key: "precioTotal", label: lang === "es" ? "Precio Total" : "Total Price" },
    { key: "inicialPagado", label: lang === "es" ? "50% Inicial" : "50% Deposit" },
    { key: "montoPagado", label: lang === "es" ? "Monto Pagado" : "Amount Paid" },
    { key: "saldoPendiente", label: lang === "es" ? "Saldo Pendiente" : "Pending Balance" },
    { key: "fechaInicio", label: lang === "es" ? "Fecha Inicio" : "Start Date" },
    { key: "entregaEst", label: lang === "es" ? "Entrega Est." : "Est. Delivery" },
    { key: "entregaReal", label: lang === "es" ? "Entrega Real" : "Actual Delivery" },
    { key: "responsable", label: lang === "es" ? "Responsable" : "Owner" },
    { key: "dominio", label: lang === "es" ? "Dominio" : "Domain" },
    { key: "mensualidad", label: lang === "es" ? "Mensualidad" : "Monthly" },
    { key: "montoMensual", label: lang === "es" ? "Monto Mensual" : "Monthly Amount" },
    { key: "creditosUsados", label: lang === "es" ? "Créditos Usados" : "Credits Used" },
    { key: "costoCreditos", label: lang === "es" ? "Costo Créditos" : "Credits Cost" },
    { key: "costoDominio", label: lang === "es" ? "Costo Dominio" : "Domain Cost" },
    { key: "costoHosting", label: lang === "es" ? "Costo Hosting" : "Hosting Cost" },
    { key: "comision15", label: lang === "es" ? "Comisión 15%" : "Commission 15%" },
    { key: "costoTotal", label: lang === "es" ? "Costo Total" : "Total Cost" },
    { key: "utilidadEst", label: lang === "es" ? "Utilidad Est." : "Est. Profit" },
    { key: "links", label: "Links" },
  ];

  const getCellValue = (p: Proyecto, key: keyof Proyecto): string => {
    const val = p[key];
    if (typeof val === "object" && val !== null && "es" in val) return (val as Record<"es"|"en",string>)[lang];
    return val as string;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--nebu-text)" }}>{lang === "es" ? "Proyectos" : "Projects"}</h1>
          <p className="text-sm mt-1" style={{ color: "var(--nebu-text-secondary)" }}>{proyectos.length} {lang === "es" ? "proyectos registrados" : "registered projects"}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: "#E53E3E", color: "#fff" }}>
          <Plus size={16} /> {lang === "es" ? "Agregar" : "Add"}
        </button>
      </div>
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#111111", border: "1px solid var(--nebu-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ minWidth: "2200px" }}>
            <thead>
              <tr style={{ backgroundColor: "#1f1f1f" }}>
                {headers.map((h) => (<th key={h.key} className="text-left px-3 py-3 font-semibold whitespace-nowrap sticky top-0" style={{ color: "#E53E3E", backgroundColor: "#1f1f1f" }}>{h.label}</th>))}
              </tr>
            </thead>
            <tbody>
              {proyectos.map((p, idx) => (
                <tr key={p.id} className="cursor-pointer transition-colors" style={{ backgroundColor: idx % 2 === 0 ? "#0f0f0f" : "#1a1a1a" }}
                  onClick={() => setSelectedProyecto(p)}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#222222"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "#0f0f0f" : "#1a1a1a"; }}>
                  {headers.map((h) => {
                    const cellVal = getCellValue(p, h.key);
                    return (
                      <td key={h.key} className="px-3 py-3 whitespace-nowrap" style={{
                        color: h.key === "saldoPendiente" && p.saldoPendiente !== "$0" ? "#f97316"
                          : h.key === "inicialPagado" && cellVal.toLowerCase().includes("pag") ? "#22c55e"
                          : h.key === "inicialPagado" && (cellVal.toLowerCase().includes("sin") || cellVal.toLowerCase().includes("un")) ? "#f97316"
                          : "#d1d5db",
                        borderBottom: "1px solid var(--nebu-border)",
                      }}>
                        {h.key === "estado" ? getEstadoBadge(cellVal)
                          : h.key === "links" && p.links !== "—" ? <span className="flex items-center gap-1 text-blue-400"><ExternalLink size={12} /> {p.links}</span>
                          : cellVal}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProyectosPage;
