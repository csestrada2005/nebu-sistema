import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { CheckSquare, Plus, Clock, User, AlertCircle, Pencil, Trash2, X, Save } from "lucide-react";
import { toast } from "sonner";

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
    actions: "Acciones",
    save: "Guardar",
    cancel: "Cancelar",
    titlePlaceholder: "Nombre de la tarea",
    assigneePlaceholder: "Responsable",
    created: "Tarea creada",
    updated: "Tarea actualizada",
    deleted: "Tarea eliminada",
    confirmDelete: "¿Eliminar esta tarea?",
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
    actions: "Actions",
    save: "Save",
    cancel: "Cancel",
    titlePlaceholder: "Task name",
    assigneePlaceholder: "Assignee",
    created: "Task created",
    updated: "Task updated",
    deleted: "Task deleted",
    confirmDelete: "Delete this task?",
  },
};

type Status = "pending" | "in-progress" | "completed";
type Priority = "high" | "medium" | "low";

interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: Priority;
  due_date: string | null;
  status: Status;
}

const priorityColors: Record<Priority, string> = { high: "#E53E3E", medium: "#D69E2E", low: "#38A169" };
const statusColors: Record<Status, string> = { pending: "#D69E2E", "in-progress": "#3182CE", completed: "#38A169" };

const emptyTask = { title: "", assignee: "", priority: "medium" as Priority, status: "pending" as Status, due_date: "" };

const TareasPage = () => {
  const { lang } = useLanguage();
  const labels = t[lang];
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyTask);

  const fetchTasks = async () => {
    const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
    if (!error && data) setTasks(data as Task[]);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSave = async () => {
    if (!form.title.trim()) return;
    if (editingId) {
      const { error } = await supabase.from("tasks").update({
        title: form.title, assignee: form.assignee, priority: form.priority,
        status: form.status, due_date: form.due_date || null,
      }).eq("id", editingId);
      if (!error) { toast.success(labels.updated); fetchTasks(); }
    } else {
      const { error } = await supabase.from("tasks").insert({
        title: form.title, assignee: form.assignee, priority: form.priority,
        status: form.status, due_date: form.due_date || null,
      });
      if (!error) { toast.success(labels.created); fetchTasks(); }
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyTask);
  };

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setForm({ title: task.title, assignee: task.assignee, priority: task.priority, status: task.status, due_date: task.due_date || "" });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (!error) { toast.success(labels.deleted); fetchTasks(); }
  };

  const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter);
  const counts = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
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
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyTask); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: "var(--nebu-accent)" }}
        >
          <Plus size={16} /> {labels.addTask}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: "var(--nebu-surface)", border: "1px solid var(--nebu-border)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <input
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder={labels.titlePlaceholder}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}
            />
            <input
              value={form.assignee} onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}
              placeholder={labels.assigneePlaceholder}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}
            />
            <select
              value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}
            >
              <option value="high">{labels.high}</option>
              <option value="medium">{labels.medium}</option>
              <option value="low">{labels.low}</option>
            </select>
            <select
              value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}
            >
              <option value="pending">{labels.pendingLabel}</option>
              <option value="in-progress">{labels.inProgressLabel}</option>
              <option value="completed">{labels.completedLabel}</option>
            </select>
            <input
              type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "var(--nebu-accent)" }}>
              <Save size={14} /> {labels.save}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyTask); }} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold" style={{ color: "var(--nebu-text-secondary)", border: "1px solid var(--nebu-border)" }}>
              <X size={14} /> {labels.cancel}
            </button>
          </div>
        </div>
      )}

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
            key={f.key} onClick={() => setFilter(f.key)}
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
              {[labels.task, labels.assignee, labels.priority, labels.dueDate, labels.status, labels.actions].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase" style={{ color: "var(--nebu-text-secondary)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center" style={{ color: "var(--nebu-text-secondary)" }}>...</td></tr>
            ) : filtered.map(task => (
              <tr key={task.id} className="hover:opacity-90" style={{ borderBottom: "1px solid var(--nebu-border)" }}>
                <td className="px-4 py-3 font-medium" style={{ color: "var(--nebu-text)" }}>{task.title}</td>
                <td className="px-4 py-3" style={{ color: "var(--nebu-text-secondary)" }}>
                  <span className="flex items-center gap-1.5"><User size={13} /> {task.assignee}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: priorityColors[task.priority] }}>
                    <AlertCircle size={12} /> {priorityLabel(task.priority)}
                  </span>
                </td>
                <td className="px-4 py-3" style={{ color: "var(--nebu-text-secondary)" }}>
                  <span className="flex items-center gap-1.5 text-xs"><Clock size={12} /> {task.due_date || "—"}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: statusColors[task.status] + "22", color: statusColors[task.status] }}>
                    {statusLabel(task.status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(task)} className="p-1.5 rounded hover:opacity-80" style={{ color: "var(--nebu-accent)" }}><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(task.id)} className="p-1.5 rounded hover:opacity-80" style={{ color: "#E53E3E" }}><Trash2 size={14} /></button>
                  </div>
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
