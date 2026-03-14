/**
 * Rutas de Conversación - Hablar con Alma
 */

const express = require('express');
const router = express.Router();
const conversacionService = require('../services/conversacionService');
const { obtenerSaludo } = require('../config/personalidad');

// POST /api/conversacion/mensaje
// Envía un mensaje de texto a Alma
router.post('/mensaje', async (req, res, next) => {
  try {
    const { userId, mensaje, contexto } = req.body;

    if (!userId || !mensaje) {
      return res.status(400).json({
        error: 'Se requiere userId y mensaje'
      });
    }

    const resultado = await conversacionService.enviarMensaje(userId, mensaje, contexto || {});

    res.json({
      respuesta: resultado.respuesta,
      intencion: resultado.intencion
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/conversacion/resumen-diario
// Genera el resumen matutino de Alma
router.post('/resumen-diario', async (req, res, next) => {
  try {
    const { userId, correos, recordatorios } = req.body;

    const resumen = await conversacionService.generarResumenDiario(userId, {
      correos: correos || {},
      recordatorios: recordatorios || {},
      hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    });

    res.json({ resumen });
  } catch (err) {
    next(err);
  }
});

// GET /api/conversacion/saludo
// Obtiene el saludo apropiado según la hora del día
router.get('/saludo', (req, res) => {
  res.json({ saludo: obtenerSaludo() });
});

// DELETE /api/conversacion/historial/:userId
// Limpia el historial de conversación
router.delete('/historial/:userId', (req, res) => {
  conversacionService.limpiarHistorial(req.params.userId);
  res.json({ mensaje: 'Historial limpiado' });
});

module.exports = router;
