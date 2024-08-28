// Importamos la conexión a la base de datos
const pool = require("../database/db");

// Definimos la clase DisciplinaModel
class DisciplinaModel {

  // Método para listar todas las disciplinas
  async listarDisciplinas(callback){
    try {
      // Creamos la consulta SQL para seleccionar todas las disciplinas
      let sql = "SELECT * FROM disciplinas";

      // Ejecutamos la consulta utilizando el pool de conexiones
      const [result] = await pool.query(sql, []);

      // Pasamos el resultado a la función callback
      callback(result);
    } catch (error) {
      // Mostramos el error en la consola si ocurre algún problema
      console.error(error);
    }
  }

}

// Exportamos la clase DisciplinaModel
module.exports = DisciplinaModel;