import { Contact } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EmptyState from "@/components/EmptyState";

const ContactosPage = () => {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "#FFFFFF" }}>
            {lang === "es" ? "Contactos" : "Contacts"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#71717A" }}>
            {lang === "es" ? "Clientes, prospectos y colaboradores" : "Clients, prospects and collaborators"}
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
          style={{ backgroundColor: "#E63946", color: "#FFFFFF" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C62828")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E63946")}
        >
          + {lang === "es" ? "Nuevo contacto" : "New contact"}
        </button>
      </div>

      <div className="rounded-xl" style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
        <EmptyState
          icon={Contact}
          title={{ es: "Contactos vacío", en: "Contacts empty" }}
          subtitle={{ es: "Agrega tu primer contacto para comenzar.", en: "Add your first contact to get started." }}
          ctaLabel={{ es: "+ Agregar contacto", en: "+ Add contact" }}
        />
      </div>
    </div>
  );
};

export default ContactosPage;
