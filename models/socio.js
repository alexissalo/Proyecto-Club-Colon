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
          s.email, 
          DATE_FORMAT(s.fechaInscripcion, '%d-%m-%Y') AS fechaInscripcion,
          d.nombre AS deporte,
          ts.nombre AS tipodesocio
        FROM 
          socios s
        LEFT JOIN 
          disciplinas d ON s.id_disciplina = d.id
        LEFT JOIN 
          tiposdesocios ts ON s.id_tipo_socio = ts.id
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
              sa.id,
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
            email:socio.email,
            fechaInscripcion: socio.fechaInscripcion,
            deporte: socio.deporte,
            tipodesocio: socio.tipodesocio,
            pagos: pagos.map((pago) => ({
              idPago:pago.id,
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
      callback(null)
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
      callback(null)
    }
  }

  async insertSocio(
    nombre,
    dni,
    telefono,
    fechaNacimiento,
    domicilio,
    email,
    deporte,
    tipodesocio,
    callback
  ) {
    try {
      let sql = `INSERT INTO socios(nombre,dni,telefono,fechaNacimiento,domicilio,id_tipo_socio,id_disciplina,email,fechaInscripcion) VALUES (?,?,?,?,?,?,?,?,now())`;

      const [result] = await pool.query(sql, [
        nombre,
        dni,
        telefono,
        fechaNacimiento,
        domicilio,
        tipodesocio,
        deporte,
        email
      ]);

      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  // Método para actualizar un socio
  async updateSocio(
    id,
    nombre,
    telefono,
    domicilio,
    email,
    tipodesocio,
    deporte,
    callback
  ) {
    try {
      let sql = `UPDATE socios SET nombre = ?, telefono = ?, domicilio = ?, id_tipo_socio= ?, id_disciplina= ?, email= ? WHERE id = ?`;

      const params = [nombre, telefono, domicilio,tipodesocio,deporte,email, id];

      const [result] = await pool.query(sql, params);

      callback(result);
    } catch (error) {
      console.error(error);
      callback(null)
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
      callback(null)
    }
  }

  async getTiposDeSocios(callback) {
    try {
      let sql = "SELECT * FROM tiposdesocios";

      const [result] = await pool.query(sql, []);

      callback(result);
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }

  async insertPago(id_socio,valor,fechaPago,callback){

    try{
      let sql= "INSERT INTO socios_abonos(id_socio,valor,fecha) VALUES (?,?,?)"

      const [result]=await pool.query(sql,[id_socio,valor,fechaPago])
      
      callback(result)
    }catch(error){
      console.log(error);
      callback(null)
    }
  }

  async insertTipoDeSocio(nombre,valordecuota,callback){
    try {
      let sql= "INSERT INTO tiposdesocios(nombre,valorDeCuota) VALUES (?,?)"

      const[result]=await pool.query(sql,[nombre,valordecuota])
      callback(result)
    } catch (error) {
      console.log(error);
      callback(null)
      
    }
  }

  async updateTipoDeSocio(id,nombre,valordecuota,callback){
    try {
      let sql= "UPDATE tiposdesocios SET nombre = ? , valorDeCuota = ? WHERE id= ?"

      const[result]=await pool.query(sql,[nombre,valordecuota,id])
      callback(result)
    } catch (error) {
      console.log(error);
      callback(null)
      
    }
  }

  async deleteTipoDeSocio(id,callback){
    try {
      let sql="DELETE FROM tiposdesocios WHERE id=?"

      const [result]=await pool.query(sql,[id])
      callback(result)
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }

  async listarCantidadDeSociosPorTipo(callback){
    try {
      let sql=`SELECT tiposdesocios.nombre, COUNT(socios.id) AS cantidad_socios
              FROM socios JOIN tiposdesocios ON socios.id_tipo_socio = tiposdesocios.id
              GROUP BY tiposdesocios.nombre;`
      const [result]=await pool.query(sql,[])
      
      callback(result)
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }

  async getPagosById(id, callback){

    try {
      let sql=`SELECT id, id_socio, valor, DATE_FORMAT(fecha, '%d-%m-%Y') AS fecha FROM socios_abonos WHERE id_socio= ?`

      const [result]= await pool.query(sql, [id])

      callback(result)
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }

  async getTotalPagosById(id,callback){
    try {
      let sql=`SELECT COUNT(*) AS total FROM socios_abonos WHERE id_socio = ?`

      const [result]= await pool.query(sql, [id])

      callback(result[0].total)
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }

  async getTotalCuotasById(id_socio, callback) {
    try {
      // Consulta SQL para contar el total de cuotas pagadas por el socio
      const sql = `
        SELECT COUNT(DISTINCT DATE_FORMAT(fecha, '%Y-%m')) AS totalCuotas
        FROM socios_abonos
        WHERE id_socio = ?
      `;
      
      // Ejecutar la consulta
      const [result] = await pool.query(sql, [id_socio]);
  
      // Devolver el resultado a través del callback
      callback(result[0].totalCuotas);
    } catch (error) {
      console.error("Error al obtener el total de cuotas:", error);
      callback(null);
    }
  }
  

  async getSocioById(id,callback){
    try {
      let sql= `SELECT * FROM socios WHERE id= ?`

      const [result]=await pool.query(sql, [id])

      callback(result)
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }
}

// Exportamos la clase SocioModel
module.exports = SocioModel;
