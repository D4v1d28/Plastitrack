const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { registrarMerma, obtenerMermas, obtenerMermasPorOrden } = require('../controllers/mermaController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Configuración de Multer para almacenamiento de fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Sube un nivel desde /routes/ para encontrar /uploads/ dentro de /src/
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'merma-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Servir la carpeta de imágenes estáticas en Express (agrega en tu app.js/server.js si no lo tenías):
// app.use('/uploads', express.static('uploads'));

// Rutas autenticadas
router.use(verificarToken);

// POST /api/mermas -> Registrar merma con foto opcional ('imagen')
router.post('/', upload.single('imagen'), registrarMerma);

// GET /api/mermas -> Listar mermas
router.get('/', obtenerMermas);

// GET /api/mermas/orden/:id_orden -> Listar mermas de una orden específica
router.get('/orden/:id_orden', obtenerMermasPorOrden);

module.exports = router;
