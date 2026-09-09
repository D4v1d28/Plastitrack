const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Endpoint de Inicio de Sesión
const login = async (req, res) => {
  const { nombre_completo, contrasena } = req.body;

  if (!nombre_completo || !contrasena) {
    return res.status(400).json({ error: 'Por favor proporciona usuario y contraseña.' });
  }

  try {
    // Buscar usuario en la base de datos de Plastitrack
    const [rows] = await db.query('SELECT * FROM usuario WHERE nombre_completo = ?', [nombre_completo]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const usuario = rows[0];

    // Para pruebas iniciales comparamos texto plano; en producción se usa bcrypt.compare()
    const passwordValida = (contrasena === usuario.contrasena);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    // Generar Token JWT con vigencia de 8 horas
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        nombre_completo: usuario.nombre_completo,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET || 'plastitrack_secreto_desarrollo_2026',
      { expiresIn: '8h' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre_completo: usuario.nombre_completo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor al iniciar sesión.', detalle: error.message });
  }
};

module.exports = {
  login,
};
