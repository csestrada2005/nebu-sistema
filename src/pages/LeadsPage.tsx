import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Plus, Search, Pencil, Trash2, X, Save, Linkedin, Phone, Mail, Globe } from "lucide-react";
import { toast } from "sonner";
import EmptyState from "@/components/EmptyState";

type Estado = "por_contactar" | "contactado" | "en_negociacion" | "calificado" | "cerrado" | "descartado";

interface Lead {
  id: string; nombre: string; empresa: string; email: string; telefono: string;
  servicio: string; valor_estimado: number; fuente: string; estado: Estado;
  notas: string; linkedin_url: string; ultimo_contacto: string | null; created_at: string;
}

const estadoColors: Record<Estado, string> = {
  por_contactar: "#F59E0B", contactado: "#3B82F6", en_negociacion: "#8B5CF6",
  calificado: "#10B981", cerrado: "#22C55E", descartado: "#6B7280",
};

const emptyForm = {
  nombre: "", empresa: "", email: "", telefono: "", servicio: "",
  valor_estimado: 0, fuente: "LinkedIn", estado: "por_contactar" as Estado,
  notas: "", linkedin_url: "", ultimo_contacto: "",
};

const LeadsPage = () => {
  const { lang } = useLanguage();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Estado>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const tt = {
    es: {
      title: "Leads", subtitle: "Gestión de prospectos", addLead: "Nuevo lead",
      search: "Buscar por nombre, empresa o servicio...",
      nombre: "Nombre", empresa: "Empresa", servicio: "Servicio", valor: "Valor est.",
      fuente: "Fuente", estado: "Estado", actions: "Acciones",
      save: "Guardar", cancel: "Cancelar",
      all: "Todos", por_contactar: "Por contactar", contactado: "Contactado",
      en_negociacion: "En negociación", calificado: "Calificado", cerrado: "Cerrado", descartado: "Descartado",
    },
    en: {
      title: "Leads", subtitle: "Prospect management", addLead: "New lead",
      search: "Search by name, company or service...",
      nombre: "Name", empresa: "Company", servicio: "Service", valor: "Est. value",
      fuente: "Source", estado: "Status", actions: "Actions",
      save: "Save", cancel: "Cancel",
      all: "All", por_contactar: "To contact", contactado: "Contacted",
      en_negociacion: "Negotiating", calificado: "Qualified", cerrado: "Closed", descartado: "Discarded",
    },
  }[lang];

  const fetchLeads = async () => {
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (!error && data) setLeads(data as Lead[]);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleSave = async () => {
    if (!form.nombre.trim()) return;
    const payload = { ...form, valor_estimado: Number(form.valor_estimado) || 0, ultimo_contacto: form.ultimo_contacto || null };
    if (editingId) {
      const { error } = await supabase.from("leads").update(payload).eq("id", editingId);
      if (!error) { toast.success(lang === "es" ? "Lead actualizado" : "Lead updated"); fetchLeads(); }
    } else {
      const { error } = await supabase.from("leads").insert(payload);
      if (!error) { toast.success(lang === "es" ? "Lead creado" : "Lead created"); fetchLeads(); }
    }
    setShowForm(false); setEditingId(null); setForm(emptyForm);
  };

  const handleEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setForm({ nombre: lead.nombre, empresa: lead.empresa, email: lead.email, telefono: lead.telefono, servicio: lead.servicio, valor_estimado: lead.valor_estimado, fuente: lead.fuente, estado: lead.estado, notas: lead.notas, linkedin_url: lead.linkedin_url, ultimo_contacto: lead.ultimo_contacto || "" });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (!error) { toast.success(lang === "es" ? "Lead eliminado" : "Lead deleted"); fetchLeads(); }
  };

  const q = search.toLowerCase();
  const searched = leads.filter(l => l.nombre.toLowerCase().includes(q) || l.empresa.toLowerCase().includes(q) || l.servicio.toLowerCase().includes(q));
  const filtered = filter === "all" ? searched : searched.filter(l => l.estado === filter);

  const filters: { key: "all" | Estado; label: string }[] = [
    { key: "all", label: tt.all }, { key: "por_contactar", label: tt.por_contactar },
    { key: "contactado", label: tt.contactado }, { key: "en_negociacion", label: tt.en_negociacion },
    { key: "calificado", label: tt.calificado }, { key: "cerrado", label: tt.cerrado }, { key: "descartado", label: tt.descartado },
  ];

  const inputStyle: React.CSSProperties = { backgroundColor: "#1A1A1A", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "#FFFFFF" }}>{tt.title}</h1>
          <p className="text-sm mt-1" style={{ color: "#71717A" }}>{tt.subtitle}</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
          style={{ backgroundColor: "#E63946", color: "#FFFFFF" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C62828")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E63946")}
        >
          <Plus size={16} /> {tt.addLead}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder={tt.nombre} className="rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} />
            <input value={form.empresa} onChange={e => setForm(f => ({ ...f, empresa: e.target.value }))} placeholder={tt.empresa} className="rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} />
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" className="rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} />
            <input type="number" value={form.valor_estimado} onChange={e => setForm(f => ({ ...f, valor_estimado: Number(e.target.value) }))} placeholder={tt.valor} className="rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: "#E63946", color: "#FFFFFF" }}>
              <Save size={14} /> {tt.save}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ color: "#71717A", border: "1px solid rgba(255,255,255,0.06)" }}>
              <X size={14} /> {tt.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#71717A" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tt.search}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none"
            style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.06)", color: "#FFFFFF" }} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap"
              style={{
                backgroundColor: filter === f.key ? "rgba(230,57,70,0.1)" : "#1A1A1A",
                color: filter === f.key ? "#E63946" : "#71717A",
                border: `1px solid ${filter === f.key ? "rgba(230,57,70,0.2)" : "rgba(255,255,255,0.06)"}`,
              }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table or Empty */}
      {loading ? (
        <div className="py-12 text-center" style={{ color: "#71717A" }}>...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl" style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
          <EmptyState
            icon={UserPlus}
            title={{ es: "Leads vacío", en: "Leads empty" }}
            subtitle={{ es: "Agrega tu primer lead para comenzar.", en: "Add your first lead to get started." }}
            ctaLabel={{ es: "+ Agregar lead", en: "+ Add lead" }}
            onCta={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          />
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {[tt.nombre, tt.empresa, tt.servicio, tt.valor, tt.estado, tt.actions].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#71717A" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => (
                  <tr key={lead.id} className="transition-colors cursor-pointer" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: "#FFFFFF" }}>{lead.nombre}</td>
                    <td className="px-4 py-3" style={{ color: "#71717A" }}>{lead.empresa}</td>
                    <td className="px-4 py-3" style={{ color: "#FFFFFF" }}>{lead.servicio}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "#22C55E" }}>${(lead.valor_estimado || 0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: estadoColors[lead.estado] + "20", color: estadoColors[lead.estado] }}>
                        {tt[lead.estado] || lead.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => handleEdit(lead)} className="p-1.5 rounded transition-colors" style={{ color: "#71717A" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")} onMouseLeave={(e) => (e.currentTarget.style.color = "#71717A")}>
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDelete(lead.id)} className="p-1.5 rounded transition-colors" style={{ color: "#71717A" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#E63946")} onMouseLeave={(e) => (e.currentTarget.style.color = "#71717A")}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
