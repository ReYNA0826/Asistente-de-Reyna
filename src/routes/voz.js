/**
 * Rutas de Voz - Hablar con Alma por voz
 *
 * Flujo completo:
 * 1. Usuario habla → POST /api/voz/escuchar (audio → texto)
 * 2. Texto → POST /api/conversacion/mensaje (texto → respuesta)
 * 3. Respuesta → POST /api/voz/hablar (texto → audio de Alma)
 *
 * O flujo combinado:
 * POST /api/voz/conversar (audio → texto → IA → audio de Alma)
 */

const express = require('express');
const router = express.Router();
const elevenlabsService = require('../services/elevenlabsService');
const speechToTextService = require('../services/speechToTextService');
const conversacionService = require('../services/conversacionService');

// POST /api/voz/hablar
// Convierte texto en la voz de Alma (ElevenLabs)
router.post('/hablar', async (req, res, next) => {
  try {
    const { texto, opciones } = req.body;

    if (!texto) {
      return res.status(400).json({ error: 'Se requiere texto' });
    }

    const audioBuffer = await elevenlabsService.textoAVoz(texto, opciones || {});

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length
    });
    res.send(audioBuffer);
  } catch (err) {
    next(err);
  }
});

// POST /api/voz/hablar/stream
// Streaming de voz de Alma (baja latencia)
router.post('/hablar/stream', async (req, res, next) => {
  try {
    const { texto, opciones } = req.body;

    if (!texto) {
      return res.status(400).json({ error: 'Se requiere texto' });
    }

    res.set({ 'Content-Type': 'audio/mpeg' });
    const stream = await elevenlabsService.textoAVozStream(texto, opciones || {});
    stream.pipe(res);
  } catch (err) {
    next(err);
  }
});

// POST /api/voz/escuchar
// Convierte audio del usuario en texto (Whisper)
router.post('/escuchar', async (req, res, next) => {
  try {
    const audioBuffer = req.body;
    const formato = req.headers['x-audio-format'] || 'webm';

    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(400).json({ error: 'Se requiere audio' });
    }

    const texto = await speechToTextService.transcribir(audioBuffer, formato);
    res.json({ texto });
  } catch (err) {
    next(err);
  }
});

// POST /api/voz/conversar
// Flujo completo: audio del usuario → respuesta en voz de Alma
router.post('/conversar', async (req, res, next) => {
  try {
    const { userId, audio, formato } = req.body;

    if (!userId || !audio) {
      return res.status(400).json({ error: 'Se requiere userId y audio (base64)' });
    }

    // 1. Audio → Texto
    const audioBuffer = Buffer.from(audio, 'base64');
    const textoUsuario = await speechToTextService.transcribir(audioBuffer, formato || 'webm');

    // 2. Texto → Respuesta de Alma
    const { respuesta, intencion } = await conversacionService.enviarMensaje(
      userId, textoUsuario, {}
    );

    // 3. Respuesta → Voz de Alma
    const audioRespuesta = await elevenlabsService.textoAVoz(respuesta);

    res.json({
      textoUsuario,
      respuestaAlma: respuesta,
      intencion,
      audio: audioRespuesta.toString('base64')
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/voz/voces
// Lista las voces disponibles en ElevenLabs
router.get('/voces', async (req, res, next) => {
  try {
    const voces = await elevenlabsService.listarVoces();
    res.json({ voces });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
