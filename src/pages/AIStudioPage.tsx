import { Bot, Send, Sparkles, FileText, BarChart3, Image, Zap, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const AIStudioPage = () => {
  const { lang } = useLanguage();
  const [input, setInput] = useState("");

  const quickActions = [
    { icon: Sparkles, label: { es: "Resumen del día", en: "Daily summary" } },
    { icon: FileText, label: { es: "Nueva cotización", en: "New quote" } },
    { icon: BarChart3, label: { es: "Estado proyectos", en: "Project status" } },
    { icon: Image, label: { es: "Generar imagen", en: "Generate image" } },
    { icon: Zap, label: { es: "Automatizar", en: "Automate" } },
    { icon: MessageSquare, label: { es: "Redactar mensaje", en: "Draft message" } },
  ];

  const suggestions = lang === "es"
    ? ["¿Cómo van mis proyectos activos?", "Genera una cotización para un sitio web", "Dame un resumen de mis ingresos"]
    : ["How are my active projects?", "Generate a quote for a website", "Give me an income summary"];

  return (
    <div className="flex h-[calc(100vh-112px)] gap-6">
      {/* Quick actions panel */}
      <div className="hidden md:flex flex-col w-56 shrink-0 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
          {lang === "es" ? "Acciones rápidas" : "Quick actions"}
        </h3>
        {quickActions.map((action, i) => (
          <button
            key={i}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-left"
          >
            <action.icon size={16} strokeWidth={1.5} />
            {action.label[lang]}
          </button>
        ))}
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col rounded-xl bg-card border border-border overflow-hidden">
        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-primary/10">
            <Bot size={24} strokeWidth={1.5} className="text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            {lang === "es" ? "Hola, soy NOVY." : "Hi, I'm NOVY."}
          </h2>
          <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
            {lang === "es"
              ? "Tu agente de operaciones. ¿Qué necesitas hoy?"
              : "Your operations agent. What do you need today?"}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="px-3.5 py-2 rounded-full text-xs border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 bg-background rounded-lg border border-border px-4 py-2.5 focus-within:border-primary transition-colors">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
              placeholder={lang === "es" ? "Escribe a NOVY..." : "Message NOVY..."}
            />
            <button className="p-1.5 rounded-md text-primary hover:bg-primary/10 transition-colors">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStudioPage;
