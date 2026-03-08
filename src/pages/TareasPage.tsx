import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckSquare, Plus, Clock, User, AlertCircle } from "lucide-react";

const t = {
  es: {
    title: "Tareas",
    subtitle: "Gestión de pendientes y asignaciones del equipo",
    addTask: "Nueva tarea",
    all: "Todas",
    pending: "Pendientes",
    inProgress: "En progreso",
    completed: "Completadas",
    task: "Tarea",
    assignee: "Asignado a",
    priority: "Prioridad",
    dueDate: "Fecha límite",
    status: "Estado",
    high: "Alta",
    medium: "Media",
    low: "Baja",
    pendingLabel: "Pendiente",
    inProgressLabel: "En progreso",
    completedLabel: "Completada",
    stats: { total: "Total tareas", pend: "Pendientes", prog: "En progreso", done: "Completadas" },
  },
  en: {
    title: "Tasks",
    subtitle: "Task management and team assignments",
    addTask: "New task",
    all: "All",
    pending: "Pending",
    inProgress: "In Progress",
    completed: "Completed",
    task: "Task",
    assignee: "Assigned to",
    priority: "Priority",
    dueDate: "Due date",
    status: "Status",
    high: "High",
    medium: "Medium",
    low: "Low",
    pendingLabel: "Pending",
    inProgressLabel: "In Progress",
    completedLabel: "Completed",
    stats: { total: "Total tasks", pend: "Pending", prog: "In Progress", done: "Completed" },
  },
};

type Status = "pending" | "in-progress" | "completed";
type Priority = "high" | "medium" | "low";

interface Task {
  id: number;
  title: Record<"es" | "en", string>;
  assignee: string;
  priority: Priority;
  dueDate: string;
  status: Status;
}

const mockTasks: Task[] = [
  { id: 1, title: { es: "Diseñar landing Acme Corp", en: "Design Acme Corp landing" }, assignee: "Carlos M.", priority: "high", dueDate: "2025-03-15", status: "in-progress" },
  { id: 2, title: { es: "Enviar cotización TechNova", en: "Send TechNova quote" }, assignee: "Ana R.", priority: "high", dueDate: "2025-03-10", status: "pending" },
  { id: 3, title: { es: "Configurar hosting MX Foods", en: "Setup MX Foods hosting" }, assignee: "Luis P.", priority: "medium", dueDate: "2025-03-18", status: "pending" },
  { id: 4, title: { es: "Revisar contrato Plaza Digital", en: "Review Plaza Digital contract" }, assignee: "Carlos M.", priority: "low", dueDate: "2025-03-20", status: "completed" },
  { id: 5, title: { es: "Crear contenido LinkedIn", en: "Create LinkedIn content" }, assignee: "Ana R.", priority: "medium", dueDate: "2025-03-12", status: "in-progress" },
  { id: 6, title: { es: "Actualizar pipeline Q2", en: "Update Q2 pipeline" }, assignee: "Luis P.", priority: "high", dueDate: "2025-03-08", status: "pending" },
  { id: 7, title: { es: "Llamada seguimiento Retail Plus", en: "Retail Plus follow-up call" }, assignee: "Carlos M.", priority: "medium", dueDate: "2025-03-14", status: "completed" },
];

const priorityColors: Record<Priority, string> = { high: "#E53E3E", medium: "#D69E2E", low: "#38A169" };
const statusColors: Record<Status, string> = { pending: "#D69E2E", "in-progress": "#3182CE", completed: "#38A169" };

const TareasPage = () => {
  const { lang } = useLanguage();
  const labels = t[lang];
  const [filter, setFilter] = useState<"all" | Status>("all");

  const filtered = filter === "all" ? mockTasks : mockTasks.filter(t => t.status === filter);
  const counts = {
    total: mockTasks.length,
    pending: mockTasks.filter(t => t.status === "pending").length,
    inProgress: mockTasks.filter(t => t.status === "in-progress").length,
    completed: mockTasks.filter(t => t.status === "completed").length,
  };

  const priorityLabel = (p: Priority) => p === "high" ? labels.high : p === "medium" ? labels.medium : labels.low;
  const statusLabel = (s: Status) => s === "pending" ? labels.pendingLabel : s === "in-progress" ? labels.inProgressLabel : labels.completedLabel;

  const statCards = [
    { label: labels.stats.total, value: counts.total, color: "var(--nebu-accent)" },
    { label: labels.stats.pend, value: counts.pending, color: "#D69E2E" },
    { label: labels.stats.prog, value: counts.inProgress, color: "#3182CE" },
    { label: labels.stats.done, value: counts.completed, color: "#38A169" },
  ];

  const filters: { key: "all" | Status; label: string }[] = [
    { key: "all", label: labels.all },
    { key: "pending", label: labels.pending },
    { key: "in-progress", label: labels.inProgress },
    { key: "completed", label: labels.completed },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--nebu-text)" }}>
            <CheckSquare size={24} style={{ color: "var(--nebu-accent)" }} />
            {labels.title}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--nebu-text-secondary)" }}>{labels.subtitle}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "var(--nebu-accent)" }}>
          <Plus size={16} /> {labels.addTask}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="rounded-xl p-4" style={{ backgroundColor: "var(--nebu-surface)", border: "1px solid var(--nebu-border)" }}>
            <p className="text-xs font-semibold uppercase" style={{ color: "var(--nebu-text-secondary)" }}>{s.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            style={{
              backgroundColor: filter === f.key ? "var(--nebu-accent)" : "var(--nebu-card)",
              color: filter === f.key ? "#fff" : "var(--nebu-text-secondary)",
              border: filter === f.key ? "none" : "1px solid var(--nebu-border)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--nebu-surface)", border: "1px solid var(--nebu-border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--nebu-border)" }}>
              {[labels.task, labels.assignee, labels.priority, labels.dueDate, labels.status].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase" style={{ color: "var(--nebu-text-secondary)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(task => (
              <tr key={task.id} className="hover:opacity-90" style={{ borderBottom: "1px solid var(--nebu-border)" }}>
                <td className="px-4 py-3 font-medium" style={{ color: "var(--nebu-text)" }}>{task.title[lang]}</td>
                <td className="px-4 py-3 flex items-center gap-1.5" style={{ color: "var(--nebu-text-secondary)" }}>
                  <User size={13} /> {task.assignee}
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: priorityColors[task.priority] }}>
                    <AlertCircle size={12} /> {priorityLabel(task.priority)}
                  </span>
                </td>
                <td className="px-4 py-3 flex items-center gap-1.5 text-xs" style={{ color: "var(--nebu-text-secondary)" }}>
                  <Clock size={12} /> {task.dueDate}
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: statusColors[task.status] + "22", color: statusColors[task.status] }}>
                    {statusLabel(task.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TareasPage;
