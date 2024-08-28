// Importamos la conexión a la base de datos
const pool = require("../database/db");

// Definimos la clase EventoModel
class EventoModel {
  // Método para listar todos los eventos
  async listarEventos(callback) {
    try {
      // Creamos la consulta SQL para seleccionar todos los eventos que no tienen una disciplina asociada
      let sql =
        "SELECT id, nombre AS title, descripcion AS description, DATE_FORMAT(fechaInicio, '%Y-%m-%d') AS start, DATE_FORMAT(fechaFin, '%Y-%m-%d') AS end FROM eventos WHERE id_disciplina IS NULL";

      // Ejecutamos la consulta utilizando el pool de conexiones
      const [result] = await pool.query(sql, []);

      // Pasamos el resultado a la función callback
      callback(result);
    } catch (error) {
      // Mostramos el error en la consola si ocurre algún problema
      console.error(error);
      throw error;
    }
  }

  // Método para listar eventos por disciplina
  async listarEventosPorDisciplina(disciplinaNombre, callback) {
    try {
      // Creamos la consulta SQL para seleccionar los eventos de una disciplina específica
      let sql = `
            SELECT e.id, e.nombre AS title, e.descripcion AS description, 
                   DATE_FORMAT(e.fechaInicio, '%Y-%m-%d') AS start, 
                   DATE_FORMAT(e.fechaFin, '%Y-%m-%d') AS end 
            FROM eventos e
            INNER JOIN disciplinas d ON e.id_disciplina = d.id
            WHERE d.nombre = ?
        `;

      // Ejecutamos la consulta utilizando el pool de conexiones
      const [result] = await pool.query(sql, [disciplinaNombre]);

      // Pasamos el resultado a la función callback
      callback(result);
    } catch (error) {
      // Mostramos el error en la consola si ocurre algún problema
      console.error(error);
      throw error;
    }
  }

  // Método para agregar un evento por disciplina
  async añadirEventoPorDisciplina(
    nombre,
    descripcion,
    fechaInicio,
    fechaFin,
    disciplinaNombre,
    callback
  ) {
    try {
      // Primero, obtenemos la id_disciplina correspondiente al nombre de la disciplina
      const disciplinaSql = "SELECT id FROM disciplinas WHERE nombre = ?";
      const [disciplinaResult] = await pool.query(disciplinaSql, [
        disciplinaNombre,
      ]);

      const idDisciplina = disciplinaResult[0].id;

      // Luego, insertamos el evento con la id_disciplina obtenida
      let sql =
        "INSERT INTO eventos (nombre, descripcion, fechaInicio, fechaFin, id_disciplina) VALUES (?,?,?,?,?)";
      const [result] = await pool.query(sql, [
        nombre,
        descripcion,
        fechaInicio,
        fechaFin,
        idDisciplina,
      ]);

      // Pasamos el resultado a la función callback
      callback(result);
    } catch (error) {
      // Mostramos el error en la consola si ocurre algún problema
      console.error(error);
    }
  }

  // Método para agregar un evento sin disciplina
  async añadirEvento(
    nombre,
    descripcion,
    fechaInicio,
    fechaFin,
    callback
  ) {
    try {
      // Insertamos el evento sin id_disciplina
      let sql =
        "INSERT INTO eventos (nombre, descripcion, fechaInicio, fechaFin) VALUES (?,?,?,?)";
      const [result] = await pool.query(sql, [
        nombre,
        descripcion,
        fechaInicio,
        fechaFin,
      ]);

      // Pasamos el resultado a la función callback
      callback(result);
    } catch (error) {
      // Mostramos el error en la consola si ocurre algún problema
      console.error(error);
    }
  }

  // Método para eliminar un evento
  async borrarEvento(id, callback) {
    try {
      // Creamos la consulta SQL para eliminar un evento por su id
      let sql = "DELETE FROM eventos WHERE id=?";

      // Ejecutamos la consulta utilizando el pool de conexiones
      const [result] = await pool.query(sql, [id]);

      // Pasamos el resultado a la función callback
      callback(result);
    } catch (error) {
      // Mostramos el error en la consola si ocurre algún problema
      console.error(error);
    }
  }
}

// Exportamos la clase EventoModel
module.exports = EventoModel;
