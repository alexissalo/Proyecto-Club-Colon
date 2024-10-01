// Importamos la conexión a la base de datos
const pool = require("../database/db");

// Definimos la clase DisciplinaModel
class DeportistaModel {
  // Método para listar los deportistas
  async listarDeportistas(pagina, filasPorPagina, buscar, callback) {
    try {
      // Calculamos el offset para la paginación
      const offset = (pagina - 1) * filasPorPagina;

      // Creamos la consulta SQL para seleccionar todas las disciplinas
      let sql = `
        SELECT dp.id, dp.nombre, DATE_FORMAT(dp.fechaNacimiento, '%d-%m-%Y') AS fechaNacimiento, dp.domicilio, dp.localidad, 
               dp.escolaridad, dp.gradoEscolar, dp.posicionJuego, dp.altura, dp.peso,
               td.talleCalzado, td.talleCamiseta, td.tallePantalon,
               cm.email, cm.instagram, cm.facebook, cm.telefonoJugador, cm.telefonoEmergencia,
               dm.grupoSanguineo, dm.factor, dm.coberturaMedica, dm.numeroAfiliado,
               GROUP_CONCAT(DISTINCT ld.lesion ORDER BY ld.lesion SEPARATOR ', ') AS lesiones,
               GROUP_CONCAT(DISTINCT al.alergia ORDER BY al.alergia SEPARATOR ', ') AS alergias,
               GROUP_CONCAT(DISTINCT pa.patologia ORDER BY pa.patologia SEPARATOR ', ') AS patologias,
               GROUP_CONCAT(DISTINCT tr.tratamientoDescripcion ORDER BY tr.tratamientoDescripcion SEPARATOR ', ') AS tratamientos
        FROM datosPersonalesDeportista dp
        LEFT JOIN tallesDeportista td ON dp.id = td.deportistaId
        LEFT JOIN comunicacionDeportista cm ON dp.id = cm.deportistaId
        LEFT JOIN datosMedicosDeportista dm ON dp.id = dm.deportistaId
        LEFT JOIN lesionesDeportista ld ON dp.id = ld.deportistaId
        LEFT JOIN alergiasDeportista al ON dp.id = al.deportistaId
        LEFT JOIN patologiasDeportista pa ON dp.id = pa.deportistaId
        LEFT JOIN tratamientosDeportista tr ON dp.id = tr.deportistaId
        `;

      // Agregamos la cláusula WHERE solo si existe una búsqueda
      if (buscar) {
        sql += ` WHERE dp.nombre LIKE ?`;
      }

      // Luego agrupamos
      sql += `
        GROUP BY dp.id, dp.nombre, dp.fechaNacimiento, dp.domicilio, dp.localidad, 
                 dp.escolaridad, dp.gradoEscolar, dp.posicionJuego, dp.altura, dp.peso,
                 td.talleCalzado, td.talleCamiseta, td.tallePantalon,
                 cm.email, cm.instagram, cm.facebook, cm.telefonoJugador, cm.telefonoEmergencia,
                 dm.grupoSanguineo, dm.factor, dm.coberturaMedica, dm.numeroAfiliado
        `;

      // Agregamos la cláusula LIMIT y OFFSET para la paginación
      sql += ` LIMIT ? OFFSET ?`;

      // Preparamos los parámetros para la consulta
      let params = [];

      if (buscar) {
        params = [`%${buscar}%`, filasPorPagina, offset];
      } else {
        params = [filasPorPagina, offset];
      }

      // Ejecutamos la consulta utilizando el pool de conexiones
      const [result] = await pool.query(sql, params);

      console.log(result);

      // Pasamos el resultado a la función callback
      callback(result);
    } catch (error) {
      // Mostramos el error en la consola si ocurre algún problema
      console.error(error);
    }
  }

