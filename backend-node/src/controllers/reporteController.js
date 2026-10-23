const db = require('../config/db');

// Obtener resumen general de métricas y registros detallados para el dashboard
const obtenerResumenMetricas = async (req, res) => {
  try {
    const { fecha, inyectora, turno } = req.query;

    // 1. Métricas generales de merma
    const [mermasResumen] = await db.query(`
      SELECT 
        COUNT(id_merma) AS total_registros_merma,
        COALESCE(SUM(peso_kilogramos), 0) AS total_kg_desperdicio,
        COALESCE(SUM(piezas), 0) AS total_piezas_desperdicio
      FROM merma
    `);

    // 2. Métricas generales de paros de línea
    const [parosResumen] = await db.query(`
      SELECT 
        COUNT(id_paro) AS total_paros,
        COALESCE(SUM(
          IFNULL(duracion_segundos, TIMESTAMPDIFF(SECOND, hora_inicio, IFNULL(hora_fin, NOW())))
        ), 0) AS total_segundos_paro
      FROM paro_linea
    `);

    // 3. Mermas agrupadas por tipo de defecto para Pareto
    const [mermasPorDefecto] = await db.query(`
      SELECT 
        tipo_defecto, 
        COUNT(*) AS cantidad_registros, 
        COALESCE(SUM(peso_kilogramos), 0) AS total_kg,
        COALESCE(SUM(piezas), 0) AS total_piezas
      FROM merma
      GROUP BY tipo_defecto
      ORDER BY cantidad_registros DESC
    `);

    // 4. Paros agrupados por motivo
    const [parosPorMotivo] = await db.query(`
      SELECT 
        motivo, 
        COUNT(*) AS cantidad_eventos,
        COALESCE(SUM(
          IFNULL(duracion_segundos, TIMESTAMPDIFF(SECOND, hora_inicio, IFNULL(hora_fin, NOW())))
        ), 0) AS segundos_acumulados
      FROM paro_linea
      GROUP BY motivo
      ORDER BY cantidad_eventos DESC
    `);

    // 5. REGISTROS DETALLADOS DE MERMA (Evaluación dinámica según unidad_medida / piezas)
    const [mermasDetalle] = await db.query(`
      SELECT 
        m.id_merma,
        m.fecha_hora AS fecha,
        op.nombre_maquina,
        m.tipo_defecto AS evento,
        CASE 
          WHEN m.unidad_medida = 'piezas' OR m.piezas IS NOT NULL THEN CONCAT(m.piezas, ' piezas')
          ELSE CONCAT(COALESCE(m.peso_kilogramos, 0), ' kg merma')
        END AS impacto,
        'merma' AS tipo_registro
      FROM merma m
      JOIN orden_produccion op ON m.id_orden = op.id_orden
      ORDER BY m.fecha_hora DESC
    `);

    // 6. REGISTROS DETALLADOS DE PAROS
    const [parosDetalle] = await db.query(`
      SELECT 
        p.id_paro,
        p.hora_inicio AS fecha,
        op.nombre_maquina,
        p.motivo AS evento,
        CONCAT(ROUND(COALESCE(p.duracion_segundos, TIMESTAMPDIFF(SECOND, p.hora_inicio, IFNULL(p.hora_fin, NOW()))) / 60), ' min inactivo') AS impacto,
        'paro' AS tipo_registro
      FROM paro_linea p
      JOIN orden_produccion op ON p.id_orden = op.id_orden
      ORDER BY p.hora_inicio DESC
    `);

    const totalSegundos = parosResumen[0].total_segundos_paro;
    const totalMinutos = (totalSegundos / 60).toFixed(2);

    res.json({
      metricas_generales: {
        total_registros_merma: mermasResumen[0].total_registros_merma,
        total_kg_merma: Number(mermasResumen[0].total_kg_desperdicio),
        total_piezas_merma: Number(mermasResumen[0].total_piezas_desperdicio),
        total_paros_linea: parosResumen[0].total_paros,
        total_segundos_inactivos: totalSegundos,
        total_minutos_inactivos: Number(totalMinutos),
      },
      desglose_mermas: mermasPorDefecto,
      desglose_paros: parosPorMotivo,
      registros_mermas: mermasDetalle,
      registros_paros: parosDetalle,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar el reporte de métricas.', detalle: error.message });
  }
};

module.exports = {
  obtenerResumenMetricas,
};
