
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  empresa text NOT NULL DEFAULT '',
  email text DEFAULT '',
  telefono text DEFAULT '',
  servicio text DEFAULT '',
  valor_estimado numeric DEFAULT 0,
  fuente text DEFAULT 'LinkedIn',
  estado text NOT NULL DEFAULT 'por_contactar' CHECK (estado IN ('por_contactar', 'contactado', 'en_negociacion', 'calificado', 'cerrado', 'descartado')),
  notas text DEFAULT '',
  linkedin_url text DEFAULT '',
  ultimo_contacto date,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to leads" ON public.leads
  FOR ALL USING (true) WITH CHECK (true);
