import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, MapPin } from "lucide-react";

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
  },
};

const mockEvents = [
  { id: 1, title: { es: "Reunión con cliente Acme", en: "Meeting with Acme client" }, date: 5, color: "#E53E3E", time: "10:00", location: "Zoom" },
  { id: 2, title: { es: "Entrega diseño web", en: "Web design delivery" }, date: 8, color: "#38A169", time: "14:00", location: "Oficina" },
  { id: 3, title: { es: "Revisión pipeline", en: "Pipeline review" }, date: 12, color: "#3182CE", time: "09:30", location: "Sala A" },
  { id: 4, title: { es: "Demo producto TechNova", en: "TechNova product demo" }, date: 15, color: "#D69E2E", time: "16:00", location: "Google Meet" },
  { id: 5, title: { es: "Cierre contrato MX Foods", en: "MX Foods contract closing" }, date: 20, color: "#E53E3E", time: "11:00", location: "Cliente" },
  { id: 6, title: { es: "Planificación sprint", en: "Sprint planning" }, date: 22, color: "#805AD5", time: "09:00", location: "Oficina" },
];

const CalendarioPage = () => {
  const { lang } = useLanguage();
  const labels = t[lang];
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay + 6) % 7;

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d: number) => d === now.getDate() && month === now.getMonth() && year === now.getFullYear();

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
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "var(--nebu-accent)" }}>
          <Plus size={16} /> {labels.addEvent}
        </button>
      </div>

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
              const evts = day ? mockEvents.filter(e => e.date === day) : [];
              return (
                <div
                  key={i}
                  className="min-h-[80px] p-1.5 rounded-md border"
                  style={{
                    backgroundColor: day ? "var(--nebu-card)" : "transparent",
                    borderColor: day && isToday(day) ? "var(--nebu-accent)" : "var(--nebu-border)",
                  }}
                >
                  {day && (
                    <>
                      <span className={`text-xs font-semibold ${isToday(day) ? "" : ""}`} style={{ color: isToday(day) ? "var(--nebu-accent)" : "var(--nebu-text-secondary)" }}>
                        {day}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {evts.map(e => (
                          <div key={e.id} className="text-[10px] px-1 py-0.5 rounded truncate" style={{ backgroundColor: e.color + "22", color: e.color }}>
                            {e.title[lang]}
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
          {mockEvents.map(e => (
            <div key={e.id} className="p-3 rounded-lg space-y-1" style={{ backgroundColor: "var(--nebu-card)", borderLeft: `3px solid ${e.color}` }}>
              <p className="text-sm font-semibold" style={{ color: "var(--nebu-text)" }}>{e.title[lang]}</p>
              <div className="flex items-center gap-3 text-xs" style={{ color: "var(--nebu-text-secondary)" }}>
                <span className="flex items-center gap-1"><Clock size={11} /> {e.time}</span>
                <span className="flex items-center gap-1"><MapPin size={11} /> {e.location}</span>
              </div>
              <span className="text-[10px] font-semibold" style={{ color: e.color }}>{labels.months[month]} {e.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarioPage;
