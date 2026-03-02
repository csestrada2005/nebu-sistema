import StatsCard from "@/components/StatsCard";

const DashboardPage = () => {
  return (
      <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                          <StatsCard
                                    label="Proyectos Activos"
                                              value="3"
                                                      />
                                                              <StatsCard
                                                                        label="Por cobrar (MXN)"
                                                                                  value="$12,500"
                                                                                            sub="Saldos pendientes"
                                                                                                    />
                                                                                                            <StatsCard
                                                                                                                      label="Entregados este mes"
                                                                                                                                value="1"
                                                                                                                                        />
                                                                                                                                                <StatsCard
                                                                                                                                                          label="Canal de ventas"
                                                                                                                                                                    value="LinkedIn"
                                                                                                                                                                              sub="Canal principal activo"
                                                                                                                                                                                      />
                                                                                                                                                                                            </div>

                                                                                                                                                                                                  {/* Placeholder table */}
                                                                                                                                                                                                        <div
                                                                                                                                                                                                                className="rounded-lg p-8 text-center"
                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                  backgroundColor: "var(--nebu-card)",
                                                                                                                                                                                                                                            border: "1px solid var(--nebu-border)",
                                                                                                                                                                                                                                                    }}
                                                                                                                                                                                                                                                          >
                                                                                                                                                                                                                                                                  <p
                                                                                                                                                                                                                                                                            className="text-sm"
                                                                                                                                                                                                                                                                                      style={{ color: "var(--nebu-text-secondary)" }}
                                                                                                                                                                                                                                                                                              >
                                                                                                                                                                                                                                                                                                        Selecciona un modulo para ver detalles
                                                                                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                                                                                                            };

                                                                                                                                                                                                                                                                                                                            export default DashboardPage;