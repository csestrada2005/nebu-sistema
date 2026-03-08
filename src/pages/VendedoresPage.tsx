import { Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const t = {
  title: { es: "EQUIPO DE VENTAS", en: "SALES TEAM" },
  subtitle: { es: "Rendimiento del equipo comercial", en: "Commercial team performance" },
  activeLeads: { es: "Leads activos", en: "Active leads" },
  closesMonth: { es: "Cierres este mes", en: "Closes this month" },
  commission: { es: "Comisión", en: "Commission" },
  monthlyGoal: { es: "Meta mensual", en: "Monthly goal" },
};

interface Seller {
  name: string;
  initials: string;
  color: string;
  leads: number;
  closes: number;
  commission: number;
  goal: number;
}

const sellers: Seller[] = [
  { name: "Olivia", initials: "OL", color: "#E53E3E", leads: 8, closes: 2, commission: 35000, goal: 80 },
  { name: "Ali", initials: "AL", color: "#4A9EDB", leads: 5, closes: 1, commission: 15000, goal: 45 },
  { name: "Rodrigo", initials: "RO", color: "#D4A84B", leads: 3, closes: 0, commission: 0, goal: 15 },
];

const VendedoresPage = () => {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Users size={22} style={{ color: "var(--nebu-accent)" }} />
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--nebu-text)" }}>{t.title[lang]}</h1>
        </div>
        <p className="text-sm" style={{ color: "var(--nebu-text-secondary)" }}>{t.subtitle[lang]}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sellers.map((s) => (
          <div key={s.name} className="rounded-lg p-6 space-y-5" style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: s.color + "22", color: s.color }}>
                {s.initials}
              </div>
              <h3 className="text-lg font-semibold" style={{ color: "var(--nebu-text)" }}>{s.name}</h3>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--nebu-text-secondary)" }}>{t.activeLeads[lang]}</span>
                <span className="font-semibold" style={{ color: "var(--nebu-text)" }}>{s.leads}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--nebu-text-secondary)" }}>{t.closesMonth[lang]}</span>
                <span className="font-semibold" style={{ color: "var(--nebu-text)" }}>{s.closes}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--nebu-text-secondary)" }}>{t.commission[lang]}</span>
                <span className="font-semibold" style={{ color: "#4ADB7A" }}>${s.commission.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span style={{ color: "var(--nebu-text-secondary)" }}>{t.monthlyGoal[lang]}</span>
                <span className="font-semibold" style={{ color: "var(--nebu-text)" }}>{s.goal}%</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: "var(--nebu-surface)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${s.goal}%`, backgroundColor: s.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendedoresPage;
