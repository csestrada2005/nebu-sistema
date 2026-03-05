import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type Tab = "secuencias" | "contactos" | "plantillas";

interface SeqStep { day: number; type: "email" | "call"; subject?: string; preview?: string; label?: Record<"es"|"en",string>; }
interface Sequence { id: number; name: Record<"es"|"en",string>; status: "activa" | "pausada" | "borrador"; desc: Record<"es"|"en",string>; contacts: number; openRate: string; replyRate: string; steps: SeqStep[]; }

const sequences: Sequence[] = [
  { id: 1, name: { es: "Prospección Fría — Sin Web", en: "Cold Outreach — No Website" }, status: "activa",
    desc: { es: "Para negocios sin presencia digital detectados en LinkedIn", en: "For businesses without digital presence detected on LinkedIn" },
    contacts: 34, openRate: "42%", replyRate: "14%", steps: [
      { day: 0, type: "email", subject: "[Nombre negocio] — vi que no tienen web", preview: "Hola [Nombre], encontré tu negocio en LinkedIn y noté..." },
      { day: 3, type: "email", subject: "¿Lo viste, [Nombre]?", preview: "Solo quería retomar mi mensaje anterior..." },
      { day: 7, type: "email", subject: "Último intento — caso de éxito relevante", preview: "Hola [Nombre], antes de cerrar el hilo..." },
      { day: 14, type: "call", label: { es: "Intento de llamada si no hay respuesta", en: "Call attempt if no response" } },
    ] },
  { id: 2, name: { es: "Nurturing Post-Llamada", en: "Post-Call Nurturing" }, status: "activa",
    desc: { es: "Para prospectos que tuvieron llamada pero no cerraron", en: "For prospects who had a call but didn't close" },
    contacts: 12, openRate: "61%", replyRate: "25%", steps: [{ day: 0, type: "email" }, { day: 5, type: "email" }, { day: 12, type: "email" }, { day: 21, type: "email" }] },
  { id: 3, name: { es: "Reactivación Clientes Pasados", en: "Past Client Reactivation" }, status: "pausada",
    desc: { es: "Para clientes con proyectos terminados hace 3+ meses", en: "For clients with projects completed 3+ months ago" },
    contacts: 8, openRate: "55%", replyRate: "18%", steps: [{ day: 0, type: "email" }, { day: 14, type: "email" }, { day: 30, type: "email" }] },
  { id: 4, name: { es: "Web Vieja — Oportunidad CRO", en: "Old Website — CRO Opportunity" }, status: "borrador",
    desc: { es: "Para negocios con web desactualizada o de baja conversión", en: "For businesses with outdated or low-conversion websites" },
    contacts: 0, openRate: "-", replyRate: "-", steps: [{ day: 0, type: "email" }, { day: 4, type: "email" }, { day: 10, type: "email" }, { day: 18, type: "call" }] },
];

interface Contact { name: string; company: string; industry: string; sequence: string; step: string; status: "sin_respuesta" | "abrio" | "respondio" | "reboto"; lastEmail: Record<"es"|"en",string>; }

const contacts: Contact[] = [
  { name: "Carlos M.", company: "Clínica Sonrisa", industry: "Salud", sequence: "Prospección Fría", step: "Paso 2/4", status: "sin_respuesta", lastEmail: { es: "Hace 3 días", en: "3 days ago" } },
  { name: "Ana R.", company: "La Hacienda", industry: "Restaurante", sequence: "Prospección Fría", step: "Paso 1/4", status: "abrio", lastEmail: { es: "Hace 1 día", en: "1 day ago" } },
  { name: "Roberto S.", company: "Constructora SB", industry: "Construcción", sequence: "Post-Llamada", step: "Paso 2/4", status: "respondio", lastEmail: { es: "Ayer", en: "Yesterday" } },
  { name: "Miguel T.", company: "Despacho MTL", industry: "Legal", sequence: "Prospección Fría", step: "Paso 3/4", status: "sin_respuesta", lastEmail: { es: "Hace 7 días", en: "7 days ago" } },
  { name: "Laura V.", company: "Boutique Flores", industry: "Retail", sequence: "Web Vieja", step: "-", status: "sin_respuesta", lastEmail: { es: "-", en: "-" } },
  { name: "Diana K.", company: "Coach Negocios", industry: "Servicios", sequence: "Post-Llamada", step: "Paso 1/4", status: "abrio", lastEmail: { es: "Hace 2 días", en: "2 days ago" } },
  { name: "Jorge P.", company: "Inmobiliaria JP", industry: "Inmuebles", sequence: "Reactivación", step: "Paso 2/3", status: "respondio", lastEmail: { es: "Hace 4 días", en: "4 days ago" } },
  { name: "Sandra L.", company: "Spa Serenity", industry: "Salud/Bienestar", sequence: "Prospección Fría", step: "Paso 1/4", status: "sin_respuesta", lastEmail: { es: "Hace 1 día", en: "1 day ago" } },
];

