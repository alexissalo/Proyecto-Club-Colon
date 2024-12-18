// Importamos la conexión a la base de datos
const pool = require("../database/db");

// Definimos la clase DisciplinaModel
class DeportistaModel {
  // Método para listar los deportistas

  async listarDeportistas(
    pagina,
    filasPorPagina,
    buscar,
    disciplina,
    callback
  ) {
    try {
      // Calculamos el offset para la paginación
      const offset = (pagina - 1) * filasPorPagina;

      // Creamos la consulta SQL para seleccionar todos los deportistas de la disciplina especificada por nombre
      let sql = `
        SELECT dp.id, dp.nombre, DATE_FORMAT(dp.fechaNacimiento, '%d-%m-%Y') AS fechaNacimiento, dp.domicilio, dp.localidad, 
               dp.escolaridad, dp.gradoEscolar, dp.posicionJuego, dp.categoria, dp.altura, dp.peso,
               td.talleCalzado, td.talleCamiseta, td.tallePantalon,
               cm.email, cm.instagram, cm.facebook, cm.telefonoJugador, cm.telefonoEmergencia,
               df.nombre, df.domicilio AS domicilioTutor, df.telefono AS telefonoTutor, df.telefonoFijo AS telefonoFijoTutor,
               df.facebookTutor, df.instagramTutor, df.emailResponsable,
               dm.grupoSanguineo, dm.factor, dm.coberturaMedica, dm.numeroAfiliado,
               dm.lesiones, dm.patologias, dm.tratamientos, dm.alergias,
               d.nombre AS disciplina
        FROM datosPersonalesDeportista dp
        LEFT JOIN tallesDeportista td ON dp.id = td.deportistaId
        LEFT JOIN comunicacionDeportista cm ON dp.id = cm.deportistaId
        LEFT JOIN datosFamiliaresDeportista df ON dp.id= df.deportistaId
        LEFT JOIN datosMedicosDeportista dm ON dp.id = dm.deportistaId
        JOIN disciplinas d ON dp.id_disciplina = d.id
        WHERE d.nombre = ?
        `;

      // Agregamos la cláusula WHERE adicional si existe una búsqueda
      if (buscar) {
        sql += ` AND dp.nombre LIKE ?`;
      }

      // Luego agrupamos
      sql += `
        GROUP BY dp.id, dp.nombre, dp.fechaNacimiento, dp.domicilio, dp.localidad, 
                 dp.escolaridad, dp.gradoEscolar, dp.posicionJuego, dp.categoria, dp.altura, dp.peso,
                 td.talleCalzado, td.talleCamiseta, td.tallePantalon,
                 cm.email, cm.instagram, cm.facebook, cm.telefonoJugador, cm.telefonoEmergencia,
                 df.nombre, df.domicilio, df.telefono, df.telefonoFijo,
                 df.facebookTutor, df.instagramTutor, df.emailResponsable,
                 dm.grupoSanguineo, dm.factor, dm.coberturaMedica, dm.numeroAfiliado, dm.lesiones, dm.patologias, dm.tratamientos, dm.alergias,
                 d.nombre
        `;

      // Agregamos la cláusula LIMIT y OFFSET para la paginación
      sql += ` LIMIT ? OFFSET ?`;

      // Preparamos los parámetros para la consulta
      let params = [disciplina];

      if (buscar) {
        params.push(`%${buscar}%`, filasPorPagina, offset);
      } else {
        params.push(filasPorPagina, offset);
      }

      // Ejecutamos la consulta utilizando el pool de conexiones
      const [result] = await pool.query(sql, params);

      // Pasamos el resultado a la función callback
      callback(result);
    } catch (error) {
      // Mostramos el error en la consola si ocurre algún problema
      console.error(error);
      callback(null)
    }
  }

  async getTotalDeportistasPorDisciplina(buscar, disciplina, callback) {
    try {
      // Consulta para contar el total de deportistas
      let sql = `
        SELECT COUNT(*) AS total 
        FROM datosPersonalesDeportista dp
        INNER JOIN disciplinas d ON dp.id_disciplina = d.id
        WHERE d.nombre = ?
      `;
  
      // Parámetros para la consulta
      let params = [disciplina];
  
      // Si hay un término de búsqueda, agregamos la condición
      if (buscar) {
        sql += ` AND dp.nombre LIKE ?`;
        params.push(`%${buscar}%`);
      }
  
      // Ejecutamos la consulta
      const [result] = await pool.query(sql, params);
  
      // Retornamos el total de deportistas en el callback
      callback(result[0].total);
    } catch (error) {
      callback(null)
      console.error(error);
    }
  }

