import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RUTA_OPERATIVO = join(__dirname, "memoria", "operativo");
const RUTA_PERSISTENTE = join(__dirname, "memoria", "persistente");

// Memoria temporal — solo dura en memoria del proceso
const memoriaTemp = new Map();

/**
 * Asegurar que existan los directorios de memoria.
 */
export function inicializarMemoria() {
  for (const ruta of [RUTA_OPERATIVO, RUTA_PERSISTENTE]) {
    if (!existsSync(ruta)) {
      mkdirSync(ruta, { recursive: true });
    }
  }
}

// --- Memoria Temporal (Nivel 1) ---

export function guardarTemporal(clave, valor) {
  memoriaTemp.set(clave, { valor, timestamp: Date.now() });
}

export function obtenerTemporal(clave) {
  const dato = memoriaTemp.get(clave);
  return dato ? dato.valor : null;
}

export function limpiarTemporal() {
  memoriaTemp.clear();
}

// --- Memoria Operativa (Nivel 2) ---

export function guardarOperativo(nombre, contenido) {
  const ruta = join(RUTA_OPERATIVO, nombre);
  writeFileSync(ruta, contenido, "utf-8");
}

export function leerOperativo(nombre) {
  const ruta = join(RUTA_OPERATIVO, nombre);
  if (!existsSync(ruta)) return null;
  return readFileSync(ruta, "utf-8");
}

// --- Memoria Persistente (Nivel 3) ---

export function guardarPersistente(nombre, datos) {
  const ruta = join(RUTA_PERSISTENTE, nombre);
  writeFileSync(ruta, JSON.stringify(datos, null, 2), "utf-8");
}

export function leerPersistente(nombre) {
  const ruta = join(RUTA_PERSISTENTE, nombre);
  if (!existsSync(ruta)) return null;
  return JSON.parse(readFileSync(ruta, "utf-8"));
}

// --- Estadísticas ---

export function obtenerEstadisticas() {
  return {
    temporal: memoriaTemp.size,
    operativo: RUTA_OPERATIVO,
    persistente: RUTA_PERSISTENTE,
  };
}

// Inicializar directorios al cargar el módulo
inicializarMemoria();
