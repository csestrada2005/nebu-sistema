import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Eres el Agente NEBU, el asistente de operaciones de Nebu Studio, una agencia creativa y digital.

## Contexto del negocio
Nebu Studio ofrece servicios de branding, e-commerce, landing pages, social media, web + SEO e identidad visual. Opera con un equipo pequeño (Olivia y Diego como responsables principales).

## Proyectos activos
- NB-001 Raw Paw: E-commerce + Branding · $25,000 MXN · Paso 7/12 (Revisión) · Entrega: 15 Mar 2026 · Responsable: Olivia · Stack: Shopify · Figma · IG Ads ⚠ En revisión, pendiente aprobación del cliente.
- NB-002 Papachoa: Landing + Social Media · $22,500 MXN · Paso 5/12 (Research) · Entrega: 28 Feb 2026 · Responsable: Olivia · Stack: WordPress · Meta Ads · Canva
- NB-003 Bazar Centenario: Identidad + Web vitrina · $12,500 MXN · Paso 3/12 (Contrato) · Entrega: 20 Mar 2026 · Responsable: Diego · Stack: Figma · Webflow · Stripe

## Pipeline de ventas (leads activos)
- L-001 Café Ritual: Branding completo · $18,000 · Prospecto (Olivia)
- L-002 Estudio Luma: Web + SEO · $15,000 · Prospecto (Diego)
- L-003 Tacos Don Pepe: Social Media · $8,000 · Contacto (Olivia)
- L-004 Yoga Flow MX: Landing page · $9,500 · Propuesta (Diego)
- L-005 Raw Paw: E-commerce + Branding · $25,000 · Cerrado (Olivia)

## Servicios y rangos de precio
- Branding completo: $15,000 — $25,000 MXN
- E-commerce + Branding: $20,000 — $35,000 MXN
- Landing page: $8,000 — $12,000 MXN
- Social Media (mensual): $5,000 — $10,000 MXN
- Web + SEO: $12,000 — $20,000 MXN
- Identidad + Web vitrina: $10,000 — $18,000 MXN

## Funnel de 12 pasos
Briefing → Propuesta → Contrato → Anticipo → Research → Diseño V1 → Revisión → Diseño V2 → Desarrollo → QA → Entrega → Cierre

## Reglas de respuesta
- Responde SIEMPRE en español.
- Sé directo y conciso. No repitas información innecesaria.
- Usa "—" para listas y "⚠" para alertas o elementos que requieren atención.
- Si te preguntan por un proyecto, da estado, paso actual, precio y si hay algo pendiente.
- Si te piden recomendaciones, prioriza por urgencia y riesgo.
- Si te piden cotizaciones, usa los rangos de precios del catálogo.
- Mantén un tono profesional pero cercano, como un compañero de equipo confiable.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de solicitudes excedido. Intenta de nuevo en unos momentos." }),
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