interface Template { id: number; name: string; category: string; categoryColor: string; subject: string; preview: string; variables: string[]; usedIn: number; openRate: string; }

const templates: Template[] = [
  { id: 1, name: "Prospección Sin Web", category: "Prospección", categoryColor: "#3B82F6", subject: "{{negocio}} — vi que no tienen web", preview: "Hola {{nombre}}, encontré tu negocio buscando {{industria}} en México...", variables: ["nombre", "negocio", "industria", "senal_dolor"], usedIn: 2, openRate: "44%" },
  { id: 2, name: "Follow-up Día 3", category: "Follow-up", categoryColor: "#EAB308", subject: "¿Lo viste, {{nombre}}?", preview: "Solo quería retomar mi mensaje anterior...", variables: ["nombre"], usedIn: 3, openRate: "38%" },
  { id: 3, name: "Caso de Éxito — E-commerce", category: "Nurturing", categoryColor: "#22C55E", subject: "Cómo {{empresa_similar}} duplicó sus ventas en 30 días", preview: "Antes de cerrar el hilo, quería compartirte algo...", variables: ["empresa_similar", "nombre"], usedIn: 1, openRate: "52%" },
  { id: 4, name: "Propuesta + Siguiente Paso", category: "Cierre", categoryColor: "#EF4444", subject: "Propuesta para {{negocio}} — lista para revisar", preview: "Hola {{nombre}}, como hablamos, aquí está...", variables: ["nombre", "negocio"], usedIn: 1, openRate: "71%" },
  { id: 5, name: "Reactivación 3 Meses", category: "Nurturing", categoryColor: "#A855F7", subject: "¿Cómo va {{negocio}} estos meses?", preview: "Han pasado unos meses desde que trabajamos juntos...", variables: ["negocio"], usedIn: 0, openRate: "-" },
];

const statusBadge = (s: Sequence["status"], lang: "es"|"en") => {
  const m: Record<string, { bg: string; text: string; label: Record<"es"|"en",string> }> = {
    activa: { bg: "#22C55E22", text: "#22C55E", label: { es: "Activa", en: "Active" } },
    pausada: { bg: "#EAB30822", text: "#EAB308", label: { es: "Pausada", en: "Paused" } },
    borrador: { bg: "#6B728022", text: "#9CA3AF", label: { es: "Borrador", en: "Draft" } },
  };
  const c = m[s];
  return <span style={{ backgroundColor: c.bg, color: c.text, fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 9999 }}>{c.label[lang]}</span>;
};

const contactStatusBadge = (s: Contact["status"], lang: "es"|"en") => {
  const m: Record<string, { bg: string; text: string; label: Record<"es"|"en",string> }> = {
    sin_respuesta: { bg: "#6B728022", text: "#9CA3AF", label: { es: "Sin respuesta", en: "No reply" } },
    abrio: { bg: "#EAB30822", text: "#EAB308", label: { es: "Abrió ✓", en: "Opened ✓" } },
    respondio: { bg: "#22C55E22", text: "#22C55E", label: { es: "Respondió ✓✓", en: "Replied ✓✓" } },
    reboto: { bg: "#EF444422", text: "#EF4444", label: { es: "Rebotó ✗", en: "Bounced ✗" } },
  };
  const c = m[s];
  return <span style={{ backgroundColor: c.bg, color: c.text, fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 9999 }}>{c.label[lang]}</span>;
};

