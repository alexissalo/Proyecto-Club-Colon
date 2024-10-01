const pool = require("../database/db");

class UsuarioModel {

  //query para validar el usuario 

  async validarUsuario(email, password, callback) {
    try {
      let sql = `
        SELECT u.id, u.nombre, u.email, u.contraseña AS password, u.id_rol, r.nombre AS rol_nombre
        FROM usuarios u
        JOIN roles r ON u.id_rol = r.id
        WHERE u.email = ? AND u.contraseña = ?
      `;
  
      const [result] = await pool.query(sql, [email, password]);
      
      callback(result[0]);
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }

  //query para verificar el rol del usuario

  async validarRol(rolId) {
    try {
      let sql = `SELECT * FROM roles WHERE id = ?`;
      const [result] = await pool.query(sql, [rolId]);
      return result[0];
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  //query para listar los roles

  async listarRoles(callback){
    try {
      let sql=`SELECT * FROM roles`
      const [result]= await pool.query(sql,[])
      callback(result)
    } catch (error) {
      console.log(error)
      callback(null)
    }
  }

  //query para listar los usuarios

  async listarUsuarios(pagina, filasPorPagina, buscar, callback) {
    try {
      const offset = (pagina - 1) * filasPorPagina;

      let sql = `SELECT u.id, u.nombre, u.email, u.contraseña AS password, u.id_rol, r.nombre AS rol_nombre
        FROM usuarios u
        JOIN roles r ON u.id_rol = r.id`;

        // Agregamos la cláusula WHERE si se proporciona un término de búsqueda
      if (buscar) {
        sql += ` WHERE u.nombre LIKE ?`;
      }

      // Agregamos la cláusula LIMIT y OFFSET para la paginación
      sql += ` LIMIT ? OFFSET ?`;

      // Preparamos los parámetros para la consulta
      let params = [];

      if (buscar) {
        params = [`%${buscar}%`, filasPorPagina, offset];
      } else {
        params = [filasPorPagina, offset];
      }
      const [result] = await pool.query(sql, params);
      callback(result)
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }

  async getTotalUsuarios(buscar, callback) {
    try {
      let sql = `SELECT COUNT(*) AS total FROM usuarios`;

      if (buscar) {
        sql += ` WHERE nombre LIKE ?`;
        const params = [`%${buscar}%`];
        const [result] = await pool.query(sql, params);
        callback(result[0].total);
      } else {
        const [result] = await pool.query(sql);
        callback(result[0].total);
      }
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }

  //query para crear un usuario

  async crearUsuario(nombre,email,contraseña,id_rol,callback) {
    try {
      let sql = `INSERT INTO usuarios(nombre,email,contraseña,id_rol) VALUES (?,?,?,?);`;
      const [result] = await pool.query(sql, [nombre,email,contraseña,id_rol]);
      callback(result)
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }

  //query para traer el usuario para la cuenta

  async traerUsuario(id, callback) {
    try {
      let sql = `SELECT u.id, u.nombre, u.email, u.id_rol, r.nombre AS rol_nombre
        FROM usuarios u
        JOIN roles r ON u.id_rol = r.id WHERE u.id= ?`;
      const [result] = await pool.query(sql, [id]);
      callback(result[0])
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }

  //query para actualizar el nombre

  async actualizarNombre(id,nombre,callback){
    try {
      let sql=`UPDATE usuarios SET nombre = ? WHERE id = ?`

      const [result]= await pool.query(sql, [nombre, id])
      callback(result)
    } catch (error) {
      console.log(error)
      callback(null)
    }
  }

  //query para actualizar la contraseña

  async actualizarContraseña(id,contraseña,callback){
    try {
      let sql=`UPDATE usuarios SET contraseña = ? WHERE id = ?`

      const [result]= await pool.query(sql, [contraseña, id])
      callback(result)
    } catch (error) {
      console.log(error)
      callback(null)
    }
  }

  //query para verificar la contraseña

  async verificarContraseña(id,callback){
    try {
      let sql=`SELECT contraseña AS password FROM usuarios WHERE id = ?`

      const [result]= await pool.query(sql, [id])
      
      callback(result[0])
    } catch (error) {
      console.log(error)
      callback(null)
    }
  }

  async borrarUsuario(id, callback) {
    try {
      let sql = "DELETE FROM usuarios WHERE id=?";

      const [result] = await pool.query(sql, [id]);

      callback(result);
    } catch (error) {
      console.log(error)
      callback(null)
    }
  }
}

module.exports = UsuarioModel;
