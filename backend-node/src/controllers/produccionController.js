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

// Consultar todas las órdenes calculando paros ACTIVOS y totales históricos
const obtenerOrdenes = async (req, res) => {
  try {
    const query = `
      SELECT 
        op.id_orden,
        op.codigo_orden,
        op.nombre_maquina,
        op.estado AS estado_orden,
        -- Detecta si la máquina tiene actualmente un paro sin hora_fin
        IF(COUNT(CASE WHEN p.hora_fin IS NULL AND p.id_paro IS NOT NULL THEN 1 END) > 0, 'paro', op.estado) AS estado_actual,
        -- Segundos del paro activo en curso (si existe)
        COALESCE(SUM(CASE WHEN p.hora_fin IS NULL THEN TIMESTAMPDIFF(SECOND, p.hora_inicio, NOW()) ELSE 0 END), 0) AS segundos_paro_activo,
        -- Totales de mermas e incidencias
        COALESCE(SUM(m.peso_kilogramos), 0) AS total_merma_kg,
        COUNT(DISTINCT p.id_paro) AS total_paros
      FROM orden_produccion op
      LEFT JOIN merma m ON op.id_orden = m.id_orden
      LEFT JOIN paro_linea p ON op.id_orden = p.id_orden
      GROUP BY op.id_orden, op.codigo_orden, op.nombre_maquina, op.estado
      ORDER BY op.id_orden DESC
    `;

    const [ordenes] = await db.query(query);
    res.json({ total: ordenes.length, ordenes });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las órdenes de producción.', detalle: error.message });
  }
};

module.exports = {
  crearOrden,
  obtenerOrdenes,
};
