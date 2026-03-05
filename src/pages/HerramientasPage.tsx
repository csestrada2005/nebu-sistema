import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Herramienta {
  nombre: string;
  categoria: Record<"es" | "en", string>;
  link?: string;
  queEs: Record<"es" | "en", string>;
  paraQue: Record<"es" | "en", string>;
}

const herramientas: Herramienta[] = [
  { nombre: "Spline", categoria: { es: "3D / Animación", en: "3D / Animation" }, link: "https://spline.design",
    queEs: { es: "Herramienta web para crear 3D interactivo y animado (web-ready)", en: "Web tool for creating interactive and animated 3D (web-ready)" },
    paraQue: { es: "Crear objetos/escenas 3D para landing pages, héroes animados y experiencias interactivas", en: "Create 3D objects/scenes for landing pages, animated heroes and interactive experiences" } },
  { nombre: "Meta Pixel", categoria: { es: "Ads Tracking", en: "Ads Tracking" }, link: "https://business.facebook.com",
    queEs: { es: "Seguimiento para campañas Meta", en: "Tracking for Meta campaigns" },
    paraQue: { es: "Optimizar campañas y conversiones", en: "Optimize campaigns and conversions" } },
  { nombre: "Google Analytics", categoria: { es: "Analytics", en: "Analytics" }, link: "https://analytics.google.com",
    queEs: { es: "Seguimiento de tráfico y comportamiento", en: "Traffic and behavior tracking" },
    paraQue: { es: "Medir visitas, conversiones y funnels", en: "Measure visits, conversions and funnels" } },
  { nombre: "Shopify", categoria: { es: "E-commerce", en: "E-commerce" }, link: "https://shopify.com",
    queEs: { es: "Plataforma ecommerce", en: "E-commerce platform" },
    paraQue: { es: "Tiendas online profesionales", en: "Professional online stores" } },
  { nombre: "Cloudflare", categoria: { es: "Infraestructura / DNS", en: "Infrastructure / DNS" }, link: "https://cloudflare.com",
    queEs: { es: "DNS, CDN y seguridad", en: "DNS, CDN and security" },
    paraQue: { es: "Gestionar dominios, SSL, velocidad y protección", en: "Manage domains, SSL, speed and protection" } },
  { nombre: "UX.ALOK | @ux.alok", categoria: { es: "Inspiración Instagram", en: "Instagram Inspiration" },
    queEs: { es: "Cuenta de UI/UX moderno, animaciones, microinteracciones", en: "Modern UI/UX account, animations, micro-interactions" },
    paraQue: { es: "Inspiración para interfaces futuristas, dashboards, efectos hover", en: "Inspiration for futuristic interfaces, dashboards, hover effects" } },
  { nombre: "Josh Yolkk | @josh_yolkk", categoria: { es: "Inspiración Instagram", en: "Instagram Inspiration" },
    queEs: { es: "Diseñador con visuales fuertes, motion, interfaces experimentales", en: "Designer with strong visuals, motion, experimental interfaces" },
    paraQue: { es: "Efectos visuales fuertes, transiciones, diseño con personalidad", en: "Strong visual effects, transitions, design with personality" } },
  { nombre: "Aka A. Alaff | @akaa.alaff", categoria: { es: "Inspiración Instagram", en: "Instagram Inspiration" },
    queEs: { es: "Diseño visual minimal / high contrast", en: "Minimal / high contrast visual design" },
    paraQue: { es: "Composiciones elegantes, contraste fuerte, dirección visual", en: "Elegant compositions, strong contrast, visual direction" } },
  { nombre: "Vuedale | @vuedaleofficial", categoria: { es: "Inspiración Instagram", en: "Instagram Inspiration" },
    queEs: { es: "Contenido visual de diseño/branding estilo moderno", en: "Modern style design/branding visual content" },
    paraQue: { es: "Visual identity, layouts y dirección de arte", en: "Visual identity, layouts and art direction" } },
  { nombre: "ReactBits", categoria: { es: "Recursos Web", en: "Web Resources" }, link: "https://reactbits.dev",
    queEs: { es: "Librería de componentes y snippets visuales en React", en: "React visual components and snippets library" },
    paraQue: { es: "Animaciones, componentes interactivos y efectos visuales avanzados", en: "Animations, interactive components and advanced visual effects" } },
  { nombre: "Google Search Console", categoria: { es: "SEO", en: "SEO" }, link: "https://search.google.com/search-console",
    queEs: { es: "Herramienta de monitoreo SEO", en: "SEO monitoring tool" },
    paraQue: { es: "Ver indexación, errores, palabras clave y rendimiento orgánico", en: "View indexing, errors, keywords and organic performance" } },
  { nombre: "Google Tag Manager", categoria: { es: "Tracking", en: "Tracking" }, link: "https://tagmanager.google.com",
    queEs: { es: "Administrador de eventos y etiquetas", en: "Events and tags manager" },
    paraQue: { es: "Instalar píxeles, eventos y tracking sin tocar código", en: "Install pixels, events and tracking without touching code" } },
  { nombre: "Lovable", categoria: { es: "Web Builder", en: "Web Builder" }, link: "https://lovable.dev",
    queEs: { es: "Constructor de web apps", en: "Web app builder" },
    paraQue: { es: "Crear SaaS con lógica integrada", en: "Build SaaS with integrated logic" } },
  { nombre: "SiteInspire", categoria: { es: "Inspiración Web / Galería", en: "Web Inspiration / Gallery" }, link: "https://siteinspire.com",
    queEs: { es: "Galería curada de sitios web bien diseñados", en: "Curated gallery of well-designed websites" },
    paraQue: { es: "Referencias de hero sections, layouts, tipografías, UI patterns", en: "References for hero sections, layouts, typography, UI patterns" } },
  { nombre: "Samuel (Drive)", categoria: { es: "Archivos", en: "Files" }, link: "https://drive.google.com/drive/folders/12wcqtVVzDnC8Qrb2NuLxo-FWFwBbHvh2",
    queEs: { es: "Carpeta de trabajo interna", en: "Internal working folder" },
    paraQue: { es: "Archivos del equipo", en: "Team files" } },
];

