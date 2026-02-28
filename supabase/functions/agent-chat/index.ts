import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Eres el Agente NEBU, el asistente de operaciones de Nebu Studio, una agencia creativa y digital.

## Tu rol
Eres un asistente operativo que puede CONSULTAR y MODIFICAR datos del CRM. Tienes acceso a herramientas para ejecutar acciones reales sobre proyectos y leads.

## Reglas de respuesta
- Responde SIEMPRE en español.
- Sé directo y conciso.
- Usa "—" para listas y "⚠" para alertas.
- Cuando el usuario pida una acción (cambiar estado, agregar lead, avanzar funnel, etc.), usa la herramienta correspondiente.
- Después de ejecutar una acción, confirma qué hiciste.
- Mantén un tono profesional pero cercano.

## Servicios y rangos de precio
- Branding completo: $15,000 — $25,000 MXN
- E-commerce + Branding: $20,000 — $35,000 MXN
- Landing page: $8,000 — $12,000 MXN
- Social Media (mensual): $5,000 — $10,000 MXN
- Web + SEO: $12,000 — $20,000 MXN
- Identidad + Web vitrina: $10,000 — $18,000 MXN

## Funnel de 12 pasos
1.Briefing 2.Propuesta 3.Contrato 4.Anticipo 5.Research 6.Diseño V1 7.Revisión 8.Diseño V2 9.Desarrollo 10.QA 11.Entrega 12.Cierre`;

const tools = [
  {
    type: "function",
    function: {
      name: "update_project_status",
      description: "Cambiar el estado de un proyecto existente. Estados posibles: activo, revisión, completado, pausado.",
      parameters: {
        type: "object",
        properties: {
          project_id: { type: "string", description: "ID del proyecto (ej: NB-001)" },
          status: { type: "string", enum: ["activo", "revisión", "completado", "pausado"], description: "Nuevo estado" },
        },
        required: ["project_id", "status"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "advance_funnel",
      description: "Avanzar un proyecto al siguiente paso del funnel de 12 pasos.",
      parameters: {
        type: "object",
        properties: {
          project_id: { type: "string", description: "ID del proyecto (ej: NB-001)" },
        },
        required: ["project_id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_lead",
      description: "Agregar un nuevo lead al pipeline de ventas.",
      parameters: {
        type: "object",
        properties: {
          nombre: { type: "string", description: "Nombre del negocio/cliente" },
          servicio: { type: "string", description: "Servicio que solicita" },
          precio: { type: "number", description: "Precio estimado en MXN" },
          owner: { type: "string", description: "Responsable (ej: Olivia, Diego)" },
          etapa: { type: "string", enum: ["prospecto", "contacto", "propuesta", "cerrado"], description: "Etapa del pipeline" },
        },
        required: ["nombre", "servicio", "precio", "owner", "etapa"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "move_lead",
      description: "Mover un lead a otra etapa del pipeline.",
      parameters: {
        type: "object",
        properties: {
          lead_id: { type: "string", description: "ID del lead (ej: L-001)" },
          etapa: { type: "string", enum: ["prospecto", "contacto", "propuesta", "cerrado"], description: "Nueva etapa" },
        },
        required: ["lead_id", "etapa"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_project",
      description: "Crear un nuevo proyecto en el CRM.",
      parameters: {
        type: "object",
        properties: {
          cliente: { type: "string", description: "Nombre del cliente" },
          servicio: { type: "string", description: "Servicio contratado" },
          precio: { type: "number", description: "Precio en MXN" },
          responsable: { type: "string", description: "Responsable del proyecto" },
          entregaEst: { type: "string", description: "Fecha estimada de entrega" },
        },
        required: ["cliente", "servicio", "precio", "responsable", "entregaEst"],
        additionalProperties: false,
      },
    },
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, crmContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build system message with live CRM data
    const systemContent = `${SYSTEM_PROMPT}\n\n## Estado actual del CRM\n${crmContext || "Sin datos disponibles."}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemContent },
          ...messages,
        ],
        tools,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de solicitudes excedido. Intenta en unos momentos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos agotados. Agrega fondos en Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Error del gateway de IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("agent-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
