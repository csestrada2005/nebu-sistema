import { useState } from "react";

type Tab = "secuencias" | "contactos" | "plantillas";

const tabList: { id: Tab; label: string }[] = [
  { id: "secuencias", label: "Secuencias" },
  { id: "contactos", label: "Contactos" },
  { id: "plantillas", label: "Plantillas" },
  ];

interface SeqStep { day: number; type: "email" | "call"; subject?: string; preview?: string; label?: string; }
interface Sequence { id: number; name: string; status: "activa" | "pausada" | "borrador"; desc: string; contacts: number; openRate: string; replyRate: string; steps: SeqStep[]; }

const sequences: Sequence[] = [
  { id: 1, name: "Prospeccion Fria - Sin Web", status: "activa", desc: "Para negocios sin presencia digital detectados en LinkedIn", contacts: 34, openRate: "42%", replyRate: "14%", steps: [
    { day: 0, type: "email", subject: "[Nombre negocio] - vi que no tienen web", preview: "Hola [Nombre], encontre tu negocio en LinkedIn y note..." },
    { day: 3, type: "email", subject: "Lo viste, [Nombre]?", preview: "Solo queria retomar mi mensaje anterior..." },
    { day: 7, type: "email", subject: "Ultimo intento - caso de exito relevante", preview: "Hola [Nombre], antes de cerrar el hilo..." },
    { day: 14, type: "call", label: "Intento de llamada si no hay respuesta" },
      ]},
  { id: 2, name: "Nurturing Post-Llamada", status: "activa", desc: "Para prospectos que tuvieron llamada pero no cerraron", contacts: 12, openRate: "61%", replyRate: "25%", steps: [
    { day: 0, type: "email" }, { day: 5, type: "email" }, { day: 12, type: "email" }, { day: 21, type: "email" },
      ]},
  { id: 3, name: "Reactivacion Clientes Pasados", status: "pausada", desc: "Para clientes con proyectos terminados hace 3+ meses", contacts: 8, openRate: "55%", replyRate: "18%", steps: [
    { day: 0, type: "email" }, { day: 14, type: "email" }, { day: 30, type: "email" },
      ]},
  { id: 4, name: "Web Vieja - Oportunidad CRO", status: "borrador", desc: "Para negocios con web desactualizada o de baja conversion", contacts: 0, openRate: "-", replyRate: "-", steps: [
    { day: 0, type: "email" }, { day: 4, type: "email" }, { day: 10, type: "email" }, { day: 18, type: "call" },
      ]},
  ];

interface Contact { name: string; company: string; industry: string; sequence: string; step: string; status: "sin_respuesta" | "abrio" | "respondio" | "reboto"; lastEmail: string; }

const contacts: Contact[] = [
  { name: "Carlos M.", company: "Clinica Sonrisa", industry: "Salud", sequence: "Prospeccion Fria", step: "Paso 2/4", status: "sin_respuesta", lastEmail: "Hace 3 dias" },
  { name: "Ana R.", company: "La Hacienda", industry: "Restaurante", sequence: "Prospeccion Fria", step: "Paso 1/4", status: "abrio", lastEmail: "Hace 1 dia" },
  { name: "Roberto S.", company: "Constructora SB", industry: "Construccion", sequence: "Post-Llamada", step: "Paso 2/4", status: "respondio", lastEmail: "Ayer" },
  { name: "Miguel T.", company: "Despacho MTL", industry: "Legal", sequence: "Prospeccion Fria", step: "Paso 3/4", status: "sin_respuesta", lastEmail: "Hace 7 dias" },
  { name: "Laura V.", company: "Boutique Flores", industry: "Retail", sequence: "Web Vieja", step: "-", status: "sin_respuesta", lastEmail: "-" },
  { name: "Diana K.", company: "Coach Negocios", industry: "Servicios", sequence: "Post-Llamada", step: "Paso 1/4", status: "abrio", lastEmail: "Hace 2 dias" },
  { name: "Jorge P.", company: "Inmobiliaria JP", industry: "Inmuebles", sequence: "Reactivacion", step: "Paso 2/3", status: "respondio", lastEmail: "Hace 4 dias" },
  { name: "Sandra L.", company: "Spa Serenity", industry: "Salud/Bienestar", sequence: "Prospeccion Fria", step: "Paso 1/4", status: "sin_respuesta", lastEmail: "Hace 1 dia" },
  ];

