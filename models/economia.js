const pool = require("../database/db");

class EconomiaModel {
  async nuevoMovimiento(
    monto,
    descripcion,
    documentacion,
    es_ingreso,
    disciplina,
    id_responsable,
    callback
  ) {
    try {
      // Consulta para obtener el ID de la disciplina basado en su nombre
      let sqlGetDisciplina = `SELECT id FROM disciplinas WHERE nombre = ?`;
      const [rows] = await pool.query(sqlGetDisciplina, [disciplina]);

      const id_disciplina = rows[0].id;

      let sql = `INSERT INTO disciplinas_abonos(valor, descripcion, documentacion, es_ingreso, id_disciplina, id_responsable, fecha) VALUES (?,?,?,?,?,?,now())`;

      const [result] = await pool.query(sql, [
        monto,
        descripcion,
        documentacion,
        es_ingreso,
        id_disciplina,
        id_responsable,
      ]);

      callback(result);
    } catch (error) {
      console.error(error);
      callback(null);
    }
  }
}

module.exports = EconomiaModel;
