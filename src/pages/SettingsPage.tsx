import { Settings, Shield, Plug, User, CreditCard, Bell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

type SettingsTab = "profile" | "team" | "integrations" | "billing" | "notifications";

const SettingsPage = () => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const tabs: { id: SettingsTab; label: Record<"es" | "en", string>; icon: React.ElementType }[] = [
    { id: "profile", label: { es: "Perfil", en: "Profile" }, icon: User },
    { id: "team", label: { es: "Equipo y Roles", en: "Team & Roles" }, icon: Shield },
    { id: "integrations", label: { es: "Integraciones", en: "Integrations" }, icon: Plug },
    { id: "billing", label: { es: "Facturación", en: "Billing" }, icon: CreditCard },
    { id: "notifications", label: { es: "Notificaciones", en: "Notifications" }, icon: Bell },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold text-foreground mb-6">
        {lang === "es" ? "Ajustes" : "Settings"}
      </h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <tab.icon size={15} strokeWidth={1.5} />
            {tab.label[lang]}
          </button>
        ))}
      </div>

      {/* Content placeholder */}
      <div className="rounded-xl bg-card border border-border p-8 flex flex-col items-center justify-center min-h-[300px]">
        <Settings size={28} strokeWidth={1.5} className="text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground text-center">
          {lang === "es"
            ? "Configuración disponible próximamente."
            : "Settings available soon."}
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
