require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const conversacionRoutes = require('./routes/conversacion');
const vozRoutes = require('./routes/voz');
const correosRoutes = require('./routes/correos');
const recordatoriosRoutes = require('./routes/recordatorios');
const authRoutes = require('./routes/auth');
const avatarRoutes = require('./routes/avatar');
const saludRoutes = require('./routes/salud');
const mondayRoutes = require('./routes/monday');
const { inicializarTablas } = require('./config/supabase');

const app = express();
const PORT = process.env.PORT || 3000;

// Seguridad
app.use(helmet());
app.use(cors());

// Límite de peticiones
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { error: 'Demasiadas peticiones. Intenta de nuevo más tarde.' }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));

// Rutas
app.use('/api/conversacion', conversacionRoutes);
app.use('/api/voz', vozRoutes);
app.use('/api/correos', correosRoutes);
app.use('/api/recordatorios', recordatoriosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/avatar', avatarRoutes);
app.use('/api/salud', saludRoutes);
app.use('/api/monday', mondayRoutes);

// Interfaz web
app.use(express.static(path.join(__dirname, '..', 'public')));

// Manejo de errores global
app.use((err, req, res, _next) => {
  console.error('[Alma Error]', err.message);
  res.status(err.status || 500).json({
    error: 'Algo salió mal. Alma está trabajando en ello.',
    detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, async () => {
  console.log(`✨ Alma está lista en http://localhost:${PORT}`);
  console.log(`📧 Correos: /api/correos`);
  console.log(`🎤 Voz: /api/voz`);
  console.log(`💬 Conversación: /api/conversacion`);
  console.log(`⏰ Recordatorios: /api/recordatorios`);
  console.log(`🎭 Avatar: /api/avatar`);
  console.log(`📋 Monday.com: /api/monday`);

  // Inicializar Supabase
  const dbOk = await inicializarTablas();
  console.log(dbOk ? '🗄️  Supabase: conectado' : '🗄️  Supabase: usando memoria local');
});

module.exports = app;
