import { FolderOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EmptyState from "@/components/EmptyState";

const ProyectosPage = () => {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {lang === "es" ? "Proyectos" : "Projects"}
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            {lang === "es" ? "Gestiona tus proyectos y entregas" : "Manage your projects and deliveries"}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          + {lang === "es" ? "Nuevo proyecto" : "New project"}
        </button>
      </div>

      <div className="rounded-xl bg-card border border-border">
        <EmptyState
          icon={FolderOpen}
          title={{ es: "Sin proyectos aún", en: "No projects yet" }}
          subtitle={{ es: "Agrega tu primer proyecto para comenzar a gestionar entregas y clientes.", en: "Add your first project to start managing deliveries and clients." }}
          ctaLabel={{ es: "+ Nuevo proyecto", en: "+ New project" }}
        />
      </div>
    </div>
  );
};

export default ProyectosPage;
