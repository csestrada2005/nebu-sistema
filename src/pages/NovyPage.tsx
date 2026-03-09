import { useState, useRef, useEffect } from "react";
import { Bot, Send, BarChart3, UserPlus, FileText, FolderOpen, TrendingUp, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChatMessage {
  id: number;
  role: "user" | "novy";
  text: string;
}

const NovyPage = () => {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
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

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now(), role: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
  };

  const handleQuickAction = (label: string) => {
    const userMsg: ChatMessage = { id: Date.now(), role: "user", text: label };
    setMessages((m) => [...m, userMsg]);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-136px)] gap-4">
      {/* Quick Actions Panel — 30% */}
      <div className="hidden lg:flex w-[30%] flex-col rounded-xl p-4" style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#71717A" }}>
          {lang === "es" ? "Acciones rápidas" : "Quick actions"}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <button
              key={action.label.es}
              onClick={() => handleQuickAction(action.label[lang])}
              className="flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all duration-200"
              style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(230,57,70,0.3)"; e.currentTarget.style.backgroundColor = "rgba(230,57,70,0.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.backgroundColor = "#1A1A1A"; }}
            >
              <action.icon size={20} strokeWidth={1.5} style={{ color: "#E63946" }} />
              <span className="text-[11px] font-medium" style={{ color: "#FFFFFF" }}>{action.label[lang]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Panel — 70% */}
      <div className="flex-1 flex flex-col rounded-xl overflow-hidden" style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Chat body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(230,57,70,0.1)" }}>
                <Bot size={28} strokeWidth={1.5} style={{ color: "#E63946" }} />
              </div>
              <p className="text-sm text-center max-w-md mb-6" style={{ color: "#71717A" }}>
                {tt.greeting}
              </p>
              <div className="flex gap-2 flex-wrap justify-center">
                {tt.suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleQuickAction(s)}
                    className="px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                    style={{ border: "1px solid rgba(230,57,70,0.3)", color: "#E63946" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#E63946"; e.currentTarget.style.color = "#FFFFFF"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#E63946"; }}
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
                    <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 shrink-0" style={{ backgroundColor: "rgba(230,57,70,0.15)" }}>
                      <Bot size={14} style={{ color: "#E63946" }} />
                    </div>
                  )}
                  <div
                    className="max-w-[70%] px-4 py-3 rounded-2xl text-sm"
                    style={{
                      backgroundColor: msg.role === "user" ? "#FFFFFF" : "#1A1A1A",
                      color: msg.role === "user" ? "#0D0D0D" : "#FFFFFF",
                      border: msg.role === "novy" ? "1px solid rgba(255,255,255,0.06)" : "none",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={tt.placeholder}
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.06)", color: "#FFFFFF" }}
            />
            <button
              onClick={handleSend}
              className="p-3 rounded-xl transition-all duration-200"
              style={{ backgroundColor: "#E63946", color: "#FFFFFF" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C62828")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E63946")}
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
