import { useLanguage } from "@/contexts/LanguageContext";

type ConnStatus = "connected" | "disconnected";

interface Integration {
  name: string;
  description: Record<"es"|"en", string>;
  status: ConnStatus;
  color: string;
  initials: string;
}

const integrations: Integration[] = [
  { name: "Make", initials: "Mk", color: "#9b59b6", status: "connected", description: { es: "Automatización de flujos", en: "Workflow automation" } },
  { name: "Stripe", initials: "St", color: "#635bff", status: "connected", description: { es: "Procesamiento de pagos", en: "Payment processing" } },
  { name: "WhatsApp API", initials: "WA", color: "#25d366", status: "connected", description: { es: "Mensajería directa", en: "Direct messaging" } },
  { name: "Google Analytics", initials: "GA", color: "#f9ab00", status: "connected", description: { es: "Analítica web", en: "Web analytics" } },
  { name: "Slack", initials: "Sl", color: "#4a154b", status: "disconnected", description: { es: "Comunicación de equipo", en: "Team communication" } },
  { name: "Notion", initials: "No", color: "#ffffff", status: "disconnected", description: { es: "Base de conocimiento", en: "Knowledge base" } },
  { name: "HubSpot", initials: "HS", color: "#ff7a59", status: "disconnected", description: { es: "CRM externo", en: "External CRM" } },
  { name: "Mailchimp", initials: "MC", color: "#ffe01b", status: "disconnected", description: { es: "Email marketing", en: "Email marketing" } },
];

const IntegracionesPage = () => {
  const { lang } = useLanguage();
  const tt = {
    es: { title: "Integraciones", subtitle: "Servicios conectados a tu CRM", connected: "Conectado", disconnected: "Desconectado", connect: "Conectar" },
    en: { title: "Integrations", subtitle: "Services connected to your CRM", connected: "Connected", disconnected: "Disconnected", connect: "Connect" },
  }[lang];

  const connectedCount = integrations.filter(i => i.status === "connected").length;
  const disconnectedCount = integrations.filter(i => i.status === "disconnected").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{tt.title}</h1>
        <p className="text-sm mt-1" style={{ color: "#888" }}>{tt.subtitle}</p>
      </div>
      <div className="flex gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22c55e" }} />
          {connectedCount} {tt.connected}
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: "rgba(136,136,136,0.1)", color: "#888", border: "1px solid rgba(136,136,136,0.2)" }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#888" }} />
          {disconnectedCount} {tt.disconnected}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {integrations.map(integ => {
          const isConn = integ.status === "connected";
          return (
            <div key={integ.name} className="rounded-lg p-5 transition-all duration-200 hover:translate-y-[-2px]" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: integ.color + "30", color: integ.color === "#ffffff" ? "#ccc" : integ.color }}>
                  {integ.initials}
                </div>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={isConn ? { backgroundColor: "rgba(34,197,94,0.1)", color: "#22c55e" } : { backgroundColor: "rgba(136,136,136,0.1)", color: "#888" }}>
                  {isConn ? tt.connected : tt.disconnected}
                </span>
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{integ.name}</h3>
              <p className="text-xs mb-4" style={{ color: "#888" }}>{integ.description[lang]}</p>
              <div className="flex items-center justify-between">
                <div className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors" style={{ backgroundColor: isConn ? "#22c55e" : "#333" }}>
                  <div className="w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: isConn ? "translateX(20px)" : "translateX(0px)" }} />
                </div>
                {!isConn && (
                  <button className="text-xs px-3 py-1.5 rounded font-medium" style={{ backgroundColor: "#E53E3E20", color: "#E53E3E" }}>{tt.connect}</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IntegracionesPage;
