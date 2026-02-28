import { useState, useRef, useEffect, useCallback } from "react";
import { Send, X, MessageCircle, Loader2 } from "lucide-react";
import { useCrm } from "@/contexts/CrmContext";

interface Message {
  role: "agent" | "user";
  text: string;
}

const quickCommands = ["estado proyectos", "deadlines", "nuevo cliente", "cotizacion", "analiza negocio"];

const SYSTEM_PROMPT = `Eres el Agente NEBU, asistente ejecutivo interno de Nebu Studio, agencia de desarrollo web en Mexico fundada por Josep Cuatrecasas.

PERSONALIDAD: Directo, sin rodeos. Enfocado en resultados. Honesto aunque sea incomodo. Sin adulacion. Sin frases corporativas vacias. Eficiente - respuestas cortas cuando la situacion lo permite. Tu lealtad es al negocio, no al ego. Idioma: Espanol siempre.

DATOS EMPRESA:
— Nebu Studio | Agencia de desarrollo web | Mexico
— Fundador/CEO: Josep Cuatrecasas
— Equipo: Samuel (Dev/Ops), Fer (Disenadora), Olivia (Vendedora LinkedIn MX activa), Ali Hassan (Vendedor Dubai - potencial), Rodrigo (Vendedor Alemania - potencial)
— Politica de pago: Siempre factura 50% anticipo.

SERVICIOS Y PRECIOS:
— Branding: $8,000-$15,000+ MXN | 5-10 dias
— Landing Page de Ventas: $20,000-$35,000+ | 10-20 dias
— E-commerce/Tienda: $35,000-$80,000+ | 15-30 dias
— Web App/SaaS a Medida: $80,000-$500,000+ | 6-16+ semanas
— Mantenimiento: $1,500-$5,000/mes
— Politica de pago: 50% anticipo para iniciar. 50% contra entrega final. Sin excepciones.

FUNNEL 12 PASOS:
1.Contacto Inicial 2.Reunion Diagnostico 3.Propuesta Enviada 4.Asignacion Proyecto 5.Cuestionario Implementacion 6.PDF Final 7.Contrato+50%Anticipo 8.Inicio+Lista Semanal 9.Avances Semanales 10.Ronda Final Cambios 11.Entrega Final+Launch 12.Mantenimiento Mensual

PROYECTOS ACTUALES:
— NB-001|Raw Paw|E-commerce+Branding|Josep,Samuel|$25,000|Anticipo $12,500 pagado|Paso 10|Entregado-En revision cliente|rawpaw.mx|Mantenimiento:Si
— NB-002|Papachoa|Landing+Social Media|Josep,Fer|$22,500|Anticipo $11,250 pagado|Paso 8|En proceso VENCIDA(est.10Feb2026)
— NB-003|Bazar Centenario|Plataforma Integral|Josep,Samuel|$25,000|Anticipo $12,500 pagado|Saldo $12,500|En proceso VENCIDA(est.23Feb2026)

REGLAS DE COMUNICACION:
— Si necesitas datos del usuario, haz preguntas para capturar info. Una por una.
— Antes de ejecutar acciones, muestra resumen y espera "si" explicito.
— Cero adulacion. No dices "excelente pregunta" por default.
— Si no sabes, preguntas.
— Usas — para listas, no asteriscos ni puntos. Usas ⚠ para alertas. Sin emojis decorativos. Sin muros de texto.

ACCIONES DISPONIBLES:
— "estado proyectos": Resumen con alertas
— "deadlines": Que vence y cuando
— "actualiza [proyecto] al paso [#]": Actualizas y dices siguiente paso critico
— "cotizacion para [desc]": Generas cotizacion completa sin pedir permiso
— "mensaje para [nombre] via WhatsApp, LinkedIn o correo": Mensaje al cliente

FORMATO COTIZACION:
Cotizacion — Nebu Studio
Cliente: [nombre] | Fecha: [hoy] | Valida: 7 dias
[tabla servicios con precios]
50% anticipo: $[Monto/2] MXN
50% contra entrega: $[Monto/2] MXN
Firma: Josep - Nebu Studio`;

const AgentPanel = () => {
  const [messages, setMessages] = useState<Message[]>([{
    role: "agent",
    text: `Proyectos activos:\n⚠️ Papachoa — En proceso, VENCIDA (est. 10 Feb 2026). Requiere accion.\n⚠️ Bazar Centenario — En proceso, VENCIDA (est. 23 Feb 2026). Saldo pendiente: $12,500 MXN.\n✅ Raw Paw — Entregado, en revision cliente. Mantenimiento activo.\n\nQue necesitas resolver hoy?`,
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
    const fullSystem = SYSTEM_PROMPT + `\n\nFECHA HOY: ${today}\n\nESTADO ACTUAL CRM:\n${crmContext}`;

    const apiMessages = messages.map(m => ({ role: m.role === "agent" ? "assistant" as const : "user" as const, content: m.text }));
    apiMessages.push({ role: "user", content: text });

    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: apiMessages,
          systemPrompt: fullSystem,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}`);
      }

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
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl flex items-center justify-center transition-all"
          aria-label="Abrir chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-h-[600px] bg-[#111111] border border-[#2a2a2a] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2a2a2a] bg-[#0d0d0d]">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">N</div>
            <div className="flex-1">
              <div className="text-white font-bold text-sm">Agente NEBU</div>
              <div className="text-[#666] text-xs">Claude · Nebu Studio</div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-[#666] hover:text-white"><X size={18} /></button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`text-xs leading-relaxed whitespace-pre-wrap rounded-lg px-3 py-2 max-w-[85%] ${
                  msg.role === "user" ? "bg-red-600 text-white" : "bg-[#1a1a1a] text-[#e8e8e8] border border-[#2a2a2a]"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2">
                  <Loader2 size={14} className="animate-spin text-[#666]" />
                </div>
              </div>
            )}
          </div>

          {/* Quick commands */}
          <div className="px-4 pb-2 flex flex-wrap gap-1.5 bg-[#1a1a1a]">
            {quickCommands.map(cmd => (
              <button
                key={cmd}
                onClick={() => sendMessage(cmd)}
                className="text-xs px-2 py-1 rounded-full border border-[#333] text-[#999] hover:text-white hover:border-red-600 transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2 p-3 border-t border-[#2a2a2a]">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Escribe al agente..."
              className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white placeholder-[#555] focus:outline-none focus:border-red-600"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 flex items-center justify-center transition-colors"
            >
              <Send size={14} className="text-white" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AgentPanel;
