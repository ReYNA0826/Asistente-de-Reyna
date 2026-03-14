/**
 * Rutas de Autenticación - Conexión con Gmail
 */

const express = require('express');
const router = express.Router();
const gmailService = require('../services/gmailService');

// GET /api/auth/google
// Inicia el flujo de autenticación con Google/Gmail
router.get('/google', (req, res) => {
  const url = gmailService.generarUrlAutorizacion();
  res.json({ url });
});

// GET /api/auth/google/callback
// Callback de Google OAuth - recibe el código de autorización
router.get('/google/callback', async (req, res, next) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Código de autorización no recibido' });
    }

    const tokens = await gmailService.autenticar(code);

    // En producción: guardar tokens de forma segura por usuario
    res.json({
      mensaje: 'Gmail conectado exitosamente',
      conectado: true
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
