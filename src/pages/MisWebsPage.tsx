import { useState } from "react";
import { Globe, TrendingUp, Target, Zap, AlertTriangle, BarChart2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const overviewStats = [
  { icon: Globe, label: "Webs Activas", value: "4" },
  { icon: TrendingUp, label: "Avg. SEO Score", value: "72 / 100" },
  { icon: Target, label: "Avg. CRO Score", value: "61 / 100" },
  { icon: Zap, label: "Avg. Performance", value: "68 / 100" },
  { icon: AlertTriangle, label: "Total Issues", value: "14", isAccent: true },
];

interface ProjectData {
  name: string;
  url: string;
  seo: number;
  cro: number;
  performance: number;
  issues: { text: string; category: string; severity: "crítico" | "medio" | "bajo" }[];
  metrics: { visitas: string; bounce: string; session: string; conv: string };
  worstBadge: string;
}

const projects: ProjectData[] = [
  {
    name: "RawPaw",
    url: "rawpaw.mx",
    seo: 78, cro: 55, performance: 71,
    issues: [
      { text: "Meta descriptions faltantes en 6 páginas", category: "SEO", severity: "medio" },
      { text: "CTA principal no visible en mobile", category: "CRO", severity: "medio" },
      { text: "Imágenes sin alt text", category: "SEO", severity: "bajo" },
      { text: "Formulario de contacto sin confirmación", category: "UX", severity: "bajo" },
    ],
    metrics: { visitas: "840", bounce: "72%", session: "1m 20s", conv: "1.8%" },
    worstBadge: "CRO medio",
  },
  {
    name: "Papachoa",
    url: "papachoa.com",
    seo: 44, cro: 38, performance: 52,
    issues: [
      { text: "Sin sitemap XML", category: "SEO", severity: "crítico" },
      { text: "Checkout con 6 pasos — fricción alta", category: "CRO", severity: "crítico" },
      { text: "LCP > 4.2s en mobile", category: "Velocidad", severity: "crítico" },
      { text: "Sin pixel de Meta configurado", category: "CRO", severity: "medio" },
    ],
    metrics: { visitas: "310", bounce: "81%", session: "0m 58s", conv: "0.6%" },
    worstBadge: "SEO crítico",
  },
  {
    name: "Bazar Centenario",
    url: "bazarcentenario.com",
    seo: 81, cro: 74, performance: 79,
    issues: [
      { text: "Schema markup ausente en productos", category: "SEO", severity: "bajo" },
      { text: "Botón WhatsApp no visible en desktop", category: "CRO", severity: "bajo" },
    ],
    metrics: { visitas: "1,240", bounce: "58%", session: "2m 15s", conv: "3.4%" },
    worstBadge: "SEO bajo",
  },
  {
    name: "Trovador",
    url: "trovador.io",
    seo: 62, cro: 55, performance: 65,
    issues: [
      { text: "Sin blog ni contenido indexable", category: "SEO", severity: "medio" },
      { text: "Hero sin propuesta de valor clara", category: "CRO", severity: "medio" },
      { text: "Google Search Console no vinculado", category: "SEO", severity: "medio" },
    ],
    metrics: { visitas: "190", bounce: "74%", session: "1m 05s", conv: "1.1%" },
    worstBadge: "SEO medio",
  },
];

const scoreColor = (score: number) => {
  if (score >= 80) return "#22C55E";
  if (score >= 50) return "#EAB308";
  return "#E63946";
};

const severityDot = (s: "crítico" | "medio" | "bajo") => {
  if (s === "crítico") return "#E63946";
  if (s === "medio") return "#EAB308";
  return "#888888";
};

const badgeColor = (badge: string) => {
  if (badge.includes("crítico")) return { bg: "rgba(230,57,70,0.15)", text: "#E63946" };
  if (badge.includes("medio")) return { bg: "rgba(234,179,8,0.15)", text: "#EAB308" };
  return { bg: "rgba(136,136,136,0.15)", text: "#888888" };
};

const ProjectCard = ({ project }: { project: ProjectData }) => {
  const { toast } = useToast();
  const [showAll, setShowAll] = useState(false);
  const visibleIssues = showAll ? project.issues : project.issues.slice(0, 4);
  const bc = badgeColor(project.worstBadge);

  const handleAction = () => {
    toast({ title: "Función disponible próximamente", duration: 3000 });
  };

  return (
    <div
      style={{
        backgroundColor: "#1A1A1A",
        border: "1px solid #2A2A2A",
        borderRadius: 12,
        padding: 24,
      }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-5">
        <div>
          <h3 style={{ color: "#FFFFFF", fontSize: 16, fontWeight: 700, margin: 0 }}>{project.name}</h3>
          <span style={{ color: "#888888", fontSize: 12, fontFamily: "monospace" }}>{project.url}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span style={{ color: "#888888", fontSize: 11 }}>Última actualización: hace 3 días</span>
          <span
            style={{
              backgroundColor: bc.bg,
              color: bc.text,
              fontSize: 10,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 999,
            }}
          >
            {project.worstBadge}
          </span>
        </div>
      </div>

      {/* A: Score Row */}
      <div className="flex gap-3 mb-4">
        {(["SEO", "CRO", "Performance"] as const).map((cat) => {
          const val = cat === "SEO" ? project.seo : cat === "CRO" ? project.cro : project.performance;
          return (
            <div
              key={cat}
              style={{
                flex: 1,
                backgroundColor: "#111111",
                border: "1px solid #333333",
                borderRadius: 8,
                padding: "10px 16px",
              }}
            >
              <div style={{ color: "#888888", fontSize: 11, marginBottom: 4 }}>{cat}</div>
              <div style={{ color: scoreColor(val), fontSize: 22, fontWeight: 700 }}>{val}</div>
            </div>
          );
        })}
      </div>

      {/* B: Issues */}
      <div className="mb-4">
        <div style={{ color: "#888888", fontSize: 12, textTransform: "uppercase", marginBottom: 8, letterSpacing: 0.5 }}>
          ⚠️ Pendientes / Mejoras
        </div>
        <div className="space-y-2">
          {visibleIssues.map((issue, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: severityDot(issue.severity),
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: "#FFFFFF", fontSize: 13 }} className="truncate">{issue.text}</span>
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: "#888888",
                  backgroundColor: "#111111",
                  border: "1px solid #2A2A2A",
                  padding: "1px 6px",
                  borderRadius: 999,
                  flexShrink: 0,
                }}
              >
                {issue.category}
              </span>
            </div>
          ))}
        </div>
        {project.issues.length > 4 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            style={{ color: "#E63946", fontSize: 12, marginTop: 6, background: "none", border: "none", cursor: "pointer" }}
          >
            + ver más
          </button>
        )}
      </div>

      {/* C: Metrics */}
      <div className="mb-4">
        <div style={{ color: "#888888", fontSize: 12, textTransform: "uppercase", marginBottom: 8, letterSpacing: 0.5 }}>
          📊 Métricas clave
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Visitas/sem", value: project.metrics.visitas },
            { label: "Bounce Rate", value: project.metrics.bounce },
            { label: "Avg. Session", value: project.metrics.session },
            { label: "Conv. Rate", value: project.metrics.conv },
          ].map((m) => (
            <div
              key={m.label}
              style={{
                backgroundColor: "#111111",
                border: "1px solid #222222",
                borderRadius: 999,
                padding: "6px 12px",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span style={{ color: "#888888", fontSize: 10 }}>{m.label}</span>
              <span style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 700 }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* D: Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleAction}
          className="flex-1 transition-colors"
          style={{
            height: 36,
            fontSize: 13,
            borderRadius: 8,
            border: "1px solid #E63946",
            color: "#E63946",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(230,57,70,0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          Ver Informe Completo
        </button>
        <button
          onClick={handleAction}
          className="flex-1 transition-colors"
          style={{
            height: 36,
            fontSize: 13,
            borderRadius: 8,
            border: "none",
            color: "#FFFFFF",
            backgroundColor: "#E63946",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C5303B")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E63946")}
        >
          Generar Reporte Cliente
        </button>
      </div>
    </div>
  );
};

const MisWebsPage = () => {
  return (
    <div>
      <h1 style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Análisis de Webs</h1>

      {/* Overview Bar */}
      <div
        style={{
          backgroundColor: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <div className="flex flex-wrap gap-6">
          {overviewStats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <s.icon size={18} style={{ color: s.isAccent ? "#E63946" : "#888888" }} />
              <div>
                <div style={{ color: "#888888", fontSize: 11 }}>{s.label}</div>
                <div
                  style={{
                    color: s.isAccent ? "#E63946" : "#FFFFFF",
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  {s.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((p) => (
          <ProjectCard key={p.name} project={p} />
        ))}
      </div>
    </div>
  );
};

export default MisWebsPage;