interface Template { id: number; name: string; category: string; categoryColor: string; subject: string; preview: string; variables: string[]; usedIn: number; openRate: string; }

const templates: Template[] = [
  { id: 1, name: "Prospeccion Sin Web", category: "Prospeccion", categoryColor: "#3B82F6", subject: "{{negocio}} - vi que no tienen web", preview: "Hola {{nombre}}, encontre tu negocio buscando {{industria}} en Mexico y note que no tienen presencia web profesional...", variables: ["nombre", "negocio", "industria", "senal_dolor"], usedIn: 2, openRate: "44%" },
  { id: 2, name: "Follow-up Dia 3", category: "Follow-up", categoryColor: "#EAB308", subject: "Lo viste, {{nombre}}?", preview: "Solo queria retomar mi mensaje anterior. Se que eres...", variables: ["nombre"], usedIn: 3, openRate: "38%" },
  { id: 3, name: "Caso de Exito - E-commerce", category: "Nurturing", categoryColor: "#22C55E", subject: "Como {{empresa_similar}} duplico sus ventas en 30 dias", preview: "Antes de cerrar el hilo, queria compartirte algo...", variables: ["empresa_similar", "nombre"], usedIn: 1, openRate: "52%" },
  { id: 4, name: "Propuesta + Siguiente Paso", category: "Cierre", categoryColor: "#EF4444", subject: "Propuesta para {{negocio}} - lista para revisar", preview: "Hola {{nombre}}, como hablamos, aqui esta...", variables: ["nombre", "negocio"], usedIn: 1, openRate: "71%" },
  { id: 5, name: "Reactivacion 3 Meses", category: "Nurturing", categoryColor: "#A855F7", subject: "Como va {{negocio}} estos meses?", preview: "Han pasado unos meses desde que trabajamos juntos...", variables: ["negocio"], usedIn: 0, openRate: "-" },
  ];

// ─── HELPERS ──────────────────────────────────
const statusBadge = (s: Sequence["status"]) => {
    const m: Record<string, { bg: string; text: string; label: string }> = {
          activa: { bg: "#22C55E22", text: "#22C55E", label: "Activa" },
          pausada: { bg: "#EAB30822", text: "#EAB308", label: "Pausada" },
          borrador: { bg: "#6B728022", text: "#9CA3AF", label: "Borrador" },
    };
    const c = m[s];
    return <span style={{ backgroundColor: c.bg, color: c.text, fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 9999 }}>{c.label}</span>span>;
};

const contactStatusBadge = (s: Contact["status"]) => {
    const m: Record<string, { bg: string; text: string; label: string }> = {
          sin_respuesta: { bg: "#6B728022", text: "#9CA3AF", label: "Sin respuesta" },
          abrio: { bg: "#EAB30822", text: "#EAB308", label: "Abrio \u2713" },
          respondio: { bg: "#22C55E22", text: "#22C55E", label: "Respondio \u2713\u2713" },
          reboto: { bg: "#EF444422", text: "#EF4444", label: "Reboto \u2717" },
    };
    const c = m[s];
    return <span style={{ backgroundColor: c.bg, color: c.text, fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 9999 }}>{c.label}</span>span>;
};

const HighlightVars = ({ text }: { text: string }) => {
    const parts = text.split(/(\{\{[^}]+\}\})/g);
    return <>{parts.map((p, i) => p.startsWith("{{") ? <span key={i} style={{ backgroundColor: "#2a1a1a", color: "#E53E3E", padding: "1px 4px", borderRadius: 4, fontFamily: "monospace", fontSize: 12 }}>{p}</span>span> : <span key={i}>{p}</span>span>)}</>>;
};

// ─── TIMELINE ──────────────────────────────────
const MiniTimeline = ({ steps, status }: { steps: SeqStep[]; status: Sequence["status"] }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 8 }}>
      {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                              <div style={{
                          width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                          backgroundColor: status === "activa" && i === 0 ? "#E53E3E" : status === "activa" ? "#22C55E22" : "#1a1a1a",
                          border: `2px solid ${status === "activa" && i === 0 ? "#E53E3E" : status === "pausada" ? "#EAB308" : "#333"}`,
                          color: status === "activa" && i === 0 ? "#fff" : "#aaa",
            }}>
                                {s.type === "email" ? "\u{1F4E7}" : "\u{1F4DE}"}
                              </div>div>
                              <span style={{ fontSize: 9, color: "#666" }}>Dia {s.day}</span>span>
                    </div>div>
              {i < steps.length - 1 && <div style={{ width: 24, height: 2, backgroundColor: "#333", margin: "0 2px" }} />}
            </div>div>
          ))}
    </div>div>
  );

