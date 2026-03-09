import { LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmptyStateProps {
  icon: LucideIcon;
  title: { es: string; en: string };
  subtitle: { es: string; en: string };
  ctaLabel?: { es: string; en: string };
  onCta?: () => void;
}

const EmptyState = ({ icon: Icon, title, subtitle, ctaLabel, onCta }: EmptyStateProps) => {
  const { lang } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ backgroundColor: "rgba(230,57,70,0.08)", border: "1px solid rgba(230,57,70,0.15)" }}
      >
        <Icon size={28} strokeWidth={1.5} style={{ color: "#E63946" }} />
      </div>
      <h3 className="text-lg font-semibold mb-1.5" style={{ color: "#FFFFFF" }}>
        {title[lang]}
      </h3>
      <p className="text-sm text-center max-w-sm mb-6" style={{ color: "#71717A" }}>
        {subtitle[lang]}
      </p>
      {ctaLabel && (
        <button
          onClick={onCta}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
          style={{ backgroundColor: "#E63946", color: "#FFFFFF" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C62828")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E63946")}
        >
          {ctaLabel[lang]}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