const HerramientasPage = () => {
  const [search, setSearch] = useState("");
  const { lang } = useLanguage();

  const tt = {
    es: { title: "HERRAMIENTAS & STACK", sub: "Recursos, cuentas y referencias de Nebu Studio", searchPlaceholder: "Buscar por nombre o categoría...", open: "Abrir", noResults: "No se encontraron herramientas para" },
    en: { title: "TOOLS & STACK", sub: "Resources, accounts and references for Nebu Studio", searchPlaceholder: "Search by name or category...", open: "Open", noResults: "No tools found for" },
  }[lang];

  const filtered = herramientas.filter(
    (h) => h.nombre.toLowerCase().includes(search.toLowerCase()) || h.categoria[lang].toLowerCase().includes(search.toLowerCase())
  );

  const grouped: Record<string, Herramienta[]> = {};
  for (const h of filtered) {
    const cat = h.categoria[lang];
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(h);
  }

  const sortedCategories = Object.keys(grouped).sort();

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">{tt.title}</h1>
        <p className="text-sm mt-1" style={{ color: "#888" }}>{tt.sub}</p>
      </div>
      <div className="relative mb-8">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#888" }} />
        <input type="text" placeholder={tt.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-colors"
          style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", color: "#fff", outline: "none" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#E53E3E")} onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")} />
      </div>
      <div className="space-y-10">
        {sortedCategories.map((cat) => (
          <div key={cat}>
            <h2 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#E53E3E" }}>{cat}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {grouped[cat].map((h) => (
                <div key={h.nombre} className="rounded-xl p-5 transition-all duration-200" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 24px rgba(229,62,62,0.08)"; e.currentTarget.style.borderColor = "#3a3a3a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">{h.nombre}</h3>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: "rgba(136,136,136,0.1)", color: "#888" }}>{h.categoria[lang]}</span>
                    </div>
                    {h.link && (
                      <a href={h.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
                        style={{ backgroundColor: "rgba(229,62,62,0.1)", color: "#E53E3E", border: "1px solid rgba(229,62,62,0.2)" }}>
                        {tt.open} <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                  <p className="text-sm mb-2" style={{ color: "#ccc" }}>{h.queEs[lang]}</p>
                  <p className="text-xs italic" style={{ color: "#666" }}>{h.paraQue[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {sortedCategories.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm" style={{ color: "#888" }}>{tt.noResults} "{search}"</p>
        </div>
      )}
    </div>
  );
};

export default HerramientasPage;
