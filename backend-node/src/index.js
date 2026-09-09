const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Registro de Rutas
app.use('/api/auth', authRoutes);

// Ruta de Salud de la API
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS resultado');
    res.json({ status: 'OK', message: 'Servidor y BD activos', testQuery: rows[0] });
  } catch (error) {
    res.status(500).json({ status: 'Error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Plastitrack corriendo en http://localhost:${PORT}`);
});
