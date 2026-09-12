const db = require('../config/db');

// Registrar una nueva merma
const registrarMerma = async (req, res) => {
  const { peso_kilogramos, tipo_defecto, id_orden } = req.body;
  const id_usuario = req.usuario.id_usuario; // Obtenido del token JWT mediante el middleware

  if (!peso_kilogramos || !tipo_defecto || !id_orden) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios: peso_kilogramos, tipo_defecto, id_orden.' });
  }

  try {
    // Validar que la orden de producción exista
    const [orden] = await db.query('SELECT id_orden FROM orden_produccion WHERE id_orden = ?', [id_orden]);
    if (orden.length === 0) {
      return res.status(404).json({ error: 'La orden de producción especificada no existe.' });
    }

    const fecha_hora = new Date();

    const [resultado] = await db.query(
      'INSERT INTO merma (peso_kilogramos, tipo_defecto, fecha_hora, id_orden, id_usuario) VALUES (?, ?, ?, ?, ?)',
      [peso_kilogramos, tipo_defecto, fecha_hora, id_orden, id_usuario]
    );

    res.status(201).json({
      mensaje: 'Merma registrada con éxito',
      id_merma: resultado.insertId,
      datos: {
        peso_kilogramos,
        tipo_defecto,
        fecha_hora,
        id_orden,
        id_usuario,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno al registrar la merma.', detalle: error.message });
  }
};

// Obtener todas las mermas registradas
const obtenerMermas = async (req, res) => {
  try {
    const [mermas] = await db.query(`
      SELECT 
        m.id_merma, 
        m.peso_kilogramos, 
        m.tipo_defecto, 
        m.fecha_hora, 
        m.id_orden, 
        u.nombre_completo AS registrado_por
      FROM merma m
      INNER JOIN usuario u ON m.id_usuario = u.id_usuario
      ORDER BY m.fecha_hora DESC
    `);

    res.json({
      total: mermas.length,
      mermas,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar mermas.', detalle: error.message });
  }
};

// Obtener mermas de una orden de producción específica
const obtenerMermasPorOrden = async (req, res) => {
  const { id_orden } = req.params;

  try {
    const [mermas] = await db.query(
      'SELECT * FROM merma WHERE id_orden = ? ORDER BY fecha_hora DESC',
      [id_orden]
    );

    res.json({
      id_orden: Number(id_orden),
      total_registros: mermas.length,
      mermas,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar mermas por orden.', detalle: error.message });
  }
};

module.exports = {
  registrarMerma,
  obtenerMermas,
  obtenerMermasPorOrden,
};