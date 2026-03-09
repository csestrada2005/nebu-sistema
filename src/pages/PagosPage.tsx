import { CreditCard } from "lucide-react";
import EmptyState from "@/components/EmptyState";

const PagosPage = () => (
  <EmptyState
    icon={CreditCard}
    title={{ es: "Sin pagos aún", en: "No payments yet" }}
    subtitle={{ es: "Crea tu primer link de pago o factura para comenzar a cobrar.", en: "Create your first payment link or invoice to start collecting." }}
    ctaLabel={{ es: "+ Nuevo pago", en: "+ New payment" }}
  />
);

export default PagosPage;
