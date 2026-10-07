const db = require('../config/db');

// Crear una nueva orden de producción
const crearOrden = async (req, res) => {
  const { codigo_orden, nombre_maquina, estado } = req.body;

  if (!codigo_orden || !nombre_maquina) {
    return res.status(400).json({ error: 'Los campos codigo_orden y nombre_maquina son obligatorios.' });
  }

  try {
    const estadoOrden = estado || 'activa';
    const [resultado] = await db.query(
      'INSERT INTO orden_produccion (codigo_orden, nombre_maquina, estado) VALUES (?, ?, ?)',
      [codigo_orden, nombre_maquina, estadoOrden]
    );

    res.status(201).json({
      mensaje: 'Orden de producción creada exitosamente',
      id_orden: resultado.insertId,
      datos: {
        codigo_orden,
        nombre_maquina,
        estado: estadoOrden,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la orden de producción.', detalle: error.message });
  }
};

// Consultar todas las órdenes de producción
const obtenerOrdenes = async (req, res) => {
  try {
    const [ordenes] = await db.query('SELECT * FROM orden_produccion ORDER BY id_orden DESC');
    res.json({ total: ordenes.length, ordenes });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las órdenes de producción.', detalle: error.message });
  }
};

module.exports = {
  crearOrden,
  obtenerOrdenes,
};
