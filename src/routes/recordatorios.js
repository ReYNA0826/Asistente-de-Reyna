/**
 * Rutas de Recordatorios - Alma recuerda por ti
 */

const express = require('express');
const router = express.Router();
const recordatoriosService = require('../services/recordatoriosService');

// POST /api/recordatorios
// Crea un nuevo recordatorio
router.post('/', (req, res) => {
  const { userId, titulo, descripcion, fecha, hora, prioridad } = req.body;

  if (!userId || !titulo) {
    return res.status(400).json({ error: 'Se requiere userId y titulo' });
  }

  const recordatorio = recordatoriosService.crear(userId, {
    titulo, descripcion, fecha, hora, prioridad
  });

  res.status(201).json(recordatorio);
});

// GET /api/recordatorios/hoy/:userId
// Obtiene los recordatorios del día
router.get('/hoy/:userId', (req, res) => {
  const recordatorios = recordatoriosService.obtenerHoy(req.params.userId);
  res.json({ total: recordatorios.length, recordatorios });
});

// GET /api/recordatorios/manana/:userId
router.get('/manana/:userId', (req, res) => {
  const recordatorios = recordatoriosService.obtenerManana(req.params.userId);
  res.json({ total: recordatorios.length, recordatorios });
});

// GET /api/recordatorios/semana/:userId
router.get('/semana/:userId', (req, res) => {
  const recordatorios = recordatoriosService.obtenerSemana(req.params.userId);
  res.json({ total: recordatorios.length, recordatorios });
});

// GET /api/recordatorios/resumen/:userId
router.get('/resumen/:userId', (req, res) => {
  const resumen = recordatoriosService.obtenerResumen(req.params.userId);
  res.json(resumen);
});

// PATCH /api/recordatorios/:userId/:id/completar
router.patch('/:userId/:id/completar', (req, res) => {
  const resultado = recordatoriosService.completar(req.params.userId, req.params.id);

  if (!resultado) {
    return res.status(404).json({ error: 'Recordatorio no encontrado' });
  }

  res.json(resultado);
});

// DELETE /api/recordatorios/:userId/:id
router.delete('/:userId/:id', (req, res) => {
  const eliminado = recordatoriosService.eliminar(req.params.userId, req.params.id);

  if (!eliminado) {
    return res.status(404).json({ error: 'Recordatorio no encontrado' });
  }

  res.json({ eliminado: true });
});

module.exports = router;
