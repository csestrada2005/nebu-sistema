import { useState } from "react";
import { Download, ChevronDown, CheckCircle, Clock, FileText, Image, Figma } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const projects = [
  { id: "rawpaw", name: "RAWPAW", service: { es: "Branding + E-commerce", en: "Branding + E-commerce" }, progress: 75 },
  { id: "papachoa", name: "Papachoa", service: { es: "Landing + Social Media", en: "Landing + Social Media" }, progress: 45 },
  { id: "bazar", name: "Bazar Centenario", service: { es: "Plataforma Integral", en: "Full Platform" }, progress: 60 },
];

const weeklyUpdates: Record<string, { week: number; title: Record<"es"|"en", string>; date: string }[]> = {
  rawpaw: [
    { week: 1, title: { es: "Wireframes aprobados", en: "Wireframes approved" }, date: "10/02/2026" },
    { week: 2, title: { es: "Diseño UI completado", en: "UI Design completed" }, date: "17/02/2026" },
    { week: 3, title: { es: "Desarrollo frontend en progreso", en: "Frontend development in progress" }, date: "24/02/2026" },
  ],
  papachoa: [
    { week: 1, title: { es: "Briefing completado", en: "Briefing completed" }, date: "06/02/2026" },
    { week: 2, title: { es: "Moodboard aprobado", en: "Moodboard approved" }, date: "13/02/2026" },
  ],
  bazar: [
    { week: 1, title: { es: "Arquitectura definida", en: "Architecture defined" }, date: "15/02/2026" },
    { week: 2, title: { es: "Base de datos configurada", en: "Database configured" }, date: "22/02/2026" },
  ],
};

const files: Record<string, { name: string; date: string; size: string; icon: React.ElementType }[]> = {
  rawpaw: [
    { name: "Logo_Final.ai", date: "12/02/2026", size: "4.2 MB", icon: Image },
    { name: "Brandbook.pdf", date: "15/02/2026", size: "12.8 MB", icon: FileText },
    { name: "Wireframes_v2.fig", date: "18/02/2026", size: "8.1 MB", icon: Figma },
  ],
  papachoa: [
    { name: "Moodboard_Final.pdf", date: "13/02/2026", size: "6.5 MB", icon: FileText },
  ],
  bazar: [
    { name: "Diagrama_ER.pdf", date: "16/02/2026", size: "2.1 MB", icon: FileText },
  ],
};

const invoices: Record<string, { id: string; concept: Record<"es"|"en", string>; amount: string; status: "paid" | "pending" }[]> = {
  rawpaw: [
    { id: "#001", concept: { es: "Anticipo 50%", en: "50% Advance" }, amount: "$17,500", status: "paid" },
    { id: "#002", concept: { es: "Entrega final", en: "Final delivery" }, amount: "$17,500", status: "pending" },
  ],
  papachoa: [
    { id: "#003", concept: { es: "Anticipo 50%", en: "50% Advance" }, amount: "$11,250", status: "paid" },
    { id: "#004", concept: { es: "Entrega final", en: "Final delivery" }, amount: "$11,250", status: "pending" },
  ],
  bazar: [
    { id: "#005", concept: { es: "Anticipo 50%", en: "50% Advance" }, amount: "$12,500", status: "paid" },
    { id: "#006", concept: { es: "Entrega final", en: "Final delivery" }, amount: "$12,500", status: "pending" },
  ],
};

