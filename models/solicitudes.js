const pool = require("../database/db"); // tu conexión MySQL

class SolicitudModel {
  async listarSolicitudesPorDisciplina(nombreDisciplina, estadoFiltro) {
    let query = `
    SELECT 
      s.id_solicitud,
      s.tipo_solicitud,
      s.estado,
      DATE_FORMAT(s.fecha_solicitud, "%d-%m-%y") AS fecha_solicitud,
      s.datos_solicitud,
      s.observaciones,
      d.nombre AS disciplina
    FROM solicitudes s
    JOIN disciplinas d 
      ON d.id = CAST(JSON_EXTRACT(s.datos_solicitud, '$.datosPersonales.id_disciplina') AS UNSIGNED)
    WHERE d.nombre = ?
  `;

    const params = [nombreDisciplina];

    // 👇 Filtro opcional por estado
    if (estadoFiltro) {
      query += ` AND s.estado = ?`;
      params.push(estadoFiltro);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  }

  async obtenerSolicitudPorId(id) {
    const [rows] = await pool.query(
      `SELECT s.id_solicitud,
        s.tipo_solicitud,
        s.estado,
        DATE_FORMAT(s.fecha_solicitud, "%d-%m-%y") AS fecha_solicitud,
        s.datos_solicitud,
        s.observaciones FROM solicitudes s WHERE id_solicitud = ?`,
      [id],
    );

    return rows[0];
  }

  async eliminarSolicitud(id, callback) {
    try {
      let sql = `DELETE FROM solicitudes WHERE id_solicitud=?`;

      const [result] = await pool.query(sql, [id]);

      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async actualizarEstadoSolicitud(id, estado, callback) {
    try {
      let sql = `UPDATE solicitudes SET estado= ? WHERE id_solicitud=?`;

      const [result] = await pool.query(sql, [estado, id]);

      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }
}

module.exports = SolicitudModel;