// ─── SECUENCIAS TAB ──────────────────────────────────
const SecuenciasTab = () => {
    const [expanded, setExpanded] = useState<number | null>(null);
    return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {sequences.map((seq) => (
                    <div key={seq.id} style={{ backgroundColor: "#1a1a1a", borderRadius: 12, padding: 20, border: "1px solid #262626" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                          <div>
                                                        <span style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>{seq.name}</span>span>
                                                        <div style={{ marginTop: 4 }}>{statusBadge(seq.status)}</div>div>
                                          </div>div>
                              </div>div>
                              <p style={{ color: "#999", fontSize: 13, marginBottom: 12 }}>{seq.desc}</p>p>
                              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#aaa", marginBottom: 4 }}>
                                          <span>{seq.contacts} contactos</span>span>
                                          <span>{seq.openRate} apertura</span>span>
                                          <span>{seq.replyRate} respuesta</span>span>
                              </div>div>
                              <MiniTimeline steps={seq.steps} status={seq.status} />
                              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                                          <button onClick={() => setExpanded(expanded === seq.id ? null : seq.id)} style={{ padding: "4px 14px", borderRadius: 6, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 12, cursor: "pointer" }}>Ver</button>button>
                                          <button style={{ padding: "4px 14px", borderRadius: 6, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 12, cursor: "pointer" }}>{seq.status === "activa" ? "Pausar" : "Activar"}</button>button>
                                          <button style={{ padding: "4px 14px", borderRadius: 6, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 12, cursor: "pointer" }}>Duplicar</button>button>
                              </div>div>
                      {expanded === seq.id && seq.steps.map((step, i) => (
                                  <div key={i} style={{ backgroundColor: "#111", borderRadius: 8, padding: 12, marginTop: 8, borderLeft: "3px solid #E53E3E" }}>
                                                <div style={{ fontWeight: 600, color: "#ddd", fontSize: 13 }}>
                                                  {step.type === "email" ? `Email ${i + 1} (Dia ${step.day})` : `Llamada (Dia ${step.day})`}
                                                </div>div>
                                    {step.subject && <div style={{ color: "#aaa", fontSize: 12, marginTop: 2 }}>Asunto: {step.subject}</div>div>}
                                    {step.preview && <div style={{ color: "#777", fontSize: 12, marginTop: 2, fontStyle: "italic" }}>{step.preview}</div>div>}
                                    {step.label && <div style={{ color: "#777", fontSize: 12, marginTop: 2 }}>{step.label}</div>div>}
                                  </div>div>
                                ))}
                    </div>div>
                  ))}
          </div>div>
        );
};

// ─── CONTACTOS TAB ──────────────────────────────────
const ContactosTab = () => {
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    return (
          <div>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                        <input placeholder="Buscar contacto..." style={{ flex: 1, backgroundColor: "#111", border: "1px solid #333", borderRadius: 8, padding: "8px 14px", color: "#fff", fontSize: 13, outline: "none" }} />
                        <select style={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: 8, padding: "8px 12px", color: "#aaa", fontSize: 13 }}><option>Secuencia</option>option></select>select>
                        <select style={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: 8, padding: "8px 12px", color: "#aaa", fontSize: 13 }}><option>Estado</option>option></select>select>
                        <select style={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: 8, padding: "8px 12px", color: "#aaa", fontSize: 13 }}><option>Industria</option>option></select>select>
                </div>div>
                <div style={{ backgroundColor: "#1a1a1a", borderRadius: 12, border: "1px solid #262626", overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                  <thead>
                                              <tr style={{ borderBottom: "1px solid #262626" }}>
                                                {["Nombre", "Empresa", "Industria", "Secuencia", "Paso actual", "Estado", "Ultimo email"].map((h) => (
                            <th key={h} style={{ padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "#666", textAlign: "left", textTransform: "uppercase" }}>{h}</th>th>
                          ))}
                                              </tr>tr>
                                  </thead>thead>
                                  <tbody>
                                    {contacts.map((c, i) => (
                          <tr key={i} onClick={() => setSelectedContact(c)} style={{ borderBottom: "1px solid #1f1f1f", cursor: "pointer" }} onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#222")} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                                          <td style={{ padding: "10px 14px", color: "#fff", fontSize: 13, fontWeight: 600 }}>{c.name}</td>td>
                                          <td style={{ padding: "10px 14px", color: "#ccc", fontSize: 13 }}>{c.company}</td>td>
                                          <td style={{ padding: "10px 14px", color: "#999", fontSize: 13 }}>{c.industry}</td>td>
                                          <td style={{ padding: "10px 14px", color: "#999", fontSize: 13 }}>{c.sequence}</td>td>
                                          <td style={{ padding: "10px 14px", color: "#999", fontSize: 13 }}>{c.step}</td>td>
                                          <td style={{ padding: "10px 14px" }}>{contactStatusBadge(c.status)}</td>td>
                                          <td style={{ padding: "10px 14px", color: "#666", fontSize: 12 }}>{c.lastEmail}</td>td>
                          </tr>tr>
                        ))}
                                  </tbody>tbody>
                        </table>table>
                </div>div>
            {selectedContact && (
                    <div style={{ position: "fixed", top: 0, right: 0, width: 400, height: "100vh", backgroundColor: "#111", borderLeft: "1px solid #262626", zIndex: 1000, padding: 24, overflowY: "auto" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                          <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{selectedContact.name}</h3>h3>
                                          <button onClick={() => setSelectedContact(null)} style={{ background: "none", border: "none", color: "#666", fontSize: 20, cursor: "pointer" }}>x</button>button>
                              </div>div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                          <div style={{ backgroundColor: "#1a1a1a", borderRadius: 8, padding: 14 }}>
                                                        <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 4 }}>Empresa</div>div>
                                                        <div style={{ color: "#fff", fontSize: 14 }}>{selectedContact.company}</div>div>
                                          </div>div>
                                          <div style={{ backgroundColor: "#1a1a1a", borderRadius: 8, padding: 14 }}>
                                                        <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 4 }}>Industria</div>div>
                                                        <div style={{ color: "#fff", fontSize: 14 }}>{selectedContact.industry}</div>div>
                                          </div>div>
                                          <div style={{ backgroundColor: "#1a1a1a", borderRadius: 8, padding: 14 }}>
                                                        <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 4 }}>Secuencia</div>div>
                                                        <div style={{ color: "#fff", fontSize: 14 }}>{selectedContact.sequence} - {selectedContact.step}</div>div>
                                          </div>div>
                                          <div style={{ backgroundColor: "#1a1a1a", borderRadius: 8, padding: 14 }}>
                                                        <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 4 }}>Estado</div>div>
                                                        <div>{contactStatusBadge(selectedContact.status)}</div>div>
                                          </div>div>
                                          <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginTop: 8 }}>Timeline de emails</div>div>
                                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                            {["\u{1F4E7} Enviado", "\u{1F441}\uFE0F Abierto", "\u21A9\uFE0F Respondido"].map((label, i) => (
                                      <span key={i} style={{ backgroundColor: "#1a1a1a", padding: "4px 10px", borderRadius: 6, fontSize: 11, color: "#aaa" }}>{label}</span>span>
                                    ))}
                                          </div>div>
                                          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                                                        <button style={{ padding: "6px 16px", borderRadius: 6, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 12, cursor: "pointer" }}>Pausar</button>button>
                                                        <button style={{ padding: "6px 16px", borderRadius: 6, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 12, cursor: "pointer" }}>Cambiar secuencia</button>button>
                                                        <button style={{ padding: "6px 16px", borderRadius: 6, border: "1px solid #E53E3E", backgroundColor: "transparent", color: "#E53E3E", fontSize: 12, cursor: "pointer" }}>Mover a CRM</button>button>
                                                        <button style={{ padding: "6px 16px", borderRadius: 6, border: "1px solid #22C55E", backgroundColor: "transparent", color: "#22C55E", fontSize: 12, cursor: "pointer" }}>Marcar respondido</button>button>
                                          </div>div>
                              </div>div>
                    </div>div>
                )}
          </div>div>
        );
};

