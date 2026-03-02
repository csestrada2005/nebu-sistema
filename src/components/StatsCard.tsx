interface StatsCardProps {
    label: string;
      value: string;
        sub?: string;
        }

        const StatsCard = ({ label, value, sub }: StatsCardProps) => {
          return (
              <div
                    className="rounded-lg p-5 transition-colors duration-150 animate-fade-in"
                          style={{
                                  backgroundColor: "var(--nebu-card)",
                                          border: "1px solid var(--nebu-border)",
                                                }}
                                                    >
                                                          <p
                                                                  className="text-sm mb-1"
                                                                          style={{ color: "var(--nebu-text-secondary)" }}
                                                                                >
                                                                                        {label}
                                                                                              </p>
                                                                                                    <p
                                                                                                            className="text-3xl font-bold tracking-tight"
                                                                                                                    style={{ color: "var(--nebu-text)" }}
                                                                                                                          >
                                                                                                                                  {value}
                                                                                                                                        </p>
                                                                                                                                              {sub && (
                                                                                                                                                      <p
                                                                                                                                                                className="text-sm mt-1"
                                                                                                                                                                          style={{ color: "var(--nebu-text-secondary)" }}
                                                                                                                                                                                  >
                                                                                                                                                                                            {sub}
                                                                                                                                                                                                    </p>
                                                                                                                                                                                                          )}
                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                );
};

export default StatsCard;