const PortalClientePage = () => {
  const [selectedProject, setSelectedProject] = useState("rawpaw");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { lang } = useLanguage();

  const project = projects.find(p => p.id === selectedProject)!;
  const updates = weeklyUpdates[selectedProject] || [];
  const projectFiles = files[selectedProject] || [];
  const projectInvoices = invoices[selectedProject] || [];

  const tt = {
    es: {
      title: "Portal del Cliente",
      subtitle: "Vista simulada del portal que verán tus clientes",
      selectProject: "Seleccionar proyecto",
      progress: "Progreso General",
      updates: "Actualizaciones Semanales",
      week: "Semana",
      files: "Archivos Entregados",
      fileName: "Archivo", date: "Fecha", size: "Tamaño", action: "Acción",
      download: "Descargar",
      invoices: "Facturas",
      invoice: "Factura", concept: "Concepto", amount: "Monto", status: "Estado",
      paid: "Pagada", pending: "Pendiente",
    },
    en: {
      title: "Client Portal",
      subtitle: "Simulated view of the portal your clients will see",
      selectProject: "Select project",
      progress: "Overall Progress",
      updates: "Weekly Updates",
      week: "Week",
      files: "Delivered Files",
      fileName: "File", date: "Date", size: "Size", action: "Action",
      download: "Download",
      invoices: "Invoices",
      invoice: "Invoice", concept: "Concept", amount: "Amount", status: "Status",
      paid: "Paid", pending: "Pending",
    },
  }[lang];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{tt.title}</h1>
        <p className="text-sm mt-1" style={{ color: "#888" }}>{tt.subtitle}</p>
      </div>

      {/* Project Selector */}
      <div className="relative w-72">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-white"
          style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}
        >
          <span><strong>{project.name}</strong> — {project.service[lang]}</span>
          <ChevronDown size={16} style={{ color: "#888" }} />
        </button>
        {dropdownOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-lg overflow-hidden shadow-xl" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => { setSelectedProject(p.id); setDropdownOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[#2a2a2a]"
                style={{ color: p.id === selectedProject ? "#E53E3E" : "#ccc" }}
              >
                <strong>{p.name}</strong> — {p.service[lang]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="rounded-lg p-5" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">{tt.progress}</h2>
          <span className="text-sm font-bold" style={{ color: "#E53E3E" }}>{project.progress}%</span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#2a2a2a" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%`, background: "linear-gradient(90deg, #E53E3E, #ff6b6b)" }}
          />
        </div>
      </div>

      {/* Weekly Updates */}
      <div className="rounded-lg p-5" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
        <h2 className="text-sm font-semibold text-white mb-4">{tt.updates}</h2>
        <div className="space-y-3">
          {updates.map((u, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-0.5">
                <CheckCircle size={18} style={{ color: i < updates.length - 1 ? "#22c55e" : "#f59e0b" }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: "#E53E3E20", color: "#E53E3E" }}>
                    {tt.week} {u.week}
                  </span>
                  <span className="text-xs" style={{ color: "#555" }}>{u.date}</span>
                </div>
                <p className="text-sm text-white mt-1">{u.title[lang]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Files */}
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold text-white">{tt.files}</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#111", borderTop: "1px solid #2a2a2a" }}>
              {[tt.fileName, tt.date, tt.size, tt.action].map(h => (
                <th key={h} className="text-left px-5 py-2.5 text-xs font-semibold" style={{ color: "#E53E3E" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projectFiles.map((f, i) => (
              <tr key={i} style={{ borderTop: "1px solid #2a2a2a" }}>
                <td className="px-5 py-3 text-white flex items-center gap-2">
                  <f.icon size={16} style={{ color: "#888" }} />
                  {f.name}
                </td>
                <td className="px-5 py-3" style={{ color: "#888" }}>{f.date}</td>
                <td className="px-5 py-3" style={{ color: "#888" }}>{f.size}</td>
                <td className="px-5 py-3">
                  <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded font-medium transition-colors" style={{ backgroundColor: "#E53E3E20", color: "#E53E3E" }}>
                    <Download size={12} /> {tt.download}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoices */}
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold text-white">{tt.invoices}</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#111", borderTop: "1px solid #2a2a2a" }}>
              {[tt.invoice, tt.concept, tt.amount, tt.status].map(h => (
                <th key={h} className="text-left px-5 py-2.5 text-xs font-semibold" style={{ color: "#E53E3E" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projectInvoices.map((inv, i) => (
              <tr key={i} style={{ borderTop: "1px solid #2a2a2a" }}>
                <td className="px-5 py-3 text-white font-medium">{lang === "es" ? "Factura" : "Invoice"} {inv.id}</td>
                <td className="px-5 py-3 text-white">{inv.concept[lang]}</td>
                <td className="px-5 py-3 text-white font-medium">{inv.amount} MXN</td>
                <td className="px-5 py-3">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit"
                    style={inv.status === "paid"
                      ? { backgroundColor: "rgba(34,197,94,0.1)", color: "#22c55e" }
                      : { backgroundColor: "rgba(245,158,11,0.1)", color: "#f59e0b" }
                    }>
                    {inv.status === "paid" ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {inv.status === "paid" ? tt.paid : tt.pending}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortalClientePage;
