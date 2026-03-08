import { useState } from "react";
import { MessageSquare, Copy, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const t = {
  title: { es: "PLANTILLAS DE MENSAJES", en: "MESSAGE TEMPLATES" },
  subtitle: { es: "Biblioteca del funnel de ventas", en: "Sales funnel library" },
  tabs: {
    all: { es: "Todos", en: "All" },
    linkedin: { es: "LinkedIn", en: "LinkedIn" },
    email: { es: "Email", en: "Email" },
    whatsapp: { es: "WhatsApp", en: "WhatsApp" },
  },
  step: { es: "Paso", en: "Step" },
  uses: { es: "usos", en: "uses" },
  copy: { es: "Copiar", en: "Copy" },
  copied: { es: "Copiado", en: "Copied" },
};

type Channel = "LinkedIn" | "Email" | "WhatsApp";

interface Template {
  title: Record<"es" | "en", string>;
  channel: Channel;
  step: string;
  uses: number;
  preview: Record<"es" | "en", string>;
}

const templates: Template[] = [
  { title: { es: "Primer Contacto", en: "First Contact" }, channel: "LinkedIn", step: "02", uses: 45, preview: { es: "Hola [nombre], vi tu perfil y me pareció interesante tu empresa. Nos dedicamos a crear sitios web profesionales para negocios como el tuyo…", en: "Hi [name], I saw your profile and found your business interesting. We create professional websites for businesses like yours…" } },
  { title: { es: "Follow-up 3 días", en: "3-day Follow-up" }, channel: "LinkedIn", step: "03", uses: 32, preview: { es: "Hola [nombre], quería dar seguimiento a mi mensaje anterior. ¿Te gustaría agendar una llamada rápida de 15 minutos para…", en: "Hi [name], I wanted to follow up on my previous message. Would you like to schedule a quick 15-minute call to…" } },
  { title: { es: "Follow-up 7 días", en: "7-day Follow-up" }, channel: "LinkedIn", step: "03", uses: 18, preview: { es: "Hola [nombre], sé que estás ocupado/a. Solo quería compartirte un caso de éxito reciente de un cliente en tu industria…", en: "Hi [name], I know you're busy. I just wanted to share a recent success story from a client in your industry…" } },
  { title: { es: "Agendar Llamada", en: "Schedule Call" }, channel: "LinkedIn", step: "04", uses: 12, preview: { es: "¡Genial! Te comparto mi calendario para que elijas el horario que mejor te funcione. La llamada es sin compromiso y…", en: "Great! Here's my calendar so you can pick the time that works best. The call is no-commitment and…" } },
  { title: { es: "Propuesta Enviada", en: "Proposal Sent" }, channel: "Email", step: "06", uses: 8, preview: { es: "Estimado [nombre], adjunto encontrarás la propuesta detallada para el proyecto de [proyecto]. Incluye alcance, timeline y…", en: "Dear [name], please find attached the detailed proposal for the [project] project. It includes scope, timeline and…" } },
  { title: { es: "Update Semanal", en: "Weekly Update" }, channel: "Email", step: "09", uses: 24, preview: { es: "Hola [nombre], te comparto el avance semanal del proyecto. Esta semana completamos las secciones de [sección] y…", en: "Hi [name], here's the weekly project update. This week we completed the [section] sections and…" } },
  { title: { es: "Entrega Final", en: "Final Delivery" }, channel: "Email", step: "11", uses: 3, preview: { es: "Estimado [nombre], nos da mucho gusto informarte que el proyecto está finalizado. Adjuntamos la documentación final y…", en: "Dear [name], we're very pleased to inform you that the project is complete. We've attached the final documentation and…" } },
  { title: { es: "Cobro Pendiente", en: "Pending Payment" }, channel: "WhatsApp", step: "10", uses: 6, preview: { es: "Hola [nombre], espero que estés bien. Te escribo para dar seguimiento al pago pendiente de la factura #[número]…", en: "Hi [name], hope you're doing well. I'm writing to follow up on the pending payment for invoice #[number]…" } },
];

const channelColors: Record<Channel, { bg: string; text: string }> = {
  LinkedIn: { bg: "#1a3a5c", text: "#4A9EDB" },
  Email: { bg: "#3a2a1a", text: "#D4A84B" },
  WhatsApp: { bg: "#1a3a2a", text: "#4ADB7A" },
};

const PlantillasPage = () => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | Channel>("all");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const filtered = activeTab === "all" ? templates : templates.filter((t) => t.channel === activeTab);
  const tabs: ("all" | Channel)[] = ["all", "LinkedIn", "Email", "WhatsApp"];

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <MessageSquare size={22} style={{ color: "var(--nebu-accent)" }} />
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--nebu-text)" }}>{t.title[lang]}</h1>
        </div>
        <p className="text-sm" style={{ color: "var(--nebu-text-secondary)" }}>{t.subtitle[lang]}</p>
      </div>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: activeTab === tab ? "var(--nebu-accent)" : "var(--nebu-card)",
              color: activeTab === tab ? "#FFFFFF" : "var(--nebu-text-secondary)",
              border: `1px solid ${activeTab === tab ? "var(--nebu-accent)" : "var(--nebu-border)"}`,
            }}
          >
            {tab === "all" ? t.tabs.all[lang] : tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((tmpl, i) => {
          const colors = channelColors[tmpl.channel];
          return (
            <div
              key={i}
              className="rounded-lg p-5 space-y-3"
              style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: "var(--nebu-text)" }}>{tmpl.title[lang]}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.bg, color: colors.text }}>{tmpl.channel}</span>
                    <span className="text-[11px]" style={{ color: "var(--nebu-text-secondary)" }}>{t.step[lang]} {tmpl.step}</span>
                  </div>
                </div>
                <span className="text-xs font-semibold" style={{ color: "var(--nebu-text-secondary)" }}>{tmpl.uses} {t.uses[lang]}</span>
              </div>
              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--nebu-text-secondary)" }}>{tmpl.preview[lang]}</p>
              <button
                onClick={() => handleCopy(i, tmpl.preview[lang])}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={{ backgroundColor: "var(--nebu-surface)", border: "1px solid var(--nebu-border)", color: copiedIdx === i ? "#4ADB7A" : "var(--nebu-text-secondary)" }}
              >
                {copiedIdx === i ? <Check size={12} /> : <Copy size={12} />}
                {copiedIdx === i ? t.copied[lang] : t.copy[lang]}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlantillasPage;
