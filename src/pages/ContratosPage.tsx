import { FileText, Eye, CheckCircle, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const t = {
  title: { es: "CONTRATOS", en: "CONTRACTS" },
  subtitle: { es: "Acuerdos y documentos legales", en: "Agreements and legal documents" },
  total: { es: "Total", en: "Total" },
  signed: { es: "Firmados", en: "Signed" },
  pending: { es: "Pendiente", en: "Pending" },
  viewPdf: { es: "Ver PDF", en: "View PDF" },
  id: { es: "ID", en: "ID" },
  client: { es: "Cliente", en: "Client" },
  project: { es: "Proyecto", en: "Project" },
  status: { es: "Estado", en: "Status" },
  date: { es: "Fecha", en: "Date" },
  actions: { es: "Acciones", en: "Actions" },
  signedStatus: { es: "Firmado", en: "Signed" },
  pendingStatus: { es: "Pendiente firma", en: "Pending signature" },
};

const contracts = [
  { id: "CTR-001", client: "RAWPAW", project: { es: "E-commerce", en: "E-commerce" }, status: "signed", date: "15/01/2026" },
  { id: "CTR-002", client: "BAZAR CENTENARIO", project: { es: "Landing Page", en: "Landing Page" }, status: "signed", date: "20/01/2026" },
  { id: "CTR-003", client: "PAPACHOA", project: { es: "Sistema POS", en: "POS System" }, status: "pending", date: "01/03/2026" },
];

const ContratosPage = () => {
  const { lang } = useLanguage();
  const signedCount = contracts.filter((c) => c.status === "signed").length;
  const pendingCount = contracts.filter((c) => c.status === "pending").length;

  const stats = [
    { label: t.total[lang], value: contracts.length, icon: FileText, color: "var(--nebu-accent)" },
    { label: t.signed[lang], value: signedCount, icon: CheckCircle, color: "#38A169" },
    { label: t.pending[lang], value: pendingCount, icon: Clock, color: "#ECC94B" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--nebu-text)" }}>{t.title[lang]}</h1>
        <p className="text-sm mt-1" style={{ color: "var(--nebu-text-secondary)" }}>{t.subtitle[lang]}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--nebu-border)" }}>
              {[t.id, t.client, t.project, t.status, t.date, t.actions].map((h) => (
                <th key={h[lang]} className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--nebu-text-secondary)" }}>
                  {h[lang]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contracts.map((c) => (
              <tr key={c.id} className="transition-colors" style={{ borderBottom: "1px solid var(--nebu-border)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--nebu-active-bg)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <td className="px-5 py-3.5 font-mono font-semibold" style={{ color: "var(--nebu-accent)" }}>{c.id}</td>
                <td className="px-5 py-3.5 font-medium" style={{ color: "var(--nebu-text)" }}>{c.client}</td>
                <td className="px-5 py-3.5" style={{ color: "var(--nebu-text-secondary)" }}>{c.project[lang]}</td>
                <td className="px-5 py-3.5">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{
                    backgroundColor: c.status === "signed" ? "rgba(56,161,105,0.15)" : "rgba(236,201,75,0.15)",
                    color: c.status === "signed" ? "#38A169" : "#ECC94B",
                  }}>
                    {c.status === "signed" ? t.signedStatus[lang] : t.pendingStatus[lang]}
                  </span>
                </td>
                <td className="px-5 py-3.5" style={{ color: "var(--nebu-text-secondary)" }}>{c.date}</td>
                <td className="px-5 py-3.5">
                  <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
                    style={{ backgroundColor: "var(--nebu-surface)", border: "1px solid var(--nebu-border)", color: "var(--nebu-text)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--nebu-accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--nebu-border)")}
                  >
                    <Eye size={13} /> {t.viewPdf[lang]}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContratosPage;
