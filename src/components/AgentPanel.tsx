import { useState, useRef, useEffect, useCallback } from "react";
import { Send, X, MessageCircle, Loader2 } from "lucide-react";
import { useCrm } from "@/contexts/CrmContext";

interface Message {
  role: "agent" | "user";
  text: string;
}

const quickCommands = ["estado proyectos", "leads", "tareas pendientes", "forecast", "nueva cotizacion"];

const SYSTEM_PROMPT = `You are NOVY, an AI operations agent for the NEBU CRM platform. You help freelancers manage projects, leads, tasks, and business operations. Be direct, concise, and helpful. Respond in the same language the user writes in. Use — for lists, ⚠ for alerts.`;

const AgentPanel = () => {
  const [messages, setMessages] = useState<Message[]>([{
    role: "agent",
    text: "¿Qué necesitas resolver hoy?",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { buildContextSummary } = useCrm();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const crmContext = buildContextSummary();
    const today = new Date().toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const fullSystem = SYSTEM_PROMPT + `\n\nTODAY: ${today}\n\nCRM STATE:\n${crmContext}`;

    const apiMessages = messages.map(m => ({ role: m.role === "agent" ? "assistant" as const : "user" as const, content: m.text }));
    apiMessages.push({ role: "user", content: text });

    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages, systemPrompt: fullSystem }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      setMessages(prev => [...prev, { role: "agent", text: data.content?.[0]?.text ?? "Sin respuesta." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "agent", text: `Error: ${e instanceof Error ? e.message : "desconocido"}` }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, buildContextSummary]);

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl flex items-center justify-center transition-all"
          aria-label="Abrir chat">
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-h-[600px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">N</div>
            <div className="flex-1">
              <div className="text-foreground font-bold text-sm">NOVY</div>
              <div className="text-muted-foreground text-xs">AI Agent</div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-muted-foreground hover:text-foreground"><X size={18} /></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`text-xs leading-relaxed whitespace-pre-wrap rounded-lg px-3 py-2 max-w-[85%] ${
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground border border-border"
                }`}>{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary border border-border rounded-xl px-3 py-2">
                  <Loader2 size={14} className="animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          <div className="px-4 pb-2 flex flex-wrap gap-1.5 bg-secondary/50">
            {quickCommands.map(cmd => (
              <button key={cmd} onClick={() => sendMessage(cmd)}
                className="text-xs px-2 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
                {cmd}
              </button>
            ))}
          </div>

          <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2 p-3 border-t border-border">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Escribe al agente..."
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
              disabled={loading} />
            <button type="submit" disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-40 flex items-center justify-center transition-colors">
              <Send size={14} className="text-primary-foreground" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AgentPanel;
