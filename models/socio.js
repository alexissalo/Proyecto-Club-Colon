// Importamos la conexión a la base de datos
const pool = require("../database/db");
const cron = require("node-cron");

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
                s.estado,
                s.email,
                s.nroSocio,
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

      // Ordenamos los resultados: activos primero, ordenados por nombre, y luego los inactivos
      sql += `
            ORDER BY 
                s.estado = 'inactivo', -- Inactivos al final
                s.nombre ASC -- Orden alfabético
        `;

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

      // Pasamos el resultado a la función callback
      callback(socios);
    } catch (error) {
      // Mostramos el error en la consola si ocurre algún problema
      console.error(error);
      callback(null);
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
      callback(null);
    }
  }

  async insertSocio(
    nombre,
    dni,
    telefono,
    fechaNacimiento,
    fechaInscripcion,
    domicilio,
    email,
    deporte,
    tipodesocio,
    nroSocio,
    callback
  ) {
    try {
      const sql = `
        INSERT INTO socios(nombre, dni, telefono, fechaNacimiento, domicilio, id_tipo_socio, id_disciplina, email, fechaInscripcion, nroSocio) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)
      `;

      const [result] = await pool.query(sql, [
        nombre,
        dni,
        telefono,
        fechaNacimiento,
        domicilio,
        tipodesocio,
        deporte,
        email,
        fechaInscripcion,
        nroSocio
      ]);

      await this.generarFactura(result.insertId, tipodesocio, callback);

      callback(null, result); // Retorna resultado si no hay error
    } catch (error) {
      callback(error, null); // Retorna error si ocurre
    }
  }

  async generarFactura(socioId, tipoSocioId, callback) {
    try {
      // Obtener el valor de la cuota del tipo de socio
      const [result] = await pool.query(
        `SELECT valorDeCuota FROM tiposdesocios WHERE id = ?`,
        [tipoSocioId]
      );

      const valorDeCuota = result[0].valorDeCuota;

      if (valorDeCuota > 0) {
        await pool.query(
          `
          INSERT INTO facturas_socios (id_socio, fecha_emision, monto, estado) 
          VALUES (?, now(), ?, 'pendiente')
      `,
          [socioId, valorDeCuota]
        );

        console.log("Factura generada para el socio:", socioId);
      } else {
        console.log(
          `Factura no generada para el socio con ID ${socioId}: valor de cuota no válido (${valorDeCuota}).`
        );
      }
    } catch (error) {
      console.log("Error al generar factura:", error);
      callback(null, error);
    }
  }

  async darDeBajaSocio(id, callback) {
    try {
      let sql = `UPDATE socios SET estado = 'inactivo' WHERE id = ?`;
      const [result] = await pool.query(sql, [id]);

      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async darDeAltaSocio(id, callback) {
    try {
      let sql = `UPDATE socios SET estado = 'activo' WHERE id = ?`;
      const [result] = await pool.query(sql, [id]);

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
    nroSocio,
    callback
  ) {
    try {
      let sql = `UPDATE socios SET nombre = ?, telefono = ?, domicilio = ?, id_tipo_socio= ?, id_disciplina= ?, email= ?, nroSocio=? WHERE id = ?`;

      const params = [
        nombre,
        telefono,
        domicilio,
        tipodesocio,
        deporte,
        email,
        nroSocio,
        id,
      ];

      const [result] = await pool.query(sql, params);

      callback(result);
    } catch (error) {
      console.error(error);
      callback(null);
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
      callback(null);
    }
  }

  async getTiposDeSocios(callback) {
    try {
      let sql = "SELECT * FROM tiposdesocios";

      const [result] = await pool.query(sql, []);

      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async insertPago(
    id_socio,
    monto,
    metodoPago,
    facturasSeleccionadas,
    callback
  ) {
    try {
      // Insertar el pago
      const sqlPago = `
        INSERT INTO socios_abonos (fecha_pago, monto_pagado, metodo_pago, id_facturas)
        VALUES (now(), ?, ?, ?)
      `;
      const [pagoResult] = await pool.query(sqlPago, [
        monto,
        metodoPago,
        JSON.stringify(facturasSeleccionadas),
      ]);

      // Actualizar las facturas como pagadas
      const sqlFacturas = `
        UPDATE facturas_socios 
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

  async insertTipoDeSocio(nombre, valordecuota, callback) {
    try {
      let sql = "INSERT INTO tiposdesocios(nombre,valorDeCuota) VALUES (?,?)";

      const [result] = await pool.query(sql, [nombre, valordecuota]);
      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async updateTipoDeSocio(id, nombre, valordecuota, callback) {
    try {
      let sql =
        "UPDATE tiposdesocios SET nombre = ? , valorDeCuota = ? WHERE id= ?";

      const [result] = await pool.query(sql, [nombre, valordecuota, id]);
      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async deleteTipoDeSocio(id, callback) {
    try {
      let sql = "DELETE FROM tiposdesocios WHERE id=?";

      const [result] = await pool.query(sql, [id]);
      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async listarCantidadDeSociosPorTipo(callback) {
    try {
      let sql = `SELECT tiposdesocios.nombre, COUNT(socios.id) AS cantidad_socios
              FROM socios JOIN tiposdesocios ON socios.id_tipo_socio = tiposdesocios.id
              GROUP BY tiposdesocios.nombre;`;
      const [result] = await pool.query(sql, []);

      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async getPagosById(id, callback) {
    try {
      let sql = `SELECT id, id_socio, valor, DATE_FORMAT(fecha, '%d-%m-%Y') AS fecha FROM socios_abonos WHERE id_socio= ?`;

      const [result] = await pool.query(sql, [id]);

      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async getTotalPagosById(id, callback) {
    try {
      let sql = `SELECT COUNT(*) AS total FROM socios_abonos WHERE id_socio = ?`;

      const [result] = await pool.query(sql, [id]);

      callback(result[0].total);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async getMontoTipoSocio(idSocio, callback) {
    try {
      let sql = `
        SELECT ts.valorDeCuota AS monto
        FROM socios s
        INNER JOIN tiposdesocios ts ON s.id_tipo_socio = ts.id
        WHERE s.id = ?
      `;
      const [result] = await pool.query(sql, [idSocio]);
      callback(result[0] ? result[0].monto : null);
    } catch (error) {
      console.error("Error al obtener el monto del tipo de socio:", error);
      callback(null);
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

  async getSocioByDNI(dni, callback) {
    try {
      let sql = `SELECT * FROM socios WHERE dni= ?`;

      const [result] = await pool.query(sql, [dni]);

      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async getSocioById(id, callback) {
    try {
      let sql = `SELECT * FROM socios WHERE id= ?`;

      const [result] = await pool.query(sql, [id]);

      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async listarSociosParaDeuda(callback) {
    try {
      const sql = `SELECT * FROM socios`;
      const [result] = await pool.query(sql);
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
          fs.id, 
          fs.id_socio, 
          fs.fecha_emision, 
          fs.monto, 
          fs.estado 
        FROM 
          facturas_socios fs
        WHERE 
          DATE_FORMAT(fs.fecha_emision, '%Y-%m') = ?
          AND fs.estado = 'pendiente'
      `;
      const [result] = await pool.query(sql, [mesActual]);
      callback(result);
    } catch (error) {
      console.error("Error al obtener las facturas pendientes del mes:", error);
      callback(null);
    }
  }

  async listarSociosParaExcel() {
    try {
      let sql = `SELECT 
          s.id,
          s.nombre, 
          s.dni, 
          DATE_FORMAT(s.fechaNacimiento, '%d-%m-%Y') AS fechaNacimiento,
          s.telefono, 
          s.domicilio,
          s.nroSocio,
          s.email, 
          DATE_FORMAT(s.fechaInscripcion, '%d-%m-%Y') AS fechaInscripcion,
          d.nombre AS deporte,
          ts.nombre AS tipodesocio
        FROM 
          socios s
        LEFT JOIN 
          disciplinas d ON s.id_disciplina = d.id
        LEFT JOIN 
          tiposdesocios ts ON s.id_tipo_socio = ts.id`;

      const [result] = await pool.query(sql, []);

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getTipoDeSocioById(id, callback) {
    try {
      let sql = `
      SELECT * 
      FROM tiposdesocios
      WHERE id = ?
    `;
      const [result] = await pool.query(sql, [id]);

      callback(result[0]);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }

  async getFacturasById(id_socio, callback) {
    try {
      let query = `
      SELECT f.id, DATE_FORMAT(f.fecha_emision, '%d-%m-%Y') AS fecha_emision, f.monto, f.estado 
      FROM facturas_socios AS f 
      WHERE f.id_socio = ?`;
      const [result] = await pool.query(query, [id_socio]);

      callback(result);
    } catch (error) {
      console.log(error);
      callback(null);
    }
  }
}

// Exportamos la clase SocioModel
module.exports = SocioModel;
