const db = require('../config/db');

// Diccionario de tipos de defectos a texto descriptivo
const TIPOS_DEFECTO = {
  1: 'Rechupados (Hundimiento por enfriamiento)',
  2: 'Ráfagas plateadas (Humedad / gas atrapado)',
  3: 'Pieza incompleta (Tiro corto / falta presión)',
  4: 'Rebabas (Exceso de presión o desajuste)',
  5: 'Purga inicial (Arranque / cambio de resina)',
};

const obtenerTextoDefecto = (valor) => {
  if (valor === null || valor === undefined) return null;
  if (TIPOS_DEFECTO[valor]) return TIPOS_DEFECTO[valor];
  if (typeof valor === 'string' && valor.trim().length > 0) return valor.trim();
  return String(valor);
};

// Registrar una nueva merma
const registrarMerma = async (req, res) => {
  try {
    // Extraer id_usuario de forma segura según la estructura del middleware
    const id_usuario = 
      req.usuario?.id_usuario || 
      req.usuario?.id || 
      req.user?.id_usuario || 
      req.user?.id || 
      req.body.id_usuario;

    if (!id_usuario) {
      return res.status(401).json({ 
        error: 'No se pudo obtener la identidad del usuario autenticado.' 
      });
    }

    const { 
      peso_kilogramos, 
      piezas, 
      unidad_medida, 
      tipo_defecto, 
      id_orden, 
      observaciones 
    } = req.body;

    // Si se envió un archivo a través de multer
    const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;

    const tipoDefectoTexto = obtenerTextoDefecto(tipo_defecto);

    // Convertir a número si vienen como string en multipart/form-data
    const numOrden = id_orden ? Number(id_orden) : null;
    const numPeso = peso_kilogramos !== undefined && peso_kilogramos !== '' ? Number(peso_kilogramos) : null;
    const numPiezas = piezas !== undefined && piezas !== '' ? Number(piezas) : null;

    if (!tipoDefectoTexto || !numOrden || (numPeso === null && numPiezas === null)) {
      return res.status(400).json({ 
        error: 'Debe especificar el tipo_defecto, id_orden y al menos peso_kilogramos o piezas.' 
      });
    }

    // Verificar existencia de la orden
    const [orden] = await db.query('SELECT id_orden FROM orden_produccion WHERE id_orden = ?', [numOrden]);
    if (orden.length === 0) {
      return res.status(404).json({ error: 'La orden de producción especificada no existe.' });
    }

    const fecha_hora = new Date();
    const textoObservaciones = observaciones ? String(observaciones).trim() : null;

    const [resultado] = await db.query(
      `INSERT INTO merma 
        (peso_kilogramos, piezas, unidad_medida, tipo_defecto, observaciones, imagen_url, fecha_hora, id_orden, id_usuario) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        numPeso, 
        numPiezas, 
        unidad_medida || 'kg', 
        tipoDefectoTexto, 
        textoObservaciones, 
        imagen_url,
        fecha_hora, 
        numOrden, 
        id_usuario
      ]
    );

    return res.status(201).json({
      success: true,
      mensaje: 'Merma registrada con éxito',
      id_merma: resultado.insertId,
      datos: {
        peso_kilogramos: numPeso,
        piezas: numPiezas,
        unidad_medida: unidad_medida || 'kg',
        tipo_defecto: tipoDefectoTexto,
        observaciones: textoObservaciones,
        imagen_url,
        fecha_hora,
        id_orden: numOrden,
        id_usuario,
      },
    });
  } catch (error) {
    console.error('Error al registrar merma:', error);
    return res.status(500).json({ 
      error: 'Error interno al registrar la merma.', 
      detalle: error.message 
    });
  }
};

const obtenerMermas = async (req, res) => {
  try {
    const [mermas] = await db.query(`
      SELECT 
        m.id_merma, 
        m.peso_kilogramos, 
        m.piezas,
        m.unidad_medida,
        m.tipo_defecto, 
        m.observaciones, 
        m.imagen_url,
        m.fecha_hora, 
        m.id_orden, 
        u.nombre_completo AS registrado_por
      FROM merma m
      INNER JOIN usuario u ON m.id_usuario = u.id_usuario
      ORDER BY m.fecha_hora DESC
    `);

    const mermasFormateadas = mermas.map((item) => ({
      ...item,
      tipo_defecto: obtenerTextoDefecto(item.tipo_defecto),
    }));

    res.json({
      success: true,
      total: mermasFormateadas.length,
      mermas: mermasFormateadas,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar mermas.', detalle: error.message });
  }
};

const obtenerMermasPorOrden = async (req, res) => {
  const { id_orden } = req.params;

  try {
    const [mermas] = await db.query(
      'SELECT * FROM merma WHERE id_orden = ? ORDER BY fecha_hora DESC',
      [id_orden]
    );

    const mermasFormateadas = mermas.map((item) => ({
      ...item,
      tipo_defecto: obtenerTextoDefecto(item.tipo_defecto),
    }));

    res.json({
      success: true,
      id_orden: Number(id_orden),
      total_registros: mermasFormateadas.length,
      mermas: mermasFormateadas,
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
