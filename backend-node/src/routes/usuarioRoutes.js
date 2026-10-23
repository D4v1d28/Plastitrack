const express = require('express');
const router = express.Router();
const { obtenerUsuarios, cambiarEstadoUsuario, crearUsuario, actualizarUsuario } = require('../controllers/usuarioController');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

// Todas las rutas requieren estar autenticado y tener rol de administrador
router.use(verificarToken);
router.use(verificarRol(['administrador', 'Administrador']));

// GET /api/usuarios -> Consultar lista de usuarios
router.get('/', obtenerUsuarios);

// PUT /api/usuarios/:id_usuario/estado -> Cambiar activo/inactivo
router.put('/:id_usuario/estado', cambiarEstadoUsuario);

// POST /api/usuarios -> Crear nuevo usuario (requiere rol administrador)
router.post('/', crearUsuario);

// PUT /api/usuarios/:id_usuario -> Editar datos del usuario
router.put('/:id_usuario', actualizarUsuario);

module.exports = router;
