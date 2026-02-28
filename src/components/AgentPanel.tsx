import { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "agent" | "user";
  text: string;
}

const quickCommands = ["estado proyectos", "deadlines", "nuevo cliente", "cotización", "recomendar"];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-chat`;

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

async function streamChat(
  messages: { role: string; content: string }[],
  onDelta: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void
) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    let errorMsg = "Error del agente";
    try {
      const errData = await resp.json();
      errorMsg = errData.error || errorMsg;
    } catch {
      errorMsg = `Error ${resp.status}`;
    }
    onError(errorMsg);
    return;
  }

  if (!resp.body) {
    onError("No se recibió respuesta del agente.");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  // Flush remaining buffer
  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { /* ignore partial leftovers */ }
    }
  }

  onDone();
}

interface AgentPanelProps {
  open: boolean;
  onClose: () => void;
}

const AgentPanel = ({ open, onClose }: AgentPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const assistantBuffer = useRef("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return;
    const userMsg: Message = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStreaming(true);
    assistantBuffer.current = "";

    // Build conversation history for the API (excluding initial mock message)
    const apiMessages = [...messages, userMsg].map((m) => ({
      role: m.role === "agent" ? "assistant" : "user",
      content: m.text,
    }));

    try {
      await streamChat(
        apiMessages,
        (chunk) => {
          assistantBuffer.current += chunk;
          const currentText = assistantBuffer.current;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "agent" && prev.length > 1 && prev[prev.length - 2]?.role === "user") {
              return prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, text: currentText } : m
              );
            }
            return [...prev, { role: "agent", text: currentText }];
          });
        },
        () => setStreaming(false),
        (err) => {
          toast.error(err);
          setStreaming(false);
        }
      );
    } catch (e) {
      console.error("Stream error:", e);
      toast.error("Error de conexión con el agente");
      setStreaming(false);
    }
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
            <div className="text-[10px] font-mono text-nebu-text-dim truncate">Gemini · Flash · Operaciones activas</div>
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
              style={{ animationDelay: `${Math.min(i * 0.05, 0.3)}s` }}
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
          {streaming && messages[messages.length - 1]?.role !== "agent" && (
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
              disabled={streaming}
              className="text-[10px] font-mono px-2 py-1 rounded border border-nebu-border text-nebu-text-dim hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
              disabled={streaming}
              className="flex-1 bg-nebu-surface border border-nebu-border rounded px-3 py-2 text-xs font-mono text-foreground placeholder:text-nebu-muted focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || streaming}
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
