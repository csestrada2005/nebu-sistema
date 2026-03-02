import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";

interface Herramienta {
  nombre: string;
  categoria: string;
  link?: string;
  queEs: string;
  paraQue: string;
}

const herramientas: Herramienta[] = [
  {
    nombre: "Spline",
    categoria: "3D / Animación",
    link: "https://spline.design",
    queEs: "Herramienta web para crear 3D interactivo y animado (web-ready)",
    paraQue: "Crear objetos/escenas 3D para landing pages, héroes animados y experiencias interactivas",
  },
  {
    nombre: "Meta Pixel",
    categoria: "Ads Tracking",
    link: "https://business.facebook.com",
    queEs: "Seguimiento para campañas Meta",
    paraQue: "Optimizar campañas y conversiones",
  },
  {
    nombre: "Google Analytics",
    categoria: "Analytics",
    link: "https://analytics.google.com",
    queEs: "Seguimiento de tráfico y comportamiento",
    paraQue: "Medir visitas, conversiones y funnels",
  },
  {
    nombre: "Shopify",
    categoria: "E-commerce",
    link: "https://shopify.com",
    queEs: "Plataforma ecommerce",
    paraQue: "Tiendas online profesionales",
  },
  {
    nombre: "Cloudflare",
    categoria: "Infraestructura / DNS",
    link: "https://cloudflare.com",
    queEs: "DNS, CDN y seguridad",
    paraQue: "Gestionar dominios, SSL, velocidad y protección",
  },
  {
    nombre: "UX.ALOK | @ux.alok",
    categoria: "Inspiración Instagram",
    queEs: "Cuenta de UI/UX moderno, animaciones, microinteracciones",
    paraQue: "Inspiración para interfaces futuristas, dashboards, efectos hover",
  },
  {
    nombre: "Josh Yolkk | @josh_yolkk",
    categoria: "Inspiración Instagram",
    queEs: "Diseñador con visuales fuertes, motion, interfaces experimentales",
    paraQue: "Efectos visuales fuertes, transiciones, diseño con personalidad",
  },
  {
    nombre: "Aka A. Alaff | @akaa.alaff",
    categoria: "Inspiración Instagram",
    queEs: "Diseño visual minimal / high contrast",
    paraQue: "Composiciones elegantes, contraste fuerte, dirección visual",
  },
  {
    nombre: "Vuedale | @vuedaleofficial",
    categoria: "Inspiración Instagram",
    queEs: "Contenido visual de diseño/branding estilo moderno",
    paraQue: "Visual identity, layouts y dirección de arte",
  },
  {
    nombre: "ReactBits",
    categoria: "Recursos Web",
    link: "https://reactbits.dev",
    queEs: "Librería de componentes y snippets visuales en React",
    paraQue: "Animaciones, componentes interactivos y efectos visuales avanzados",
  },
  {
    nombre: "Google Search Console",
    categoria: "SEO",
    link: "https://search.google.com/search-console",
    queEs: "Herramienta de monitoreo SEO",
    paraQue: "Ver indexación, errores, palabras clave y rendimiento orgánico",
  },
  {
    nombre: "Google Tag Manager",
    categoria: "Tracking",
    link: "https://tagmanager.google.com",
    queEs: "Administrador de eventos y etiquetas",
    paraQue: "Instalar píxeles, eventos y tracking sin tocar código",
  },
  {
    nombre: "Lovable",
    categoria: "Web Builder",
    link: "https://lovable.dev",
    queEs: "Constructor de web apps",
    paraQue: "Crear SaaS con lógica integrada",
  },
  {
    nombre: "SiteInspire",
    categoria: "Inspiración Web / Galería",
    link: "https://siteinspire.com",
    queEs: "Galería curada de sitios web bien diseñados",
    paraQue: "Referencias de hero sections, layouts, tipografías, UI patterns",
  },
  {
    nombre: "Samuel (Drive)",
    categoria: "Archivos",
    link: "https://drive.google.com/drive/folders/12wcqtVVzDnC8Qrb2NuLxo-FWFwBbHvh2",
    queEs: "Carpeta de trabajo interna",
    paraQue: "Archivos del equipo",
  },
];

const categoryOrder = [
  "3D / Animación",
  "Ads Tracking",
  "Analytics",
  "Archivos",
  "E-commerce",
  "Infraestructura / DNS",
  "Inspiración Instagram",
  "Inspiración Web / Galería",
  "Recursos Web",
  "SEO",
  "Tracking",
  "Web Builder",
];

const HerramientasPage = () => {
  const [search, setSearch] = useState("");

  const filtered = herramientas.filter(
    (h) =>
      h.nombre.toLowerCase().includes(search.toLowerCase()) ||
      h.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const grouped: Record<string, Herramienta[]> = {};
  for (const h of filtered) {
    if (!grouped[h.categoria]) grouped[h.categoria] = [];
    grouped[h.categoria].push(h);
  }

  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          HERRAMIENTAS & STACK
        </h1>
        <p className="text-sm mt-1" style={{ color: "#888" }}>
          Recursos, cuentas y referencias de Nebu Studio
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "#888" }}
        />
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-colors"
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #2a2a2a",
            color: "#fff",
            outline: "none",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#E53E3E")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
        />
      </div>

      {/* Categories */}
      <div className="space-y-10">
        {sortedCategories.map((cat) => (
          <div key={cat}>
            <h2
              className="text-xs font-bold tracking-widest uppercase mb-4"
              style={{ color: "#E53E3E" }}
            >
              {cat}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {grouped[cat].map((h) => (
                <div
                  key={h.nombre}
                  className="rounded-xl p-5 transition-all duration-200"
                  style={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 24px rgba(229,62,62,0.08)";
                    e.currentTarget.style.borderColor = "#3a3a3a";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#2a2a2a";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">
                        {h.nombre}
                      </h3>
                      <span
                        className="inline-block px-2 py-0.5 rounded text-[10px] font-medium"
                        style={{
                          backgroundColor: "rgba(136,136,136,0.1)",
                          color: "#888",
                        }}
                      >
                        {h.categoria}
                      </span>
                    </div>
                    {h.link && (
                      <a
                        href={h.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
                        style={{
                          backgroundColor: "rgba(229,62,62,0.1)",
                          color: "#E53E3E",
                          border: "1px solid rgba(229,62,62,0.2)",
                        }}
                      >
                        Abrir <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                  <p className="text-sm mb-2" style={{ color: "#ccc" }}>
                    {h.queEs}
                  </p>
                  <p className="text-xs italic" style={{ color: "#666" }}>
                    {h.paraQue}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {sortedCategories.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm" style={{ color: "#888" }}>
            No se encontraron herramientas para "{search}"
          </p>
        </div>
      )}
    </div>
  );
};

export default HerramientasPage;
