/**
 * Rutas de Avatar - El rostro visual de Alma (HeyGen)
 *
 * Endpoints:
 * POST /api/avatar/generar      - Genera video del avatar hablando
 * GET  /api/avatar/estado/:id   - Consulta estado del video
 * POST /api/avatar/conversar    - Flujo completo: texto → IA → video avatar
 * GET  /api/avatar/avatares     - Lista avatares disponibles
 */

const express = require('express');
const router = express.Router();
const heygenService = require('../services/heygenService');
const conversacionService = require('../services/conversacionService');

// POST /api/avatar/generar
// Genera un video del avatar de Alma hablando el texto dado
router.post('/generar', async (req, res, next) => {
  try {
    const { texto, opciones } = req.body;

    if (!texto) {
      return res.status(400).json({ error: 'Se requiere texto' });
    }

    const resultado = await heygenService.generarVideo(texto, opciones || {});

    res.json({
      mensaje: 'Video en proceso de generación',
      ...resultado
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/avatar/estado/:videoId
// Consulta el estado de un video en proceso
router.get('/estado/:videoId', async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const estado = await heygenService.estadoVideo(videoId);

    res.json(estado);
  } catch (err) {
    next(err);
  }
});

// POST /api/avatar/conversar
// Flujo completo: mensaje del usuario → IA responde → avatar habla la respuesta
router.post('/conversar', async (req, res, next) => {
  try {
    const { userId, mensaje, opcionesAvatar } = req.body;

    if (!userId || !mensaje) {
      return res.status(400).json({ error: 'Se requiere userId y mensaje' });
    }

    // 1. Obtener respuesta de Alma (OpenAI)
    const { respuesta, intencion } = await conversacionService.enviarMensaje(
      userId, mensaje, {}
    );

    // 2. Generar video del avatar hablando la respuesta
    const video = await heygenService.generarVideo(respuesta, opcionesAvatar || {});

    res.json({
      mensajeUsuario: mensaje,
      respuestaAlma: respuesta,
      intencion,
      video
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/avatar/avatares
// Lista los avatares disponibles en HeyGen
router.get('/avatares', async (req, res, next) => {
  try {
    const avatares = await heygenService.listarAvatares();
    res.json({ avatares });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
