/**
 * Cliente Supabase - Base de datos persistente para Alma
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Supabase] URL o Key no configuradas. Base de datos no disponible.');
}

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Crea las tablas necesarias si no existen.
 * Se ejecuta al iniciar el servidor.
 */
async function inicializarTablas() {
  if (!supabase) {
    console.warn('[Supabase] No inicializado - usando almacenamiento en memoria.');
    return false;
  }

  try {
    // Verificar conexion haciendo un query simple
    const { error } = await supabase.from('recordatorios').select('id').limit(1);

    if (error && error.code === '42P01') {
      // Tabla no existe - el usuario debe crearla en Supabase Dashboard
      console.warn('[Supabase] Tablas no encontradas. Crea las tablas ejecutando el SQL del archivo sql/setup.sql en tu Supabase Dashboard.');
      return false;
    }

    if (error) {
      console.warn('[Supabase] Error de conexion:', error.message);
      return false;
    }

    console.log('[Supabase] Conectado correctamente.');
    return true;
  } catch (e) {
    console.warn('[Supabase] Error:', e.message);
    return false;
  }
}

module.exports = { supabase, inicializarTablas };
