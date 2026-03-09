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

export const projects: Project[] = [];

export const funnelSteps = [
  "Briefing",
  "Propuesta",
  "Contrato",
  "Anticipo",
  "Diseño",
  "Desarrollo",
  "QA",
  "Entrega",
];

export interface PipelineLead {
  id: string;
  nombre: string;
  servicio: string;
  precio: number;
  owner: string;
  etapa: 'prospecto' | 'contacto' | 'propuesta' | 'cerrado';
}

export const pipelineLeads: PipelineLead[] = [];

export const servicios = [
  { label: "Branding completo", rango: "$15,000 — $25,000 MXN" },
  { label: "E-commerce + Branding", rango: "$20,000 — $35,000 MXN" },
  { label: "Landing page", rango: "$8,000 — $12,000 MXN" },
  { label: "Social Media (mensual)", rango: "$5,000 — $10,000 MXN" },
  { label: "Web + SEO", rango: "$12,000 — $20,000 MXN" },
];
