export interface Project {
  id: string;
  cliente: string;
  servicio: string;
  precio: number;
  estado: 'activo' | 'revisión' | 'completado' | 'pausado';
  pasoFunnel: number;
  entregaEst: string;
  responsable: string;
  stack?: string;
}

export const projects: Project[] = [
  {
    id: "NB-001",
    cliente: "Raw Paw",
    servicio: "E-commerce + Branding",
    precio: 25000,
    estado: "revisión",
    pasoFunnel: 7,
    entregaEst: "15 Mar 2026",
    responsable: "Olivia",
    stack: "Shopify · Figma · IG Ads",
  },
  {
    id: "NB-002",
    cliente: "Papachoa",
    servicio: "Landing + Social Media",
    precio: 22500,
    estado: "activo",
    pasoFunnel: 5,
    entregaEst: "28 Feb 2026",
    responsable: "Olivia",
    stack: "WordPress · Meta Ads · Canva",
  },
  {
    id: "NB-003",
    cliente: "Bazar Centenario",
    servicio: "Identidad + Web vitrina",
    precio: 12500,
    estado: "activo",
    pasoFunnel: 3,
    entregaEst: "20 Mar 2026",
    responsable: "Diego",
    stack: "Figma · Webflow · Stripe",
  },
];

export const funnelSteps = [
  "Briefing",
  "Propuesta",
  "Contrato",
  "Anticipo",
  "Research",
  "Diseño V1",
  "Revisión",
  "Diseño V2",
  "Desarrollo",
  "QA",
  "Entrega",
  "Cierre",
];

export interface PipelineLead {
  id: string;
  nombre: string;
  servicio: string;
  precio: number;
  owner: string;
  etapa: 'prospecto' | 'contacto' | 'propuesta' | 'cerrado';
}

export const pipelineLeads: PipelineLead[] = [
  { id: "L-001", nombre: "Café Ritual", servicio: "Branding completo", precio: 18000, owner: "Olivia", etapa: "prospecto" },
  { id: "L-002", nombre: "Estudio Luma", servicio: "Web + SEO", precio: 15000, owner: "Diego", etapa: "prospecto" },
  { id: "L-003", nombre: "Tacos Don Pepe", servicio: "Social Media", precio: 8000, owner: "Olivia", etapa: "contacto" },
  { id: "L-004", nombre: "Yoga Flow MX", servicio: "Landing page", precio: 9500, owner: "Diego", etapa: "propuesta" },
  { id: "L-005", nombre: "Raw Paw", servicio: "E-commerce + Branding", precio: 25000, owner: "Olivia", etapa: "cerrado" },
];

export const servicios = [
  { label: "Branding completo", rango: "$15,000 — $25,000 MXN" },
  { label: "E-commerce + Branding", rango: "$20,000 — $35,000 MXN" },
  { label: "Landing page", rango: "$8,000 — $12,000 MXN" },
  { label: "Social Media (mensual)", rango: "$5,000 — $10,000 MXN" },
  { label: "Web + SEO", rango: "$12,000 — $20,000 MXN" },
  { label: "Identidad + Web vitrina", rango: "$10,000 — $18,000 MXN" },
];
