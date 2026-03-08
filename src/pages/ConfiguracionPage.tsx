import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Settings, User, Bell, Palette, Shield, Save } from "lucide-react";

const t = {
  es: {
    title: "Configuración",
    subtitle: "Ajustes de perfil y preferencias del CRM",
    profile: "Perfil",
    name: "Nombre",
    email: "Correo electrónico",
    role: "Rol",
    phone: "Teléfono",
    notifications: "Notificaciones",
    emailNotif: "Notificaciones por email",
    emailNotifDesc: "Recibe alertas de nuevos prospectos y oportunidades",
    pushNotif: "Notificaciones push",
    pushNotifDesc: "Alertas en tiempo real en el navegador",
    weeklyReport: "Reporte semanal",
    weeklyReportDesc: "Resumen de actividad cada lunes",
    appearance: "Apariencia",
    theme: "Tema",
    dark: "Oscuro",
    light: "Claro",
    language: "Idioma",
    security: "Seguridad",
    password: "Cambiar contraseña",
    twoFactor: "Autenticación de dos factores",
    twoFactorDesc: "Protege tu cuenta con verificación adicional",
    save: "Guardar cambios",
    saved: "¡Cambios guardados!",
  },
  en: {
    title: "Settings",
    subtitle: "Profile settings and CRM preferences",
    profile: "Profile",
    name: "Name",
    email: "Email",
    role: "Role",
    phone: "Phone",
    notifications: "Notifications",
    emailNotif: "Email notifications",
    emailNotifDesc: "Receive alerts for new prospects and opportunities",
    pushNotif: "Push notifications",
    pushNotifDesc: "Real-time browser alerts",
    weeklyReport: "Weekly report",
    weeklyReportDesc: "Activity summary every Monday",
    appearance: "Appearance",
    theme: "Theme",
    dark: "Dark",
    light: "Light",
    language: "Language",
    security: "Security",
    password: "Change password",
    twoFactor: "Two-factor authentication",
    twoFactorDesc: "Protect your account with additional verification",
    save: "Save changes",
    saved: "Changes saved!",
  },
};

const ConfiguracionPage = () => {
  const { lang } = useLanguage();
  const labels = t[lang];
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className="w-10 h-5 rounded-full relative transition-colors" style={{ backgroundColor: on ? "var(--nebu-accent)" : "#333" }}>
      <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform" style={{ left: on ? "22px" : "2px" }} />
    </button>
  );

  const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
    <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: "var(--nebu-surface)", border: "1px solid var(--nebu-border)" }}>
      <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--nebu-text-secondary)" }}>
        <Icon size={16} /> {title}
      </h3>
      {children}
    </div>
  );

  const InputField = ({ label, value, type = "text" }: { label: string; value: string; type?: string }) => (
    <div className="space-y-1">
      <label className="text-xs font-semibold" style={{ color: "var(--nebu-text-secondary)" }}>{label}</label>
      <input
        type={type}
        defaultValue={value}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
        style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)", color: "var(--nebu-text)" }}
      />
    </div>
  );

  const ToggleRow = ({ label, desc, on, onToggle }: { label: string; desc: string; on: boolean; onToggle: () => void }) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--nebu-text)" }}>{label}</p>
        <p className="text-xs" style={{ color: "var(--nebu-text-secondary)" }}>{desc}</p>
      </div>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--nebu-text)" }}>
          <Settings size={24} style={{ color: "var(--nebu-accent)" }} />
          {labels.title}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--nebu-text-secondary)" }}>{labels.subtitle}</p>
      </div>

      <Section icon={User} title={labels.profile}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label={labels.name} value="Carlos Méndez" />
          <InputField label={labels.email} value="carlos@nebustudio.com" type="email" />
          <InputField label={labels.role} value={lang === "es" ? "Administrador" : "Administrator"} />
          <InputField label={labels.phone} value="+52 55 1234 5678" />
        </div>
      </Section>

      <Section icon={Bell} title={labels.notifications}>
        <ToggleRow label={labels.emailNotif} desc={labels.emailNotifDesc} on={emailNotif} onToggle={() => setEmailNotif(v => !v)} />
        <ToggleRow label={labels.pushNotif} desc={labels.pushNotifDesc} on={pushNotif} onToggle={() => setPushNotif(v => !v)} />
        <ToggleRow label={labels.weeklyReport} desc={labels.weeklyReportDesc} on={weeklyReport} onToggle={() => setWeeklyReport(v => !v)} />
      </Section>

      <Section icon={Palette} title={labels.appearance}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: "var(--nebu-text-secondary)" }}>{labels.theme}</label>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: "var(--nebu-accent)", color: "#fff" }}>{labels.dark}</button>
              <button className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: "var(--nebu-card)", color: "var(--nebu-text-secondary)", border: "1px solid var(--nebu-border)" }}>{labels.light}</button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: "var(--nebu-text-secondary)" }}>{labels.language}</label>
            <div className="flex gap-2">
              <button className={`px-4 py-2 rounded-lg text-sm font-semibold`} style={{ backgroundColor: lang === "es" ? "var(--nebu-accent)" : "var(--nebu-card)", color: lang === "es" ? "#fff" : "var(--nebu-text-secondary)", border: lang === "es" ? "none" : "1px solid var(--nebu-border)" }}>Español</button>
              <button className={`px-4 py-2 rounded-lg text-sm font-semibold`} style={{ backgroundColor: lang === "en" ? "var(--nebu-accent)" : "var(--nebu-card)", color: lang === "en" ? "#fff" : "var(--nebu-text-secondary)", border: lang === "en" ? "none" : "1px solid var(--nebu-border)" }}>English</button>
            </div>
          </div>
        </div>
      </Section>

      <Section icon={Shield} title={labels.security}>
        <ToggleRow label={labels.twoFactor} desc={labels.twoFactorDesc} on={twoFactor} onToggle={() => setTwoFactor(v => !v)} />
        <button className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)", color: "var(--nebu-text)" }}>
          {labels.password}
        </button>
      </Section>

      <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: "var(--nebu-accent)" }}>
        <Save size={16} /> {labels.save}
      </button>
    </div>
  );
};

export default ConfiguracionPage;
