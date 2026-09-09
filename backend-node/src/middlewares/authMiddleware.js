const jwt = require('jsonwebtoken');

// Middleware para verificar que la petición incluya un Token JWT válido
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // El token suele enviarse en la cabecera como: "Bearer <TOKEN>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Acceso denegado. No se proporcionó un token de autenticación.',
    });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET || 'plastitrack_secreto_desarrollo_2026');
    req.usuario = verificado; // Guardamos los datos del usuario descifrados en el request
    next(); // Permitir el paso a la siguiente función/controlador
  } catch (error) {
    return res.status(403).json({
      error: 'Token no válido o expirado.',
    });
  }
};

// Middleware para verificar el rol del usuario (Control de acceso basado en roles - RBAC)
const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Usuario no autenticado.' });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        error: `Acceso restringido. Esta acción requiere rol de: ${rolesPermitidos.join(' o ')}`,
      });
    }

    next();
  };
};

module.exports = {
  verificarToken,
  verificarRol,
};
