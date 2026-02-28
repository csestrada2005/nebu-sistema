interface StatsCardProps {
  label: string;
  value: string;
  sub: string;
  color?: "default" | "amber" | "green";
}

const colorMap = {
  default: "text-foreground",
  amber: "text-nebu-amber",
  green: "text-nebu-green",
};

const StatsCard = ({ label, value, sub, color = "default" }: StatsCardProps) => {
  return (
    <div className="bg-nebu-surface border border-nebu-border rounded-md p-4 hover:border-primary/30 transition-colors animate-fade-up">
      <div className="font-mono text-[10px] uppercase tracking-widest text-nebu-muted mb-2">{label}</div>
      <div className={`font-display text-3xl tracking-tight ${colorMap[color]}`}>{value}</div>
      <div className="font-mono text-[11px] text-nebu-text-dim mt-1">{sub}</div>
    </div>
  );
};

export default StatsCard;