  async getTotalDeportistas(buscar, callback) {
    try {
      // Consulta para contar el total de deportistas
      let sql = `
        SELECT COUNT(*) AS total 
        FROM datosPersonalesDeportista`;
  
      // Parámetros para la consulta
      let params = [];
  
      // Si hay un término de búsqueda, agregamos la condición
      if (buscar) {
        sql += ` AND dp.nombre LIKE ?`;
        params.push(`%${buscar}%`);
      }
  
      // Ejecutamos la consulta
      const [result] = await pool.query(sql, params);
  
      // Retornamos el total de deportistas en el callback
      callback(result[0].total);
    } catch (error) {
      callback(null)
      console.error(error);
    }
  }
  

  async deleteDeportista(id, callback) {
    try {
      // Eliminar datos personales del deportista
      let sql = "DELETE FROM datosPersonalesDeportista WHERE id = ?";
      await pool.query(sql, id);

      // Eliminar talles del deportista
      sql = "DELETE FROM tallesDeportista WHERE deportistaId = ?";
      await pool.query(sql, id);

      // Eliminar comunicación del deportista
      sql = "DELETE FROM comunicacionDeportista WHERE deportistaId = ?";
      await pool.query(sql, id);

      // Eliminar datos médicos del deportista
      sql = "DELETE FROM datosMedicosDeportista WHERE deportistaId = ?";
      await pool.query(sql, id);

      // Eliminar datos familiares del deportista
      sql = "DELETE FROM datosFamiliaresDeportista WHERE deportistaId = ?";
      await pool.query(sql, id);

      callback(`Deportista con ID ${id} eliminado correctamente`);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async insertDeportista(datos, disciplina, callback) {
    try {
      let sql; // Declarar sql con let para permitir reasignación

      let sqlGetDisciplina = `SELECT id FROM disciplinas WHERE nombre = ?`;
      const [rows] = await pool.query(sqlGetDisciplina, [disciplina]);

      const id_disciplina = rows[0].id;

      // Insertar datos personales del deportista
      sql =
        "INSERT INTO datosPersonalesDeportista (nombre, fechaNacimiento, domicilio, localidad, escolaridad, gradoEscolar, posicionJuego, altura, peso, id_disciplina, categoria) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const [resultado] = await pool.query(sql, [
        datos.nombre,
        datos.fechaNacimiento,
        datos.domicilio,
        datos.localidad,
        datos.escolaridad,
        datos.gradoEscolar,
        datos.posicionJuego,
        datos.altura || null,
        datos.peso || null,
        id_disciplina,
        datos.categoria,
      ]);

      const idDeportista = resultado.insertId;

      // Insertar talles del deportista
      sql =
        "INSERT INTO tallesDeportista (deportistaId, talleCalzado, talleCamiseta, tallePantalon) VALUES (?, ?, ?, ?)";
      await pool.query(sql, [
        idDeportista,
        datos.talleCalzado,
        datos.talleCamiseta,
        datos.tallePantalon,
      ]);

      // Insertar comunicación del deportista
      sql =
        "INSERT INTO comunicacionDeportista (deportistaId, email, instagram, facebook, telefonoJugador, telefonoEmergencia) VALUES (?, ?, ?, ?, ?, ?)";
      await pool.query(sql, [
        idDeportista,
        datos.email,
        datos.instagram,
        datos.facebook,
        datos.telefonoJugador,
        datos.telefonoEmergencia,
      ]);

      // Insertar datos médicos del deportista
      sql =
        "INSERT INTO datosMedicosDeportista (deportistaId, grupoSanguineo, factor, coberturaMedica, numeroAfiliado, alergias, patologias, tratamientos, lesiones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      await pool.query(sql, [
        idDeportista,
        datos.grupoSanguineo,
        datos.factor,
        datos.coberturaMedica,
        datos.numeroAfiliado,
        datos.alergias,
        datos.patologias,
        datos.tratamientos,
        datos.lesiones,
      ]);

