const express = require('express');
const router = express.Router();
const { crearOrden, obtenerOrdenes } = require('../controllers/produccionController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.use(verificarToken);

// Órdenes de producción
router.post('/ordenes', crearOrden);
router.get('/ordenes', obtenerOrdenes);

module.exports = router;
