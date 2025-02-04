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
  
      // Creamos la consulta SQL
      let sql = `
        SELECT dp.id, dp.nombre, dp.id_tipo_cuota, dp.dni, DATE_FORMAT(dp.fechaNacimiento, '%d-%m-%Y') AS fechaNacimiento, dp.domicilio, dp.localidad, 
               dp.escolaridad, dp.gradoEscolar, dp.posicionJuego, dp.categoria, dp.altura, dp.peso,
               td.talleCalzado, td.talleCamiseta, td.tallePantalon,
               cm.email, cm.instagram, cm.facebook, cm.telefonoJugador, cm.telefonoEmergencia,
               df.nombre AS tutorNombre, df.domicilio AS domicilioTutor, df.telefono AS telefonoTutor, df.telefonoFijo AS telefonoFijoTutor,
               df.facebookTutor, df.instagramTutor, df.emailResponsable,
               dm.grupoSanguineo, dm.factor, dm.coberturaMedica, dm.numeroAfiliado,
               dm.lesiones, dm.patologias, dm.tratamientos, dm.alergias,
               cd.nombre AS tipodecuotanombre,
               d.nombre AS disciplina,
               -- Verificamos si el deportista es socio
               CASE 
                 WHEN s.dni IS NOT NULL THEN true
                 ELSE false
               END AS esSocio
        FROM datospersonalesdeportista dp
        LEFT JOIN tallesdeportista td ON dp.id = td.deportistaId
        LEFT JOIN comunicaciondeportista cm ON dp.id = cm.deportistaId
        LEFT JOIN datosfamiliaresdeportista df ON dp.id = df.deportistaId
        LEFT JOIN datosmedicosdeportista dm ON dp.id = dm.deportistaId
        LEFT JOIN cuotas_deportistas cd ON dp.id_tipo_cuota = cd.id
        JOIN disciplinas d ON dp.id_disciplina = d.id
        -- Relación con la tabla socios para verificar el DNI
        LEFT JOIN socios s ON dp.dni = s.dni
        WHERE d.nombre = ?
      `;
  
      // Agregamos la cláusula WHERE adicional si existe una búsqueda
      if (buscar) {
        sql += ` AND (dp.nombre LIKE ? OR dp.dni LIKE ?)`;
      }
  
      // Luego agrupamos
      sql += `
        GROUP BY dp.id, dp.nombre, dp.id_tipo_cuota, dp.dni, dp.fechaNacimiento, dp.domicilio, dp.localidad, 
                 dp.escolaridad, dp.gradoEscolar, dp.posicionJuego, dp.categoria, dp.altura, dp.peso,
                 td.talleCalzado, td.talleCamiseta, td.tallePantalon,
                 cm.email, cm.instagram, cm.facebook, cm.telefonoJugador, cm.telefonoEmergencia,
                 df.nombre, df.domicilio, df.telefono, df.telefonoFijo,
                 df.facebookTutor, df.instagramTutor, df.emailResponsable,
                 dm.grupoSanguineo, dm.factor, dm.coberturaMedica, dm.numeroAfiliado, dm.lesiones, dm.patologias, dm.tratamientos, dm.alergias,
                 d.nombre, cd.nombre, s.dni
      `;
  
      // Agregamos la cláusula LIMIT y OFFSET para la paginación
      sql += ` LIMIT ? OFFSET ?`;
  
      // Preparamos los parámetros para la consulta
      let params = [disciplina];
  
      if (buscar) {
        params.push(`%${buscar}%`, `%${buscar}%`, filasPorPagina, offset);
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
      callback(null);
    }
  }
  
  

  async getTotalDeportistasPorDisciplina(buscar, disciplina, callback) {
    try {
      // Consulta para contar el total de deportistas
      let sql = `
        SELECT COUNT(*) AS total 
        FROM datospersonalesdeportista dp
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
        FROM datospersonalesdeportista`;
  
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
      let sql = "DELETE FROM datospersonalesdeportista WHERE id = ?";
      await pool.query(sql, id);

      // Eliminar talles del deportista
      sql = "DELETE FROM tallesdeportista WHERE deportistaId = ?";
      await pool.query(sql, id);

      // Eliminar comunicación del deportista
      sql = "DELETE FROM comunicaciondeportista WHERE deportistaId = ?";
      await pool.query(sql, id);

      // Eliminar datos médicos del deportista
      sql = "DELETE FROM datosmedicosdeportista WHERE deportistaId = ?";
      await pool.query(sql, id);

      // Eliminar datos familiares del deportista
      sql = "DELETE FROM datosfamiliaresdeportista WHERE deportistaId = ?";
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
        "INSERT INTO datospersonalesdeportista (nombre, dni, fechaNacimiento, domicilio, localidad, escolaridad, gradoEscolar, posicionJuego, altura, peso, id_disciplina, categoria, id_tipo_cuota) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const [resultado] = await pool.query(sql, [
        datos.nombre,
        datos.dni,
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
        datos.tipodecuota
      ]);

      const idDeportista = resultado.insertId;

      // Insertar talles del deportista
      sql =
        "INSERT INTO tallesdeportista (deportistaId, talleCalzado, talleCamiseta, tallePantalon) VALUES (?, ?, ?, ?)";
      await pool.query(sql, [
        idDeportista,
        datos.talleCalzado,
        datos.talleCamiseta,
        datos.tallePantalon,
      ]);

      // Insertar comunicación del deportista
      sql =
        "INSERT INTO comunicaciondeportista (deportistaId, email, instagram, facebook, telefonoJugador, telefonoEmergencia) VALUES (?, ?, ?, ?, ?, ?)";
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
        "INSERT INTO datosmedicosdeportista (deportistaId, grupoSanguineo, factor, coberturaMedica, numeroAfiliado, alergias, patologias, tratamientos, lesiones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
        "INSERT INTO datosfamiliaresdeportista (deportistaId, nombre, domicilio, localidad, telefono, telefonoFijo, facebookTutor, instagramTutor, emailResponsable) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
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

      await this.generarFactura(idDeportista, datos.tipodecuota, callback);

      callback(`Deportista creado correctamente con ID ${idDeportista}`);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async generarFactura(deportistaId, tipoCuotaId, callback) {
    try {
      // Obtener el valor de la cuota del tipo de socio
      const [result] = await pool.query(
        `SELECT valorDeCuota FROM cuotas_deportistas WHERE id = ?`,
        [tipoCuotaId]
      );

      const valorDeCuota = result[0].valorDeCuota;

      if (valorDeCuota > 0) {
        await pool.query(
          `
          INSERT INTO facturas_deportistas (id_deportista, fecha_emision, monto, estado) 
          VALUES (?, now(), ?, 'pendiente')
      `,
          [deportistaId, valorDeCuota]
        );
  
        console.log("Factura generada para el socio:", deportistaId);
      }else{
        console.log(`Factura no generada para el socio con ID ${deportistaId}: valor de cuota no válido (${valorDeCuota}).`)
      }
    } catch (error) {
      console.log("Error al generar factura:", error);
      callback(null, error);
    }
  }

  async updateDeportista(idDeportista, datos, callback) {
    try {
      let sql;
  
      // Actualizar datos personales del deportista
      sql = `
        UPDATE datospersonalesdeportista 
        SET nombre = ?, dni= ?, fechaNacimiento = ?, domicilio = ?, localidad = ?, escolaridad = ?, 
            gradoEscolar = ?, posicionJuego = ?, altura = ?, peso = ?, categoria = ?, id_tipo_cuota= ?
        WHERE id = ?
      `;
      await pool.query(sql, [
        datos.nombre,
        datos.dni,
        datos.fechaNacimiento,
        datos.domicilio,
        datos.localidad,
        datos.escolaridad,
        datos.gradoEscolar,
        datos.posicionJuego,
        datos.altura || null,
        datos.peso || null,
        datos.categoria,
        datos.tipodecuota,
        idDeportista,
      ]);
  
      // Actualizar talles del deportista
      sql = `
        UPDATE tallesdeportista 
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
        UPDATE comunicaciondeportista 
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
        UPDATE datosmedicosdeportista 
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
        UPDATE datosfamiliaresdeportista 
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
      let sql = `SELECT disciplinas.nombre, COUNT(datospersonalesdeportista.id) AS cantidad_deportistas
              FROM datospersonalesdeportista JOIN disciplinas ON datospersonalesdeportista.id_disciplina = disciplinas.id
              GROUP BY disciplinas.nombre;
          `;

      const [result] = await pool.query(sql, []);

      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async insertPago(
    id_deportista,
    monto,
    metodoPago,
    facturasSeleccionadas,
    callback
  ) {
    try {
      // Insertar el pago
      const sqlPago = `
        INSERT INTO deportistas_abonos (fecha_pago, monto_pagado, metodo_pago, id_facturas)
        VALUES (now(), ?, ?, ?)
      `;
      const [pagoResult] = await pool.query(sqlPago, [
        monto,
        metodoPago,
        JSON.stringify(facturasSeleccionadas),
      ]);

      // Actualizar las facturas como pagadas
      const sqlFacturas = `
        UPDATE facturas_deportistas 
        SET estado = "pagado" 
        WHERE id IN (?);
    `;

      await pool.query(sqlFacturas, [facturasSeleccionadas]);

      callback(pagoResult);
    } catch (error) {
      console.error(error);
      callback(null);
    }
  }

  async getFacturasById(id_deportista, callback) {
    try {
      let query = `
      SELECT f.id, DATE_FORMAT(f.fecha_emision, '%d-%m-%Y') AS fecha_emision, f.monto, f.estado 
      FROM facturas_deportistas AS f 
      WHERE f.id_deportista = ?`;
      const [result] = await pool.query(query, [id_deportista]);

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
          dpd.id, dpd.nombre, dpd.dni ,DATE_FORMAT(dpd.fechaNacimiento, '%Y-%m-%d') AS fechaNacimiento, dpd.domicilio, dpd.localidad, dpd.escolaridad, dpd.gradoEscolar, 
          dpd.posicionJuego, dpd.altura, dpd.peso, d.nombre AS disciplina,
          td.talleCalzado, td.talleCamiseta, td.tallePantalon,
          cd.email, cd.instagram, cd.facebook, cd.telefonoJugador, cd.telefonoEmergencia,
          dm.grupoSanguineo, dm.factor, dm.coberturaMedica, dm.numeroAfiliado, dm.lesiones, dm.patologias, dm.tratamientos, dm.alergias,
          df.nombre AS nombreTutor, df.domicilio AS domicilioTutor, df.localidad AS localidadTutor, df.telefono AS telefonoTutor, 
          df.telefonoFijo AS telefonoFijoTutor, df.facebookTutor, df.instagramTutor, df.emailResponsable
        FROM datospersonalesdeportista dpd
        JOIN disciplinas d ON dpd.id_disciplina = d.id
        LEFT JOIN tallesdeportista td ON dpd.id = td.deportistaId
        LEFT JOIN comunicaciondeportista cd ON dpd.id = cd.deportistaId
        LEFT JOIN datosmedicosdeportista dm ON dpd.id = dm.deportistaId
        LEFT JOIN datosfamiliaresdeportista df ON dpd.id = df.deportistaId
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
  

  async getFacturasPendientesDelMes(mesActual, callback) {
    try {
      const sql = `
        SELECT 
          fd.id, 
          fd.id_deportista, 
          fd.fecha_emision, 
          fd.monto, 
          fd.estado 
        FROM 
          facturas_deportistas fd
        WHERE 
          DATE_FORMAT(fd.fecha_emision, '%Y-%m') = ?
          AND fd.estado = 'pendiente'
      `;
      const [result] = await pool.query(sql, [mesActual]);
      callback(result);
    } catch (error) {
      console.error('Error al obtener las facturas pendientes del mes:', error);
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

  async insertCuotaDeportista(nombre, valorDeCuota, disciplina, callback){
    try {
      let sqlGetDisciplina = `SELECT id FROM disciplinas WHERE nombre = ?`;
      const [rows] = await pool.query(sqlGetDisciplina, [disciplina]);

      const id_disciplina = rows[0].id;

      let sql= `INSERT INTO cuotas_deportistas(nombre, valorDeCuota, id_disciplina) VALUES (?, ?, ?)`

      const [result]= await pool.query(sql,[nombre, valorDeCuota, id_disciplina])

      callback(result)
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }

  async updateCuotaDeportista(id, nombre, valorDeCuota, callback){
    try {
      let sql=`UPDATE cuotas_deportistas SET nombre = ?, valorDeCuota= ? WHERE id= ?`

      const [result]= await pool.query(sql, [nombre, valorDeCuota, id])

      callback(result)
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }

  async deleteCuotaDeportista(id, callback){
    try {
      let sql= `DELETE FROM cuotas_deportistas WHERE id= ?`

      const [result]= await pool.query(sql, id)

      callback(result)
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }

  async selectCuotasDeportista(disciplina, callback){
    try {
      let sqlGetDisciplina = `SELECT id FROM disciplinas WHERE nombre = ?`;
      const [rows] = await pool.query(sqlGetDisciplina, [disciplina]);

      const id_disciplina = rows[0].id;

      let sql= `SELECT * FROM cuotas_deportistas WHERE id_disciplina= ?`

      const [result]= await pool.query(sql, [id_disciplina])
    
      callback(result)
    } catch (error) {
      console.log(error);
      callback(null)
    }
  }
  
}

// Exportamos la clase DisciplinaModel
module.exports = DeportistaModel;
