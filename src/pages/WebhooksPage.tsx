import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type WStatus = "processed" | "failed" | "pending";

interface WebhookEntry {
  id: number; date: string; time: string;
  origin: string; event: Record<"es"|"en", string>;
  payload: string; status: WStatus;
}

const mockData: WebhookEntry[] = [
  { id: 1, date: "08/03/2026", time: "14:32", origin: "WhatsApp", event: { es: "Mensaje entrante", en: "Incoming message" }, payload: '{"from":"+5215512345678","body":"Hola, me interesa..."}', status: "processed" },
  { id: 2, date: "08/03/2026", time: "13:15", origin: "Stripe", event: { es: "Pago completado", en: "Payment completed" }, payload: '{"amount":17500,"currency":"mxn","customer":"cus_Raw..."}', status: "processed" },
  { id: 3, date: "08/03/2026", time: "12:48", origin: "Typeform", event: { es: "Formulario enviado", en: "Form submitted" }, payload: '{"email":"diana@coach.mx","service":"Landing Page"}', status: "processed" },
  { id: 4, date: "08/03/2026", time: "11:20", origin: "Meta", event: { es: "Lead ad recibido", en: "Lead ad received" }, payload: '{"campaign_id":"camp_123","lead_name":"Carlos M."}', status: "pending" },
  { id: 5, date: "07/03/2026", time: "18:05", origin: "Stripe", event: { es: "Pago fallido", en: "Payment failed" }, payload: '{"amount":11250,"error":"card_declined","customer":...}', status: "failed" },
  { id: 6, date: "07/03/2026", time: "16:30", origin: "WhatsApp", event: { es: "Mensaje entrante", en: "Incoming message" }, payload: '{"from":"+5215598765432","body":"¿Cuánto cuesta un..."}', status: "processed" },
  { id: 7, date: "07/03/2026", time: "10:12", origin: "Meta", event: { es: "Conversión registrada", en: "Conversion registered" }, payload: '{"pixel_id":"px_456","event":"Purchase","value":35000}', status: "processed" },
  { id: 8, date: "06/03/2026", time: "09:00", origin: "Typeform", event: { es: "Formulario enviado", en: "Form submitted" }, payload: '{"email":"roberto@construc.mx","service":"E-commerce"}', status: "failed" },
];

const origins = ["WhatsApp", "Stripe", "Typeform", "Meta"];
const statuses: WStatus[] = ["processed", "failed", "pending"];

const statusStyle: Record<WStatus, { bg: string; color: string }> = {
  processed: { bg: "rgba(34,197,94,0.1)", color: "#22c55e" },
  failed: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
  pending: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
};

const WebhooksPage = () => {
  const { lang } = useLanguage();
  const [filterOrigin, setFilterOrigin] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const tt = {
    es: { title: "Webhooks", subtitle: "Log de eventos entrantes de servicios externos", all: "Todos", origin: "Origen", dateTime: "Fecha/Hora", event: "Evento", payload: "Payload", status: "Estado", statusLabels: { processed: "Procesado", failed: "Fallido", pending: "Pendiente" } as Record<WStatus, string> },
    en: { title: "Webhooks", subtitle: "Log of incoming events from external services", all: "All", origin: "Origin", dateTime: "Date/Time", event: "Event", payload: "Payload", status: "Status", statusLabels: { processed: "Processed", failed: "Failed", pending: "Pending" } as Record<WStatus, string> },
  }[lang];

  const filtered = mockData.filter(d => (filterOrigin === "all" || d.origin === filterOrigin) && (filterStatus === "all" || d.status === filterStatus));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{tt.title}</h1>
        <p className="text-sm mt-1" style={{ color: "#888" }}>{tt.subtitle}</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {[{ key: "all", label: tt.all }, ...origins.map(o => ({ key: o, label: o }))].map(f => (
          <button key={f.key} onClick={() => setFilterOrigin(f.key)} className="text-xs px-3 py-1.5 rounded font-medium transition-colors"
            style={{ backgroundColor: filterOrigin === f.key ? "#E53E3E" : "#1a1a1a", color: filterOrigin === f.key ? "white" : "#888", border: "1px solid #2a2a2a" }}>{f.label}</button>
        ))}
        <div className="w-px mx-1" style={{ backgroundColor: "#2a2a2a" }} />
        {[{ key: "all", label: tt.all }, ...statuses.map(s => ({ key: s, label: tt.statusLabels[s] }))].map(f => (
          <button key={f.key} onClick={() => setFilterStatus(f.key)} className="text-xs px-3 py-1.5 rounded font-medium transition-colors"
            style={{ backgroundColor: filterStatus === f.key ? "#E53E3E" : "#1a1a1a", color: filterStatus === f.key ? "white" : "#888", border: "1px solid #2a2a2a" }}>{f.label}</button>
        ))}
      </div>
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #2a2a2a" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#111" }}>
              {[tt.dateTime, tt.origin, tt.event, tt.payload, tt.status].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#E53E3E" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id} style={{ borderTop: "1px solid #1a1a1a" }}>
                <td className="px-4 py-3 text-xs" style={{ color: "#888" }}>{row.date} {row.time}</td>
                <td className="px-4 py-3 text-xs text-white font-medium">{row.origin}</td>
                <td className="px-4 py-3 text-xs text-white">{row.event[lang]}</td>
                <td className="px-4 py-3 text-xs font-mono max-w-[200px] truncate" style={{ color: "#666" }}>{row.payload}</td>
                <td className="px-4 py-3">
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={statusStyle[row.status]}>{tt.statusLabels[row.status]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WebhooksPage;
