import { useState } from "react";
import { Copy, RefreshCw, Save, Zap } from "lucide-react";

const postTypes = ["Caso de Éxito", "Tip Educativo", "Behind the Scenes", "Señal de Dolor", "Lanzamiento"];

const samplePost = `🚀 Caso real: RAWPAW — de Excel a un sistema de pedidos inteligente

Cuando conocí a los fundadores de RAWPAW (alimento BARF premium), su proceso era:
📋 Pedidos por WhatsApp
📊 Control en Excel
😰 Errores en entregas cada semana

Lo que construimos:
• Sistema de pedidos online con suscripción recurrente
• Dashboard de control de inventario en tiempo real
• Notificaciones automáticas de entrega
• Página web optimizada para SEO

Resultados en 60 días:
✅ 40% menos errores en entregas
✅ 25% más clientes recurrentes
✅ 3hrs/semana ahorradas en gestión

La tecnología correcta transforma operaciones. ¿Tu negocio sigue en modo manual?

#TransformaciónDigital #RAWPAW #WebDevelopment #PyMEs #México`;

const calendar = [
  { date: "Lun 03/03", title: "Caso de Éxito RAWPAW", status: "Pendiente", statusColor: "var(--nebu-text-secondary)" },
  { date: "Mié 05/03", title: "Tip Google Maps", status: "Borrador", statusColor: "var(--nebu-text-secondary)" },
  { date: "Vie 07/03", title: "Behind scenes Bazar", status: "Pendiente", statusColor: "var(--nebu-text-secondary)" },
  { date: "Lun 10/03", title: "Señal de dolor", status: "Programado ✓", statusColor: "#38A169" },
];

const contentMetrics = [
  { label: "Impresiones", value: "4,230" },
  { label: "Interacciones", value: "312" },
  { label: "Perfil visto", value: "89" },
  { label: "Nuevas conexiones", value: "14" },
];

const ContenidoTab = () => {
  const [topic, setTopic] = useState("Proyecto RAWPAW — sistema de pedidos inteligente para alimento BARF");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Generator – 60% */}
      <div className="lg:col-span-3 space-y-4">
        {/* Post Type Selector */}
        <div
          className="rounded-lg p-5"
          style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--nebu-text-secondary)" }}>TIPO DE POST</p>
          <div className="flex flex-wrap gap-2">
            {postTypes.map((t) => (
              <button
                key={t}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
                style={{
                  backgroundColor: t === "Caso de Éxito" ? "var(--nebu-accent)" : "var(--nebu-active-bg)",
                  color: t === "Caso de Éxito" ? "#fff" : "var(--nebu-text-secondary)",
                  border: `1px solid ${t === "Caso de Éxito" ? "var(--nebu-accent)" : "var(--nebu-border)"}`,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Describe el tema o proyecto..."
            className="w-full mt-4 rounded-md p-3 text-sm resize-none h-20"
            style={{ backgroundColor: "var(--nebu-bg)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}
          />

          <button
            className="mt-3 w-full py-2.5 rounded-md text-sm font-bold flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--nebu-accent)", color: "#fff" }}
          >
            <Zap size={16} /> Generar Post Viral
          </button>
        </div>

        {/* Generated Post */}
        <div
          className="rounded-lg p-5"
          style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--nebu-text-secondary)" }}>POST GENERADO</p>
          <div
            className="rounded-md p-4 text-sm leading-relaxed whitespace-pre-line"
            style={{ backgroundColor: "var(--nebu-bg)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}
          >
            {samplePost}
          </div>
          <div className="flex gap-2 mt-3">
            {[
              { label: "Copiar", icon: Copy },
              { label: "Regenerar", icon: RefreshCw },
              { label: "Guardar", icon: Save },
            ].map((a) => (
              <button
                key={a.label}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md transition-colors"
                style={{ backgroundColor: "var(--nebu-active-bg)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}
              >
                <a.icon size={13} /> {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar + Metrics – 40% */}
      <div className="lg:col-span-2 space-y-4">
        {/* Calendar */}
        <div
          className="rounded-lg p-5"
          style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--nebu-text-secondary)" }}>PRÓXIMOS POSTS</p>
          <div className="space-y-3">
            {calendar.map((c) => (
              <div key={c.date} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium" style={{ color: "var(--nebu-text)" }}>{c.date}</span>
                  <span className="ml-2" style={{ color: "var(--nebu-text-secondary)" }}>{c.title}</span>
                </div>
                <span className="text-[11px] font-medium" style={{ color: c.statusColor }}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Metrics */}
        <div
          className="rounded-lg p-5"
          style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--nebu-text-secondary)" }}>MÉTRICAS DE CONTENIDO</p>
          <div className="grid grid-cols-2 gap-3">
            {contentMetrics.map((m) => (
              <div key={m.label}>
                <p className="text-2xl font-bold" style={{ color: "var(--nebu-text)" }}>{m.value}</p>
                <p className="text-[11px]" style={{ color: "var(--nebu-text-secondary)" }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContenidoTab;
