import { useState } from "react";
import { Bot, MessageSquare, Settings, ChevronDown, ChevronUp, Check, X, Pencil, AlertTriangle, FileText, Users, BarChart3, Globe } from "lucide-react";

type TaskStatus = "pending" | "approved" | "cancelled" | "modified";
type TabId = "tareas" | "historial" | "config";

interface Task {
  id: number;
  category: string;
  categoryColor: string;
  title: string;
  description: string;
  preview: string;
  time: string;
  status: TaskStatus;
  approveLabel?: string;
  modifyLabel?: string;
}

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    category: "LinkedIn",
    categoryColor: "#3b82f6",
    title: 'Enviar mensaje inicial a Roberto Sánchez',
    description: 'Roberto aceptó tu solicitud hace 2 días. NOVY preparó el mensaje personalizado basado en su perfil de constructora.',
    preview: 'Hola Roberto, noté que Constructora SB no tiene presencia web profesional. En Nebu Studio hemos ayudado a constructoras a generar leads calificados desde su sitio. ¿Tienes 10 min esta semana para una llamada rápida?',
    time: "hace 12 min",
    status: "pending",
  },
  {
    id: 2,
    category: "LinkedIn",
    categoryColor: "#3b82f6",
    title: 'Follow-up a Ana Rodríguez (5 días sin respuesta)',
    description: 'Han pasado 5 días desde el primer mensaje. NOVY sugiere un follow-up breve según el protocolo de Nebu Studio.',
    preview: 'Hola Ana, quería retomar mi mensaje anterior. ¿Tuviste oportunidad de revisarlo? Quedo al pendiente.',
    time: "hace 25 min",
    status: "pending",
  },
  {
    id: 3,
    category: "Proyectos",
    categoryColor: "#f97316",
    title: '⚠️ BAZAR CENTENARIO — Deadline vencido hace 7 días',
    description: 'La entrega estimada era 23/02/2026. NOVY redactó un mensaje de actualización para Iñigo.',
    preview: 'Hola Iñigo, te escribo para darte un update del proyecto. Esta semana completamos [X]. La entrega estimada se ajusta a [nueva fecha]. ¿Tienes disponibilidad para una llamada rápida?',
    time: "hace 1 hora",
    status: "pending",
  },
  {
    id: 4,
    category: "Finanzas",
    categoryColor: "#ef4444",
    title: '⚠️ PAPACHOA — Sin anticipo pagado desde 06/02',
    description: 'Miriam no ha pagado el anticipo de $15,000 MXN. NOVY preparó un mensaje de recordatorio de cobro por WhatsApp.',
    preview: 'Hola Miriam, te recuerdo que para continuar con el proyecto PAPACHOA necesitamos confirmar el anticipo de $15,000 MXN. ¿Podemos coordinarlo hoy? 🙏',
    time: "hace 2 horas",
    status: "pending",
  },
  {
    id: 5,
    category: "Contenido",
    categoryColor: "#8b5cf6",
    title: 'Publicar post de caso de éxito: RAWPAW',
    description: 'Lunes 03/03 es el día programado para el post de caso de éxito. NOVY lo tiene listo para publicar.',
    preview: '🚀 Caso real: RAWPAW — de Excel a un sistema de pedidos inteligente\n\nCuando conocí a los fundadores de RAWPAW (alimento BARF premium), su proceso era:\n📱 Pedidos por WhatsApp\n📊 Control en Excel\n😰 Errores en entregas cada semana\n\nLo que construimos:\n• Sistema de pedidos online con suscripción recurrente\n• Dashboard de control de inventario\n• Notificaciones automáticas de entrega\n\n#TransformaciónDigital #RAWPAW #NebStudio',
    time: "hace 3 horas",
    status: "pending",
  },
  {
    id: 6,
    category: "Análisis",
    categoryColor: "#ec4899",
    title: 'Análisis web completado: Clínica Dental Sonrisa',
    description: 'NOVY analizó la web del prospecto Carlos M. y encontró 6 problemas críticos de conversión.',
    preview: 'Problemas detectados:\n• Sin HTTPS → pérdida de confianza\n• Sin CTA visible above the fold\n• Velocidad mobile: 34/100 (Lighthouse)\n• Sin Google Maps embebido\n• Sin formulario de contacto\n• Sin precios ni servicios claros\n\nOportunidad: Web completa + SEO local → $25,000–$35,000 MXN',
    time: "hace 4 horas",
    status: "pending",
    approveLabel: "Usar en propuesta",
    modifyLabel: "Ver análisis completo",
  },
  {
    id: 7,
    category: "CRM",
    categoryColor: "#22c55e",
    title: 'Registrar nuevo lead: Diana K. — Coach de Negocios',
    description: 'Diana respondió positivamente y agendó llamada. NOVY tiene los datos listos para registrarla en el CRM.',
    preview: 'Nombre: Diana K.\nEmpresa: Coach de Negocios\nServicio de interés: Landing Page de Ventas\nPresupuesto estimado: $20,000–$35,000 MXN\nPaso funnel: 03 — Cuestionario de Inicio\nPróximo paso: Llamada jueves 10am',
    time: "hace 5 horas",
    status: "pending",
    approveLabel: "Registrar en CRM",
  },
];

