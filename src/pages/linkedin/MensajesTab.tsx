import { useState } from "react";
import { Send } from "lucide-react";

const messages = [
  { from: "Josep", text: "Hola Roberto, vi que tienes Constructora SB. Me especializo en crear sitios web que generan clientes para negocios como el tuyo. ¿Te interesaría una llamada de 15 min?" },
  { from: "Roberto", text: "Hola Josep, gracias por contactarme. La verdad sí necesitamos mejorar nuestra presencia web, la página actual está muy lenta." },
  { from: "Josep", text: "Perfecto, justo en eso nos especializamos. Podemos hacer un sitio rápido, optimizado para SEO y que convierta visitantes en cotizaciones. ¿Te parece el miércoles a las 11am?" },
  { from: "Roberto", text: "El miércoles me funciona bien. Mándame el link de la reunión." },
];

const templates = ["Primer contacto", "Follow-up", "Agendar llamada", "Propuesta"];

const MensajesTab = () => {
  const [input, setInput] = useState("");

  return (
    <div
      className="rounded-lg flex flex-col h-[calc(100vh-220px)]"
      style={{ backgroundColor: "var(--nebu-card)", border: "1px solid var(--nebu-border)" }}
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.map((m, i) => {
          const isJosep = m.from === "Josep";
          return (
            <div key={i} className={`flex ${isJosep ? "justify-start" : "justify-end"}`}>
              <div
                className="max-w-[70%] rounded-lg px-4 py-3 text-sm"
                style={{
                  backgroundColor: isJosep ? "var(--nebu-bg)" : "var(--nebu-active-bg)",
                  color: "var(--nebu-text)",
                  border: `1px solid var(--nebu-border)`,
                }}
              >
                <p className="text-[10px] font-semibold mb-1" style={{ color: "var(--nebu-accent)" }}>{m.from}</p>
                <p className="leading-relaxed">{m.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Templates */}
      <div className="px-5 pb-2 flex gap-2 flex-wrap">
        {templates.map((t) => (
          <button
            key={t}
            className="text-[11px] px-3 py-1 rounded-full font-medium transition-colors"
            style={{
              backgroundColor: "var(--nebu-active-bg)",
              color: "var(--nebu-text-secondary)",
              border: "1px solid var(--nebu-border)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 flex gap-2" style={{ borderTop: "1px solid var(--nebu-border)" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 text-sm rounded-md px-3 py-2"
          style={{
            backgroundColor: "var(--nebu-bg)",
            color: "var(--nebu-text)",
            border: "1px solid var(--nebu-border)",
          }}
        />
        <button
          className="px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5"
          style={{ backgroundColor: "var(--nebu-accent)", color: "#fff" }}
        >
          <Send size={14} /> Enviar
        </button>
      </div>
    </div>
  );
};

export default MensajesTab;
