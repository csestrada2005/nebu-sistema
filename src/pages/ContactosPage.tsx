import { useState } from "react";
import { Search, Plus, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const t = {
  es: {
    title: "Contactos",
    subtitle: "Clientes, prospectos y colaboradores",
    nuevo: "+ Nuevo Contacto",
    buscar: "Buscar por nombre, empresa o email...",
    nombre: "Nombre",
    empresa: "Empresa",
    tipo: "Tipo",
    email: "Email",
    telefono: "Teléfono",
    canal: "Canal",
    ultimoContacto: "Último contacto",
    estado: "Estado",
    cliente: "Cliente",
    prospecto: "Prospecto",
    colaborador: "Colaborador",
    activo: "Activo",
    enSeguimiento: "En seguimiento",
    sinRespuesta: "Sin respuesta",
    llamadaAgendada: "Llamada agendada",
    referido: "Referido",
    interno: "Interno",
    mostrando: "Mostrando",
    de: "de",
    contactos: "contactos",
  },
  en: {
    title: "Contacts",
    subtitle: "Clients, prospects and collaborators",
    nuevo: "+ New Contact",
    buscar: "Search by name, company or email...",
    nombre: "Name",
    empresa: "Company",
    tipo: "Type",
    email: "Email",
    telefono: "Phone",
    canal: "Channel",
    ultimoContacto: "Last contact",
    estado: "Status",
    cliente: "Client",
    prospecto: "Prospect",
    colaborador: "Collaborator",
    activo: "Active",
    enSeguimiento: "In follow-up",
    sinRespuesta: "No response",
    llamadaAgendada: "Call scheduled",
    referido: "Referral",
    interno: "Internal",
    mostrando: "Showing",
    de: "of",
    contactos: "contacts",
  },
};

type ContactType = "cliente" | "prospecto" | "colaborador";
type ContactStatus = "activo" | "enSeguimiento" | "sinRespuesta" | "llamadaAgendada";
type ContactChannel = "LinkedIn" | "Referido" | "Web" | "Interno";

interface Contact {
  name: string;
  company: string;
  type: ContactType;
  email: string;
  phone: string;
  channel: ContactChannel;
  lastContact: string;
  status: ContactStatus;
}

const CONTACTS: Contact[] = [
  { name: "Miriam López", company: "PAPACHOA", type: "cliente", email: "miriam@papachoa.com", phone: "+52 33 8765 4321", channel: "Referido", lastContact: "15/02/2026", status: "activo" },
  { name: "Iñigo Martínez", company: "BAZAR CENTENARIO", type: "cliente", email: "inigo@bazarcentenario.com", phone: "+52 33 5555 1234", channel: "LinkedIn", lastContact: "01/03/2026", status: "activo" },
  { name: "Carlos Mendoza", company: "Clínica Dental Sonrisa", type: "prospecto", email: "carlos@clinicasonrisa.mx", phone: "+52 33 9999 8888", channel: "LinkedIn", lastContact: "05/03/2026", status: "enSeguimiento" },
  { name: "Ana Rodríguez", company: "Restaurante La Hacienda", type: "prospecto", email: "ana@lahacienda.mx", phone: "+52 33 7777 6666", channel: "LinkedIn", lastContact: "25/02/2026", status: "sinRespuesta" },
  { name: "Roberto Sánchez", company: "Constructora SB", type: "prospecto", email: "roberto@constructorasb.mx", phone: "+52 33 2222 1111", channel: "LinkedIn", lastContact: "06/03/2026", status: "llamadaAgendada" },
  { name: "Samuel Nebu", company: "—", type: "colaborador", email: "samuel@nebu.studio", phone: "+52 33 1111 0000", channel: "Interno", lastContact: "08/03/2026", status: "activo" },
];

const statusColors: Record<ContactStatus, string> = {
  activo: "#22C55E",
  enSeguimiento: "#EAB308",
  sinRespuesta: "#888888",
  llamadaAgendada: "#3B82F6",
};

const typeColors: Record<ContactType, string> = {
  cliente: "#22C55E",
  prospecto: "#EAB308",
  colaborador: "#3B82F6",
};

const ContactosPage = () => {
  const { lang } = useLanguage();
  const s = t[lang];
  const [search, setSearch] = useState("");

  const filtered = CONTACTS.filter((c) => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const typeLabel = (type: ContactType) => s[type];
  const statusLabel = (status: ContactStatus) => s[status];
  const channelLabel = (ch: ContactChannel) => {
    if (ch === "Referido") return s.referido;
    if (ch === "Interno") return s.interno;
    return ch;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#FFFFFF" }}>{s.title}</h1>
          <p className="text-sm" style={{ color: "#888888" }}>{s.subtitle}</p>
        </div>
        <button
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors self-start sm:self-auto"
          style={{ backgroundColor: "#E63946", color: "#FFFFFF" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C62828")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E63946")}
        >
          {s.nuevo}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#888888" }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={s.buscar}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none"
          style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", color: "#FFFFFF" }}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #2A2A2A" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ color: "#FFFFFF" }}>
            <thead>
              <tr style={{ backgroundColor: "#111111" }}>
                {[s.nombre, s.empresa, s.tipo, s.email, s.telefono, s.canal, s.ultimoContacto, s.estado].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold tracking-wider whitespace-nowrap" style={{ color: "#888888" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={i}
                  className="transition-colors"
                  style={{ backgroundColor: i % 2 === 0 ? "#1A1A1A" : "#151515", borderTop: "1px solid #2A2A2A" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#222222")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? "#1A1A1A" : "#151515")}
                >
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{c.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{c.company}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${typeColors[c.type]}20`, color: typeColors[c.type] }}>
                      {typeLabel(c.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 hover:underline" style={{ color: "#CCCCCC" }}>
                      <Mail size={12} /> {c.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="flex items-center gap-1.5" style={{ color: "#CCCCCC" }}>
                      <Phone size={12} /> {c.phone}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#CCCCCC" }}>{channelLabel(c.channel)}</td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#CCCCCC" }}>{c.lastContact}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[c.status] }} />
                      <span style={{ color: statusColors[c.status], fontSize: 12, fontWeight: 600 }}>{statusLabel(c.status)}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <p className="text-[11px]" style={{ color: "#888888" }}>
        {s.mostrando} {filtered.length} {s.de} {CONTACTS.length} {s.contactos}
      </p>
    </div>
  );
};

export default ContactosPage;
