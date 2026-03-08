import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, MapPin, X, Save, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const t = {
  es: {
    title: "Calendario",
    subtitle: "Vista mensual con eventos y tareas",
    today: "Hoy",
    addEvent: "Nuevo evento",
    noEvents: "Sin eventos",
    months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    upcoming: "Próximos eventos",
    save: "Guardar",
    cancel: "Cancelar",
    titlePlaceholder: "Título del evento",
    locationPlaceholder: "Ubicación",
    created: "Evento creado",
    updated: "Evento actualizado",
    deleted: "Evento eliminado",
  },
  en: {
    title: "Calendar",
    subtitle: "Monthly view with events and tasks",
    today: "Today",
    addEvent: "New event",
    noEvents: "No events",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    upcoming: "Upcoming events",
    save: "Save",
    cancel: "Cancel",
    titlePlaceholder: "Event title",
    locationPlaceholder: "Location",
    created: "Event created",
    updated: "Event updated",
    deleted: "Event deleted",
  },
};

const colorOptions = ["#E53E3E", "#38A169", "#3182CE", "#D69E2E", "#805AD5", "#DD6B20"];

interface CalEvent {
  id: string;
  title: string;
  event_date: string;
  event_time: string | null;
  location: string;
  color: string;
}

const emptyForm = { title: "", event_date: "", event_time: "", location: "", color: "#3182CE" };

const CalendarioPage = () => {
  const { lang } = useLanguage();
  const labels = t[lang];
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("calendar_events").select("*").order("event_date", { ascending: true });
    if (!error && data) setEvents(data as CalEvent[]);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSave = async () => {
    if (!form.title.trim() || !form.event_date) return;
    const payload = {
      title: form.title, event_date: form.event_date,
      event_time: form.event_time || null, location: form.location, color: form.color,
    };
    if (editingId) {
      const { error } = await supabase.from("calendar_events").update(payload).eq("id", editingId);
      if (!error) { toast.success(labels.updated); fetchEvents(); }
    } else {
      const { error } = await supabase.from("calendar_events").insert(payload);
      if (!error) { toast.success(labels.created); fetchEvents(); }
    }
    setShowForm(false); setEditingId(null); setForm(emptyForm);
  };

  const handleEdit = (e: CalEvent) => {
    setEditingId(e.id);
    setForm({ title: e.title, event_date: e.event_date, event_time: e.event_time || "", location: e.location || "", color: e.color || "#3182CE" });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("calendar_events").delete().eq("id", id);
    if (!error) { toast.success(labels.deleted); fetchEvents(); }
  };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay + 6) % 7;
  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d: number) => d === now.getDate() && month === now.getMonth() && year === now.getFullYear();

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(e => e.event_date === dateStr);
  };

  const upcomingEvents = events.filter(e => new Date(e.event_date) >= new Date(now.toISOString().split("T")[0])).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--nebu-text)" }}>
            <Calendar size={24} style={{ color: "var(--nebu-accent)" }} />
            {labels.title}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--nebu-text-secondary)" }}>{labels.subtitle}</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: "var(--nebu-accent)" }}
        >
          <Plus size={16} /> {labels.addEvent}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: "var(--nebu-surface)", border: "1px solid var(--nebu-border)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder={labels.titlePlaceholder}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}
            />
            <input
              type="date" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}
            />
            <input
              type="time" value={form.event_time} onChange={e => setForm(f => ({ ...f, event_time: e.target.value }))}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}
            />
            <input
              value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder={labels.locationPlaceholder}
              className="rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {colorOptions.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                  className="w-6 h-6 rounded-full border-2 transition-transform"
                  style={{ backgroundColor: c, borderColor: form.color === c ? "white" : "transparent", transform: form.color === c ? "scale(1.2)" : "scale(1)" }}
                />
              ))}
            </div>
            <div className="flex gap-2 ml-auto">
              <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "var(--nebu-accent)" }}>
                <Save size={14} /> {labels.save}
              </button>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold" style={{ color: "var(--nebu-text-secondary)", border: "1px solid var(--nebu-border)" }}>
                <X size={14} /> {labels.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="xl:col-span-3 rounded-xl p-5" style={{ backgroundColor: "var(--nebu-surface)", border: "1px solid var(--nebu-border)" }}>
          <div className="flex items-center justify-between mb-5">
            <button onClick={prev} className="p-2 rounded-lg hover:opacity-80" style={{ backgroundColor: "var(--nebu-card)" }}>
              <ChevronLeft size={18} style={{ color: "var(--nebu-text)" }} />
            </button>
            <h2 className="text-lg font-bold" style={{ color: "var(--nebu-text)" }}>
              {labels.months[month]} {year}
            </h2>
            <button onClick={next} className="p-2 rounded-lg hover:opacity-80" style={{ backgroundColor: "var(--nebu-card)" }}>
              <ChevronRight size={18} style={{ color: "var(--nebu-text)" }} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-px">
            {labels.days.map(d => (
              <div key={d} className="text-center text-xs font-semibold py-2" style={{ color: "var(--nebu-text-secondary)" }}>{d}</div>
            ))}
            {cells.map((day, i) => {
              const evts = day ? getEventsForDay(day) : [];
              return (
                <div key={i} className="min-h-[80px] p-1.5 rounded-md border"
                  style={{
                    backgroundColor: day ? "var(--nebu-card)" : "transparent",
                    borderColor: day && isToday(day) ? "var(--nebu-accent)" : "var(--nebu-border)",
                  }}
                >
                  {day && (
                    <>
                      <span className="text-xs font-semibold" style={{ color: isToday(day) ? "var(--nebu-accent)" : "var(--nebu-text-secondary)" }}>
                        {day}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {evts.map(e => (
                          <div key={e.id} className="text-[10px] px-1 py-0.5 rounded truncate" style={{ backgroundColor: e.color + "22", color: e.color }}>
                            {e.title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: "var(--nebu-surface)", border: "1px solid var(--nebu-border)" }}>
          <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--nebu-text-secondary)" }}>{labels.upcoming}</h3>
          {loading ? (
            <p className="text-sm" style={{ color: "var(--nebu-text-secondary)" }}>...</p>
          ) : upcomingEvents.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--nebu-text-secondary)" }}>{labels.noEvents}</p>
          ) : upcomingEvents.map(e => (
            <div key={e.id} className="p-3 rounded-lg space-y-1 group relative" style={{ backgroundColor: "var(--nebu-card)", borderLeft: `3px solid ${e.color}` }}>
              <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                <button onClick={() => handleEdit(e)} className="p-1 rounded hover:opacity-80" style={{ color: "var(--nebu-accent)" }}><Pencil size={12} /></button>
                <button onClick={() => handleDelete(e.id)} className="p-1 rounded hover:opacity-80" style={{ color: "#E53E3E" }}><Trash2 size={12} /></button>
              </div>
              <p className="text-sm font-semibold" style={{ color: "var(--nebu-text)" }}>{e.title}</p>
              <div className="flex items-center gap-3 text-xs" style={{ color: "var(--nebu-text-secondary)" }}>
                {e.event_time && <span className="flex items-center gap-1"><Clock size={11} /> {e.event_time}</span>}
                {e.location && <span className="flex items-center gap-1"><MapPin size={11} /> {e.location}</span>}
              </div>
              <span className="text-[10px] font-semibold" style={{ color: e.color }}>{e.event_date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarioPage;
