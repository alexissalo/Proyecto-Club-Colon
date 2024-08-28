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
      console.error(error);
      throw error;
    }
  }

  //query para verificar el rol del usuario

  async validarRol(rolId) {
    try {
      let sql = `SELECT * FROM roles WHERE id = ?`;
      const [result] = await pool.query(sql, [rolId]);
      return result[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //query para listar los roles

  async listarRoles(callback){
    try {
      let sql=`SELECT * FROM roles`
      const [result]= await pool.query(sql,[])
      callback(result)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  //query para listar los usuarios

  async listarUsuarios(callback) {
    try {
      let sql = `SELECT u.id, u.nombre, u.email, u.contraseña AS password, u.id_rol, r.nombre AS rol_nombre
        FROM usuarios u
        JOIN roles r ON u.id_rol = r.id`;
      const [result] = await pool.query(sql, []);
      callback(result)
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //query para crear un usuario

  async crearUsuario(nombre,email,contraseña,id_rol,callback) {
    try {
      let sql = `INSERT INTO usuarios(nombre,email,contraseña,id_rol) VALUES (?,?,?,?);`;
      const [result] = await pool.query(sql, [nombre,email,contraseña,id_rol]);
      callback(result)
    } catch (error) {
      console.error(error);
      throw error;
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
      console.error(error);
      throw error;
    }
  }

  //query para actualizar el nombre

  async actualizarNombre(id,nombre,callback){
    try {
      let sql=`UPDATE usuarios SET nombre = ? WHERE id = ?`

      const [result]= await pool.query(sql, [nombre, id])
      callback(result)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  //query para actualizar la contraseña

  async actualizarContraseña(id,contraseña,callback){
    try {
      let sql=`UPDATE usuarios SET contraseña = ? WHERE id = ?`

      const [result]= await pool.query(sql, [contraseña, id])
      callback(result)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  //query para verificar la contraseña

  async verificarContraseña(id,callback){
    try {
      let sql=`SELECT contraseña AS password FROM usuarios WHERE id = ?`

      const [result]= await pool.query(sql, [id])
      
      callback(result[0])
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async borrarUsuario(id, callback) {
    try {
      let sql = "DELETE FROM usuarios WHERE id=?";

      const [result] = await pool.query(sql, [id]);

      callback(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = UsuarioModel;
