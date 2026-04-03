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
app.set('trust proxy', 1);

// Seguridad
app.use(helmet());
app.use(cors());

// Limite de peticiones
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas peticiones. Intenta de nuevo mas tarde.' }
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));

app.use('/api/conversacion', conversacionRoutes);
app.use('/api/voz', vozRoutes);
app.use('/api/correos', correosRoutes);
app.use('/api/recordatorios', recordatoriosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/avatar', avatarRoutes);
app.use('/api/salud', saludRoutes);
app.use('/api/monday', mondayRoutes);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use((err, req, res, _next) => {
  console.error('[Alma Error]', err.message);
  res.status(err.status || 500).json({ error: 'Algo salio mal.' });
});

app.listen(PORT, async () => {
  console.log(`Alma lista en http://localhost:${PORT}`);
  const dbOk = await inicializarTablas();
  console.log(dbOk ? 'Supabase: conectado' : 'Supabase: memoria local');
});

module.exports = app;