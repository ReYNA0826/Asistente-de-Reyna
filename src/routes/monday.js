/**
 * Rutas de Monday.com - CRM y gestion de tareas
 */

const express = require('express');
const router = express.Router();
const mondayService = require('../services/mondayService');

// GET /api/monday/tableros - Lista todos los tableros
router.get('/tableros', async (req, res) => {
  try {
    if (!mondayService.configurado) {
      return res.status(503).json({ error: 'Monday.com no configurado' });
    }
    const tableros = await mondayService.obtenerTableros();
    res.json({ tableros });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/monday/tableros/:id/items - Items de un tablero
router.get('/tableros/:id/items', async (req, res) => {
  try {
    const items = await mondayService.obtenerItems(req.params.id, parseInt(req.query.limit) || 20);
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/monday/tableros/:id/items - Crear item
router.post('/tableros/:id/items', async (req, res) => {
  try {
    const { nombre, columnValues } = req.body;
    if (!nombre) return res.status(400).json({ error: 'Nombre es requerido' });
    const item = await mondayService.crearItem(req.params.id, nombre, columnValues || {});
    res.json({ item });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/monday/resumen - Resumen para Alma
router.get('/resumen', async (req, res) => {
  try {
    if (!mondayService.configurado) {
      return res.json({ totalTableros: 0, tableros: [], mensaje: 'Monday.com no configurado' });
    }
    const resumen = await mondayService.obtenerResumen();
    res.json(resumen);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