const HighlightVars = ({ text }: { text: string }) => {
  const parts = text.split(/(\{\{[^}]+\}\})/g);
  return <>{parts.map((p, i) => p.startsWith("{{") ? <span key={i} style={{ backgroundColor: "#2a1a1a", color: "#E53E3E", padding: "1px 4px", borderRadius: 4, fontFamily: "monospace", fontSize: 12 }}>{p}</span> : <span key={i}>{p}</span>)}</>;
};

const MiniTimeline = ({ steps, status }: { steps: SeqStep[]; status: Sequence["status"] }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 8 }}>
    {steps.map((s, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
            backgroundColor: status === "activa" && i === 0 ? "#E53E3E" : status === "activa" ? "#22C55E22" : "#1a1a1a",
            border: `2px solid ${status === "activa" && i === 0 ? "#E53E3E" : status === "pausada" ? "#EAB308" : "#333"}`,
            color: status === "activa" && i === 0 ? "#fff" : "#aaa" }}>
            {s.type === "email" ? "📧" : "📞"}
          </div>
          <span style={{ fontSize: 9, color: "#666" }}>Day {s.day}</span>
        </div>
        {i < steps.length - 1 && <div style={{ width: 24, height: 2, backgroundColor: "#333", margin: "0 2px" }} />}
      </div>
    ))}
  </div>
);

