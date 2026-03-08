import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Plus, Search, Pencil, Trash2, X, Save, ExternalLink, StickyNote, Globe, Linkedin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

const t = {
  es: {
    title: "Leads",
    subtitle: "Base de datos de prospectos para scraping y seguimiento",
    addLead: "Nuevo lead",
    search: "Buscar por nombre, empresa o servicio...",
    nombre: "Nombre",
    empresa: "Empresa",
    email: "Email",
    telefono: "Teléfono",
    servicio: "Servicio",
    valor: "Valor est.",
    fuente: "Fuente",
    estado: "Estado",
    notas: "Notas",
    ultimoContacto: "Último contacto",
    actions: "Acciones",
    save: "Guardar",
    cancel: "Cancelar",
    created: "Lead creado",
    updated: "Lead actualizado",
    deleted: "Lead eliminado",
    nombrePh: "Nombre del lead",
    empresaPh: "Empresa",
    emailPh: "Email",
    telefonoPh: "Teléfono",
    servicioPh: "Servicio de interés",
    valorPh: "Valor estimado",
    linkedinPh: "URL LinkedIn",
    notasPh: "Notas...",
    all: "Todos",
    por_contactar: "Por contactar",
    contactado: "Contactado",
    en_negociacion: "En negociación",
    calificado: "Calificado",
    cerrado: "Cerrado",
    descartado: "Descartado",
    total: "Total leads",
    porContactar: "Por contactar",
    contactados: "Contactados",
    enNego: "En negociación",
    calificados: "Calificados",
    cerrados: "Cerrados",
    mostrando: "Mostrando",
    de: "de",
    leads: "leads",
    valorTotal: "Valor total pipeline",
  },
  en: {
    title: "Leads",
    subtitle: "Prospect database for scraping and follow-up",
    addLead: "New lead",
    search: "Search by name, company or service...",
    nombre: "Name",
    empresa: "Company",
    email: "Email",
    telefono: "Phone",
    servicio: "Service",
    valor: "Est. value",
    fuente: "Source",
    estado: "Status",
    notas: "Notes",
    ultimoContacto: "Last contact",
    actions: "Actions",
    save: "Save",
    cancel: "Cancel",
    created: "Lead created",
    updated: "Lead updated",
    deleted: "Lead deleted",
    nombrePh: "Lead name",
    empresaPh: "Company",
    emailPh: "Email",
    telefonoPh: "Phone",
    servicioPh: "Service of interest",
    valorPh: "Estimated value",
    linkedinPh: "LinkedIn URL",
    notasPh: "Notes...",
    all: "All",
    por_contactar: "To contact",
    contactado: "Contacted",
    en_negociacion: "Negotiating",
    calificado: "Qualified",
    cerrado: "Closed",
    descartado: "Discarded",
    total: "Total leads",
    porContactar: "To contact",
    contactados: "Contacted",
    enNego: "Negotiating",
    calificados: "Qualified",
    cerrados: "Closed",
    mostrando: "Showing",
    de: "of",
    leads: "leads",
    valorTotal: "Total pipeline value",
  },
};

type Estado = "por_contactar" | "contactado" | "en_negociacion" | "calificado" | "cerrado" | "descartado";

interface Lead {
  id: string;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  servicio: string;
  valor_estimado: number;
  fuente: string;
  estado: Estado;
  notas: string;
  linkedin_url: string;
  ultimo_contacto: string | null;
  created_at: string;
}

const estadoColors: Record<Estado, string> = {
  por_contactar: "#F59E0B",
  contactado: "#3B82F6",
  en_negociacion: "#8B5CF6",
  calificado: "#10B981",
  cerrado: "#22C55E",
  descartado: "#6B7280",
};

const fuenteIcons: Record<string, React.ElementType> = {
  LinkedIn: Linkedin,
  Web: Globe,
  Referido: UserPlus,
};

const emptyForm = {
  nombre: "", empresa: "", email: "", telefono: "", servicio: "",
  valor_estimado: 0, fuente: "LinkedIn", estado: "por_contactar" as Estado,
  notas: "", linkedin_url: "", ultimo_contacto: "",
};

