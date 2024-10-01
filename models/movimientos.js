// Importamos la conexión a la base de datos
const pool = require("../database/db");

// Definimos la clase MovimientoModel
class MovimientoModel {
  // Método para listar movimientos con paginación
  async listarMovimiento(
    pagina,
    filasPorPagina,
    tipo,
    fecha,
    disciplina,
    callback
  ) {
    try {
      // Calculamos el offset para la paginación
      const offset = (pagina - 1) * filasPorPagina;

      // Creamos la consulta SQL para seleccionar los movimientos con joins a usuarios y disciplinas
      let sql = `
        SELECT da.id, da.valor, DATE_FORMAT(da.fecha, "%d-%m-%y") AS fecha, da.es_ingreso, da.descripcion,da.documentacion, 
          u.nombre AS responsable, d.nombre AS disciplina 
        FROM disciplinas_abonos da 
        JOIN usuarios u ON da.id_responsable = u.id
        JOIN disciplinas d ON da.id_disciplina = d.id 
      `;

      // Agregamos los filtros a la consulta
      let condiciones = [];
      let params = [];
      if (tipo) {
        condiciones.push(`da.es_ingreso = ?`);
        params.push(tipo === "ingreso" ? 1 : 0);
      }
      if (fecha) {
        condiciones.push(`da.fecha = ?`);
        params.push(fecha);
      }
      if (disciplina) {
        condiciones.push(`da.id_disciplina = ?`);
        params.push(disciplina);
      }

      if (condiciones.length > 0) {
        sql += ` WHERE ${condiciones.join(" AND ")}`;
      }

      sql += ` LIMIT ? OFFSET ?`;
      params.push(filasPorPagina);
      params.push(offset);

      // Ejecutamos la consulta utilizando el pool de conexiones
      const [result] = await pool.query(sql, params);

      // Pasamos el resultado a la función callback
      callback(result);
    } catch (error) {
      // Mostramos el error en la consola si ocurre algún problema
      console.log(error);
      throw error;
    }
  }

  // Método para obtener el total de movimientos
  async getTotalMovimientos(tipo, fecha, disciplina, callback) {
    try {
      // Creamos la consulta SQL para contar el total de movimientos
      let sql = "SELECT COUNT(*) AS total FROM disciplinas_abonos";

      // Agregamos los filtros a la consulta
      let condiciones = [];
      let params = [];
      if (tipo) {
        condiciones.push(`es_ingreso = ?`);
        params.push(tipo === "ingreso" ? 1 : 0);
      }
      if (fecha) {
        condiciones.push(`fecha = ?`);
        params.push(fecha);
      }
      if (disciplina) {
        condiciones.push(`id_disciplina = ?`);
        params.push(disciplina);
      }

      if (condiciones.length > 0) {
        sql += ` WHERE ${condiciones.join(" AND ")}`;
      }

      // Ejecutamos la consulta utilizando el pool de conexiones
      const [result] = await pool.query(sql, params);

      // Pasamos el resultado a la función callback
      callback(result[0].total);
    } catch (error) {
      // Mostramos el error en la consola si ocurre algún problema
      console.error(error);
      callback(null);
    }
  }

  // Método para listar movimientos por disciplina con paginación
  async listarMovimientosPorDisciplina(
    disciplina,
    pagina,
    filasPorPagina,
    callback
  ) {
    try {
      // Calculamos el offset para la paginación
      const offset = (pagina - 1) * filasPorPagina;

      // Creamos la consulta SQL para seleccionar los movimientos de una disciplina específica con joins a usuarios y disciplinas
      let sql = `
        SELECT da.id, da.valor, DATE_FORMAT(da.fecha, "%d-%m-%y") AS fecha, da.es_ingreso, da.descripcion,da.documentacion, 
          u.nombre AS responsable, d.nombre AS disciplina 
        FROM disciplinas_abonos da 
        JOIN usuarios u ON da.id_responsable = u.id
        JOIN disciplinas d ON da.id_disciplina = d.id
        WHERE d.nombre = ? LIMIT ? OFFSET ?
      `;

      // Ejecutamos la consulta utilizando el pool de conexiones
      const [result] = await pool.query(sql, [
        disciplina,
        filasPorPagina,
        offset,
      ]);

      // Pasamos el resultado a la función callback
      callback(result);
    } catch (error) {
      // Mostramos el error en la consola si ocurre algún problema
      console.log(error);
      throw error;
    }
  }

  // Método para obtener el total de movimientos por disciplina
  async getTotalMovimientosPorDisciplina(disciplinaNombre, callback) {
    try {
      // Creamos la consulta SQL para contar el total de movimientos de una disciplina específica
      const sql = `
        SELECT COUNT(*) AS total
        FROM disciplinas_abonos
        INNER JOIN disciplinas ON disciplinas_abonos.id_disciplina = disciplinas.id
        WHERE disciplinas.nombre = ?
      `;

      // Ejecutamos la consulta utilizando el pool de conexiones
      const [result] = await pool.query(sql, [disciplinaNombre]);

      // Pasamos el resultado a la función callback
      callback(result[0].total);
    } catch (error) {
      // Mostramos el error en la consola si ocurre algún problema
      console.error(error);
      callback(null);
    }
  }

