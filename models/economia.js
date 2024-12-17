const pool = require("../database/db");

class EconomiaModel {
  async nuevoMovimiento(
    monto,
    descripcion,
    documentacion,
    es_ingreso,
    disciplina,
    id_responsable,
    fecha,
    callback
  ) {
    try {
      // Consulta para obtener el ID de la disciplina basado en su nombre
      let sqlGetDisciplina = `SELECT id FROM disciplinas WHERE nombre = ?`;
      const [rows] = await pool.query(sqlGetDisciplina, [disciplina]);

      const id_disciplina = rows[0].id;

      let sql = `INSERT INTO disciplinas_abonos(valor, descripcion, documentacion, es_ingreso, id_disciplina, id_responsable, fecha) VALUES (?,?,?,?,?,?,?)`;

      const [result] = await pool.query(sql, [
        monto,
        descripcion,
        documentacion,
        es_ingreso,
        id_disciplina,
        id_responsable,
        fecha
      ]);

      callback(result);
    } catch (error) {
      console.error(error);
      callback(null);
    }
  }

  async updateMovimiento(id, valor, descripcion, fecha, tipo_movimiento,documentacion, callback){
    try {
      let sql= `UPDATE disciplinas_abonos SET valor= ?, descripcion=?, fecha= ?, es_ingreso=?, documentacion= ? WHERE id= ?`

      const [result]= await pool.query(sql, [valor, descripcion, fecha, tipo_movimiento,documentacion, id])

      callback(result)
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }

  async getMovimientoById(id, callback){
    try {
      let sql=`SELECT * FROM disciplinas_abonos WHERE id= ?`

      const [result]=await pool.query(sql, [id])

      callback(result[0])
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }

  async deleteMovimiento(id, callback){
    try {
      let sql=`DELETE FROM disciplinas_abonos WHERE id= ?`

      const [result]= await pool.query(sql, [id])

      callback(result)
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }
}

module.exports = EconomiaModel;