      // Insertar datos familiares del deportista
      sql =
        "INSERT INTO datosFamiliaresDeportista (deportistaId, nombre, domicilio, localidad, telefono, telefonoFijo, facebookTutor, instagramTutor, emailResponsable) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      await pool.query(sql, [
        idDeportista,
        datos.tutorNombre,
        datos.domicilioTutor,
        datos.localidadTutor,
        datos.telefonoTutor,
        datos.telefonoFijoTutor,
        datos.facebookTutor,
        datos.instagramTutor,
        datos.emailResponsable,
      ]);

      callback(`Deportista creado correctamente con ID ${idDeportista}`);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async updateDeportista(idDeportista, datos, callback) {
    try {
      let sql;
  
      // Actualizar datos personales del deportista
      sql = `
        UPDATE datosPersonalesDeportista 
        SET nombre = ?, fechaNacimiento = ?, domicilio = ?, localidad = ?, escolaridad = ?, 
            gradoEscolar = ?, posicionJuego = ?, altura = ?, peso = ?, categoria = ?
        WHERE id = ?
      `;
      await pool.query(sql, [
        datos.nombre,
        datos.fechaNacimiento,
        datos.domicilio,
        datos.localidad,
        datos.escolaridad,
        datos.gradoEscolar,
        datos.posicionJuego,
        datos.altura || null,
        datos.peso || null,
        datos.categoria,
        idDeportista,
      ]);
  
      // Actualizar talles del deportista
      sql = `
        UPDATE tallesDeportista 
        SET talleCalzado = ?, talleCamiseta = ?, tallePantalon = ? 
        WHERE deportistaId = ?
      `;
      await pool.query(sql, [
        datos.talleCalzado,
        datos.talleCamiseta,
        datos.tallePantalon,
        idDeportista,
      ]);
  
      // Actualizar comunicación del deportista
      sql = `
        UPDATE comunicacionDeportista 
        SET email = ?, instagram = ?, facebook = ?, telefonoJugador = ?, telefonoEmergencia = ?
        WHERE deportistaId = ?
      `;
      await pool.query(sql, [
        datos.email,
        datos.instagram,
        datos.facebook,
        datos.telefonoJugador,
        datos.telefonoEmergencia,
        idDeportista,
      ]);
  
      // Actualizar datos médicos del deportista
      sql = `
        UPDATE datosMedicosDeportista 
        SET grupoSanguineo = ?, factor = ?, coberturaMedica = ?, numeroAfiliado = ?, 
            alergias = ?, patologias = ?, tratamientos = ?, lesiones = ? 
        WHERE deportistaId = ?
      `;
      await pool.query(sql, [
        datos.grupoSanguineo,
        datos.factor,
        datos.coberturaMedica,
        datos.numeroAfiliado,
        datos.alergias,
        datos.patologias,
        datos.tratamientos,
        datos.lesiones,
        idDeportista,
      ]);
  
      // Actualizar datos familiares del deportista
      sql = `
        UPDATE datosFamiliaresDeportista 
        SET nombre = ?, domicilio = ?, localidad = ?, telefono = ?, telefonoFijo = ?, 
            facebookTutor = ?, instagramTutor = ?, emailResponsable = ? 
        WHERE deportistaId = ?
      `;
      await pool.query(sql, [
        datos.tutorNombre,
        datos.domicilioTutor,
        datos.localidadTutor,
        datos.telefonoTutor,
        datos.telefonoFijoTutor,
        datos.facebookTutor,
        datos.instagramTutor,
        datos.emailResponsable,
        idDeportista,
      ]);
  
      // Si todas las actualizaciones fueron exitosas
      callback(`Deportista con ID ${idDeportista} actualizado correctamente.`);
    } catch (error) {
      console.error(error);
      callback(null);
    }
  }
  

  async getCantidadDeportistaPorDisciplina(callback) {
    try {
      let sql = `SELECT disciplinas.nombre, COUNT(datosPersonalesDeportista.id) AS cantidad_deportistas
              FROM datosPersonalesDeportista JOIN disciplinas ON datosPersonalesDeportista.id_disciplina = disciplinas.id
              GROUP BY disciplinas.nombre;
          `;

      const [result] = await pool.query(sql, []);

      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async insertPago(id_deportista, monto, fechaPago, callback) {
    try {
      let sql = `INSERT INTO deportistas_abonos(id_deportista,valor,fecha) VALUES(?,?,?)`;

      const [result] = await pool.query(sql, [id_deportista, monto, fechaPago]);

      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async getDeportistaById(deportistaId, callback) {
    try {
      const sql = `
        SELECT 
          dpd.id, dpd.nombre,DATE_FORMAT(dpd.fechaNacimiento, '%Y-%m-%d') AS fechaNacimiento, dpd.domicilio, dpd.localidad, dpd.escolaridad, dpd.gradoEscolar, 
          dpd.posicionJuego, dpd.altura, dpd.peso, d.nombre AS disciplina,
          td.talleCalzado, td.talleCamiseta, td.tallePantalon,
          cd.email, cd.instagram, cd.facebook, cd.telefonoJugador, cd.telefonoEmergencia,
          dm.grupoSanguineo, dm.factor, dm.coberturaMedica, dm.numeroAfiliado, dm.lesiones, dm.patologias, dm.tratamientos, dm.alergias,
          df.nombre, df.domicilio AS domicilioTutor, df.localidad AS localidadTutor, df.telefono AS telefonoTutor, 
          df.telefonoFijo AS telefonoFijoTutor, df.facebookTutor, df.instagramTutor, df.emailResponsable
        FROM datosPersonalesDeportista dpd
        JOIN disciplinas d ON dpd.id_disciplina = d.id
        LEFT JOIN tallesDeportista td ON dpd.id = td.deportistaId
        LEFT JOIN comunicacionDeportista cd ON dpd.id = cd.deportistaId
        LEFT JOIN datosMedicosDeportista dm ON dpd.id = dm.deportistaId
        LEFT JOIN datosFamiliaresDeportista df ON dpd.id = df.deportistaId
        WHERE dpd.id = ?
      `;

      const [rows] = await pool.query(sql, [deportistaId]);

      if (rows.length === 0) {
        callback(null, "No se encontró un deportista con ese ID.");
      } else {
        callback(rows[0]);
      }
    } catch (error) {
      console.error(error);
      callback(null);
    }
  }


  async getPagosPorDeportista(id,callback){
    try {
      let sql=`SELECT da.id, DATE_FORMAT(da.fecha, '%d-%m-%Y') AS fecha,
              da.valor
            FROM 
              deportistas_abonos da
            WHERE 
              da.id_deportista = ?`

      const [result]=await pool.query(sql,[id])

      callback(result)
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }

  async listarDeportistasParaDeuda(disciplina,callback) {
    try {
      const sql = `
        SELECT 
          dp.id AS id,
          dp.nombre AS nombre,
          dp.domicilio AS direccion,
          dp.localidad,
          cd.email AS email,
          cd.telefonoJugador AS telefonoJugador,
          cd.telefonoEmergencia AS telefonoEmergencia,
          d.nombre AS disciplina
        FROM datospersonalesdeportista dp
        LEFT JOIN comunicaciondeportista cd ON dp.id = cd.deportistaId
        JOIN disciplinas d ON dp.id_disciplina = d.id
        WHERE d.nombre = ?
      `;
      const [result] = await pool.query(sql,[disciplina]);
      
      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }
  

  async getPagosDelMes(fecha, callback) {
    try {
      const sql = `
        SELECT id_deportista, valor, DATE_FORMAT(fecha, '%Y-%m') AS mesPago 
        FROM deportistas_abonos 
        WHERE DATE_FORMAT(fecha, '%Y-%m') = ?
      `;
      const [result] = await pool.query(sql, [fecha]);
      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async getPrimerPagoDeportistas(callback) {
    try {
      const sql = `
        SELECT id_deportista, MIN(fecha) AS fecha
        FROM deportistas_abonos
        GROUP BY id_deportista
      `;
      const [result] = await pool.query(sql);
      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }
  
}

// Exportamos la clase DisciplinaModel
module.exports = DeportistaModel;
