import { ShieldX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RestrictedPageProps {
  onGoBack: () => void;
}

const RestrictedPage = ({ onGoBack }: RestrictedPageProps) => {
  const { lang } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-32 px-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ backgroundColor: "rgba(230,57,70,0.08)", border: "1px solid rgba(230,57,70,0.15)" }}
      >
        <ShieldX size={28} strokeWidth={1.5} style={{ color: "#E63946" }} />
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: "#FFFFFF" }}>
        {lang === "es" ? "Acceso restringido" : "Access restricted"}
      </h3>
      <p className="text-sm text-center max-w-sm mb-6" style={{ color: "#71717A" }}>
        {lang === "es"
          ? "No tienes permisos para acceder a esta sección. Contacta a un administrador."
          : "You don't have permissions to access this section. Contact an administrator."}
      </p>
      <button
        onClick={onGoBack}
        className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
        style={{ backgroundColor: "#E63946", color: "#FFFFFF" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C62828")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E63946")}
      >
        {lang === "es" ? "Volver al Dashboard" : "Back to Dashboard"}
      </button>
    </div>
  );
};

export default RestrictedPage;
