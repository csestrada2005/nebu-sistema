import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, BarChart3, UserPlus, FileText, FolderOpen, TrendingUp, MessageSquare, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCrm } from "@/contexts/CrmContext";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  id: number;
  role: "user" | "novy";
  text: string;
}

const SYSTEM_PROMPT = `You are NOVY, an AI operations agent embedded in the NEBU CRM platform. You help freelancers and small agencies manage their projects, leads, tasks, payments, and business operations.

PERSONALITY: Direct, results-focused, helpful. No fluff. Respond in the same language the user writes in.

CAPABILITIES:
— Summarize project status, pipeline, revenue, and tasks
— Help draft quotes, emails, and client messages
— Analyze business metrics and suggest improvements
— Provide actionable recommendations

FORMAT: Use markdown. Use — for lists. Use ⚠ for alerts. Keep responses concise.`;

const NovyPage = () => {
  const { lang } = useLanguage();
  const { buildContextSummary } = useCrm();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const tt = {
    es: {
      greeting: "Hola, soy NOVY. Tu agente de operaciones. ¿Qué necesitas hoy?",
      placeholder: "Escribe a NOVY... Controla todo tu CRM desde aquí",
      suggestions: ["Resumen del día", "Crear nuevo lead", "Estado de proyectos"],
    },
    en: {
      greeting: "Hi, I'm NOVY. Your operations agent. What do you need today?",
      placeholder: "Write to NOVY... Control your entire CRM from here",
      suggestions: ["Daily summary", "Create new lead", "Project status"],
    },
  }[lang];

  const quickActions = [
    { icon: BarChart3, label: { es: "Resumen del día", en: "Daily summary" } },
    { icon: UserPlus, label: { es: "Nuevo lead", en: "New lead" } },
    { icon: FileText, label: { es: "Nueva cotización", en: "New quote" } },
    { icon: FolderOpen, label: { es: "Estado proyectos", en: "Project status" } },
    { icon: TrendingUp, label: { es: "Forecast", en: "Forecast" } },
    { icon: MessageSquare, label: { es: "Redactar mensaje", en: "Draft message" } },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { id: Date.now(), role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const crmContext = buildContextSummary();
    const today = new Date().toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const fullSystem = SYSTEM_PROMPT + `\n\nTODAY: ${today}\n\nCURRENT CRM STATE:\n${crmContext}`;

    const apiMessages = messages.map(m => ({
      role: m.role === "novy" ? "assistant" as const : "user" as const,
      content: m.text,
    }));
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

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: "novy",
        text: data.content?.[0]?.text ?? "Sin respuesta.",
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: "novy",
        text: `⚠ Error: ${e instanceof Error ? e.message : "desconocido"}`,
      }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, buildContextSummary]);

  const handleSend = () => sendMessage(input);
  const handleQuickAction = (label: string) => sendMessage(label);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-136px)] gap-4">
      {/* Quick Actions Panel */}
      <div className="hidden lg:flex w-[30%] flex-col rounded-xl p-4 bg-card border border-border">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-muted-foreground">
          {lang === "es" ? "Acciones rápidas" : "Quick actions"}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <button
              key={action.label.es}
              onClick={() => handleQuickAction(action.label[lang])}
              className="flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all duration-200 bg-background border border-border hover:border-primary/30 hover:bg-primary/5"
            >
              <action.icon size={20} strokeWidth={1.5} className="text-primary" />
              <span className="text-[11px] font-medium text-foreground">{action.label[lang]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col rounded-xl overflow-hidden bg-card border border-border">
        <div className="flex-1 overflow-y-auto p-6">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-primary/10">
                <Bot size={28} strokeWidth={1.5} className="text-primary" />
              </div>
              <p className="text-sm text-center max-w-md mb-6 text-muted-foreground">
                {tt.greeting}
              </p>
              <div className="flex gap-2 flex-wrap justify-center">
                {tt.suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleQuickAction(s)}
                    className="px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "novy" && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 shrink-0 bg-primary/15">
                      <Bot size={14} className="text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border text-foreground"
                    }`}
                  >
                    {msg.role === "novy" ? (
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 shrink-0 bg-primary/15">
                    <Bot size={14} className="text-primary" />
                  </div>
                  <div className="bg-background border border-border rounded-2xl px-4 py-3">
                    <Loader2 size={16} className="animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={tt.placeholder}
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary transition-colors"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-3 rounded-xl transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovyPage;