const SecuenciasTab = ({ lang }: { lang: "es"|"en" }) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {sequences.map((seq) => (
        <div key={seq.id} style={{ backgroundColor: "#1a1a1a", borderRadius: 12, padding: 20, border: "1px solid #262626" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <span style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>{seq.name[lang]}</span>
              <div style={{ marginTop: 4 }}>{statusBadge(seq.status, lang)}</div>
            </div>
          </div>
          <p style={{ color: "#999", fontSize: 13, marginBottom: 12 }}>{seq.desc[lang]}</p>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#aaa", marginBottom: 4 }}>
            <span>{seq.contacts} {lang === "es" ? "contactos" : "contacts"}</span>
            <span>{seq.openRate} {lang === "es" ? "apertura" : "open rate"}</span>
            <span>{seq.replyRate} {lang === "es" ? "respuesta" : "reply rate"}</span>
          </div>
          <MiniTimeline steps={seq.steps} status={seq.status} />
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={() => setExpanded(expanded === seq.id ? null : seq.id)} style={{ padding: "4px 14px", borderRadius: 6, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 12, cursor: "pointer" }}>{lang === "es" ? "Ver" : "View"}</button>
            <button style={{ padding: "4px 14px", borderRadius: 6, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 12, cursor: "pointer" }}>{seq.status === "activa" ? (lang === "es" ? "Pausar" : "Pause") : (lang === "es" ? "Activar" : "Activate")}</button>
            <button style={{ padding: "4px 14px", borderRadius: 6, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 12, cursor: "pointer" }}>{lang === "es" ? "Duplicar" : "Duplicate"}</button>
          </div>
          {expanded === seq.id && seq.steps.map((step, i) => (
            <div key={i} style={{ backgroundColor: "#111", borderRadius: 8, padding: 12, marginTop: 8, borderLeft: "3px solid #E53E3E" }}>
              <div style={{ fontWeight: 600, color: "#ddd", fontSize: 13 }}>{step.type === "email" ? `Email ${i + 1} (${lang === "es" ? "Día" : "Day"} ${step.day})` : `${lang === "es" ? "Llamada" : "Call"} (${lang === "es" ? "Día" : "Day"} ${step.day})`}</div>
              {step.subject && <div style={{ color: "#aaa", fontSize: 12, marginTop: 2 }}>{lang === "es" ? "Asunto" : "Subject"}: {step.subject}</div>}
              {step.preview && <div style={{ color: "#777", fontSize: 12, marginTop: 2, fontStyle: "italic" }}>{step.preview}</div>}
              {step.label && <div style={{ color: "#777", fontSize: 12, marginTop: 2 }}>{step.label[lang]}</div>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const ContactosTab = ({ lang }: { lang: "es"|"en" }) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const headers = lang === "es" ? ["Nombre", "Empresa", "Industria", "Secuencia", "Paso actual", "Estado", "Último email"] : ["Name", "Company", "Industry", "Sequence", "Current step", "Status", "Last email"];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input placeholder={lang === "es" ? "Buscar contacto..." : "Search contact..."} style={{ flex: 1, backgroundColor: "#111", border: "1px solid #333", borderRadius: 8, padding: "8px 14px", color: "#fff", fontSize: 13, outline: "none" }} />
        <select style={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: 8, padding: "8px 12px", color: "#aaa", fontSize: 13 }}><option>{lang === "es" ? "Secuencia" : "Sequence"}</option></select>
        <select style={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: 8, padding: "8px 12px", color: "#aaa", fontSize: 13 }}><option>{lang === "es" ? "Estado" : "Status"}</option></select>
        <select style={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: 8, padding: "8px 12px", color: "#aaa", fontSize: 13 }}><option>{lang === "es" ? "Industria" : "Industry"}</option></select>
      </div>
      <div style={{ backgroundColor: "#1a1a1a", borderRadius: 12, border: "1px solid #262626", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: "1px solid #262626" }}>{headers.map((h) => (<th key={h} style={{ padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "#666", textAlign: "left", textTransform: "uppercase" }}>{h}</th>))}</tr></thead>
          <tbody>
            {contacts.map((c, i) => (
              <tr key={i} onClick={() => setSelectedContact(c)} style={{ borderBottom: "1px solid #1f1f1f", cursor: "pointer" }} onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#222")} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                <td style={{ padding: "10px 14px", color: "#fff", fontSize: 13, fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: "10px 14px", color: "#ccc", fontSize: 13 }}>{c.company}</td>
                <td style={{ padding: "10px 14px", color: "#999", fontSize: 13 }}>{c.industry}</td>
                <td style={{ padding: "10px 14px", color: "#999", fontSize: 13 }}>{c.sequence}</td>
                <td style={{ padding: "10px 14px", color: "#999", fontSize: 13 }}>{c.step}</td>
                <td style={{ padding: "10px 14px" }}>{contactStatusBadge(c.status, lang)}</td>
                <td style={{ padding: "10px 14px", color: "#666", fontSize: 12 }}>{c.lastEmail[lang]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedContact && (
        <div style={{ position: "fixed", top: 0, right: 0, width: 400, height: "100vh", backgroundColor: "#111", borderLeft: "1px solid #262626", zIndex: 1000, padding: 24, overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{selectedContact.name}</h3>
            <button onClick={() => setSelectedContact(null)} style={{ background: "none", border: "none", color: "#666", fontSize: 20, cursor: "pointer" }}>×</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: lang === "es" ? "Empresa" : "Company", value: selectedContact.company },
              { label: lang === "es" ? "Industria" : "Industry", value: selectedContact.industry },
              { label: lang === "es" ? "Secuencia" : "Sequence", value: `${selectedContact.sequence} — ${selectedContact.step}` },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: "#1a1a1a", borderRadius: 8, padding: 14 }}>
                <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
                <div style={{ color: "#fff", fontSize: 14 }}>{item.value}</div>
              </div>
            ))}
            <div style={{ backgroundColor: "#1a1a1a", borderRadius: 8, padding: 14 }}>
              <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 4 }}>{lang === "es" ? "Estado" : "Status"}</div>
              <div>{contactStatusBadge(selectedContact.status, lang)}</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              <button style={{ padding: "6px 16px", borderRadius: 6, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 12, cursor: "pointer" }}>{lang === "es" ? "Pausar" : "Pause"}</button>
              <button style={{ padding: "6px 16px", borderRadius: 6, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 12, cursor: "pointer" }}>{lang === "es" ? "Cambiar secuencia" : "Change sequence"}</button>
              <button style={{ padding: "6px 16px", borderRadius: 6, border: "1px solid #E53E3E", backgroundColor: "transparent", color: "#E53E3E", fontSize: 12, cursor: "pointer" }}>{lang === "es" ? "Mover a CRM" : "Move to CRM"}</button>
              <button style={{ padding: "6px 16px", borderRadius: 6, border: "1px solid #22C55E", backgroundColor: "transparent", color: "#22C55E", fontSize: 12, cursor: "pointer" }}>{lang === "es" ? "Marcar respondido" : "Mark replied"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PlantillasTab = ({ lang }: { lang: "es"|"en" }) => {
  const [filter, setFilter] = useState("Todas");
  const [viewTemplate, setViewTemplate] = useState<Template | null>(null);
  const cats = lang === "es" ? ["Todas", "Prospección", "Follow-up", "Nurturing", "Cierre"] : ["All", "Prospección", "Follow-up", "Nurturing", "Cierre"];
  const filtered = filter === "Todas" || filter === "All" ? templates : templates.filter((t) => t.category === filter);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: 16, margin: 0 }}>{lang === "es" ? "BIBLIOTECA DE PLANTILLAS" : "TEMPLATE LIBRARY"}</h2>
        <button style={{ padding: "6px 18px", borderRadius: 8, border: "none", backgroundColor: "#E53E3E", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{lang === "es" ? "Nueva Plantilla +" : "New Template +"}</button>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)} style={{ padding: "5px 14px", borderRadius: 20, border: filter === c ? "1px solid #E53E3E" : "1px solid #333", backgroundColor: filter === c ? "#E53E3E22" : "transparent", color: filter === c ? "#E53E3E" : "#999", fontSize: 12, cursor: "pointer" }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {filtered.map((t) => (
          <div key={t.id} style={{ backgroundColor: "#1a1a1a", borderRadius: 12, padding: 18, border: "1px solid #262626" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{t.name}</span>
              <span style={{ backgroundColor: t.categoryColor + "22", color: t.categoryColor, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 9999 }}>{t.category}</span>
            </div>
            <div style={{ color: "#aaa", fontSize: 12, marginBottom: 4 }}>{lang === "es" ? "Asunto" : "Subject"}: <HighlightVars text={t.subject} /></div>
            <p style={{ color: "#777", fontSize: 12, marginBottom: 10, lineHeight: 1.5 }}><HighlightVars text={t.preview} /></p>
            {t.variables.length > 0 && (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                {t.variables.map((v) => <span key={v} style={{ backgroundColor: "#2a1a1a", color: "#E53E3E", fontSize: 10, padding: "2px 6px", borderRadius: 4, fontFamily: "monospace" }}>{`{{${v}}}`}</span>)}
              </div>
            )}
            <div style={{ color: "#666", fontSize: 11, marginBottom: 10 }}>{lang === "es" ? `Usada en ${t.usedIn} secuencias | Apertura: ${t.openRate}` : `Used in ${t.usedIn} sequences | Open rate: ${t.openRate}`}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setViewTemplate(t)} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 11, cursor: "pointer" }}>{lang === "es" ? "Ver completa" : "View full"}</button>
              <button style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 11, cursor: "pointer" }}>{lang === "es" ? "Usar" : "Use"}</button>
              <button style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 11, cursor: "pointer" }}>{lang === "es" ? "Editar" : "Edit"}</button>
            </div>
          </div>
        ))}
      </div>
      {viewTemplate && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setViewTemplate(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#1a1a1a", borderRadius: 16, padding: 28, width: 560, maxHeight: "80vh", overflowY: "auto", border: "1px solid #333" }}>
            <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{viewTemplate.name}</h3>
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 4 }}>{lang === "es" ? "Asunto" : "Subject"}</div>
              <div style={{ backgroundColor: "#111", borderRadius: 8, padding: 12, color: "#fff", fontSize: 14 }}><HighlightVars text={viewTemplate.subject} /></div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 4 }}>{lang === "es" ? "Cuerpo" : "Body"}</div>
              <div style={{ backgroundColor: "#111", borderRadius: 8, padding: 14, color: "#ccc", fontSize: 13, lineHeight: 1.7 }}><HighlightVars text={viewTemplate.preview} /></div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 6 }}>{lang === "es" ? "Variables detectadas" : "Detected variables"}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {viewTemplate.variables.map((v) => <span key={v} style={{ backgroundColor: "#2a1a1a", color: "#E53E3E", fontSize: 12, padding: "4px 10px", borderRadius: 6, fontFamily: "monospace" }}>{`{{${v}}}`}</span>)}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setViewTemplate(null)} style={{ padding: "6px 18px", borderRadius: 8, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 13, cursor: "pointer" }}>{lang === "es" ? "Cerrar" : "Close"}</button>
              <button style={{ padding: "6px 18px", borderRadius: 8, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 13, cursor: "pointer" }}>{lang === "es" ? "Duplicar" : "Duplicate"}</button>
              <button style={{ padding: "6px 18px", borderRadius: 8, border: "none", backgroundColor: "#E53E3E", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{lang === "es" ? "Usar en secuencia" : "Use in sequence"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EmailPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("secuencias");
  const { lang } = useLanguage();

  const tabList: { id: Tab; label: string }[] = [
    { id: "secuencias", label: lang === "es" ? "Secuencias" : "Sequences" },
    { id: "contactos", label: lang === "es" ? "Contactos" : "Contacts" },
    { id: "plantillas", label: lang === "es" ? "Plantillas" : "Templates" },
  ];

  const kpiLabels = lang === "es"
    ? ["Emails enviados este mes", "Tasa de apertura", "Tasa de respuesta", "Reuniones generadas"]
    : ["Emails sent this month", "Open rate", "Response rate", "Meetings generated"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold" style={{ color: "var(--nebu-text)" }}>EMAIL AUTOMATION</h1>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#22C55E22", color: "#22C55E" }}>
              <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#22C55E" }} />
              {lang === "es" ? "Sistema activo" : "System active"}
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: "var(--nebu-text-secondary)" }}>
            {lang === "es" ? "Secuencias de cold email · Follow-ups · Nurturing" : "Cold email sequences · Follow-ups · Nurturing"}
          </p>
        </div>
        <button className="px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap" style={{ backgroundColor: "var(--nebu-accent)", color: "#fff" }}>
          {lang === "es" ? "Nueva Secuencia +" : "New Sequence +"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div style={{ backgroundColor: "#1a1a1a", borderRadius: 12, padding: 18, border: "1px solid #262626" }}>
          <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 6 }}>{kpiLabels[0]}</div>
          <div style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>127</div>
          <span style={{ color: "#22C55E", fontSize: 12 }}>{lang === "es" ? "↑ Tendencia positiva" : "↑ Positive trend"}</span>
        </div>
        <div style={{ backgroundColor: "#1a1a1a", borderRadius: 12, padding: 18, border: "1px solid #262626" }}>
          <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 6 }}>{kpiLabels[1]}</div>
          <div style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>38%</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ color: "#999", fontSize: 11 }}>Benchmark: 25%</span>
            <span style={{ backgroundColor: "#22C55E22", color: "#22C55E", fontSize: 10, padding: "2px 8px", borderRadius: 9999, fontWeight: 600 }}>{lang === "es" ? "✓ Sobre promedio" : "✓ Above avg"}</span>
          </div>
        </div>
        <div style={{ backgroundColor: "#1a1a1a", borderRadius: 12, padding: 18, border: "1px solid #262626" }}>
          <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 6 }}>{kpiLabels[2]}</div>
          <div style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>12%</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ color: "#999", fontSize: 11 }}>Benchmark: 8%</span>
            <span style={{ backgroundColor: "#22C55E22", color: "#22C55E", fontSize: 10, padding: "2px 8px", borderRadius: 9999, fontWeight: 600 }}>{lang === "es" ? "✓ Sobre promedio" : "✓ Above avg"}</span>
          </div>
        </div>
        <div style={{ backgroundColor: "#1a1a1a", borderRadius: 12, padding: 18, border: "1px solid #262626" }}>
          <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 6 }}>{kpiLabels[3]}</div>
          <div style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>4</div>
          <span style={{ backgroundColor: "#E53E3E22", color: "#E53E3E", fontSize: 10, padding: "2px 8px", borderRadius: 9999, fontWeight: 600 }}>{lang === "es" ? "⚡ Este mes" : "⚡ This month"}</span>
        </div>
      </div>

      <div className="flex gap-0" style={{ borderBottom: "1px solid var(--nebu-border)" }}>
        {tabList.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className="px-5 py-2.5 text-sm font-medium transition-colors relative" style={{ color: activeTab === t.id ? "var(--nebu-text)" : "var(--nebu-text-secondary)" }}>
            {t.label}
            {activeTab === t.id && <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: "var(--nebu-accent)" }} />}
          </button>
        ))}
      </div>

      {activeTab === "secuencias" && <SecuenciasTab lang={lang} />}
      {activeTab === "contactos" && <ContactosTab lang={lang} />}
      {activeTab === "plantillas" && <PlantillasTab lang={lang} />}
    </div>
  );
};

export default EmailPage;
