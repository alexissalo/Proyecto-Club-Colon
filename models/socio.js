// Importamos la conexión a la base de datos
const pool = require("../database/db");

// Definimos la clase SocioModel
class SocioModel {
  // Método para obtener la lista de socios con paginación y búsqueda
  async getSocios(pagina, filasPorPagina, buscar, callback) {
    try {
      // Calculamos el offset para la paginación
      const offset = (pagina - 1) * filasPorPagina;

      // Creamos la consulta SQL para seleccionar los socios
      let sql = `
        SELECT 
          s.id,
          s.nombre, 
          s.dni, 
          DATE_FORMAT(s.fechaNacimiento, '%d-%m-%Y') AS fechaNacimiento,
          s.telefono, 
          s.domicilio, 
          DATE_FORMAT(s.fechaInscripcion, '%d-%m-%Y') AS fechaInscripcion
        FROM 
          socios s
      `;

      // Agregamos la cláusula WHERE si se proporciona un término de búsqueda
      if (buscar) {
        sql += ` WHERE s.nombre LIKE ? OR s.dni LIKE ?`;
      }

      // Agregamos la cláusula LIMIT y OFFSET para la paginación
      sql += ` LIMIT ? OFFSET ?`;

      // Preparamos los parámetros para la consulta
      let params = [];

      if (buscar) {
        params = [`%${buscar}%`, `%${buscar}%`, filasPorPagina, offset];
      } else {
        params = [filasPorPagina, offset];
      }

      // Ejecutamos la consulta utilizando el pool de conexiones
      const [socios] = await pool.query(sql, params);

      // Luego, para cada socio, obtenemos los pagos correspondientes
      const arregloSocios = await Promise.all(
        socios.map(async (socio) => {
          let sql = `
            SELECT 
              DATE_FORMAT(sa.fecha, '%d-%m-%Y') AS fecha,
              sa.valor
            FROM 
              socios_abonos sa
            WHERE 
              sa.id_socio = ?
          `;

          const [pagos] = await pool.query(sql, [socio.id]);

          return {
            id: socio.id,
            nombre: socio.nombre,
            dni: socio.dni,
            fechaNacimiento: socio.fechaNacimiento,
            telefono: socio.telefono,
            domicilio: socio.domicilio,
            fechaInscripcion: socio.fechaInscripcion,
            pagos: pagos.map((pago) => ({
              fecha: pago.fecha,
              valor: pago.valor,
            })),
          };
        })
      );

      // Pasamos el resultado a la función callback
      callback(arregloSocios);
    } catch (error) {
      // Mostramos el error en la consola si ocurre algún problema
      console.error(error);
    }
  }

  // Método para obtener el total de socios
  async getTotalSocios(buscar, callback) {
    try {
      let sql = `SELECT COUNT(*) AS total FROM socios`;

      if (buscar) {
        sql += ` WHERE nombre LIKE ? OR dni LIKE ?`;
        const params = [`%${buscar}%`, `%${buscar}%`];
        const [result] = await pool.query(sql, params);
        callback(result[0].total);
      } else {
        const [result] = await pool.query(sql);
        callback(result[0].total);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Método para actualizar un socio
  async updateSocio(id, nombre, dni, telefono, fechaNacimiento, domicilio, callback) {
    try {
      let sql = `UPDATE socios SET nombre = ?, dni = ?, telefono = ?, fechaNacimiento = ?, domicilio = ? WHERE id = ?`;
      
      const params = [nombre, dni, telefono, fechaNacimiento, domicilio, id];

      const [result] = await pool.query(sql, params);

      callback(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Método para eliminar un socio
  async deleteSocio(id, callback) {
    try {
      let sql = `DELETE FROM socios WHERE id = ?`;
      
      const [result] = await pool.query(sql, id);

      callback(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

// Exportamos la clase SocioModel
module.exports = SocioModel;
