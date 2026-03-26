import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCrm } from "@/contexts/CrmContext";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Plus, Search, Pencil, Trash2, X, Save } from "lucide-react";
import { toast } from "sonner";
import EmptyState from "@/components/EmptyState";

type Estado = "por_contactar" | "contactado" | "en_negociacion" | "calificado" | "cerrado" | "descartado";

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
  const { user } = useAuth();
  const { leads, refreshLeads } = useCrm();
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

  const handleSave = async () => {
    if (!form.nombre.trim() || !user) return;
    const payload = { ...form, valor_estimado: Number(form.valor_estimado) || 0, ultimo_contacto: form.ultimo_contacto || null, user_id: user.id };
    if (editingId) {
      const { error } = await supabase.from("leads").update(payload as any).eq("id", editingId);
      if (!error) { toast.success(lang === "es" ? "Lead actualizado" : "Lead updated"); refreshLeads(); }
    } else {
      const { error } = await supabase.from("leads").insert(payload as any);
      if (!error) { toast.success(lang === "es" ? "Lead creado" : "Lead created"); refreshLeads(); }
    }
    setShowForm(false); setEditingId(null); setForm(emptyForm);
  };

  const handleEdit = (lead: any) => {
    setEditingId(lead.id);
    setForm({ nombre: lead.nombre, empresa: lead.empresa, email: lead.email, telefono: lead.telefono, servicio: lead.servicio, valor_estimado: lead.valor_estimado, fuente: lead.fuente, estado: lead.estado, notas: lead.notas, linkedin_url: lead.linkedin_url, ultimo_contacto: lead.ultimo_contacto || "" });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (!error) { toast.success(lang === "es" ? "Lead eliminado" : "Lead deleted"); refreshLeads(); }
  };

  const q = search.toLowerCase();
  const searched = leads.filter(l => l.nombre.toLowerCase().includes(q) || l.empresa.toLowerCase().includes(q) || l.servicio.toLowerCase().includes(q));
  const filtered = filter === "all" ? searched : searched.filter(l => l.estado === filter);

  const filters: { key: "all" | Estado; label: string }[] = [
    { key: "all", label: tt.all }, { key: "por_contactar", label: tt.por_contactar },
    { key: "contactado", label: tt.contactado }, { key: "en_negociacion", label: tt.en_negociacion },
    { key: "calificado", label: tt.calificado }, { key: "cerrado", label: tt.cerrado }, { key: "descartado", label: tt.descartado },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{tt.title}</h1>
          <p className="text-sm mt-1 text-muted-foreground">{tt.subtitle}</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus size={16} /> {tt.addLead}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl p-5 space-y-4 bg-card border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder={tt.nombre}
              className="rounded-lg px-3 py-2 text-sm outline-none bg-background border border-border text-foreground" />
            <input value={form.empresa} onChange={e => setForm(f => ({ ...f, empresa: e.target.value }))} placeholder={tt.empresa}
              className="rounded-lg px-3 py-2 text-sm outline-none bg-background border border-border text-foreground" />
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email"
              className="rounded-lg px-3 py-2 text-sm outline-none bg-background border border-border text-foreground" />
            <input type="number" value={form.valor_estimado} onChange={e => setForm(f => ({ ...f, valor_estimado: Number(e.target.value) }))} placeholder={tt.valor}
              className="rounded-lg px-3 py-2 text-sm outline-none bg-background border border-border text-foreground" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground">
              <Save size={14} /> {tt.save}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold text-muted-foreground border border-border">
              <X size={14} /> {tt.cancel}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tt.search}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none bg-background border border-border text-foreground" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap ${
                filter === f.key ? "bg-primary/10 text-primary border border-primary/20" : "bg-card text-muted-foreground border border-border"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-card border border-border">
          <EmptyState icon={UserPlus}
            title={{ es: "Leads vacío", en: "Leads empty" }}
            subtitle={{ es: "Agrega tu primer lead para comenzar.", en: "Add your first lead to get started." }}
            ctaLabel={{ es: "+ Agregar lead", en: "+ Add lead" }}
            onCta={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }} />
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden bg-card border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[tt.nombre, tt.empresa, tt.servicio, tt.valor, tt.estado, tt.actions].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => (
                  <tr key={lead.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors cursor-pointer">
                    <td className="px-4 py-3 font-medium text-foreground">{lead.nombre}</td>
                    <td className="px-4 py-3 text-muted-foreground">{lead.empresa}</td>
                    <td className="px-4 py-3 text-foreground">{lead.servicio}</td>
                    <td className="px-4 py-3 font-semibold text-green-400">${(lead.valor_estimado || 0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: estadoColors[lead.estado as Estado] + "20", color: estadoColors[lead.estado as Estado] }}>
                        {(tt as any)[lead.estado] || lead.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => handleEdit(lead)} className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"><Pencil size={13} /></button>
                        <button onClick={() => handleDelete(lead.id)} className="p-1.5 rounded text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
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
