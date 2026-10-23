const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const mermaRoutes = require('./routes/mermaRoutes');
const paroRoutes = require('./routes/paroRoutes');
const produccionRoutes = require('./routes/produccionRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Registro de Rutas
app.use('/api/auth', authRoutes);
app.use('/api/mermas', mermaRoutes);
app.use('/api/paros', paroRoutes);
app.use('/api/produccion', produccionRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta de Salud de la API
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS resultado');
    res.json({ status: 'OK', message: 'Servidor y BD activos', testQuery: rows[0] });
  } catch (error) {
    res.status(500).json({ status: 'Error', error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Plastitrack corriendo en ${PORT}`);
});
