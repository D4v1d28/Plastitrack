const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

// Ruta pública para autenticación
router.post('/login', login);

// Ruta protegida de prueba (Solo requiere estar logueado)
router.get('/perfil', verificarToken, (req, res) => {
  res.json({
    mensaje: 'Acceso concedido a perfil privado',
    usuarioLogueado: req.usuario,
  });
});

// Ruta protegida exclusiva para el rol Supervisor
//Previo a entrega de acts 27 y 28 -- router.get('/panel-supervisor', verificarToken, verificarRol(['Supervisor']), (req, res) => {
  router.get('/panel-supervisor', verificarToken, verificarRol(['supervisor', 'Supervisor', 'administrador', 'Administrador']), (req, res) => {
  res.json({
    mensaje: 'Bienvenido al panel exclusivo para Supervisores de planta.',
  });
});

module.exports = router;
