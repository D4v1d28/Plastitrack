const db = require('../config/db');

// Obtener usuarios (con soporte opcional de filtros por query params)
const obtenerUsuarios = async (req, res) => {
  try {
    const { rol, activo } = req.query;

    let sql = 'SELECT id_usuario, nombre_completo, rol, activo, fecha_creacion FROM usuario WHERE 1=1';
    const params = [];

    // Filtro opcional por rol
    if (rol) {
      sql += ' AND LOWER(rol) = LOWER(?)';
      params.push(rol);
    }

    // Filtro opcional por estado activo/inactivo
    if (activo !== undefined) {
      const esActivo = activo === 'true' || activo === '1' || activo === true;
      sql += ' AND activo = ?';
      params.push(esActivo ? 1 : 0);
    }

    sql += ' ORDER BY id_usuario DESC';

    const [usuarios] = await db.query(sql, params);

    // Formatear activo como booleano puro (true/false)
    const usuariosFormateados = usuarios.map((u) => ({
      ...u,
      activo: Boolean(u.activo),
    }));

    res.json({
      total: usuariosFormateados.length,
      usuarios: usuariosFormateados,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar la lista de usuarios.', detalle: error.message });
  }
};

// Cambiar estado activo/inactivo de un usuario (Soft Delete / Reactivación)
const cambiarEstadoUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  const { activo } = req.body;

  if (activo === undefined) {
    return res.status(400).json({ error: 'El campo "activo" (boolean) es obligatorio.' });
  }

  try {
    const [resultado] = await db.query(
      'UPDATE usuario SET activo = ? WHERE id_usuario = ?',
      [activo, id_usuario]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json({
      mensaje: `Estado del usuario actualizado a ${activo ? 'Activo' : 'Inactivo'}`,
      id_usuario: Number(id_usuario),
      activo,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado del usuario.', detalle: error.message });
  }
};

// Crear un nuevo usuario en la BDD
const crearUsuario = async (req, res) => {
  const { nombre_completo, contrasena, rol } = req.body;

  if (!nombre_completo || !contrasena || !rol) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios: nombre_completo, contrasena y rol.' });
  }

  const rolesValidos = ['operador', 'supervisor', 'administrador'];
  const rolLower = rol.toLowerCase();

  if (!rolesValidos.includes(rolLower)) {
    return res.status(400).json({ error: 'El rol especificado no es válido.' });
  }

  try {
    const [existente] = await db.query('SELECT id_usuario FROM usuario WHERE nombre_completo = ?', [nombre_completo]);
    if (existente.length > 0) {
      return res.status(400).json({ error: 'Ya existe un usuario registrado con ese nombre.' });
    }

    const [resultado] = await db.query(
      'INSERT INTO usuario (nombre_completo, contrasena, rol, activo) VALUES (?, ?, ?, TRUE)',
      [nombre_completo, contrasena, rolLower]
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      id_usuario: resultado.insertId,
      usuario: {
        id_usuario: resultado.insertId,
        nombre_completo,
        rol: rolLower,
        activo: true,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno al registrar el usuario.', detalle: error.message });
  }
};

// Actualizar datos de un usuario existente
const actualizarUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  const { nombre_completo, contrasena, rol } = req.body;

  if (!nombre_completo || !rol) {
    return res.status(400).json({ error: 'Los campos nombre_completo y rol son obligatorios.' });
  }

  const rolesValidos = ['operador', 'supervisor', 'administrador'];
  const rolLower = rol.toLowerCase();

  if (!rolesValidos.includes(rolLower)) {
    return res.status(400).json({ error: 'El rol especificado no es válido.' });
  }

  try {
    const [existente] = await db.query(
      'SELECT id_usuario FROM usuario WHERE nombre_completo = ? AND id_usuario != ?',
      [nombre_completo, id_usuario]
    );

    if (existente.length > 0) {
      return res.status(400).json({ error: 'Ya existe otro usuario registrado con ese nombre.' });
    }

    if (contrasena && contrasena.trim() !== '') {
      await db.query(
        'UPDATE usuario SET nombre_completo = ?, contrasena = ?, rol = ? WHERE id_usuario = ?',
        [nombre_completo, contrasena, rolLower, id_usuario]
      );
    } else {
      await db.query(
        'UPDATE usuario SET nombre_completo = ?, rol = ? WHERE id_usuario = ?',
        [nombre_completo, rolLower, id_usuario]
      );
    }

    res.json({
      mensaje: 'Usuario actualizado exitosamente',
      id_usuario: Number(id_usuario),
      usuario: {
        id_usuario: Number(id_usuario),
        nombre_completo,
        rol: rolLower,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno al actualizar el usuario.', detalle: error.message });
  }
};

module.exports = {
  obtenerUsuarios,
  cambiarEstadoUsuario,
  crearUsuario,
  actualizarUsuario,
};