// ─── PLANTILLAS TAB ──────────────────────────────────
const PlantillasTab = () => {
    const [filter, setFilter] = useState("Todas");
    const [viewTemplate, setViewTemplate] = useState<Template | null>(null);
    const cats = ["Todas", "Prospeccion", "Follow-up", "Nurturing", "Cierre"];
    const filtered = filter === "Todas" ? templates : templates.filter((t) => t.category === filter);
    return (
          <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <div>
                                  <h2 style={{ color: "#fff", fontWeight: 700, fontSize: 16, margin: 0 }}>BIBLIOTECA DE PLANTILLAS</h2>h2>
                        </div>div>
                        <button style={{ padding: "6px 18px", borderRadius: 8, border: "none", backgroundColor: "#E53E3E", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Nueva Plantilla +</button>button>
                </div>div>
                <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                  {cats.map((c) => (
                      <button key={c} onClick={() => setFilter(c)} style={{ padding: "5px 14px", borderRadius: 20, border: filter === c ? "1px solid #E53E3E" : "1px solid #333", backgroundColor: filter === c ? "#E53E3E22" : "transparent", color: filter === c ? "#E53E3E" : "#999", fontSize: 12, cursor: "pointer" }}>{c}</button>button>
                    ))}
                </div>div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  {filtered.map((t) => (
                      <div key={t.id} style={{ backgroundColor: "#1a1a1a", borderRadius: 12, padding: 18, border: "1px solid #262626" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                                <span style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{t.name}</span>span>
                                                <span style={{ backgroundColor: t.categoryColor + "22", color: t.categoryColor, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 9999 }}>{t.category}</span>span>
                                  </div>div>
                                  <div style={{ color: "#aaa", fontSize: 12, marginBottom: 4 }}>Asunto: <HighlightVars text={t.subject} /></div>div>
                                  <p style={{ color: "#777", fontSize: 12, marginBottom: 10, lineHeight: 1.5 }}><HighlightVars text={t.preview} /></p>p>
                        {t.variables.length > 0 && (
                                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                                        {t.variables.map((v) => <span key={v} style={{ backgroundColor: "#2a1a1a", color: "#E53E3E", fontSize: 10, padding: "2px 6px", borderRadius: 4, fontFamily: "monospace" }}>{`{{${v}}}`}</span>span>)}
                                      </div>div>
                                  )}
                                  <div style={{ color: "#666", fontSize: 11, marginBottom: 10 }}>Usada en {t.usedIn} secuencias | Apertura: {t.openRate}</div>div>
                                  <div style={{ display: "flex", gap: 6 }}>
                                                <button onClick={() => setViewTemplate(t)} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 11, cursor: "pointer" }}>Ver completa</button>button>
                                                <button style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 11, cursor: "pointer" }}>Usar</button>button>
                                                <button style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 11, cursor: "pointer" }}>Editar</button>button>
                                  </div>div>
                      </div>div>
                    ))}
                </div>div>
            {viewTemplate && (
                    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setViewTemplate(null)}>
                              <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#1a1a1a", borderRadius: 16, padding: 28, width: 560, maxHeight: "80vh", overflowY: "auto", border: "1px solid #333" }}>
                                          <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{viewTemplate.name}</h3>h3>
                                          <div style={{ marginBottom: 12 }}>
                                                        <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 4 }}>Asunto</div>div>
                                                        <div style={{ backgroundColor: "#111", borderRadius: 8, padding: 12, color: "#fff", fontSize: 14 }}><HighlightVars text={viewTemplate.subject} /></div>div>
                                          </div>div>
                                          <div style={{ marginBottom: 12 }}>
                                                        <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 4 }}>Cuerpo</div>div>
                                                        <div style={{ backgroundColor: "#111", borderRadius: 8, padding: 14, color: "#ccc", fontSize: 13, lineHeight: 1.7 }}><HighlightVars text={viewTemplate.preview} /></div>div>
                                          </div>div>
                                          <div style={{ marginBottom: 16 }}>
                                                        <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 6 }}>Variables detectadas</div>div>
                                                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                                          {viewTemplate.variables.map((v) => <span key={v} style={{ backgroundColor: "#2a1a1a", color: "#E53E3E", fontSize: 12, padding: "4px 10px", borderRadius: 6, fontFamily: "monospace" }}>{`{{${v}}}`}</span>span>)}
                                                        </div>div>
                                          </div>div>
                                          <div style={{ display: "flex", gap: 8 }}>
                                                        <button onClick={() => setViewTemplate(null)} style={{ padding: "6px 18px", borderRadius: 8, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 13, cursor: "pointer" }}>Cerrar</button>button>
                                                        <button style={{ padding: "6px 18px", borderRadius: 8, border: "1px solid #333", backgroundColor: "transparent", color: "#ccc", fontSize: 13, cursor: "pointer" }}>Duplicar</button>button>
                                                        <button style={{ padding: "6px 18px", borderRadius: 8, border: "none", backgroundColor: "#E53E3E", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Usar en secuencia</button>button>
                                          </div>div>
                              </div>div>
                    </div>div>
                )}
          </div>div>
        );
};

