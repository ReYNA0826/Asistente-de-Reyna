import { obtenerEstadisticas } from "./memoriaService.js";

/**
 * GET /api/salud
 * Devuelve el estado del sistema y estadísticas básicas.
 */
export const obtenerEstadoSistema = (_req, res) => {
  const estadisticas = obtenerEstadisticas();

  res.json({
    estado: "OK",
    mensaje: "Asistente de Reyna funcionando correctamente",
    version: "1.0",
    timestamp: new Date().toISOString(),
    memoria: estadisticas,
  });
};
