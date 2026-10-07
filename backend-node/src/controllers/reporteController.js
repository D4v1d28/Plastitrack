const db = require('../config/db');

// Obtener resumen general de métricas para dashboard
const obtenerResumenMetricas = async (req, res) => {
  try {
    // 1. Métricas generales de merma (peso total en kg y piezas totales)
    const [mermasResumen] = await db.query(`
      SELECT 
        COUNT(id_merma) AS total_registros_merma,
        COALESCE(SUM(peso_kilogramos), 0) AS total_kg_desperdicio,
        COALESCE(SUM(piezas), 0) AS total_piezas_desperdicio
      FROM merma
    `);

    // 2. Métricas generales de paros de línea (duración total en segundos y minutos)
    const [parosResumen] = await db.query(`
      SELECT 
        COUNT(id_paro) AS total_paros,
        COALESCE(SUM(
          IFNULL(duracion_segundos, TIMESTAMPDIFF(SECOND, hora_inicio, IFNULL(hora_fin, NOW())))
        ), 0) AS total_segundos_paro
      FROM paro_linea
    `);

    // 3. Mermas agrupadas por tipo de defecto
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
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar el reporte de métricas.', detalle: error.message });
  }
};

module.exports = {
  obtenerResumenMetricas,
};
