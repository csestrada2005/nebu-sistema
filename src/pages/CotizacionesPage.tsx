import { FileText, CheckCircle, Clock, XCircle, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const t = {
  title: { es: "COTIZACIONES", en: "QUOTES" },
  subtitle: { es: "Propuestas y presupuestos", en: "Proposals and budgets" },
  total: { es: "Total", en: "Total" },
  accepted: { es: "Aceptadas", en: "Accepted" },
  pending: { es: "Pendientes", en: "Pending" },
  lost: { es: "Perdidas", en: "Lost" },
  newQuote: { es: "+ Nueva Cotización", en: "+ New Quote" },
  id: { es: "ID", en: "ID" },
  client: { es: "Cliente", en: "Client" },
  project: { es: "Proyecto", en: "Project" },
  amount: { es: "Monto", en: "Amount" },
  date: { es: "Fecha", en: "Date" },
  status: { es: "Estado", en: "Status" },
  validUntil: { es: "Válida hasta", en: "Valid until" },
};

const statusLabels: Record<string, Record<"es" | "en", string>> = {
  accepted: { es: "Aceptada", en: "Accepted" },
  sent: { es: "Enviada", en: "Sent" },
  draft: { es: "Borrador", en: "Draft" },
  lost: { es: "Perdida", en: "Lost" },
};

const statusStyles: Record<string, { bg: string; color: string }> = {
  accepted: { bg: "rgba(56,161,105,0.15)", color: "#38A169" },
  sent: { bg: "rgba(66,153,225,0.15)", color: "#4299E1" },
  draft: { bg: "rgba(160,174,192,0.15)", color: "#A0AEC0" },
  lost: { bg: "rgba(229,62,62,0.15)", color: "#E53E3E" },
};

const quotes = [
  { id: "COT-001", client: "RAWPAW", project: { es: "E-commerce Premium", en: "Premium E-commerce" }, amount: "$45,000", date: "10/01/2026", status: "accepted", validUntil: "10/02/2026" },
  { id: "COT-002", client: "BAZAR CENTENARIO", project: { es: "Landing Page", en: "Landing Page" }, amount: "$18,000", date: "15/01/2026", status: "accepted", validUntil: "15/02/2026" },
  { id: "COT-003", client: "PAPACHOA", project: { es: "Sistema POS", en: "POS System" }, amount: "$60,000", date: "01/02/2026", status: "accepted", validUntil: "01/03/2026" },
  { id: "COT-004", client: "Clínica Sonrisa", project: { es: "Sitio Web + SEO", en: "Website + SEO" }, amount: "$25,000", date: "20/02/2026", status: "sent", validUntil: "20/03/2026" },
  { id: "COT-005", client: "La Hacienda", project: { es: "App de Reservas", en: "Booking App" }, amount: "$35,000", date: "25/02/2026", status: "sent", validUntil: "25/03/2026" },
  { id: "COT-006", client: "Constructora SB", project: { es: "Portal Corporativo", en: "Corporate Portal" }, amount: "$40,000", date: "01/03/2026", status: "draft", validUntil: "01/04/2026" },
  { id: "COT-007", client: "Gym Fitness Pro", project: { es: "App Membresías", en: "Membership App" }, amount: "$30,000", date: "10/12/2025", status: "lost", validUntil: "10/01/2026" },
  { id: "COT-008", client: "Café Urbano", project: { es: "Tienda en Línea", en: "Online Store" }, amount: "$22,000", date: "05/12/2025", status: "lost", validUntil: "05/01/2026" },
];

const CotizacionesPage = () => {
  const { lang } = useLanguage();
  const accepted = quotes.filter((q) => q.status === "accepted").length;
  const pending = quotes.filter((q) => q.status === "sent" || q.status === "draft").length;
  const lost = quotes.filter((q) => q.status === "lost").length;

  const stats = [
    { label: t.total[lang], value: quotes.length, icon: FileText, color: "var(--nebu-accent)" },
    { label: t.accepted[lang], value: accepted, icon: CheckCircle, color: "#38A169" },
    { label: t.pending[lang], value: pending, icon: Clock, color: "#4299E1" },
    { label: t.lost[lang], value: lost, icon: XCircle, color: "#E53E3E" },
  ];

  const headers = [t.id, t.client, t.project, t.amount, t.date, t.status, t.validUntil];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--nebu-text)" }}>{t.title[lang]}</h1>
          <p className="text-sm mt-1" style={{ color: "var(--nebu-text-secondary)" }}>{t.subtitle[lang]}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors" style={{ backgroundColor: "var(--nebu-accent)", color: "#FFFFFF" }}>
          <Plus size={16} /> {t.newQuote[lang]}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg p-5 flex items-center gap-4" style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}>
            <div className="p-2.5 rounded-md" style={{ backgroundColor: "var(--nebu-surface)" }}>
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--nebu-text)" }}>{s.value}</p>
              <p className="text-xs" style={{ color: "var(--nebu-text-secondary)" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg overflow-x-auto" style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}>
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--nebu-border)" }}>
              {headers.map((h) => (
                <th key={h[lang]} className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--nebu-text-secondary)" }}>
                  {h[lang]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.id} className="transition-colors" style={{ borderBottom: "1px solid var(--nebu-border)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--nebu-active-bg)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <td className="px-5 py-3.5 font-mono font-semibold" style={{ color: "var(--nebu-accent)" }}>{q.id}</td>
                <td className="px-5 py-3.5 font-medium" style={{ color: "var(--nebu-text)" }}>{q.client}</td>
                <td className="px-5 py-3.5" style={{ color: "var(--nebu-text-secondary)" }}>{q.project[lang]}</td>
                <td className="px-5 py-3.5 font-semibold" style={{ color: "var(--nebu-text)" }}>{q.amount}</td>
                <td className="px-5 py-3.5" style={{ color: "var(--nebu-text-secondary)" }}>{q.date}</td>
                <td className="px-5 py-3.5">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: statusStyles[q.status].bg, color: statusStyles[q.status].color }}>
                    {statusLabels[q.status][lang]}
                  </span>
                </td>
                <td className="px-5 py-3.5" style={{ color: "var(--nebu-text-secondary)" }}>{q.validUntil}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CotizacionesPage;
