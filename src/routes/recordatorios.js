/**
 * Rutas de Recordatorios - Alma recuerda por ti
 */

const express = require('express');
const router = express.Router();
const recordatoriosService = require('../services/recordatoriosService');

// POST /api/recordatorios
router.post('/', async (req, res) => {
  const { userId, titulo, descripcion, fecha, hora, prioridad } = req.body;

  if (!userId || !titulo) {
    return res.status(400).json({ error: 'Se requiere userId y titulo' });
  }

  try {
    const recordatorio = await recordatoriosService.crear(userId, {
      titulo, descripcion, fecha, hora, prioridad
    });
    res.status(201).json(recordatorio);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/recordatorios/hoy/:userId
router.get('/hoy/:userId', async (req, res) => {
  try {
    const recordatorios = await recordatoriosService.obtenerHoy(req.params.userId);
    res.json({ total: recordatorios.length, recordatorios });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/recordatorios/manana/:userId
router.get('/manana/:userId', async (req, res) => {
  try {
    const recordatorios = await recordatoriosService.obtenerManana(req.params.userId);
    res.json({ total: recordatorios.length, recordatorios });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/recordatorios/semana/:userId
router.get('/semana/:userId', async (req, res) => {
  try {
    const recordatorios = await recordatoriosService.obtenerSemana(req.params.userId);
    res.json({ total: recordatorios.length, recordatorios });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/recordatorios/resumen/:userId
router.get('/resumen/:userId', async (req, res) => {
  try {
    const resumen = await recordatoriosService.obtenerResumen(req.params.userId);
    res.json(resumen);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/recordatorios/:userId/:id/completar
router.patch('/:userId/:id/completar', async (req, res) => {
  try {
    const resultado = await recordatoriosService.completar(req.params.userId, req.params.id);
    if (!resultado) {
      return res.status(404).json({ error: 'Recordatorio no encontrado' });
    }
    res.json(resultado);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/recordatorios/:userId/:id
router.delete('/:userId/:id', async (req, res) => {
  try {
    const eliminado = await recordatoriosService.eliminar(req.params.userId, req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Recordatorio no encontrado' });
    }
    res.json({ eliminado: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
