import { useState } from "react";
import { Globe, TrendingUp, Target, Zap, AlertTriangle, X, FileDown, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const t = {
  es: {
    title: "Análisis de Webs",
    websActivas: "Webs Activas", avgSeo: "Avg. SEO Score", avgCro: "Avg. CRO Score", avgPerf: "Avg. Performance",
    totalIssues: "Total Issues", lastUpdate: "Última actualización: hace 3 días",
    pendientes: "⚠️ Pendientes / Mejoras", metricas: "📊 Métricas clave",
    visitasSem: "Visitas/sem", bounceRate: "Bounce Rate", avgSession: "Avg. Session", convRate: "Conv. Rate",
    verInforme: "Ver Informe Completo", generarReporte: "Generar Reporte Cliente",
    toastMsg: "Función disponible próximamente", verMas: "+ ver más",
    detailProblems: "Problemas Detectados", problem: "Problema", priority: "Prioridad", category: "Categoría", status: "Estado",
    high: "Alta", medium: "Media", low: "Baja", pending: "Pendiente", resolved: "Resuelto",
    generatePdf: "Generar reporte PDF", close: "Cerrar",
  },
  en: {
    title: "Web Analysis",
    websActivas: "Active Webs", avgSeo: "Avg. SEO Score", avgCro: "Avg. CRO Score", avgPerf: "Avg. Performance",
    totalIssues: "Total Issues", lastUpdate: "Last updated: 3 days ago",
    pendientes: "⚠️ Pending / Improvements", metricas: "📊 Key Metrics",
    visitasSem: "Visits/wk", bounceRate: "Bounce Rate", avgSession: "Avg. Session", convRate: "Conv. Rate",
    verInforme: "View Full Report", generarReporte: "Generate Client Report",
    toastMsg: "Feature coming soon", verMas: "+ see more",
    detailProblems: "Detected Problems", problem: "Problem", priority: "Priority", category: "Category", status: "Status",
    high: "High", medium: "Medium", low: "Low", pending: "Pending", resolved: "Resolved",
    generatePdf: "Generate PDF report", close: "Close",
  },
};

interface DetailIssue {
  text: Record<"es"|"en", string>;
  priority: "high" | "medium" | "low";
  category: "SEO" | "CRO" | "Performance";
  status: "pending" | "resolved";
}

const detailIssues: Record<string, DetailIssue[]> = {
  "rawpaw.mx": [
    { text: { es: "Imágenes sin comprimir", en: "Uncompressed images" }, priority: "high", category: "Performance", status: "pending" },
    { text: { es: "Meta descriptions vacías", en: "Empty meta descriptions" }, priority: "high", category: "SEO", status: "pending" },
    { text: { es: "Sin botón CTA visible en hero", en: "No visible CTA button in hero" }, priority: "medium", category: "CRO", status: "pending" },
    { text: { es: "Certificado SSL próximo a vencer", en: "SSL certificate expiring soon" }, priority: "high", category: "Performance", status: "resolved" },
    { text: { es: "Falta sitemap.xml", en: "Missing sitemap.xml" }, priority: "medium", category: "SEO", status: "resolved" },
  ],
  "papachoa.com": [
    { text: { es: "Sin sitemap XML", en: "No XML sitemap" }, priority: "high", category: "SEO", status: "pending" },
    { text: { es: "LCP > 4.2s en mobile", en: "LCP > 4.2s on mobile" }, priority: "high", category: "Performance", status: "pending" },
    { text: { es: "Checkout con 6 pasos — fricción alta", en: "6-step checkout — high friction" }, priority: "high", category: "CRO", status: "pending" },
    { text: { es: "Sin pixel de Meta configurado", en: "No Meta pixel configured" }, priority: "medium", category: "CRO", status: "pending" },
  ],
  "bazarcentenario.com": [
    { text: { es: "Schema markup ausente en productos", en: "Schema markup missing on products" }, priority: "low", category: "SEO", status: "pending" },
    { text: { es: "Botón WhatsApp no visible en desktop", en: "WhatsApp button not visible on desktop" }, priority: "low", category: "CRO", status: "resolved" },
  ],
  "trovador.io": [
    { text: { es: "Sin blog ni contenido indexable", en: "No blog or indexable content" }, priority: "medium", category: "SEO", status: "pending" },
    { text: { es: "Hero sin propuesta de valor clara", en: "Hero without clear value proposition" }, priority: "medium", category: "CRO", status: "pending" },
    { text: { es: "Google Search Console no vinculado", en: "Google Search Console not linked" }, priority: "medium", category: "SEO", status: "pending" },
  ],
};

interface ProjectData {
  name: string; url: string; seo: number; cro: number; performance: number;
  issues: { text: Record<"es"|"en", string>; category: string; severity: "crítico" | "medio" | "bajo" }[];
  metrics: { visitas: string; bounce: string; session: string; conv: string };
  worstBadge: Record<"es"|"en", string>;
}

const projects: ProjectData[] = [
  { name: "RawPaw", url: "rawpaw.mx", seo: 78, cro: 55, performance: 71,
    issues: [
      { text: { es: "Meta descriptions faltantes en 6 páginas", en: "Meta descriptions missing on 6 pages" }, category: "SEO", severity: "medio" },
      { text: { es: "CTA principal no visible en mobile", en: "Main CTA not visible on mobile" }, category: "CRO", severity: "medio" },
      { text: { es: "Imágenes sin alt text", en: "Images without alt text" }, category: "SEO", severity: "bajo" },
      { text: { es: "Formulario de contacto sin confirmación", en: "Contact form without confirmation" }, category: "UX", severity: "bajo" },
    ],
    metrics: { visitas: "840", bounce: "72%", session: "1m 20s", conv: "1.8%" },
    worstBadge: { es: "CRO medio", en: "CRO medium" },
  },
  { name: "Papachoa", url: "papachoa.com", seo: 44, cro: 38, performance: 52,
    issues: [
      { text: { es: "Sin sitemap XML", en: "No XML sitemap" }, category: "SEO", severity: "crítico" },
      { text: { es: "Checkout con 6 pasos — fricción alta", en: "6-step checkout — high friction" }, category: "CRO", severity: "crítico" },
      { text: { es: "LCP > 4.2s en mobile", en: "LCP > 4.2s on mobile" }, category: "Velocidad", severity: "crítico" },
      { text: { es: "Sin pixel de Meta configurado", en: "No Meta pixel configured" }, category: "CRO", severity: "medio" },
    ],
    metrics: { visitas: "310", bounce: "81%", session: "0m 58s", conv: "0.6%" },
    worstBadge: { es: "SEO crítico", en: "SEO critical" },
  },
  { name: "Bazar Centenario", url: "bazarcentenario.com", seo: 81, cro: 74, performance: 79,
    issues: [
      { text: { es: "Schema markup ausente en productos", en: "Schema markup missing on products" }, category: "SEO", severity: "bajo" },
      { text: { es: "Botón WhatsApp no visible en desktop", en: "WhatsApp button not visible on desktop" }, category: "CRO", severity: "bajo" },
    ],
    metrics: { visitas: "1,240", bounce: "58%", session: "2m 15s", conv: "3.4%" },
    worstBadge: { es: "SEO bajo", en: "SEO low" },
  },
  { name: "Trovador", url: "trovador.io", seo: 62, cro: 55, performance: 65,
    issues: [
      { text: { es: "Sin blog ni contenido indexable", en: "No blog or indexable content" }, category: "SEO", severity: "medio" },
      { text: { es: "Hero sin propuesta de valor clara", en: "Hero without clear value proposition" }, category: "CRO", severity: "medio" },
      { text: { es: "Google Search Console no vinculado", en: "Google Search Console not linked" }, category: "SEO", severity: "medio" },
    ],
    metrics: { visitas: "190", bounce: "74%", session: "1m 05s", conv: "1.1%" },
    worstBadge: { es: "SEO medio", en: "SEO medium" },
  },
];

const scoreColor = (score: number) => score >= 80 ? "#22C55E" : score >= 60 ? "#EAB308" : "#E63946";
const severityDot = (s: "crítico" | "medio" | "bajo") => s === "crítico" ? "#E63946" : s === "medio" ? "#EAB308" : "#888888";
const badgeColor = (badge: string) => {
  if (badge.includes("crítico") || badge.includes("critical")) return { bg: "rgba(230,57,70,0.15)", text: "#E63946" };
  if (badge.includes("medio") || badge.includes("medium")) return { bg: "rgba(234,179,8,0.15)", text: "#EAB308" };
  return { bg: "rgba(136,136,136,0.15)", text: "#888888" };
};

type Lang = "es" | "en";

const priorityStyle = { high: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" }, medium: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" }, low: { bg: "rgba(34,197,94,0.1)", color: "#22c55e" } };
const statusStyle = { pending: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" }, resolved: { bg: "rgba(34,197,94,0.1)", color: "#22c55e" } };

const ProjectCard = ({ project, lang, onSelect }: { project: ProjectData; lang: Lang; onSelect: () => void }) => {
  const { toast } = useToast();
  const [showAll, setShowAll] = useState(false);
  const visibleIssues = showAll ? project.issues : project.issues.slice(0, 4);
  const bc = badgeColor(project.worstBadge[lang]);
  const s = t[lang];
  const handleAction = () => { toast({ title: s.toastMsg, duration: 3000 }); };

  return (
    <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 12, padding: 24, cursor: "pointer" }} onClick={onSelect} className="transition-all duration-200 hover:border-[#E63946]/50">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-5">
        <div>
          <h3 style={{ color: "#FFFFFF", fontSize: 16, fontWeight: 700, margin: 0 }}>{project.name}</h3>
          <span style={{ color: "#888888", fontSize: 12, fontFamily: "monospace" }}>{project.url}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span style={{ color: "#888888", fontSize: 11 }}>{s.lastUpdate}</span>
          <span style={{ backgroundColor: bc.bg, color: bc.text, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999 }}>{project.worstBadge[lang]}</span>
        </div>
      </div>
      <div className="flex gap-3 mb-4">
        {(["SEO", "CRO", "Performance"] as const).map((cat) => {
          const val = cat === "SEO" ? project.seo : cat === "CRO" ? project.cro : project.performance;
          return (
            <div key={cat} style={{ flex: 1, backgroundColor: "#111111", border: "1px solid #333333", borderRadius: 8, padding: "10px 16px" }}>
              <div style={{ color: "#888888", fontSize: 11, marginBottom: 4 }}>{cat}</div>
              <div style={{ color: scoreColor(val), fontSize: 22, fontWeight: 700 }}>{val}</div>
            </div>
          );
        })}
      </div>
      <div className="mb-4">
        <div style={{ color: "#888888", fontSize: 12, textTransform: "uppercase", marginBottom: 8, letterSpacing: 0.5 }}>{s.pendientes}</div>
        <div className="space-y-2">
          {visibleIssues.map((issue, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: severityDot(issue.severity), flexShrink: 0 }} />
                <span style={{ color: "#FFFFFF", fontSize: 13 }} className="truncate">{issue.text[lang]}</span>
              </div>
              <span style={{ fontSize: 10, color: "#888888", backgroundColor: "#111111", border: "1px solid #2A2A2A", padding: "1px 6px", borderRadius: 999, flexShrink: 0 }}>{issue.category}</span>
            </div>
          ))}
        </div>
        {project.issues.length > 4 && !showAll && (
          <button onClick={(e) => { e.stopPropagation(); setShowAll(true); }} style={{ color: "#E63946", fontSize: 12, marginTop: 6, background: "none", border: "none", cursor: "pointer" }}>{s.verMas}</button>
        )}
      </div>
      <div className="mb-4">
        <div style={{ color: "#888888", fontSize: 12, textTransform: "uppercase", marginBottom: 8, letterSpacing: 0.5 }}>{s.metricas}</div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: s.visitasSem, value: project.metrics.visitas },
            { label: s.bounceRate, value: project.metrics.bounce },
            { label: s.avgSession, value: project.metrics.session },
            { label: s.convRate, value: project.metrics.conv },
          ].map((m) => (
            <div key={m.label} style={{ backgroundColor: "#111111", border: "1px solid #222222", borderRadius: 999, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#888888", fontSize: 10 }}>{m.label}</span>
              <span style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 700 }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); handleAction(); }} className="flex-1 transition-colors" style={{ height: 36, fontSize: 13, borderRadius: 8, border: "1px solid #E63946", color: "#E63946", backgroundColor: "transparent", cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(230,57,70,0.1)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>{s.verInforme}</button>
        <button onClick={(e) => { e.stopPropagation(); handleAction(); }} className="flex-1 transition-colors" style={{ height: 36, fontSize: 13, borderRadius: 8, border: "none", color: "#FFFFFF", backgroundColor: "#E63946", cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C5303B")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E63946")}>{s.generarReporte}</button>
      </div>
    </div>
  );
};

