const express = require('express');
const router = express.Router();
const { obtenerResumenMetricas } = require('../controllers/reporteController');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

// Dashboard protegido para supervisores y administradores
router.get('/dashboard', verificarToken, verificarRol(['supervisor', 'administrador']), obtenerResumenMetricas);

module.exports = router;
