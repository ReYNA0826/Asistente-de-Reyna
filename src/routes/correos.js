/**
 * Rutas de Correos - Alma organiza tu bandeja
 */

const express = require('express');
const router = express.Router();
const gmailService = require('../services/gmailService');

// GET /api/correos/importantes
// Obtiene los correos importantes que requieren atención
router.get('/importantes', async (req, res, next) => {
  try {
    const max = parseInt(req.query.max) || 10;
    const correos = await gmailService.obtenerCorreosImportantes(max);
    res.json({
      total: correos.length,
      correos
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/correos/archivables
// Obtiene correos promocionales que se pueden archivar
router.get('/archivables', async (req, res, next) => {
  try {
    const max = parseInt(req.query.max) || 20;
    const correos = await gmailService.obtenerCorreosArchivables(max);
    res.json({
      total: correos.length,
      correos
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/correos/archivar
// Archiva una lista de correos
router.post('/archivar', async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Se requiere una lista de IDs de correos' });
    }

    const resultados = await gmailService.archivarCorreos(ids);
    res.json({
      archivados: resultados.length,
      resultados
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/correos/resumen
// Resumen rápido del buzón
router.get('/resumen', async (req, res, next) => {
  try {
    const resumen = await gmailService.obtenerResumen();
    res.json(resumen);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