// ─── MAIN COMPONENT ──────────────────────────────────
const EmailPage = () => {
    const [activeTab, setActiveTab] = useState<Tab>("secuencias");
  
    return (
          <div className="space-y-6">
            {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                                  <div className="flex items-center gap-3">
                                              <h1 className="text-2xl font-bold" style={{ color: "var(--nebu-text)" }}>
                                                            EMAIL AUTOMATION
                                              </h1>h1>
                                              <span className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#22C55E22", color: "#22C55E" }}>
                                                            <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#22C55E" }} />
                                                            Sistema activo
                                              </span>span>
                                  </div>div>
                                  <p className="text-sm mt-1" style={{ color: "var(--nebu-text-secondary)" }}>
                                              Secuencias de cold email &middot; Follow-ups &middot; Nurturing
                                  </p>p>
                        </div>div>
                        <button
                                    className="px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap"
                                    style={{ backgroundColor: "var(--nebu-accent)", color: "#fff" }}
                                  >
                                  Nueva Secuencia +
                        </button>button>
                </div>div>
          
            {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div style={{ backgroundColor: "#1a1a1a", borderRadius: 12, padding: 18, border: "1px solid #262626" }}>
                                  <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 6 }}>Emails enviados este mes</div>div>
                                  <div style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>127</div>div>
                                  <span style={{ color: "#22C55E", fontSize: 12 }}>&#8593; Tendencia positiva</span>span>
                        </div>div>
                        <div style={{ backgroundColor: "#1a1a1a", borderRadius: 12, padding: 18, border: "1px solid #262626" }}>
                                  <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 6 }}>Tasa de apertura</div>div>
                                  <div style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>38%</div>div>
                                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                              <span style={{ color: "#999", fontSize: 11 }}>Benchmark: 25%</span>span>
                                              <span style={{ backgroundColor: "#22C55E22", color: "#22C55E", fontSize: 10, padding: "2px 8px", borderRadius: 9999, fontWeight: 600 }}>&#10003; Sobre promedio</span>span>
                                  </div>div>
                        </div>div>
                        <div style={{ backgroundColor: "#1a1a1a", borderRadius: 12, padding: 18, border: "1px solid #262626" }}>
                                  <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 6 }}>Tasa de respuesta</div>div>
                                  <div style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>12%</div>div>
                                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                              <span style={{ color: "#999", fontSize: 11 }}>Benchmark: 8%</span>span>
                                              <span style={{ backgroundColor: "#22C55E22", color: "#22C55E", fontSize: 10, padding: "2px 8px", borderRadius: 9999, fontWeight: 600 }}>&#10003; Sobre promedio</span>span>
                                  </div>div>
                        </div>div>
                        <div style={{ backgroundColor: "#1a1a1a", borderRadius: 12, padding: 18, border: "1px solid #262626" }}>
                                  <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase", marginBottom: 6 }}>Reuniones generadas</div>div>
                                  <div style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>4</div>div>
                                  <span style={{ backgroundColor: "#E53E3E22", color: "#E53E3E", fontSize: 10, padding: "2px 8px", borderRadius: 9999, fontWeight: 600 }}>&#9889; Este mes</span>span>
                        </div>div>
                </div>div>
          
            {/* Tabs */}
                <div className="flex gap-0" style={{ borderBottom: "1px solid var(--nebu-border)" }}>
                  {tabList.map((t) => (
                      <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id)}
                                    className="px-5 py-2.5 text-sm font-medium transition-colors relative"
                                    style={{
                                                    color: activeTab === t.id ? "var(--nebu-text)" : "var(--nebu-text-secondary)",
                                    }}
                                  >
                        {t.label}
                        {activeTab === t.id && (
                                                  <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: "var(--nebu-accent)" }} />
                                                )}
                      </button>button>
                    ))}
                </div>div>
          
            {/* Tab content */}
            {activeTab === "secuencias" && <SecuenciasTab />}
            {activeTab === "contactos" && <ContactosTab />}
            {activeTab === "plantillas" && <PlantillasTab />}
          </div>div>
        );
};

export default EmailPage;</>