const DetailPanel = ({ project, lang, onClose }: { project: ProjectData; lang: Lang; onClose: () => void }) => {
  const { toast } = useToast();
  const s = t[lang];
  const issues = detailIssues[project.url] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={onClose}>
      <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl" style={{ backgroundColor: "#111", border: "1px solid #2a2a2a" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid #2a2a2a" }}>
          <div>
            <h2 className="text-xl font-bold text-white">{project.name}</h2>
            <span className="text-xs font-mono" style={{ color: "#888" }}>{project.url}</span>
          </div>
          <button onClick={onClose} className="text-[#888] hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Big Scores */}
          <div className="grid grid-cols-3 gap-4">
            {(["SEO", "CRO", "Performance"] as const).map((cat) => {
              const val = cat === "SEO" ? project.seo : cat === "CRO" ? project.cro : project.performance;
              return (
                <div key={cat} className="text-center rounded-xl p-5" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
                  <div className="text-xs font-semibold mb-2" style={{ color: "#888" }}>{cat}</div>
                  <div className="text-4xl font-bold" style={{ color: scoreColor(val) }}>{val}</div>
                  <div className="text-[10px] mt-1 font-medium" style={{ color: scoreColor(val) }}>
                    {val >= 80 ? "✓ Good" : val >= 60 ? "⚠ Needs work" : "✗ Critical"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Problems Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#E53E3E" }}>{s.detailProblems}</h3>
            <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #2a2a2a" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#0d0d0d" }}>
                    {[s.problem, s.priority, s.category, s.status].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#E53E3E" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue, i) => (
                    <tr key={i} style={{ borderTop: "1px solid #1a1a1a" }}>
                      <td className="px-4 py-3 text-white text-xs">{issue.text[lang]}</td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={priorityStyle[issue.priority]}>
                          {s[issue.priority]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] px-2 py-0.5 rounded" style={{ backgroundColor: "#1a1a1a", color: "#ccc", border: "1px solid #2a2a2a" }}>{issue.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit" style={statusStyle[issue.status]}>
                          {issue.status === "resolved" ? <CheckCircle size={12} /> : <Clock size={12} />}
                          {issue.status === "pending" ? s.pending : s.resolved}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Generate PDF button */}
          <button
            onClick={() => toast({ title: s.toastMsg, duration: 3000 })}
            className="w-full flex items-center justify-center gap-2 transition-colors"
            style={{ height: 44, fontSize: 14, borderRadius: 10, border: "none", color: "#FFFFFF", backgroundColor: "#E63946", cursor: "pointer", fontWeight: 600 }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C5303B")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E63946")}
          >
            <FileDown size={16} />
            {s.generatePdf}
          </button>
        </div>
      </div>
    </div>
  );
};

const MisWebsPage = () => {
  const { lang } = useLanguage();
  const s = t[lang];
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const overviewStats = [
    { icon: Globe, label: s.websActivas, value: "4" },
    { icon: TrendingUp, label: s.avgSeo, value: "72 / 100" },
    { icon: Target, label: s.avgCro, value: "61 / 100" },
    { icon: Zap, label: s.avgPerf, value: "68 / 100" },
    { icon: AlertTriangle, label: s.totalIssues, value: "14", isAccent: true },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 700, margin: 0 }}>{s.title}</h1>
      </div>
      <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div className="flex flex-wrap gap-6">
          {overviewStats.map((st) => (
            <div key={st.label} className="flex items-center gap-3">
              <st.icon size={18} style={{ color: st.isAccent ? "#E63946" : "#888888" }} />
              <div>
                <div style={{ color: "#888888", fontSize: 11 }}>{st.label}</div>
                <div style={{ color: st.isAccent ? "#E63946" : "#FFFFFF", fontSize: 20, fontWeight: 700 }}>{st.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((p) => <ProjectCard key={p.name} project={p} lang={lang} onSelect={() => setSelectedProject(p)} />)}
      </div>
      {selectedProject && <DetailPanel project={selectedProject} lang={lang} onClose={() => setSelectedProject(null)} />}
    </div>
  );
};

export default MisWebsPage;
