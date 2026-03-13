-- ===================================
-- Mi Secretaria Digital - Alma
-- Setup de base de datos Supabase
-- ===================================
-- Ejecuta este SQL en tu Supabase Dashboard:
-- SQL Editor > New Query > Pegar y ejecutar

-- Tabla de recordatorios
CREATE TABLE IF NOT EXISTS recordatorios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  hora TIME DEFAULT NULL,
  prioridad TEXT DEFAULT 'media' CHECK (prioridad IN ('alta', 'media', 'baja')),
  completado BOOLEAN DEFAULT FALSE,
  completado_en TIMESTAMPTZ DEFAULT NULL,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Indice para busquedas por usuario y fecha
CREATE INDEX IF NOT EXISTS idx_recordatorios_user_fecha ON recordatorios(user_id, fecha);

-- Tabla de historial de conversaciones
CREATE TABLE IF NOT EXISTS conversaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('user', 'assistant')),
  mensaje TEXT NOT NULL,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversaciones_user ON conversaciones(user_id, creado_en DESC);

-- Tabla de contactos/clientes (sync con Monday.com)
CREATE TABLE IF NOT EXISTS contactos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  nombre TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  monday_item_id TEXT,
  notas TEXT DEFAULT '',
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contactos_user ON contactos(user_id);

-- Tabla de resumen diario
CREATE TABLE IF NOT EXISTS resumenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  contenido TEXT NOT NULL,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resumenes_user_fecha ON resumenes(user_id, fecha DESC);

-- Habilitar Row Level Security
ALTER TABLE recordatorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumenes ENABLE ROW LEVEL SECURITY;

-- Politicas: permitir todo con la anon key (para servidor backend)
CREATE POLICY "Allow all for recordatorios" ON recordatorios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for conversaciones" ON conversaciones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for contactos" ON contactos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for resumenes" ON resumenes FOR ALL USING (true) WITH CHECK (true);
