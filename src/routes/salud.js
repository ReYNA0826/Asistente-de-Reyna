/**
 * Rutas de Salud - Estado del sistema
 */

const express = require('express');
const router = express.Router();

// GET /api/salud
// Verifica que todos los servicios estén funcionando
router.get('/', (req, res) => {
  const estado = {
    sistema: 'activo',
    nombre: 'Alma - Mi Secretaria Digital',
    version: '1.0.0',
    servicios: {
      elevenlabs: !!process.env.ELEVENLABS_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
      gmail: !!process.env.GOOGLE_CLIENT_ID
    },
    timestamp: new Date().toISOString()
  };

  res.json(estado);
});

module.exports = router;
