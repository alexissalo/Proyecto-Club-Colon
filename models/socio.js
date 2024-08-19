const pool = require("../database/db");

class SocioModel {

  async getSocios(pagina,filasPorPagina,callback) {
    try {
      const offset = (pagina - 1) * filasPorPagina;
      let sql = `SELECT nombre, dni, DATE_FORMAT(fechaNacimiento, '%d-%m-%Y') AS fechaNacimiento,telefono, domicilio, DATE_FORMAT(fechaInscripcion, '%d-%m-%Y') AS fechaInscripcion FROM socios LIMIT ? OFFSET ?`;

      const [result] = await pool.query(sql, [filasPorPagina,offset]);

      callback(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = SocioModel;
