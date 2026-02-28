import { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";

interface Message {
  role: "agent" | "user";
  text: string;
}

const quickCommands = ["estado proyectos", "deadlines", "nuevo cliente", "cotización", "recomendar"];

const initialMessage: Message = {
  role: "agent",
  text: `— Resumen de operaciones activas:

— Raw Paw (NB-001): E-commerce + Branding · $25,000 MXN · Paso 7/12 (Revisión)
  ⚠ En revisión — pendiente aprobación del cliente. Seguimiento recomendado.
— Papachoa (NB-002): Landing + Social Media · $22,500 MXN · Paso 5/12 (Research)
— Bazar Centenario (NB-003): Identidad + Web vitrina · $12,500 MXN · Paso 3/12 (Contrato)

Pendiente de cobro: $12,500 MXN (Bazar Centenario)
Pipeline: 5 leads activos.`,
};

async function getClaudeResponse(messages: Message[]): Promise<string> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) return "⚠ API key no configurada. Añade VITE_ANTHROPIC_API_KEY a tu .env";

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: "Eres un asistente de CRM para Nebu Studio. Responde siempre en español, de forma directa y concisa. Usa listas con '—' y alertas con '⚠' cuando aplique.",
      messages: messages.map((m) => ({
        role: m.role === "agent" ? "assistant" : "user",
        content: m.text,
      })),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return `⚠ Error de API (${res.status}): ${err}`;
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? "Sin respuesta del agente.";
}

interface AgentPanelProps {
  open: boolean;
  onClose: () => void;
}

const AgentPanel = ({ open, onClose }: AgentPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text: text.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setTyping(true);

    const response = await getClaudeResponse(updated);
    setTyping(false);
    setMessages((prev) => [...prev, { role: "agent", text: response }]);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed lg:static top-0 right-0 z-50 h-full w-[380px] max-w-full bg-nebu-carbon border-l border-nebu-border
          flex flex-col transition-transform duration-200
          ${open ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="h-14 flex items-center gap-3 px-4 border-b border-nebu-border shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-display text-sm text-primary-foreground">
            N
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">Agente NEBU</div>
            <div className="text-[10px] font-mono text-nebu-text-dim truncate">Claude · Sonnet · Operaciones activas</div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-nebu-surface rounded transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`animate-fade-up ${msg.role === "user" ? "flex justify-end" : ""}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div
                className={`
                  text-xs leading-relaxed whitespace-pre-wrap rounded-md px-3 py-2 max-w-[90%]
                  ${msg.role === "agent"
                    ? "bg-nebu-surface text-foreground font-mono"
                    : "bg-primary/10 text-foreground border border-primary/20"
                  }
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex items-center gap-1 px-3 py-2">
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-nebu-muted" />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-nebu-muted" />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-nebu-muted" />
            </div>
          )}
        </div>

        {/* Quick commands */}
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {quickCommands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => sendMessage(cmd)}
              className="text-[10px] font-mono px-2 py-1 rounded border border-nebu-border text-nebu-text-dim hover:border-primary hover:text-primary transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-nebu-border">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe al agente..."
              className="flex-1 bg-nebu-surface border border-nebu-border rounded px-3 py-2 text-xs font-mono text-foreground placeholder:text-nebu-muted focus:border-primary focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </aside>
    </>
  );
};

export default AgentPanel;