  async getTotalDeportistas(buscar, callback) {
    try {
      let sql = `SELECT COUNT(*) AS total FROM datosPersonalesDeportista`;

      if (buscar) {
        sql += ` WHERE nombre LIKE ?`;
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

  async deleteDeportista(id, callback) {
    try {
      // Eliminar datos personales del deportista
      let sql = "DELETE FROM datosPersonalesDeportista WHERE id = ?";
      await db.query(sql, id);

      // Eliminar talles del deportista
      sql = "DELETE FROM tallesDeportista WHERE deportistaId = ?";
      await db.query(sql, id);

      // Eliminar comunicación del deportista
      sql = "DELETE FROM comunicacionDeportista WHERE deportistaId = ?";
      await db.query(sql, id);

      // Eliminar datos médicos del deportista
      sql = "DELETE FROM datosMedicosDeportista WHERE deportistaId = ?";
      await db.query(sql, id);

      // Eliminar datos familiares del deportista
      sql = "DELETE FROM datosFamiliaresDeportista WHERE deportistaId = ?";
      await db.query(sql, id);

      // Eliminar lesiones del deportista
      sql = "DELETE FROM lesionesDeportista WHERE deportistaId = ?";
      await db.query(sql, id);

      // Eliminar alergias del deportista
      sql = "DELETE FROM alergiasDeportista WHERE deportistaId = ?";
      await db.query(sql, id);

      // Eliminar patologías del deportista
      sql = "DELETE FROM patologiasDeportista WHERE deportistaId = ?";
      await db.query(sql, id);

      // Eliminar tratamientos del deportista
      sql = "DELETE FROM tratamientosDeportista WHERE deportistaId = ?";
      await db.query(sql, id);

      // Eliminar familiares del deportista
      sql = "DELETE FROM familiaJugador WHERE jugadorID = ?";
      await db.query(sql, id);

      callback(`Deportista con ID ${id} eliminado correctamente`);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async insertDeportista(datos, callback) {
    try {
      // Insertar datos personales del deportista
      const sql = "INSERT INTO datosPersonalesDeportista (nombre, fechaNacimiento, domicilio, localidad, escolaridad, gradoEscolar, posicionJuego, altura, peso) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const resultado = await db.query(sql, [
        datos.nombre,
        datos.fechaNacimiento,
        datos.domicilio,
        datos.localidad,
        datos.escolaridad,
        datos.gradoEscolar,
        datos.posicionJuego,
        datos.altura,
        datos.peso
      ]);

      const idDeportista = resultado.insertId;

      // Insertar talles del deportista
      sql = "INSERT INTO tallesDeportista (deportistaId, talleCalzado, talleCamiseta, tallePantalon) VALUES (?, ?, ?, ?)";
      await db.query(sql, [
        idDeportista,
        datos.talleCalzado,
        datos.talleCamiseta,
        datos.tallePantalon
      ]);

      // Insertar comunicación del deportista
      sql = "INSERT INTO comunicacionDeportista (deportistaId, email, instagram, facebook, telefonoJugador, telefonoEmergencia) VALUES (?, ?, ?, ?, ?, ?)";
      await db.query(sql, [
        idDeportista,
        datos.email,
        datos.instagram,
        datos.facebook,
        datos.telefonoJugador,
        datos.telefonoEmergencia
      ]);

      // Insertar datos médicos del deportista
      sql = "INSERT INTO datosMedicosDeportista (deportistaId, grupoSanguineo, factor, coberturaMedica, numeroAfiliado) VALUES (?, ?, ?, ?, ?)";
      await db.query(sql, [
        idDeportista,
        datos.grupoSanguineo,
        datos.factor,
        datos.coberturaMedica,
        datos.numeroAfiliado
      ]);

      // Insertar datos familiares del deportista
      sql = "INSERT INTO datosFamiliaresDeportista (nombre, tutorApellido, domicilio, localidad, telefono, telefonoFijo, facebookTutor, instagramTutor, emailResponsable) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      await db.query(sql, [
        idDeportista,
        datos.tutorNombre,
        datos.domicilio,
        datos.localidad,
        datos.telefono,
        datos.telefonoFijo,
        datos.facebookTutor,
        datos.instagramTutor,
        datos.emailResponsable
      ]);

      callback(null, `Deportista creado correctamente con ID ${idDeportista}`);
    } catch (error) {
      callback(error, null);
    }
  }

  async updateDeportista(id, datos, callback) {
    try {
      // Actualizar datos personales del deportista
      const sql = "UPDATE datosPersonalesDeportista SET primerNombre = ?, apellido = ?, fechaNacimiento = ?, domicilio = ?, localidad = ?, escolaridad = ?, gradoEscolar = ?, posicionJuego = ?, altura = ?, peso = ? WHERE id = ?";
      await db.query(sql, [
        datos.primerNombre,
        datos.apellido,
        datos.fechaNacimiento,
        datos.domicilio,
        datos.localidad,
        datos.escolaridad,
        datos.gradoEscolar,
        datos.posicionJuego,
        datos.altura,
        datos.peso,
        id
      ]);

      // Actualizar talles del deportista
      sql = "UPDATE tallesDeportista SET talleCalzado = ?, talleCamiseta = ?, tallePantalon = ? WHERE deportistaId = ?";
      await db.query(sql, [
        datos.talleCalzado,
        datos.talleCamiseta,
        datos.tallePantalon,
        id
      ]);

      // Actualizar comunicación del deportista
      sql = "UPDATE comunicacionDeportista SET email = ?, instagram = ?, facebook = ?, telefonoJugador = ?, telefonoEmergencia = ? WHERE deportistaId = ?";
      await db.query(sql, [
        datos.email,
        datos.instagram,
        datos.facebook,
        datos.telefonoJugador,
        datos.telefonoEmergencia,
        id
      ]);

      // Actualizar datos médicos del deportista
      sql = "UPDATE datosMedicosDeportista SET grupoSanguineo = ?, factor = ?, coberturaMedica = ?, numeroAfiliado = ? WHERE deportistaId = ?";
      await db.query(sql, [
        datos.grupoSanguineo,
        datos.factor,
        datos.coberturaMedica,
        datos.numeroAfiliado,
        id
      ]);

      // Actualizar datos familiares del deportista
      sql = "UPDATE datosFamiliaresDeportista SET tutorNombre = ?, tutorApellido = ?, domicilio = ?, localidad = ?, telefono = ?, telefonoFijo = ?, facebookTutor = ?, instagramTutor = ?, emailResponsable = ? WHERE deportistaId = ?";
      await db.query(sql, [
        datos.tutorNombre,
        datos.tutorApellido,
        datos.domicilio,
        datos.localidad,
        datos.telefono,
        datos.telefonoFijo,
        datos.facebookTutor,
        datos.instagramTutor,
        datos.emailResponsable,
        id
      ]);

      callback(null, `Deportista actualizado correctamente con ID ${id}`);
    } catch (error) {
      callback(error, null);
    }
  }

  async getCantidadDeportistaPorDisciplina(callback){
    try {
      let sql=`SELECT disciplinas.nombre, COUNT(datosPersonalesDeportista.id) AS cantidad_deportistas
              FROM datosPersonalesDeportista JOIN disciplinas ON datosPersonalesDeportista.id_disciplina = disciplinas.id
              GROUP BY disciplinas.nombre;
          `
      
      const [result]=await pool.query(sql,[])

      callback(result)
    } catch (error) {
      console.log(error);
      callback(null)
      
    }
  }
}

// Exportamos la clase DisciplinaModel
module.exports = DeportistaModel;
