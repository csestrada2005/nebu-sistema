import { useState, useRef, useEffect } from "react";
import { Bot, MessageSquare, Settings, ChevronDown, ChevronUp, Check, X, Pencil, AlertTriangle, FileText, Users, BarChart3, Globe, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type TaskStatus = "pending" | "approved" | "cancelled" | "modified";
type TabId = "tareas" | "historial" | "config" | "chat";

interface ChatMessage {
  id: number;
  role: "user" | "novy";
  text: Record<"es" | "en", string>;
  time: string;
}

const MOCK_CHAT: ChatMessage[] = [
  { id: 1, role: "user", text: { es: "NOVY, ¿cuántos prospectos tenemos esta semana?", en: "NOVY, how many prospects do we have this week?" }, time: "10:15" },
  { id: 2, role: "novy", text: { es: "Tienes 5 prospectos activos: 2 nuevos contactos, 2 en reunión agendada y 1 en negociación. El de mayor valor es Estudio Legal Vega ($55,000 MXN) en etapa de negociación — lleva 5 días, aún en zona verde.", en: "You have 5 active prospects: 2 new contacts, 2 with scheduled meetings and 1 in negotiation. The highest value is Estudio Legal Vega ($55,000 MXN) in negotiation stage — 5 days in, still in the green zone." }, time: "10:15" },
  { id: 3, role: "user", text: { es: "¿Algún proyecto en riesgo?", en: "Any project at risk?" }, time: "10:18" },
  { id: 4, role: "novy", text: { es: "⚠ Sí, dos proyectos requieren atención:\n\n— Papachoa — VENCIDA desde 10 Feb 2026. Anticipo de $11,250 pagado pero el proyecto lleva retraso. Recomiendo contactar a Miriam hoy.\n— Bazar Centenario — VENCIDA desde 23 Feb 2026. Saldo pendiente: $12,500 MXN. Iñigo espera update.\n\nRaw Paw está en revisión cliente, sin alertas.", en: "⚠ Yes, two projects need attention:\n\n— Papachoa — OVERDUE since Feb 10, 2026. Advance of $11,250 paid but project is delayed. I recommend contacting Miriam today.\n— Bazar Centenario — OVERDUE since Feb 23, 2026. Pending balance: $12,500 MXN. Iñigo is waiting for an update.\n\nRaw Paw is in client review, no alerts." }, time: "10:18" },
  { id: 5, role: "user", text: { es: "Redacta un mensaje para Miriam de Papachoa", en: "Draft a message for Miriam from Papachoa" }, time: "10:22" },
  { id: 6, role: "novy", text: { es: "Listo. Borrador:\n\n\"Hola Miriam, te escribo para darte un update de tu proyecto. Estamos avanzando en la etapa de diseño y quiero alinear contigo los próximos pasos para no perder ritmo. ¿Tienes 15 minutos esta semana para una llamada rápida?\n\nJosep — Nebu Studio\"\n\n¿Apruebas, modificas o cancelas?", en: "Done. Draft:\n\n\"Hi Miriam, I'm writing to give you a project update. We're progressing on the design phase and I want to align with you on next steps to keep momentum. Do you have 15 minutes this week for a quick call?\n\nJosep — Nebu Studio\"\n\nApprove, modify, or cancel?" }, time: "10:22" },
];

interface Task {
  id: number; category: string; categoryColor: string;
  title: Record<"es"|"en",string>; description: Record<"es"|"en",string>; preview: string;
  time: Record<"es"|"en",string>; status: TaskStatus;
  approveLabel?: Record<"es"|"en",string>; modifyLabel?: Record<"es"|"en",string>;
}

const INITIAL_TASKS: Task[] = [
  { id: 1, category: "LinkedIn", categoryColor: "#3b82f6",
    title: { es: "Enviar mensaje inicial a Roberto Sánchez", en: "Send initial message to Roberto Sánchez" },
    description: { es: "Roberto aceptó tu solicitud hace 2 días. NOVY preparó el mensaje personalizado basado en su perfil de constructora.", en: "Roberto accepted your request 2 days ago. NOVY prepared a personalized message based on his construction company profile." },
    preview: "Hola Roberto, noté que Constructora SB no tiene presencia web profesional...", time: { es: "hace 12 min", en: "12 min ago" }, status: "pending" },
  { id: 2, category: "LinkedIn", categoryColor: "#3b82f6",
    title: { es: "Follow-up a Ana Rodríguez (5 días sin respuesta)", en: "Follow-up Ana Rodríguez (5 days no reply)" },
    description: { es: "Han pasado 5 días desde el primer mensaje. NOVY sugiere un follow-up breve.", en: "5 days since first message. NOVY suggests a brief follow-up." },
    preview: "Hola Ana, quería retomar mi mensaje anterior...", time: { es: "hace 25 min", en: "25 min ago" }, status: "pending" },
  { id: 3, category: "Proyectos", categoryColor: "#f97316",
    title: { es: "⚠️ BAZAR CENTENARIO — Deadline vencido hace 7 días", en: "⚠️ BAZAR CENTENARIO — Deadline overdue by 7 days" },
    description: { es: "La entrega estimada era 23/02/2026. NOVY redactó un mensaje de actualización para Iñigo.", en: "Estimated delivery was 23/02/2026. NOVY drafted an update message for Iñigo." },
    preview: "Hola Iñigo, te escribo para darte un update del proyecto...", time: { es: "hace 1 hora", en: "1 hour ago" }, status: "pending" },
  { id: 4, category: "Finanzas", categoryColor: "#ef4444",
    title: { es: "⚠️ PAPACHOA — Sin anticipo pagado desde 06/02", en: "⚠️ PAPACHOA — No advance payment since 06/02" },
    description: { es: "Miriam no ha pagado el anticipo de $15,000 MXN.", en: "Miriam has not paid the $15,000 MXN advance." },
    preview: "Hola Miriam, te recuerdo que para continuar con el proyecto...", time: { es: "hace 2 horas", en: "2 hours ago" }, status: "pending" },
  { id: 5, category: "Contenido", categoryColor: "#8b5cf6",
    title: { es: "Publicar post de caso de éxito: RAWPAW", en: "Publish success story post: RAWPAW" },
    description: { es: "Lunes 03/03 es el día programado para el post de caso de éxito.", en: "Monday 03/03 is the scheduled day for the success story post." },
    preview: "🚀 Caso real: RAWPAW — de Excel a un sistema de pedidos inteligente...", time: { es: "hace 3 horas", en: "3 hours ago" }, status: "pending" },
  { id: 6, category: "Análisis", categoryColor: "#ec4899",
    title: { es: "Análisis web completado: Clínica Dental Sonrisa", en: "Web analysis completed: Clínica Dental Sonrisa" },
    description: { es: "NOVY analizó la web del prospecto Carlos M. y encontró 6 problemas críticos.", en: "NOVY analyzed prospect Carlos M.'s website and found 6 critical issues." },
    preview: "Problemas detectados:\n• Sin HTTPS\n• Sin CTA visible\n• Velocidad mobile: 34/100...", time: { es: "hace 4 horas", en: "4 hours ago" }, status: "pending",
    approveLabel: { es: "Usar en propuesta", en: "Use in proposal" }, modifyLabel: { es: "Ver análisis completo", en: "View full analysis" } },
  { id: 7, category: "CRM", categoryColor: "#22c55e",
    title: { es: "Registrar nuevo lead: Diana K. — Coach de Negocios", en: "Register new lead: Diana K. — Business Coach" },
    description: { es: "Diana respondió positivamente y agendó llamada.", en: "Diana responded positively and scheduled a call." },
    preview: "Nombre: Diana K.\nEmpresa: Coach de Negocios\nServicio de interés: Landing Page...", time: { es: "hace 5 horas", en: "5 hours ago" }, status: "pending",
    approveLabel: { es: "Registrar en CRM", en: "Register in CRM" } },
];

const HISTORY = [
  { date: "28/02", category: "LinkedIn", task: { es: "Follow-up Miguel T.", en: "Follow-up Miguel T." }, status: "approved" as const, by: "Josep" },
  { date: "27/02", category: "Finanzas", task: { es: "Recordatorio BAZAR anticipo", en: "BAZAR advance reminder" }, status: "modified" as const, by: "Josep" },
  { date: "25/02", category: "Contenido", task: { es: "Post tip Google Maps", en: "Google Maps tip post" }, status: "approved" as const, by: "Josep" },
  { date: "24/02", category: "LinkedIn", task: { es: "Mensaje inicial Ana R.", en: "Initial message Ana R." }, status: "approved" as const, by: "Josep" },
  { date: "22/02", category: "Proyectos", task: { es: "Update semanal RAWPAW", en: "RAWPAW weekly update" }, status: "cancelled" as const, by: "Josep" },
];

const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case "LinkedIn": return <MessageSquare size={16} />;
    case "Proyectos": return <AlertTriangle size={16} />;
    case "Finanzas": return <BarChart3 size={16} />;
    case "Contenido": return <FileText size={16} />;
    case "Análisis": return <Globe size={16} />;
    case "CRM": return <Users size={16} />;
    default: return <Bot size={16} />;
  }
};

const NovyPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("tareas");
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [historyFilter, setHistoryFilter] = useState("all");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHAT);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [chatMessages]);

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = { id: Date.now(), role: "user", text: { es: chatInput, en: chatInput }, time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput("");
    setTimeout(() => {
      const reply: ChatMessage = { id: Date.now() + 1, role: "novy", text: { es: "Entendido. Déjame procesarlo — esta funcionalidad se conectará al backend pronto.", en: "Got it. Let me process that — this feature will connect to the backend soon." }, time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) };
      setChatMessages(prev => [...prev, reply]);
    }, 1200);
  };
  const { lang } = useLanguage();

  const pendingCount = tasks.filter((t) => t.status === "pending" || t.status === "modified").length;

  const handleApprove = (id: number) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "approved" as TaskStatus } : t)));
  const handleCancel = (id: number) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "cancelled" as TaskStatus } : t)));
  const handleModify = (id: number) => { const task = tasks.find((t) => t.id === id); if (task) { setEditingTask(id); setEditText(task.preview.replace(/\\n/g, "\n")); setExpandedTask(id); } };
  const handleSaveEdit = (id: number) => { setTasks((prev) => prev.map((t) => t.id === id ? { ...t, preview: editText.replace(/\n/g, "\\n"), status: "modified" as TaskStatus } : t)); setEditingTask(null); };

  const tt = {
    es: {
      analyzing: "● Analizando...", agentSub: "Agente IA · Nebu Studio · v1.0",
      pendingAuth: "tareas pendientes de autorización",
      tabs: [{ id: "tareas" as TabId, label: "Tareas Pendientes" }, { id: "chat" as TabId, label: "Chat" }, { id: "historial" as TabId, label: "Historial" }, { id: "config" as TabId, label: "Configuración" }],
      detected: "NOVY detectó estas acciones. Revisa, modifica o aprueba cada una.",
      hidePreview: "Ocultar vista previa", showPreview: "Ver vista previa",
      modify: "Modificar", approve: "Aprobar", cancel: "Cancelar",
      saveChanges: "Guardar cambios", cancelEdit: "Cancelar edición",
      approved: "✓ APROBADO", cancelled: "✗ CANCELADA", modified: "✏️ MODIFICADA · Pendiente aprobar", pending: "PENDIENTE",
      approvedMsg: "Tarea aprobada · Ejecutará cuando se conecte al sistema",
      cancelledMsg: "Tarea cancelada por Josep",
      filterAll: "Todas", filterApproved: "Aprobadas", filterCancelled: "Canceladas", filterModified: "Modificadas",
      histHeaders: ["Fecha", "Categoría", "Tarea", "Estado", "Aprobada por"],
      histApproved: "✓ Aprobada", histCancelled: "✗ Cancelada", histModified: "✏️ Modificada",
      configTitle: "CONFIGURACIÓN DE NOVY", activeAgents: "AGENTES ACTIVOS", prefs: "PREFERENCIAS",
      agents: [{ name: "Agente LinkedIn", on: true }, { name: "Agente Análisis Web", on: true }, { name: "Agente Correos", on: false, badge: "Próximamente" }, { name: "Agente Cotizaciones", on: true }, { name: "Agente Proyectos", on: true }, { name: "Agente Contenido", on: true }],
      prefItems: [{ label: "Notificar tareas nuevas", type: "toggle", value: true }, { label: "Frecuencia de análisis", type: "select", value: "Diaria" }, { label: "Idioma de comunicación", type: "select", value: "Español" }, { label: "Firma en mensajes", type: "text", value: "Josep — Nebu Studio" }],
      aboutTitle: "SOBRE NOVY",
      aboutText: "NOVY es el agente de IA de Nebu Studio. Analiza prospectos, detecta oportunidades, redacta mensajes, monitorea proyectos y genera contenido. Nunca actúa sin tu aprobación.",
      version: "Versión: 1.0 MVP · Modo: Frontend Demo", backend: "Conexión backend: Pendiente (Mac Mini + OpenClaw)",
    },
    en: {
      analyzing: "● Analyzing...", agentSub: "AI Agent · Nebu Studio · v1.0",
      pendingAuth: "tasks pending authorization",
      tabs: [{ id: "tareas" as TabId, label: "Pending Tasks" }, { id: "historial" as TabId, label: "History" }, { id: "config" as TabId, label: "Settings" }],
      detected: "NOVY detected these actions. Review, modify, or approve each one.",
      hidePreview: "Hide preview", showPreview: "View preview",
      modify: "Modify", approve: "Approve", cancel: "Cancel",
      saveChanges: "Save changes", cancelEdit: "Cancel editing",
      approved: "✓ APPROVED", cancelled: "✗ CANCELLED", modified: "✏️ MODIFIED · Pending approval", pending: "PENDING",
      approvedMsg: "Task approved · Will execute when connected to system",
      cancelledMsg: "Task cancelled by Josep",
      filterAll: "All", filterApproved: "Approved", filterCancelled: "Cancelled", filterModified: "Modified",
      histHeaders: ["Date", "Category", "Task", "Status", "Approved by"],
      histApproved: "✓ Approved", histCancelled: "✗ Cancelled", histModified: "✏️ Modified",
      configTitle: "NOVY SETTINGS", activeAgents: "ACTIVE AGENTS", prefs: "PREFERENCES",
      agents: [{ name: "LinkedIn Agent", on: true }, { name: "Web Analysis Agent", on: true }, { name: "Email Agent", on: false, badge: "Coming soon" }, { name: "Quotes Agent", on: true }, { name: "Projects Agent", on: true }, { name: "Content Agent", on: true }],
      prefItems: [{ label: "Notify new tasks", type: "toggle", value: true }, { label: "Analysis frequency", type: "select", value: "Daily" }, { label: "Communication language", type: "select", value: "English" }, { label: "Message signature", type: "text", value: "Josep — Nebu Studio" }],
      aboutTitle: "ABOUT NOVY",
      aboutText: "NOVY is Nebu Studio's AI agent. It analyzes prospects, detects opportunities, drafts messages, monitors projects and generates content. It never acts without your approval.",
      version: "Version: 1.0 MVP · Mode: Frontend Demo", backend: "Backend connection: Pending (Mac Mini + OpenClaw)",
    },
  }[lang];

  const getStatusLabel = (s: TaskStatus) => s === "approved" ? tt.approved : s === "cancelled" ? tt.cancelled : s === "modified" ? tt.modified : tt.pending;
  const getStatusColor = (s: TaskStatus) => s === "approved" ? "#22c55e" : s === "cancelled" ? "#888" : s === "modified" ? "#f59e0b" : "#888";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #1a1a1a, #2a2a2a)", border: "2px solid #E53E3E" }}>
            <Bot size={28} style={{ color: "#E53E3E" }} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">NOVY</h1>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium animate-pulse" style={{ backgroundColor: "rgba(229,62,62,0.15)", color: "#E53E3E" }}>{tt.analyzing}</span>
            </div>
            <p style={{ color: "#888888" }} className="text-sm">{tt.agentSub}</p>
          </div>
        </div>
        <div className="text-sm px-4 py-2 rounded-md" style={{ backgroundColor: "rgba(229,62,62,0.1)", color: "#E53E3E", border: "1px solid rgba(229,62,62,0.2)" }}>
          <strong>{pendingCount}</strong> {tt.pendingAuth}
        </div>
      </div>

      <div className="flex gap-1" style={{ borderBottom: "1px solid #2a2a2a" }}>
        {tt.tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="px-4 py-2.5 text-sm font-medium transition-colors"
            style={{ color: activeTab === tab.id ? "#E53E3E" : "#888888", borderBottom: activeTab === tab.id ? "2px solid #E53E3E" : "2px solid transparent" }}>{tab.label}</button>
        ))}
      </div>

      {activeTab === "tareas" && (
        <div className="space-y-4">
          <p className="text-sm" style={{ color: "#888888" }}>{tt.detected}</p>
          {tasks.map((task) => {
            const isExpanded = expandedTask === task.id;
            const isEditing = editingTask === task.id;
            const statusBg = task.status === "approved" ? "rgba(34,197,94,0.08)" : task.status === "cancelled" ? "rgba(100,100,100,0.08)" : "#1a1a1a";
            const statusBorder = task.status === "approved" ? "#22c55e" : task.status === "cancelled" ? "#555" : task.categoryColor;
            return (
              <div key={task.id} className="rounded-lg overflow-hidden transition-all duration-200" style={{ backgroundColor: statusBg, border: "1px solid #2a2a2a", borderLeftWidth: "4px", borderLeftColor: statusBorder }}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs" style={{ color: "#888" }}><Bot size={14} style={{ color: "#E53E3E" }} /><span>NOVY · {task.time[lang]}</span></div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ color: getStatusColor(task.status), backgroundColor: `${getStatusColor(task.status)}15` }}>{getStatusLabel(task.status)}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ color: task.categoryColor }}>{getCategoryIcon(task.category)}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ color: task.categoryColor, backgroundColor: `${task.categoryColor}15` }}>{task.category}</span>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{task.title[lang]}</h3>
                  <p className="text-xs mb-3" style={{ color: "#888" }}>{task.description[lang]}</p>
                  <button onClick={() => setExpandedTask(isExpanded ? null : task.id)} className="flex items-center gap-1 text-xs mb-3 transition-colors" style={{ color: "#E53E3E" }}>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}{isExpanded ? tt.hidePreview : tt.showPreview}
                  </button>
                  {isExpanded && (
                    <div className="rounded-md p-3 mb-3 text-sm whitespace-pre-line" style={{ backgroundColor: "#0a0a0a", color: "#ccc", border: "1px solid #2a2a2a" }}>
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full bg-transparent text-sm text-white outline-none resize-none min-h-[120px]" style={{ border: "1px solid #E53E3E", borderRadius: "6px", padding: "8px" }} />
                          <div className="flex gap-2">
                            <button onClick={() => handleSaveEdit(task.id)} className="text-xs px-3 py-1.5 rounded font-medium" style={{ backgroundColor: "#E53E3E", color: "white" }}>{tt.saveChanges}</button>
                            <button onClick={() => setEditingTask(null)} className="text-xs px-3 py-1.5 rounded font-medium" style={{ backgroundColor: "#2a2a2a", color: "#888" }}>{tt.cancelEdit}</button>
                          </div>
                        </div>
                      ) : task.preview.replace(/\\n/g, "\n")}
                    </div>
                  )}
                  {task.status === "pending" || task.status === "modified" ? (
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => handleModify(task.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded font-medium transition-colors" style={{ backgroundColor: "#2a2a2a", color: "#ccc" }}>
                        <Pencil size={12} /> {task.modifyLabel?.[lang] || tt.modify}
                      </button>
                      <button onClick={() => handleApprove(task.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded font-medium transition-colors" style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                        <Check size={12} /> {task.approveLabel?.[lang] || tt.approve}
                      </button>
                      <button onClick={() => handleCancel(task.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded font-medium transition-colors" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
                        <X size={12} /> {tt.cancel}
                      </button>
                    </div>
                  ) : task.status === "approved" ? (
                    <p className="text-xs" style={{ color: "#22c55e" }}>{tt.approvedMsg}</p>
                  ) : <p className="text-xs" style={{ color: "#888" }}>{tt.cancelledMsg}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "historial" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {[{ key: "all", label: tt.filterAll }, { key: "approved", label: tt.filterApproved }, { key: "cancelled", label: tt.filterCancelled }, { key: "modified", label: tt.filterModified }].map((f) => (
              <button key={f.key} onClick={() => setHistoryFilter(f.key)} className="text-xs px-3 py-1.5 rounded font-medium transition-colors"
                style={{ backgroundColor: historyFilter === f.key ? "#E53E3E" : "#1a1a1a", color: historyFilter === f.key ? "white" : "#888", border: "1px solid #2a2a2a" }}>{f.label}</button>
            ))}
          </div>
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #2a2a2a" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#111", borderBottom: "1px solid #2a2a2a" }}>
                  {tt.histHeaders.map((h) => (<th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#E53E3E" }}>{h}</th>))}
                </tr>
              </thead>
              <tbody>
                {HISTORY.filter((h) => historyFilter === "all" || h.status === historyFilter).map((h, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #1a1a1a" }}>
                    <td className="px-4 py-3 text-xs" style={{ color: "#888" }}>{h.date}</td>
                    <td className="px-4 py-3 text-xs text-white">{h.category}</td>
                    <td className="px-4 py-3 text-xs text-white">{h.task[lang]}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={{
                        color: h.status === "approved" ? "#22c55e" : h.status === "cancelled" ? "#ef4444" : "#f59e0b",
                        backgroundColor: h.status === "approved" ? "rgba(34,197,94,0.1)" : h.status === "cancelled" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
                      }}>{h.status === "approved" ? tt.histApproved : h.status === "cancelled" ? tt.histCancelled : tt.histModified}</span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#888" }}>{h.by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "config" && (
        <div className="space-y-6">
          <h2 className="text-sm font-bold tracking-wider" style={{ color: "#E53E3E" }}>{tt.configTitle}</h2>
          <div className="rounded-lg p-5 space-y-4" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
            <h3 className="text-sm font-semibold text-white">{tt.activeAgents}</h3>
            {tt.agents.map((agent, i) => (
              <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #2a2a2a" }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white">{agent.name}</span>
                  {agent.badge && <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: "#2a2a2a", color: "#888" }}>{agent.badge}</span>}
                </div>
                <div className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors" style={{ backgroundColor: agent.on ? "#22c55e" : "#333" }}>
                  <div className="w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: agent.on ? "translateX(20px)" : "translateX(0px)" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg p-5 space-y-4" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
            <h3 className="text-sm font-semibold text-white">{tt.prefs}</h3>
            {tt.prefItems.map((pref, i) => (
              <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #2a2a2a" }}>
                <span className="text-sm text-white">{pref.label}</span>
                {pref.type === "toggle" ? (
                  <div className="w-10 h-5 rounded-full flex items-center px-0.5" style={{ backgroundColor: pref.value ? "#22c55e" : "#333" }}>
                    <div className="w-4 h-4 rounded-full bg-white" style={{ transform: pref.value ? "translateX(20px)" : "translateX(0px)" }} />
                  </div>
                ) : pref.type === "select" ? (
                  <span className="text-xs px-3 py-1 rounded" style={{ backgroundColor: "#2a2a2a", color: "#ccc" }}>{pref.value} ▾</span>
                ) : <span className="text-xs" style={{ color: "#ccc" }}>{pref.value}</span>}
              </div>
            ))}
          </div>
          <div className="rounded-lg p-5" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
            <h3 className="text-sm font-semibold text-white mb-3">{tt.aboutTitle}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#888" }}>{tt.aboutText}</p>
            <div className="mt-3 space-y-1">
              <p className="text-xs" style={{ color: "#555" }}>{tt.version}</p>
              <p className="text-xs" style={{ color: "#555" }}>{tt.backend}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NovyPage;