const HISTORY = [
  { date: "28/02", category: "LinkedIn", task: "Follow-up Miguel T.", status: "approved" as const, by: "Josep" },
  { date: "27/02", category: "Finanzas", task: "Recordatorio BAZAR anticipo", status: "modified" as const, by: "Josep" },
  { date: "25/02", category: "Contenido", task: "Post tip Google Maps", status: "approved" as const, by: "Josep" },
  { date: "24/02", category: "LinkedIn", task: "Mensaje inicial Ana R.", status: "approved" as const, by: "Josep" },
  { date: "22/02", category: "Proyectos", task: "Update semanal RAWPAW", status: "cancelled" as const, by: "Josep" },
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

  const pendingCount = tasks.filter((t) => t.status === "pending" || t.status === "modified").length;

  const handleApprove = (id: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "approved" as TaskStatus } : t)));
  };

  const handleCancel = (id: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "cancelled" as TaskStatus } : t)));
  };

  const handleModify = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setEditingTask(id);
      setEditText(task.preview.replace(/\\n/g, "\n"));
      setExpandedTask(id);
    }
  };

  const handleSaveEdit = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, preview: editText.replace(/\n/g, "\\n"), status: "modified" as TaskStatus } : t
      )
    );
    setEditingTask(null);
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "tareas", label: "Tareas Pendientes" },
    { id: "historial", label: "Historial" },
    { id: "config", label: "Configuración" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #1a1a1a, #2a2a2a)", border: "2px solid #E53E3E" }}
          >
            <Bot size={28} style={{ color: "#E53E3E" }} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">NOVY</h1>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium animate-pulse"
                style={{ backgroundColor: "rgba(229,62,62,0.15)", color: "#E53E3E" }}
              >
                ● Analizando...
              </span>
            </div>
            <p style={{ color: "#888888" }} className="text-sm">
              Agente IA · Nebu Studio · v1.0
            </p>
          </div>
        </div>
        <div
          className="text-sm px-4 py-2 rounded-md"
          style={{ backgroundColor: "rgba(229,62,62,0.1)", color: "#E53E3E", border: "1px solid rgba(229,62,62,0.2)" }}
        >
          <strong>{pendingCount}</strong> tareas pendientes de autorización
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1" style={{ borderBottom: "1px solid #2a2a2a" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2.5 text-sm font-medium transition-colors"
            style={{
              color: activeTab === tab.id ? "#E53E3E" : "#888888",
              borderBottom: activeTab === tab.id ? "2px solid #E53E3E" : "2px solid transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Tareas Pendientes */}
      {activeTab === "tareas" && (
        <div className="space-y-4">
          <p className="text-sm" style={{ color: "#888888" }}>
            NOVY detectó estas acciones. Revisa, modifica o aprueba cada una.
          </p>
          {tasks.map((task) => {
            const isExpanded = expandedTask === task.id;
            const isEditing = editingTask === task.id;
            const statusBg =
              task.status === "approved"
                ? "rgba(34,197,94,0.08)"
                : task.status === "cancelled"
                ? "rgba(100,100,100,0.08)"
                : "#1a1a1a";
            const statusBorder =
              task.status === "approved"
                ? "#22c55e"
                : task.status === "cancelled"
                ? "#555"
                : task.categoryColor;
            const statusLabel =
              task.status === "approved"
                ? "✓ APROBADO"
                : task.status === "cancelled"
                ? "✗ CANCELADA"
                : task.status === "modified"
                ? "✏️ MODIFICADA · Pendiente aprobar"
                : "PENDIENTE";
            const statusColor =
              task.status === "approved"
                ? "#22c55e"
                : task.status === "cancelled"
                ? "#888"
                : task.status === "modified"
                ? "#f59e0b"
                : "#888";

            return (
              <div
                key={task.id}
                className="rounded-lg overflow-hidden transition-all duration-200"
                style={{
                  backgroundColor: statusBg,
                  borderLeft: `4px solid ${statusBorder}`,
                  border: `1px solid #2a2a2a`,
                  borderLeftWidth: "4px",
                  borderLeftColor: statusBorder,
                }}
              >
                <div className="p-4">
                  {/* Task header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs" style={{ color: "#888" }}>
                      <Bot size={14} style={{ color: "#E53E3E" }} />
                      <span>NOVY · {task.time}</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ color: statusColor, backgroundColor: `${statusColor}15` }}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Category + Title */}
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ color: task.categoryColor }}>{getCategoryIcon(task.category)}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ color: task.categoryColor, backgroundColor: `${task.categoryColor}15` }}>
                      {task.category}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{task.title}</h3>
                  <p className="text-xs mb-3" style={{ color: "#888" }}>{task.description}</p>

                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                    className="flex items-center gap-1 text-xs mb-3 transition-colors"
                    style={{ color: "#E53E3E" }}
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {isExpanded ? "Ocultar vista previa" : "Ver vista previa"}
                  </button>

                  {/* Preview content */}
                  {isExpanded && (
                    <div className="rounded-md p-3 mb-3 text-sm whitespace-pre-line" style={{ backgroundColor: "#0a0a0a", color: "#ccc", border: "1px solid #2a2a2a" }}>
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-transparent text-sm text-white outline-none resize-none min-h-[120px]"
                            style={{ border: "1px solid #E53E3E", borderRadius: "6px", padding: "8px" }}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(task.id)}
                              className="text-xs px-3 py-1.5 rounded font-medium"
                              style={{ backgroundColor: "#E53E3E", color: "white" }}
                            >
                              Guardar cambios
                            </button>
                            <button
                              onClick={() => setEditingTask(null)}
                              className="text-xs px-3 py-1.5 rounded font-medium"
                              style={{ backgroundColor: "#2a2a2a", color: "#888" }}
                            >
                              Cancelar edición
                            </button>
                          </div>
                        </div>
                      ) : (
                        task.preview.replace(/\\n/g, "\n")
                      )}
                    </div>
                  )}

                  {/* Action buttons */}
                  {task.status === "pending" || task.status === "modified" ? (
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleModify(task.id)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded font-medium transition-colors"
                        style={{ backgroundColor: "#2a2a2a", color: "#ccc" }}
                      >
                        <Pencil size={12} /> {task.modifyLabel || "Modificar"}
                      </button>
                      <button
                        onClick={() => handleApprove(task.id)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded font-medium transition-colors"
                        style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e" }}
                      >
                        <Check size={12} /> {task.approveLabel || "Aprobar"}
                      </button>
                      <button
                        onClick={() => handleCancel(task.id)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded font-medium transition-colors"
                        style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                      >
                        <X size={12} /> Cancelar
                      </button>
                    </div>
                  ) : task.status === "approved" ? (
                    <p className="text-xs" style={{ color: "#22c55e" }}>
                      Tarea aprobada · Ejecutará cuando se conecte al sistema
                    </p>
                  ) : (
                    <p className="text-xs" style={{ color: "#888" }}>
                      Tarea cancelada por Josep
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Historial */}
      {activeTab === "historial" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {["all", "approved", "cancelled", "modified"].map((f) => (
              <button
                key={f}
                onClick={() => setHistoryFilter(f)}
                className="text-xs px-3 py-1.5 rounded font-medium transition-colors"
                style={{
                  backgroundColor: historyFilter === f ? "#E53E3E" : "#1a1a1a",
                  color: historyFilter === f ? "white" : "#888",
                  border: "1px solid #2a2a2a",
                }}
              >
                {f === "all" ? "Todas" : f === "approved" ? "Aprobadas" : f === "cancelled" ? "Canceladas" : "Modificadas"}
              </button>
            ))}
          </div>

          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #2a2a2a" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#111", borderBottom: "1px solid #2a2a2a" }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#E53E3E" }}>Fecha</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#E53E3E" }}>Categoría</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#E53E3E" }}>Tarea</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#E53E3E" }}>Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#E53E3E" }}>Aprobada por</th>
                </tr>
              </thead>
              <tbody>
                {HISTORY.filter((h) => historyFilter === "all" || h.status === historyFilter).map((h, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #1a1a1a" }}>
                    <td className="px-4 py-3 text-xs" style={{ color: "#888" }}>{h.date}</td>
                    <td className="px-4 py-3 text-xs text-white">{h.category}</td>
                    <td className="px-4 py-3 text-xs text-white">{h.task}</td>
                    <td className="px-4 py-3 text-xs">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          color: h.status === "approved" ? "#22c55e" : h.status === "cancelled" ? "#ef4444" : "#f59e0b",
                          backgroundColor: h.status === "approved" ? "rgba(34,197,94,0.1)" : h.status === "cancelled" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
                        }}
                      >
                        {h.status === "approved" ? "✓ Aprobada" : h.status === "cancelled" ? "✗ Cancelada" : "✏️ Modificada"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#888" }}>{h.by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Configuración */}
      {activeTab === "config" && (
        <div className="space-y-6">
          <h2 className="text-sm font-bold tracking-wider" style={{ color: "#E53E3E" }}>
            CONFIGURACIÓN DE NOVY
          </h2>

          {/* Agentes Activos */}
          <div className="rounded-lg p-5 space-y-4" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
            <h3 className="text-sm font-semibold text-white">AGENTES ACTIVOS</h3>
            {[
              { name: "Agente LinkedIn", on: true },
              { name: "Agente Análisis Web", on: true },
              { name: "Agente Correos", on: false, badge: "Próximamente" },
              { name: "Agente Cotizaciones", on: true },
              { name: "Agente Proyectos", on: true },
              { name: "Agente Contenido", on: true },
            ].map((agent, i) => (
              <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #2a2a2a" }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white">{agent.name}</span>
                  {agent.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: "#2a2a2a", color: "#888" }}>
                      {agent.badge}
                    </span>
                  )}
                </div>
                <div
                  className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors"
                  style={{ backgroundColor: agent.on ? "#22c55e" : "#333" }}
                >
                  <div
                    className="w-4 h-4 rounded-full bg-white transition-transform"
                    style={{ transform: agent.on ? "translateX(20px)" : "translateX(0px)" }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Preferencias */}
          <div className="rounded-lg p-5 space-y-4" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
            <h3 className="text-sm font-semibold text-white">PREFERENCIAS</h3>
            {[
              { label: "Notificar tareas nuevas", type: "toggle", value: true },
              { label: "Frecuencia de análisis", type: "select", value: "Diaria" },
              { label: "Idioma de comunicación", type: "select", value: "Español" },
              { label: "Firma en mensajes", type: "text", value: "Josep — Nebu Studio" },
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #2a2a2a" }}>
                <span className="text-sm text-white">{pref.label}</span>
                {pref.type === "toggle" ? (
                  <div className="w-10 h-5 rounded-full flex items-center px-0.5" style={{ backgroundColor: pref.value ? "#22c55e" : "#333" }}>
                    <div className="w-4 h-4 rounded-full bg-white" style={{ transform: pref.value ? "translateX(20px)" : "translateX(0px)" }} />
                  </div>
                ) : pref.type === "select" ? (
                  <span className="text-xs px-3 py-1 rounded" style={{ backgroundColor: "#2a2a2a", color: "#ccc" }}>
                    {pref.value} ▾
                  </span>
                ) : (
                  <span className="text-xs" style={{ color: "#ccc" }}>{pref.value}</span>
                )}
              </div>
            ))}
          </div>

          {/* Sobre NOVY */}
          <div className="rounded-lg p-5" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
            <h3 className="text-sm font-semibold text-white mb-3">SOBRE NOVY</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#888" }}>
              NOVY es el agente de IA de Nebu Studio. Analiza prospectos, detecta oportunidades, redacta mensajes, monitorea proyectos y genera contenido. Nunca actúa sin tu aprobación.
            </p>
            <div className="mt-3 space-y-1">
              <p className="text-xs" style={{ color: "#555" }}>Versión: 1.0 MVP · Modo: Frontend Demo</p>
              <p className="text-xs" style={{ color: "#555" }}>Conexión backend: Pendiente (Mac Mini + OpenClaw)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NovyPage;
