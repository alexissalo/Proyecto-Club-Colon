// Importamos la conexión a la base de datos
const pool = require("../database/db");

// Definimos la clase MovimientoModel
class MovimientoModel {
  // Método para listar movimientos con paginación
  async listarMovimiento(pagina, filasPorPagina, callback) {
    try {
      // Calculamos el offset para la paginación
      const offset = (pagina - 1) * filasPorPagina;

      // Creamos la consulta SQL para seleccionar los movimientos con joins a usuarios y disciplinas
      let sql = `
        SELECT da.id, da.valor, DATE_FORMAT(da.fecha, "%d-%m-%y") AS fecha, da.es_ingreso, da.descripcion, 
          u.nombre AS responsable, d.nombre AS disciplina 
        FROM disciplinas_abonos da 
        JOIN usuarios u ON da.id_responsable = u.id
        JOIN disciplinas d ON da.id_disciplina = d.id 
        LIMIT ? OFFSET ?
      `;

      // Ejecutamos la consulta utilizando el pool de conexiones
      const [result] = await pool.query(sql, [filasPorPagina, offset]);

      // Pasamos el resultado a la función callback
      callback(result);
    } catch (error) {
      // Mostramos el error en la consola si ocurre algún problema
      console.log(error);
      throw error;
    }
  }

  // Método para listar movimientos por disciplina con paginación
  async listarMovimientosPorDisciplina(
    disciplina,
    pagina,
    filasPorPagina,
    callback
  ) {
    try {
      // Calculamos el offset para la paginación
      const offset = (pagina - 1) * filasPorPagina;

      // Creamos la consulta SQL para seleccionar los movimientos de una disciplina específica con joins a usuarios y disciplinas
      let sql = `
        SELECT da.id, da.valor, DATE_FORMAT(da.fecha, "%d-%m-%y") AS fecha, da.es_ingreso, da.descripcion, 
          u.nombre AS responsable, d.nombre AS disciplina 
        FROM disciplinas_abonos da 
        JOIN usuarios u ON da.id_responsable = u.id
        JOIN disciplinas d ON da.id_disciplina = d.id
        WHERE d.nombre = ? LIMIT ? OFFSET ?
      `;

      // Ejecutamos la consulta utilizando el pool de conexiones
      const [result] = await pool.query(sql, [
        disciplina,
        filasPorPagina,
        offset,
      ]);

      // Pasamos el resultado a la función callback
      callback(result);
    } catch (error) {
      // Mostramos el error en la consola si ocurre algún problema
      console.log(error);
      throw error;
    }
  }

  // Método para obtener el total de movimientos
  async getTotalMovimientos(callback) {
    try {
      // Creamos la consulta SQL para contar el total de movimientos
      const sql = "SELECT COUNT(*) AS total FROM disciplinas_abonos";

      // Ejecutamos la consulta utilizando el pool de conexiones
      const [result] = await pool.query(sql);

      // Pasamos el resultado a la función callback
      callback(result[0].total);
    } catch (error) {
      // Mostramos el error en la consola si ocurre algún problema
      console.error(error);
      callback(null);
    }
  }

  // Método para obtener el total de movimientos por disciplina
  async getTotalMovimientosPorDisciplina(disciplinaNombre, callback) {
    try {
      // Creamos la consulta SQL para contar el total de movimientos de una disciplina específica
      const sql = `
        SELECT COUNT(*) AS total
        FROM disciplinas_abonos
        INNER JOIN disciplinas ON disciplinas_abonos.id_disciplina = disciplinas.id
        WHERE disciplinas.nombre = ?
      `;

      // Ejecutamos la consulta utilizando el pool de conexiones
      const [result] = await pool.query(sql, [disciplinaNombre]);

      // Pasamos el resultado a la función callback
      callback(result[0].total);
    } catch (error) {
      // Mostramos el error en la consola si ocurre algún problema
      console.error(error);
      callback(null);
    }
  }
}

// Exportamos la clase MovimientoModel
module.exports = MovimientoModel;
