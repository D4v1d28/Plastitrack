// controllers/paroController.js
const db = require('../config/db');

// 1. Registrar inicio de paro (POST /api/paros)
exports.registrarInicioParo = async (req, res) => {
  try {
    const { id_orden, motivo, observaciones } = req.body;

    if (!id_orden || !motivo) {
      return res.status(400).json({
        success: false,
        message: 'La orden (id_orden) y el motivo son obligatorios.',
      });
    }

    // Extrae el ID del usuario desencriptado por authMiddleware (req.usuario o req.user)
    const id_usuario =
      req.usuario?.id_usuario ||
      req.usuario?.id ||
      req.user?.id_usuario ||
      req.user?.id ||
      req.body.id_usuario;

    if (!id_usuario) {
      return res.status(401).json({
        success: false,
        message: 'No se pudo obtener el usuario autenticado.',
      });
    }

    // Verificar si la orden ya se encuentra detenida (hora_fin IS NULL)
    const [existente] = await db.query(
      `SELECT id_paro FROM paro_linea WHERE id_orden = ? AND hora_fin IS NULL`,
      [id_orden]
    );

    if (existente.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un paro activo registrado para esta orden de producción.',
      });
    }

    const [result] = await db.query(
      `INSERT INTO paro_linea (id_orden, motivo, hora_inicio, observaciones, id_usuario)
       VALUES (?, ?, NOW(), ?, ?)`,
      [id_orden, motivo, observaciones || null, id_usuario]
    );

    return res.status(201).json({
      success: true,
      message: 'Paro registrado correctamente',
      id_paro: result.insertId,
    });
  } catch (error) {
    console.error('Error al registrar inicio de paro:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en la base de datos',
      error: error.sqlMessage || error.message,
    });
  }
};

// 2. Finalizar paro (PUT /api/paros/:id_paro/finalizar)
exports.finalizarParo = async (req, res) => {
  try {
    const { id_paro } = req.params;
    const { observaciones } = req.body;

    if (!id_paro) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere el id_paro en la URL.',
      });
    }

    // Consultar paro activo
    const [rows] = await db.query(
      `SELECT hora_inicio FROM paro_linea WHERE id_paro = ? AND hora_fin IS NULL`,
      [id_paro]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No existe un paro activo con el ID proporcionado.',
      });
    }

    const hora_fin = new Date();
    const hora_inicio = new Date(rows[0].hora_inicio);
    const duracion_segundos = Math.max(0, Math.floor((hora_fin - hora_inicio) / 1000));

    await db.query(
      `UPDATE paro_linea 
       SET hora_fin = ?, duracion_segundos = ?, observaciones = COALESCE(?, observaciones)
       WHERE id_paro = ?`,
      [hora_fin, duracion_segundos, observaciones || null, id_paro]
    );

    return res.json({
      success: true,
      message: 'Paro finalizado exitosamente',
      duracion_segundos,
    });
  } catch (error) {
    console.error('Error al finalizar paro:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en la base de datos',
      error: error.sqlMessage || error.message,
    });
  }
};

// 3. Obtener paros activos (GET /api/paros/activos)
exports.obtenerParosActivos = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, o.codigo_orden, o.nombre_maquina, u.nombre_completo AS registrado_por
       FROM paro_linea p
       JOIN orden_produccion o ON p.id_orden = o.id_orden
       LEFT JOIN usuario u ON p.id_usuario = u.id_usuario
       WHERE p.hora_fin IS NULL
       ORDER BY p.hora_inicio DESC`
    );

    return res.json({
      success: true,
      count: rows.length,
      parosActivos: rows,
      data: rows,
    });
  } catch (error) {
    console.error('Error al consultar paros activos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en la base de datos',
      error: error.sqlMessage || error.message,
    });
  }
};

// 4. Obtener TODOS los paros (GET /api/paros) -> HISTÓRICOS Y ACTIVOS
exports.obtenerTodosLosParos = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, o.codigo_orden, o.nombre_maquina, u.nombre_completo AS registrado_por
       FROM paro_linea p
       JOIN orden_produccion o ON p.id_orden = o.id_orden
       LEFT JOIN usuario u ON p.id_usuario = u.id_usuario
       ORDER BY p.hora_inicio DESC`
    );

    return res.json({
      success: true,
      count: rows.length,
      paros: rows,
      data: rows,
    });
  } catch (error) {
    console.error('Error al consultar todos los paros:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en la base de datos',
      error: error.sqlMessage || error.message,
    });
  }
};

// 5. Eliminar un registro de paro (DELETE /api/paros/:id_paro)
exports.eliminarParo = async (req, res) => {
  try {
    const { id_paro } = req.params;

    const [result] = await db.query(`DELETE FROM paro_linea WHERE id_paro = ?`, [id_paro]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró el registro de paro especificado.',
      });
    }

    return res.json({
      success: true,
      message: 'Registro de paro eliminado correctamente.',
    });
  } catch (error) {
    console.error('Error al eliminar paro:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en la base de datos',
      error: error.sqlMessage || error.message,
    });
  }
};
