import { useState, useRef, useEffect, useCallback } from "react";
import { Send, X, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useCrm } from "@/contexts/CrmContext";

interface Message {
  role: "agent" | "user";
  text: string;
}

interface ToolCall {
  id: string;
  function: {
    name: string;
    arguments: string;
  };
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
Pipeline: 5 leads activos.

💡 Puedo ejecutar acciones: cambiar estados, avanzar funnel, agregar leads o proyectos. Solo pídelo.`,
};

interface StreamResult {
  content: string;
  toolCalls: ToolCall[];
}

async function streamChat(
  messages: { role: string; content: string; tool_call_id?: string }[],
  crmContext: string,
  onDelta: (text: string) => void,
  onDone: (result: StreamResult) => void,
  onError: (err: string) => void
) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, crmContext }),
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
  let fullContent = "";
  const toolCalls: Record<number, ToolCall> = {};

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
        const choice = parsed.choices?.[0];
        if (!choice) continue;

        const delta = choice.delta;

        // Text content
        if (delta?.content) {
          fullContent += delta.content;
          onDelta(delta.content);
        }

        // Tool calls
        if (delta?.tool_calls) {
          for (const tc of delta.tool_calls) {
            const idx = tc.index ?? 0;
            if (!toolCalls[idx]) {
              toolCalls[idx] = { id: tc.id || "", function: { name: "", arguments: "" } };
            }
            if (tc.id) toolCalls[idx].id = tc.id;
            if (tc.function?.name) toolCalls[idx].function.name += tc.function.name;
            if (tc.function?.arguments) toolCalls[idx].function.arguments += tc.function.arguments;
          }
        }
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  // Flush remaining
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
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          fullContent += content;
          onDelta(content);
        }
      } catch { /* ignore */ }
    }
  }

  onDone({ content: fullContent, toolCalls: Object.values(toolCalls) });
}

const AgentPanel = () => {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const assistantBuffer = useRef("");
  const conversationRef = useRef<{ role: string; content: string; tool_call_id?: string }[]>([]);

  const { actions, buildContextSummary } = useCrm();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  const executeToolCall = useCallback((toolCall: ToolCall): string => {
    try {
      const args = JSON.parse(toolCall.function.arguments);
      switch (toolCall.function.name) {
        case "update_project_status":
          return actions.updateProjectStatus(args.project_id, args.status);
        case "advance_funnel":
          return actions.advanceFunnel(args.project_id);
        case "add_lead":
          return actions.addLead(args);
        case "move_lead":
          return actions.moveLead(args.lead_id, args.etapa);
        case "add_project":
          return actions.addProject({
            ...args,
            estado: "activo",
            pasoFunnel: 1,
          });
        default:
          return `⚠ Acción desconocida: ${toolCall.function.name}`;
      }
    } catch (e) {
      return `⚠ Error ejecutando acción: ${e instanceof Error ? e.message : "desconocido"}`;
    }
  }, [actions]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return;
    const userMsg: Message = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStreaming(true);
    assistantBuffer.current = "";

    conversationRef.current.push({ role: "user", content: text.trim() });

    const processStream = async (apiMessages: { role: string; content: string; tool_call_id?: string }[]) => {
      return new Promise<StreamResult>((resolve, reject) => {
        streamChat(
          apiMessages,
          buildContextSummary(),
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
          resolve,
          (err) => reject(new Error(err))
        );
      });
    };

    try {
      const result = await processStream([...conversationRef.current]);

      // Handle tool calls
      if (result.toolCalls.length > 0) {
        // Add assistant message with tool calls to conversation
        conversationRef.current.push({
          role: "assistant",
          content: result.content || "",
        });

        // Execute each tool call and collect results
        const toolResults: string[] = [];
        for (const tc of result.toolCalls) {
          const toolResult = executeToolCall(tc);
          toolResults.push(toolResult);

          // Add tool result to conversation
          conversationRef.current.push({
            role: "tool",
            content: toolResult,
            tool_call_id: tc.id,
          });
        }

        // Show tool results as system feedback
        const actionSummary = toolResults.join("\n");
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "agent") {
            const newText = (last.text ? last.text + "\n\n" : "") + actionSummary;
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, text: newText } : m
            );
          }
          return [...prev, { role: "agent", text: actionSummary }];
        });

        // Get follow-up from agent after tool execution
        assistantBuffer.current = "";
        const followUp = await processStream([...conversationRef.current]);

        if (followUp.content) {
          conversationRef.current.push({ role: "assistant", content: followUp.content });
        }
      } else if (result.content) {
        conversationRef.current.push({ role: "assistant", content: result.content });
      }
    } catch (e) {
      console.error("Stream error:", e);
      toast.error(e instanceof Error ? e.message : "Error de conexión con el agente");
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          aria-label="Abrir chat del agente"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Backdrop mobile */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:bg-black/40" onClick={() => setOpen(false)} />
      )}

      {/* Chat panel */}
      {open && (
        <aside
          className="fixed bottom-0 right-0 lg:bottom-6 lg:right-6 z-50 w-full lg:w-[400px] h-[85vh] lg:h-[600px] lg:max-h-[80vh] bg-nebu-carbon border border-nebu-border lg:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-up"
        >
          {/* Header */}
          <div className="h-14 flex items-center gap-3 px-4 border-b border-nebu-border shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-display text-sm text-primary-foreground">
              N
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">Agente NEBU</div>
              <div className="text-[10px] font-mono text-nebu-text-dim truncate">
                Gemini · Flash · Operaciones activas
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-nebu-surface rounded transition-colors"
              aria-label="Cerrar chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${msg.role === "user" ? "flex justify-end" : ""}`}
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
      )}
    </>
  );
};

export default AgentPanel;
