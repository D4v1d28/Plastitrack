const express = require('express');
const router = express.Router();
const {
  registrarInicioParo,
  finalizarParo,
  obtenerParosActivos,
  obtenerTodosLosParos,
  eliminarParo,
} = require('../controllers/paroController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Aplicar middleware de autenticación JWT a todas las rutas
router.use(verificarToken);

// GET /api/paros -> Consultar TODOS los paros (históricos y activos)
router.get('/', obtenerTodosLosParos);

// GET /api/paros/activos -> Consultar paros en curso (hora_fin IS NULL)
router.get('/activos', obtenerParosActivos);

// POST /api/paros -> Registrar inicio de paro
router.post('/', registrarInicioParo);

// PUT /api/paros/:id_paro/finalizar -> Registrar fin de paro
router.put('/:id_paro/finalizar', finalizarParo);

// DELETE /api/paros/:id_paro -> Eliminar registro de paro
router.delete('/:id_paro', eliminarParo);

module.exports = router;
