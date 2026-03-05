import { useState } from "react";
import { Copy, RefreshCw, Save, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ContenidoTab = () => {
  const { lang } = useLanguage();
  const [topic, setTopic] = useState(lang === "es" ? "Proyecto RAWPAW — sistema de pedidos inteligente para alimento BARF" : "RAWPAW project — smart ordering system for BARF pet food");

  const postTypes = lang === "es" ? ["Caso de Éxito", "Tip Educativo", "Behind the Scenes", "Señal de Dolor", "Lanzamiento"] : ["Success Story", "Educational Tip", "Behind the Scenes", "Pain Signal", "Launch"];

  const samplePost = lang === "es"
    ? `🚀 Caso real: RAWPAW — de Excel a un sistema de pedidos inteligente\n\nCuando conocí a los fundadores de RAWPAW (alimento BARF premium), su proceso era:\n📋 Pedidos por WhatsApp\n📊 Control en Excel\n😰 Errores en entregas cada semana\n\nLo que construimos:\n• Sistema de pedidos online con suscripción recurrente\n• Dashboard de control de inventario en tiempo real\n• Notificaciones automáticas de entrega\n• Página web optimizada para SEO\n\nResultados en 60 días:\n✅ 40% menos errores en entregas\n✅ 25% más clientes recurrentes\n✅ 3hrs/semana ahorradas en gestión\n\nLa tecnología correcta transforma operaciones. ¿Tu negocio sigue en modo manual?\n\n#TransformaciónDigital #RAWPAW #WebDevelopment #PyMEs #México`
    : `🚀 Real case: RAWPAW — from Excel to a smart ordering system\n\nWhen I met the founders of RAWPAW (premium BARF pet food), their process was:\n📋 Orders via WhatsApp\n📊 Tracking in Excel\n😰 Delivery errors every week\n\nWhat we built:\n• Online ordering system with recurring subscriptions\n• Real-time inventory control dashboard\n• Automatic delivery notifications\n• SEO-optimized website\n\nResults in 60 days:\n✅ 40% fewer delivery errors\n✅ 25% more recurring customers\n✅ 3hrs/week saved in management\n\nThe right technology transforms operations. Is your business still in manual mode?\n\n#DigitalTransformation #RAWPAW #WebDevelopment #SMBs #Mexico`;

  const calendar = lang === "es"
    ? [
      { date: "Lun 03/03", title: "Caso de Éxito RAWPAW", status: "Pendiente", statusColor: "var(--nebu-text-secondary)" },
      { date: "Mié 05/03", title: "Tip Google Maps", status: "Borrador", statusColor: "var(--nebu-text-secondary)" },
      { date: "Vie 07/03", title: "Behind scenes Bazar", status: "Pendiente", statusColor: "var(--nebu-text-secondary)" },
      { date: "Lun 10/03", title: "Señal de dolor", status: "Programado ✓", statusColor: "#38A169" },
    ]
    : [
      { date: "Mon 03/03", title: "RAWPAW Success Story", status: "Pending", statusColor: "var(--nebu-text-secondary)" },
      { date: "Wed 05/03", title: "Google Maps Tip", status: "Draft", statusColor: "var(--nebu-text-secondary)" },
      { date: "Fri 07/03", title: "Behind scenes Bazar", status: "Pending", statusColor: "var(--nebu-text-secondary)" },
      { date: "Mon 10/03", title: "Pain signal", status: "Scheduled ✓", statusColor: "#38A169" },
    ];

  const contentMetrics = [
    { label: lang === "es" ? "Impresiones" : "Impressions", value: "4,230" },
    { label: lang === "es" ? "Interacciones" : "Interactions", value: "312" },
    { label: lang === "es" ? "Perfil visto" : "Profile views", value: "89" },
    { label: lang === "es" ? "Nuevas conexiones" : "New connections", value: "14" },
  ];

  const actionLabels = lang === "es" ? ["Copiar", "Regenerar", "Guardar"] : ["Copy", "Regenerate", "Save"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-3 space-y-4">
        <div className="rounded-lg p-5" style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}>
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--nebu-text-secondary)" }}>{lang === "es" ? "TIPO DE POST" : "POST TYPE"}</p>
          <div className="flex flex-wrap gap-2">
            {postTypes.map((t) => (
              <button key={t} className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
                style={{ backgroundColor: t === postTypes[0] ? "var(--nebu-accent)" : "var(--nebu-active-bg)", color: t === postTypes[0] ? "#fff" : "var(--nebu-text-secondary)", border: `1px solid ${t === postTypes[0] ? "var(--nebu-accent)" : "var(--nebu-border)"}` }}>{t}</button>
            ))}
          </div>
          <textarea value={topic} onChange={(e) => setTopic(e.target.value)}
            placeholder={lang === "es" ? "Describe el tema o proyecto..." : "Describe the topic or project..."}
            className="w-full mt-4 rounded-md p-3 text-sm resize-none h-20" style={{ backgroundColor: "var(--nebu-bg)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }} />
          <button className="mt-3 w-full py-2.5 rounded-md text-sm font-bold flex items-center justify-center gap-2" style={{ backgroundColor: "var(--nebu-accent)", color: "#fff" }}>
            <Zap size={16} /> {lang === "es" ? "Generar Post Viral" : "Generate Viral Post"}
          </button>
        </div>
        <div className="rounded-lg p-5" style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}>
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--nebu-text-secondary)" }}>{lang === "es" ? "POST GENERADO" : "GENERATED POST"}</p>
          <div className="rounded-md p-4 text-sm leading-relaxed whitespace-pre-line" style={{ backgroundColor: "var(--nebu-bg)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}>{samplePost}</div>
          <div className="flex gap-2 mt-3">
            {[Copy, RefreshCw, Save].map((Icon, i) => (
              <button key={i} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md transition-colors"
                style={{ backgroundColor: "var(--nebu-active-bg)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}>
                <Icon size={13} /> {actionLabels[i]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-lg p-5" style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}>
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--nebu-text-secondary)" }}>{lang === "es" ? "PRÓXIMOS POSTS" : "UPCOMING POSTS"}</p>
          <div className="space-y-3">
            {calendar.map((c) => (
              <div key={c.date} className="flex items-center justify-between text-sm">
                <div><span className="font-medium" style={{ color: "var(--nebu-text)" }}>{c.date}</span><span className="ml-2" style={{ color: "var(--nebu-text-secondary)" }}>{c.title}</span></div>
                <span className="text-[11px] font-medium" style={{ color: c.statusColor }}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg p-5" style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}>
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--nebu-text-secondary)" }}>{lang === "es" ? "MÉTRICAS DE CONTENIDO" : "CONTENT METRICS"}</p>
          <div className="grid grid-cols-2 gap-3">
            {contentMetrics.map((m) => (
              <div key={m.label}><p className="text-2xl font-bold" style={{ color: "var(--nebu-text)" }}>{m.value}</p><p className="text-[11px]" style={{ color: "var(--nebu-text-secondary)" }}>{m.label}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContenidoTab;
