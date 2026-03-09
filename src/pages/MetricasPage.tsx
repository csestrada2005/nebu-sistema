import { BarChart3 } from "lucide-react";
import EmptyState from "@/components/EmptyState";

const MetricasPage = () => (
  <EmptyState
    icon={BarChart3}
    title={{ es: "Sin métricas aún", en: "No metrics yet" }}
    subtitle={{ es: "Conecta tus fuentes de datos para ver analytics, rendimiento y más.", en: "Connect your data sources to see analytics, performance and more." }}
    ctaLabel={{ es: "+ Conectar fuente", en: "+ Connect source" }}
  />
);

export default MetricasPage;
