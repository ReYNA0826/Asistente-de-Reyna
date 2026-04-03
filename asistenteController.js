import { generarRespuesta } from "./claudeService.js";
import { guardarTemporal } from "./memoriaService.js";

/**
 * Detecta el rol apropiado según el contexto proporcionado.
 */
function detectarRol(contexto) {
  const mapa = {
    operativo: "paralegal",
    educativo: "educativo",
    creativo: "creativo",
    técnico: "tecnico",
    tecnico: "tecnico",
    emocional: "emocional",
    productividad: "organizador",
    direccion: "ejecutivo",
  };
  return mapa[contexto] || "paralegal";
}

/**
 * POST /api/asistente-reyna
 * Procesa una solicitud al asistente y devuelve respuesta estructurada.
 */
export const procesarSolicitud = async (req, res) => {
  try {
    const { usuario, mensaje, contexto, modo } = req.body;

    // Validación
    if (!mensaje || mensaje.trim() === "") {
      return res.status(400).json({
        estado: "ERROR",
        mensaje: "El campo 'mensaje' es obligatorio.",
      });
    }

    const rol = detectarRol(contexto);

    // Guardar en memoria temporal
    guardarTemporal("ultima_solicitud", {
      usuario: usuario || "Reyna",
      mensaje,
      contexto,
      modo,
      timestamp: new Date().toISOString(),
    });

    // Generar respuesta con IA
    const respuestaIA = await generarRespuesta({
      mensaje,
      rol,
      contexto,
      modo,
    });

    // Crear resumen (primeras 150 caracteres)
    const resumen =
      respuestaIA.length > 150
        ? respuestaIA.substring(0, 150) + "..."
        : respuestaIA;

    const respuesta = {
      respuesta: respuestaIA,
      resumen,
      acciones: [],
      contexto_detectado: contexto || "operativo",
      rol_usado: rol,
      estado: "OK",
    };

    res.json(respuesta);
  } catch (error) {
    console.error("Error procesando solicitud:", error.message);
    res.status(500).json({
      estado: "ERROR",
      mensaje: "Error interno del asistente. Intenta de nuevo.",
    });
  }
};