const LeadsPage = () => {
  const { lang } = useLanguage();
  const s = t[lang];
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Estado>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchLeads = async () => {
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (!error && data) setLeads(data as Lead[]);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleSave = async () => {
    if (!form.nombre.trim()) return;
    const payload = {
      ...form,
      valor_estimado: Number(form.valor_estimado) || 0,
      ultimo_contacto: form.ultimo_contacto || null,
    };
    if (editingId) {
      const { error } = await supabase.from("leads").update(payload).eq("id", editingId);
      if (!error) { toast.success(s.updated); fetchLeads(); }
    } else {
      const { error } = await supabase.from("leads").insert(payload);
      if (!error) { toast.success(s.created); fetchLeads(); }
    }
    setShowForm(false); setEditingId(null); setForm(emptyForm);
  };

  const handleEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setForm({
      nombre: lead.nombre, empresa: lead.empresa, email: lead.email, telefono: lead.telefono,
      servicio: lead.servicio, valor_estimado: lead.valor_estimado, fuente: lead.fuente,
      estado: lead.estado, notas: lead.notas, linkedin_url: lead.linkedin_url,
      ultimo_contacto: lead.ultimo_contacto || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (!error) { toast.success(s.deleted); fetchLeads(); }
  };

  const q = search.toLowerCase();
  const searched = leads.filter(l =>
    l.nombre.toLowerCase().includes(q) || l.empresa.toLowerCase().includes(q) || l.servicio.toLowerCase().includes(q)
  );
  const filtered = filter === "all" ? searched : searched.filter(l => l.estado === filter);

  const counts = {
    total: leads.length,
    por_contactar: leads.filter(l => l.estado === "por_contactar").length,
    contactado: leads.filter(l => l.estado === "contactado").length,
    en_negociacion: leads.filter(l => l.estado === "en_negociacion").length,
    calificado: leads.filter(l => l.estado === "calificado").length,
    cerrado: leads.filter(l => l.estado === "cerrado").length,
  };

  const totalValue = leads.reduce((sum, l) => sum + (l.valor_estimado || 0), 0);

  const statCards = [
    { label: s.total, value: counts.total, color: "var(--nebu-accent)" },
    { label: s.porContactar, value: counts.por_contactar, color: estadoColors.por_contactar },
    { label: s.contactados, value: counts.contactado, color: estadoColors.contactado },
    { label: s.enNego, value: counts.en_negociacion, color: estadoColors.en_negociacion },
    { label: s.calificados, value: counts.calificado, color: estadoColors.calificado },
    { label: s.valorTotal, value: `$${totalValue.toLocaleString()}`, color: "#22C55E" },
  ];

  const filters: { key: "all" | Estado; label: string }[] = [
    { key: "all", label: s.all },
    { key: "por_contactar", label: s.por_contactar },
    { key: "contactado", label: s.contactado },
    { key: "en_negociacion", label: s.en_negociacion },
    { key: "calificado", label: s.calificado },
    { key: "cerrado", label: s.cerrado },
    { key: "descartado", label: s.descartado },
  ];

  const estadoLabel = (e: Estado) => s[e] || e;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--nebu-text)" }}>
            <UserPlus size={24} style={{ color: "var(--nebu-accent)" }} />
            {s.title}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--nebu-text-secondary)" }}>{s.subtitle}</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: "var(--nebu-accent)" }}
        >
          <Plus size={16} /> {s.addLead}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: "var(--nebu-surface)", border: "1px solid var(--nebu-border)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder={s.nombrePh}
              className="rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }} />
            <input value={form.empresa} onChange={e => setForm(f => ({ ...f, empresa: e.target.value }))} placeholder={s.empresaPh}
              className="rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }} />
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder={s.emailPh}
              className="rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }} />
            <input value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} placeholder={s.telefonoPh}
              className="rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <input value={form.servicio} onChange={e => setForm(f => ({ ...f, servicio: e.target.value }))} placeholder={s.servicioPh}
              className="rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }} />
            <input type="number" value={form.valor_estimado} onChange={e => setForm(f => ({ ...f, valor_estimado: Number(e.target.value) }))} placeholder={s.valorPh}
              className="rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }} />
            <select value={form.fuente} onChange={e => setForm(f => ({ ...f, fuente: e.target.value }))}
              className="rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Web">Web</option>
              <option value="Referido">{lang === "es" ? "Referido" : "Referral"}</option>
            </select>
            <select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value as Estado }))}
              className="rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }}>
              <option value="por_contactar">{s.por_contactar}</option>
              <option value="contactado">{s.contactado}</option>
              <option value="en_negociacion">{s.en_negociacion}</option>
              <option value="calificado">{s.calificado}</option>
              <option value="cerrado">{s.cerrado}</option>
              <option value="descartado">{s.descartado}</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input value={form.linkedin_url} onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))} placeholder={s.linkedinPh}
              className="rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }} />
            <input type="date" value={form.ultimo_contacto} onChange={e => setForm(f => ({ ...f, ultimo_contacto: e.target.value }))}
              className="rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }} />
            <input value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} placeholder={s.notasPh}
              className="rounded-lg px-3 py-2 text-sm outline-none" style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text)", border: "1px solid var(--nebu-border)" }} />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "var(--nebu-accent)" }}>
              <Save size={14} /> {s.save}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold" style={{ color: "var(--nebu-text-secondary)", border: "1px solid var(--nebu-border)" }}>
              <X size={14} /> {s.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map(sc => (
          <div key={sc.label} className="rounded-xl p-4" style={{ backgroundColor: "var(--nebu-surface)", border: "1px solid var(--nebu-border)" }}>
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--nebu-text-secondary)" }}>{sc.label}</p>
            <p className="text-xl font-bold mt-1" style={{ color: sc.color }}>{sc.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--nebu-text-secondary)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={s.search}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none"
            style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)", color: "var(--nebu-text)" }} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap"
              style={{
                backgroundColor: filter === f.key ? "var(--nebu-accent)" : "var(--nebu-card)",
                color: filter === f.key ? "#fff" : "var(--nebu-text-secondary)",
                border: filter === f.key ? "none" : "1px solid var(--nebu-border)",
              }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--nebu-surface)", border: "1px solid var(--nebu-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--nebu-border)" }}>
                {[s.nombre, s.empresa, s.servicio, s.valor, s.fuente, s.estado, s.ultimoContacto, s.notas, s.actions].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: "var(--nebu-text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center" style={{ color: "var(--nebu-text-secondary)" }}>...</td></tr>
              ) : filtered.map(lead => {
                const FuenteIcon = fuenteIcons[lead.fuente] || Globe;
                return (
                  <tr key={lead.id} className="hover:opacity-90 transition-opacity" style={{ borderBottom: "1px solid var(--nebu-border)" }}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <p className="font-medium" style={{ color: "var(--nebu-text)" }}>{lead.nombre}</p>
                        <div className="flex gap-2 mt-0.5">
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} className="hover:opacity-80"><Mail size={11} style={{ color: "var(--nebu-text-secondary)" }} /></a>
                          )}
                          {lead.telefono && (
                            <a href={`tel:${lead.telefono}`} className="hover:opacity-80"><Phone size={11} style={{ color: "var(--nebu-text-secondary)" }} /></a>
                          )}
                          {lead.linkedin_url && (
                            <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80"><Linkedin size={11} style={{ color: "#0A66C2" }} /></a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--nebu-text-secondary)" }}>{lead.empresa}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--nebu-text)" }}>{lead.servicio}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold" style={{ color: "#22C55E" }}>
                      ${(lead.valor_estimado || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--nebu-text-secondary)" }}>
                        <FuenteIcon size={12} /> {lead.fuente}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                        style={{ backgroundColor: estadoColors[lead.estado] + "22", color: estadoColors[lead.estado] }}>
                        {estadoLabel(lead.estado)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: "var(--nebu-text-secondary)" }}>
                      {lead.ultimo_contacto || "—"}
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      {lead.notas && (
                        <span className="flex items-start gap-1 text-[11px] leading-tight" style={{ color: "var(--nebu-text-secondary)" }}>
                          <StickyNote size={11} className="shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{lead.notas}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-1.5">
                        <button onClick={() => handleEdit(lead)} className="p-1.5 rounded hover:opacity-80" style={{ color: "var(--nebu-accent)" }}><Pencil size={13} /></button>
                        <button onClick={() => handleDelete(lead.id)} className="p-1.5 rounded hover:opacity-80" style={{ color: "#E53E3E" }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <p className="text-[11px]" style={{ color: "var(--nebu-text-secondary)" }}>
        {s.mostrando} {filtered.length} {s.de} {leads.length} {s.leads}
      </p>
    </div>
  );
};

export default LeadsPage;
