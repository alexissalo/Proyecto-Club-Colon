const pool = require("../database/db");

class UsuarioModel {
  async validarUsuario(email, password, callback) {
    try {

      let sql = `SELECT id, nombre, email, contraseña AS password, id_rol FROM usuarios WHERE email = ? AND contraseña = ?`;

      const result = await pool.query(sql, [email, password]);

      callback(result[0]);
    } catch (error) {
      console.error(error);
    }
  }

  async validarRol(rolId) {
    try {
      let sql = `SELECT * FROM roles WHERE id = ?`;
      const [result] = await pool.query(sql, [rolId]);
      return result[0];
    } catch (error) {
      console.error(error);
      throw error; // Propaga el error para que pueda ser manejado por el controlador
    }
  }
}

module.exports = UsuarioModel;
