// Importamos la conexión a la base de datos
const pool = require("../database/db");

class ProductoModel {
  //Metodo para crear un nuevo producto
  async crearProducto(nombre, descripcion, precio, id_categoria, imagenes) {
    try {
      //Consulta SQL para insertar un nuevo producto
      let sql = `
            INSERT INTO productos (nombre, descripcion, precio, id_categoria)
            VALUES (?, ?, ?, ?)
            `;
      //Ejecutamos la consulta con los valores pasados por parámetro
      const [result] = await pool.query(sql, [
        nombre,
        descripcion,
        precio,
        id_categoria,
      ]);

      const id_producto = result.insertId;

      if (imagenes.length > 0) {
        let sqlImagen = `
          INSERT INTO imagenes_productos (id_producto, ruta_imagen)
          VALUES ?
        `;

        // Construimos el array de valores [[id, ruta], [id, ruta], ...]
        const values = imagenes.map((ruta) => [id_producto, ruta]);

        await pool.query(sqlImagen, [values]);
      }
      //Llamamos al callback con el resultado de la consulta
      return result;
    } catch (error) {
      //Si ocurre un error, lo mostramos en la consola y llamamos al callback con null
      console.error(error);
      return null;
    }
  }

  agregarImagen(id_producto, ruta_imagen) {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO imagenes_productos (id_producto, ruta_imagen) VALUES (?, ?)";
      pool.query(sql, [id_producto, ruta_imagen], (err, result) => {
        if (err) {
          console.error("Error al guardar imagen:", err);
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  //Metodo para agregar imagenes a un producto
  async agregarImagenProducto(id_producto, ruta_imagen) {
    try {
      //Consulta SQL para insertar la imagen en la db
      let sql = `
            INSERT INTO imagenes_productos (id_producto, ruta_imagen)
            VALUES (?, ?)
            `;
      const [result] = await pool.query(sql, [id_producto, ruta_imagen]);

      //Pasamos el resultado a la funcion callback
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  //Método para agregar stock por talle
  // models/productos.js — método agregarStockProducto
  async agregarStockProducto(id_producto, id_talle, cantidad, callback) {
    try {
      const sql = `
            INSERT INTO stock_productos (id_producto, id_talle, cantidad)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE cantidad = ?
        `; // ✅ = ? en vez de = cantidad + ? → reemplaza en vez de sumar
      const [result] = await pool.query(sql, [
        id_producto,
        id_talle,
        cantidad,
        cantidad, // valor de reemplazo
      ]);
      callback(result);
    } catch (error) {
      console.error(error);
      callback(null);
    }
  }

  //Metodo para listar todos los productos
  async listarProductos(pagina, filasPorPagina, buscar, filtros, callback) {
    try {
      let sql = `
      SELECT 
        p.id_producto, 
        p.nombre, 
        p.descripcion, 
        p.precio, 
        c.nombre AS categoria,
        i.ruta_imagen,
        s.cantidad,
        t.nombre AS talle
      FROM productos p
      INNER JOIN categorias_productos c ON p.id_categoria = c.id_categoria
      LEFT JOIN imagenes_productos i ON p.id_producto = i.id_producto
      LEFT JOIN stock_productos s ON p.id_producto = s.id_producto
      LEFT JOIN talles_productos t ON s.id_talle = t.id_talle
      WHERE 1=1
    `;

      let params = [];

      // 🔎 Búsqueda
      if (buscar && buscar.trim() !== "") {
        sql += ` AND p.nombre LIKE ?`;
        params.push(`%${buscar}%`);
      }

      // 🎯 Filtro por categoría
      if (filtros?.categoria && filtros.categoria.trim() !== "") {
        sql += ` AND c.nombre = ?`;
        params.push(filtros.categoria);
      }

      // 💲 Filtro por precio
      if (filtros?.precioMin) {
        sql += ` AND p.precio >= ?`;
        params.push(filtros.precioMin);
      }
      if (filtros?.precioMax) {
        sql += ` AND p.precio <= ?`;
        params.push(filtros.precioMax);
      }

      // 📦 Filtro por stock
      if (filtros?.stock === "disponible") {
        sql += ` AND s.cantidad > 0`;
      } else if (filtros?.stock === "agotado") {
        sql += ` AND (s.cantidad = 0 OR s.cantidad IS NULL)`;
      }

      sql += ` ORDER BY p.id_producto`;

      const [rows] = await pool.query(sql, params);

      // Reestructuramos los datos en objetos anidados
      const productos = [];

      rows.forEach((row) => {
        let producto = productos.find((p) => p.id_producto === row.id_producto);

        if (!producto) {
          producto = {
            id_producto: row.id_producto,
            nombre: row.nombre,
            descripcion: row.descripcion,
            precio: row.precio,
            categoria: row.categoria,
            imagenes: [],
            stock: {
              general: 0,
              talles: [],
            },
          };
          productos.push(producto);
        }

        // Agregamos imágenes
        if (row.ruta_imagen && !producto.imagenes.includes(row.ruta_imagen)) {
          producto.imagenes.push(row.ruta_imagen);
        }

        // Agregamos stock
        if (row.talle) {
          if (!producto.stock.talles.find((t) => t.nombre === row.talle)) {
            producto.stock.talles.push({
              nombre: row.talle,
              cantidad: row.cantidad,
            });
          }
        } else if (row.cantidad !== null) {
          producto.stock.general = row.cantidad;
        }
      });

      // 🔹 Ahora aplicamos la paginación sobre el array final
      const totalProductos = productos.length; // total real (ya agrupado)
      const inicio = (pagina - 1) * filasPorPagina;
      const fin = inicio + filasPorPagina;

      const productosPaginados = productos.slice(inicio, fin);

      callback({ productos: productosPaginados, totalProductos });
    } catch (error) {
      console.error(error);
      callback(null);
    }
  }

  //Método para obtener un producto por su ID
  async obtenerProductoPorId(id_producto, callback) {
    try {
      let sql = `
            SELECT p.id_producto, p.nombre, p.descripcion, p.precio c.nomvre AS categoria
            FROM productos p
            INNER JOIN categorias_productos c ON p.id_categoria = c.id_categoria
            WHERE p.id_categoria = ?
            `;
      const [result] = await pool.query(sql, [id_producto]);

      //Como se espera un solo producto, devolvemos el primer elemento del array
      callback(result[0]);
    } catch (error) {
      console.error(error);
      callback(null);
    }
  }

  //Metodo para listar productos de una categoria especifica
  async listarProductosPorCategoria(categoriaNombre, callback) {
    try {
      let sql = `
            SELECT p.id_producto, p.nombre, p.descripcion, p.precio, c.nombre AS categoria
            FROM productos p
            INNER JOIN categorias_productos c ON p.id_categoria = c.id_categoria
            WHERE c.nombre = ?
            `;
      const [result] = await pool.query(sql, [categoriaNombre]);

      callback(result);
    } catch (error) {
      console.error(error);
      callback(null);
    }
  }

  //Metodo para editar un producto
  async editarProducto(
    id_producto,
    nombre,
    descripcion,
    precio,
    id_categoria,
    callback,
  ) {
    try {
      let sql = `
            UPDATE productos
            SET nombre = ?, descripcion = ?, precio = ?, id_categoria = ?
            WHERE id_producto = ?
            `;
      const [result] = await pool.query(sql, [
        nombre,
        descripcion,
        precio,
        id_categoria,
        id_producto,
      ]);

      callback(result);
    } catch (error) {
      console.error(error);
      callback(null);
    }
  }

  //Metodo para eliminar un producto
  async eliminarProductoConAsociados(id_producto) {
    try {
      // Eliminar primero stock
      await pool.query(`DELETE FROM stock_productos WHERE id_producto = ?`, [
        id_producto,
      ]);

      // Eliminar imágenes asociadas
      await pool.query(`DELETE FROM imagenes_productos WHERE id_producto = ?`, [
        id_producto,
      ]);

      // Finalmente eliminar el producto
      await pool.query(`DELETE FROM productos WHERE id_producto = ?`, [
        id_producto,
      ]);

      return true;
    } catch (error) {
      console.error("Error en eliminarProductoConAsociados:", error);
      throw error;
    }
  }

  async obtenerImagenesPorProducto(id_producto, callback) {
    try {
      const [rows] = await pool.query(
        `SELECT ruta_imagen FROM imagenes_productos WHERE id_producto = ?`,
        [id_producto],
      );
      callback(rows);
    } catch (error) {
      console.error("Error al obtener imágenes:", error);
      callback([]);
    }
  }

  //Método para listar los talles disponibles
  async listarTalles(callback) {
    try {
      let sql = `
            SELECT * FROM talles_productos;
            `;
      const [result] = await pool.query(sql, []);

      callback(result);
    } catch (error) {
      console.error(error);
      callback(null);
    }
  }

  //Metodo para listar todas las categorias
  async listarCategorias(callback) {
    try {
      let sql = `
            SELECT * FROM categorias_productos
            `;
      const [result] = await pool.query(sql, []);

      callback(result);
    } catch (error) {
      console.error(error);
      callback(null);
    }
  }

  async crearCategoria(nombre, descripcion, callback) {
    try {
      let sql = `
            INSERT INTO categorias_productos (nombre, descripcion)
            VALUES (?, ?)
            `;
      const [result] = await pool.query(sql, [nombre, descripcion]);

      callback(result);
    } catch (error) {
      console.error(error);
      callback(null);
    }
  }

  async crearTalle(nombre, descripcion, callback) {
    try {
      let sql = `
            INSERT INTO talles_productos (nombre, descripcion)
            VALUES (?, ?)
            `;
      const [result] = await pool.query(sql, [nombre, descripcion]);

      callback(result);
    } catch (error) {
      console.error(error);
      callback(null);
    }
  }

  async editarCategoria(id_categoria, nombre, descripcion, callback) {
    try {
      let sql = `
            UPDATE categorias_productos
            SET nombre = ?, descripcion = ?
            WHERE id_categoria = ?
            `;
      const [result] = await pool.query(sql, [
        nombre,
        descripcion,
        id_categoria,
      ]);

      callback(result);
    } catch (error) {
      console.error(error);
      callback(null);
    }
  }

  async editarTalle(id_talle, nombre, descripcion, callback) {
    try {
      let sql = `
            UPDATE talles_productos
            SET nombre = ?, descripcion = ?
            WHERE id_talle = ?
            `;
      const [result] = await pool.query(sql, [nombre, descripcion, id_talle]);

      callback(result);
    } catch (error) {
      console.error(error);
      callback(null);
    }
  }

  async borrarCategoria(id_categoria, callback) {
    try {
      let sql = `
            DELETE FROM categorias_productos
            WHERE id_categoria = ?
            `;
      const [result] = await pool.query(sql, [id_categoria]);

      callback(result);
    } catch (error) {
      console.error(error);
      callback(null);
    }
  }

  async borrarTalle(id_talle, callback) {
    try {
      let sql = `
            DELETE FROM talles_productos
            WHERE id_talle = ?
            `;
      const [result] = await pool.query(sql, [id_talle]);

      callback(result);
    } catch (error) {
      console.error(error);
      callback(null);
    }
  }
}

//Exportamos la clase ProductoModel para que pueda ser utilizada en otras partes del código
module.exports = ProductoModel;