  async getBalanceUltimos30Dias(disciplina) {
    try {
      let sql = `SELECT 
      DATE_FORMAT(da.fecha, "%d-%m-%y") AS fecha,
      da.valor,
      da.es_ingreso,
      da.descripcion
  `;
      let params = [];
      if (disciplina) {
        sql += `, d.nombre AS disciplina
    FROM disciplinas_abonos da
    JOIN disciplinas d ON da.id_disciplina = d.id
    WHERE da.fecha >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY) AND
    d.nombre = ?
     `;
        params.push(disciplina);
      } else {
        sql += `FROM disciplinas_abonos da
        WHERE da.fecha >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)`;
      }

      const [result] = await pool.query(sql, params);

      const ingresos = result.filter((item) => item.es_ingreso === 1);
      const egresos = result.filter((item) => item.es_ingreso === 0);

      const totalIngresos = ingresos.reduce(
        (acc, item) => acc + parseFloat(item.valor),
        0
      );
      const totalEgresos = egresos.reduce(
        (acc, item) => acc + parseFloat(item.valor),
        0
      );
      const total = totalIngresos - totalEgresos;

      const response = {
        total,
        ingresos,
        egresos,
        totalIngresos,
        totalEgresos,
      };

      console.log(response);

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getBalanceUltimos90Dias(disciplina) {
    try {
      let sql = `SELECT 
      DATE_FORMAT(da.fecha, "%d-%m-%y") AS fecha,
      da.valor,
      da.es_ingreso,
      da.descripcion
  `;
      let params = [];
      if (disciplina) {
        sql += `, d.nombre AS disciplina
    FROM disciplinas_abonos da
    JOIN disciplinas d ON da.id_disciplina = d.id
    WHERE da.fecha >= DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY) AND
    d.nombre = ?
     `;
        params.push(disciplina);
      } else {
        sql += `FROM disciplinas_abonos da
        WHERE da.fecha >= DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)`;
      }

      const [result] = await pool.query(sql, params);

      const ingresos = result.filter((item) => item.es_ingreso === 1);
      const egresos = result.filter((item) => item.es_ingreso === 0);

      const totalIngresos = ingresos.reduce(
        (acc, item) => acc + parseFloat(item.valor),
        0
      );
      const totalEgresos = egresos.reduce(
        (acc, item) => acc + parseFloat(item.valor),
        0
      );
      const total = totalIngresos - totalEgresos;

      const response = {
        total,
        ingresos,
        egresos,
        totalIngresos,
        totalEgresos,
      };

      console.log(response);

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getBalanceAnual(disciplina) {
    try {
      let sql = `
        SELECT 
          DATE_FORMAT(da.fecha, "%d-%m-%y") AS fecha,
          da.valor,
          da.es_ingreso,
          da.descripcion
        `;
      let params = [];
      if (disciplina) {
        sql += `, d.nombre AS disciplina
    FROM disciplinas_abonos da
    JOIN disciplinas d ON da.id_disciplina = d.id
    WHERE da.fecha >= DATE_FORMAT(CURRENT_DATE, '%Y-01-01') AND
    d.nombre = ?
     `;
        params.push(disciplina);
      } else {
        sql += `FROM disciplinas_abonos da
        WHERE da.fecha >= DATE_FORMAT(CURRENT_DATE, '%Y-01-01')`;
      }

      const [result] = await pool.query(sql, params);

      const ingresos = result.filter((item) => item.es_ingreso === 1);
      const egresos = result.filter((item) => item.es_ingreso === 0);

      const totalIngresos = ingresos.reduce(
        (acc, item) => acc + parseFloat(item.valor),
        0
      );
      const totalEgresos = egresos.reduce(
        (acc, item) => acc + parseFloat(item.valor),
        0
      );
      const total = totalIngresos - totalEgresos;

      const response = {
        total,
        ingresos,
        egresos,
        totalIngresos,
        totalEgresos,
      };

      console.log(response);

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getBalancePersonalizado(disciplina, fechaInicio, fechaFin) {
    try {
      let sql = `
        SELECT 
          DATE_FORMAT(da.fecha, "%d-%m-%y") AS fecha,
          da.valor,
          da.es_ingreso,
          da.descripcion
      `;
      let params = [];
  
      if (disciplina) {
        sql += `, d.nombre AS disciplina
        FROM disciplinas_abonos da
        JOIN disciplinas d ON da.id_disciplina = d.id
        WHERE da.fecha BETWEEN ? AND ? 
        AND d.nombre = ?`;
        params.push(fechaInicio, fechaFin, disciplina);
      } else {
        sql += `FROM disciplinas_abonos da
        WHERE da.fecha BETWEEN ? AND ?`;
        params.push(fechaInicio, fechaFin);
      }
  
      const [result] = await pool.query(sql, params);
  
      const ingresos = result.filter((item) => item.es_ingreso === 1);
      const egresos = result.filter((item) => item.es_ingreso === 0);
  
      const totalIngresos = ingresos.reduce(
        (acc, item) => acc + parseFloat(item.valor),
        0
      );
      const totalEgresos = egresos.reduce(
        (acc, item) => acc + parseFloat(item.valor),
        0
      );
      const total = totalIngresos - totalEgresos;
  
      const response = {
        total,
        ingresos,
        egresos,
        totalIngresos,
        totalEgresos,
      };
  
      console.log(response);
  
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
}

// Exportamos la clase MovimientoModel
module.exports = MovimientoModel;
