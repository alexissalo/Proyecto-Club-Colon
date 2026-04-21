const fs = require("fs");
const path = require("path");
//Importamos el modelo de productos<<
const ProductoModel = require("../models/productos");
//Creamos una instancia del modelo de productos
const productoModel = new ProductoModel();

const modelDisciplina = require("../models/disciplina");
const disciplinaModel = new modelDisciplina();

// URL base del servidor de imágenes
const MEDIA_URL = "https://media.clubcolonchivilcoy.com";

//Definimos la clase ProductoController
class ProductoController {
  //Metodo para mostrar todos los productos
  mostrarProductos(req, res) {
    const buscar = req.query.buscar || "";
    const pagina = parseInt(req.query.pagina) || 1;
    const filasPorPagina = parseInt(req.query.filasPorPagina) || 5;

    const filtros = {
      categoria: req.query.categoria || "",
      precioMin: req.query.precioMin || "",
      precioMax: req.query.precioMax || "",
      stock: req.query.stock || "",
    };

    productoModel.listarCategorias((categoriaData) => {
      if (!categoriaData) {
        return res.status(500).send("Error al obtener las categorias.");
      }
      disciplinaModel.listarDisciplinas((disciplinaData) => {
        //Consultamos todos los productos
        productoModel.listarProductos(
          pagina,
          filasPorPagina,
          buscar,
          filtros,
          (productoData) => {
            if (!productoData) {
              return res.status(500).send("Error al obtener los productos.");
            }
            productoModel.listarTalles((talleData) => {
              if (!talleData) {
                return res.status(500).send("Error al obtener los talles.");
              }
              //Obtenemos el rol del usuario
              const rolId = req.rolId;
              const rolNombre = req.rolNombre;

              //Renderizamos la vista de productos con los datos obtenidos
              res.render("dashboard/productos", {
                productos: productoData.productos,
                rolId: rolId,
                rolNombre: rolNombre,
                pagina: pagina,
                filasPorPagina: filasPorPagina,
                buscar: buscar,
                ...filtros,
                totalProductos: productoData.totalProductos,
                disciplinas: disciplinaData,
                categorias: categoriaData,
                talles: talleData,
              });
            });
          },
        );
      });
    });
  }

  // metodo para mostrar categorias
  mostrarCategorias(req, res) {
    disciplinaModel.listarDisciplinas((disciplinaData) => {
      //Consultamos todos las categorias
      productoModel.listarTalles((talleData) => {
        if (!talleData) {
          return res.status(500).send("Error al obtener los talles.");
        }
        productoModel.listarCategorias((categoriaData) => {
          if (!categoriaData) {
            return res.status(500).send("Error al obtener las categorias.");
          }

          //Obtenemos el rol del usuario
          const rolId = req.rolId;
          const rolNombre = req.rolNombre;

          //Renderizamos la vista de productos con los datos obtenidos
          res.render("dashboard/categoriaProductos", {
            categorias: categoriaData,
            talles: talleData,
            rolId: rolId,
            rolNombre: rolNombre,
            disciplinas: disciplinaData,
          });
        });
      });
    });
  }

  //Método para obtener los detalles de un producto específico por su ID
  obtenerProducto(req, res) {
    const { id } = req.params; //Extrae el ID del producto desde los parámetros de la solicitud

    if (!id || isNaN(id)) {
      return res.status(400).send("ID de producto inválido.");
    }

    // Consultamos el producto por su ID
    productoModel.obtenerProductoPorId(id, (productoData) => {
      if (!productoData) {
        return res.status(404).send("Producto no encontrado.");
      }

      //Obtenemos el rol del usuario
      const rolId = req.rolId;
      const rolNombre = req.rolNombre;

      // Renderizamos la vista con los detalles del producto
      res.render("dashboard/detalleProducto", {
        producto: productoData,
        rolId: rolId,
        rolNombre: rolNombre,
      });
    });
  }

  //Método para agregar un nuevo producto
  // agregarProducto(req, res) {
  //   const { nombre, descripcion, precio, id_categoria } = req.body;

  //   //Verificamos que los campos obligatoios esten completos
  //   if (!nombre || !descripcion || !precio || !id_categoria) {
  //     return res.status(400).json({
  //       message: "Faltan datos obligatorios.",
  //       ok: false,
  //     });
  //   }

  //   const precioNum = parseFloat(precio);
  //   if (isNaN(precioNum) || precioNum <= 0) {
  //     return res
  //       .status(400)
  //       .json({ message: "El precio debe ser un número positivo.", ok: false });
  //   }

  //   //Llamamos al metodo para crear producto
  //   productoModel.crearProducto(
  //     nombre,
  //     descripcion,
  //     precio,
  //     id_categoria,
  //     (productoData) => {
  //       if (!productoData) {
  //         return res.status(500).json({
  //           message: "Error al crear el producto.",
  //           ok: false,
  //         });
  //       }
  //       res.status(201).json({
  //         message: "Producto creado con éxito.",
  //         ok: true,
  //       });
  //     }
  //   );
  // }

  async agregarProducto(req, res) {
    const { nombre, descripcion, precio, id_categoria } = req.body;
    // ✅ URL pública en media.club.com en vez de /public/uploads/
    const imagenes = req.files
      ? req.files.map((file) => `${MEDIA_URL}/productos/${file.filename}`)
      : [];

    // Validaciones básicas
    if (!nombre || !descripcion || !precio || !id_categoria) {
      return res.status(400).json({
        message: "Faltan datos obligatorios.",
        ok: false,
      });
    }

    const precioNum = parseFloat(precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      return res.status(400).json({
        message: "El precio debe ser un número positivo.",
        ok: false,
      });
    }

    const producto = await productoModel.crearProducto(
      nombre,
      descripcion,
      precio,
      id_categoria,
      imagenes,
    );

    if (!producto) {
      return res
        .status(500)
        .json({ message: "Error al crear producto", ok: false });
    }

    res.status(201).json({
      message: "Producto creado con éxito",
      ok: true,
      id_producto: producto.insertId,
    });
  }

  //Metodo para agregar imagenes a un producto
  agregarImagen(req, res) {
    const { id_producto, ruta_imagen } = req.body;

    if (!id_producto || !ruta_imagen) {
      return res.status(400).json({
        message: "Faltan datos de imagen.",
        ok: false,
      });
    }

    //Llamamos al metodo para agregar la imagen
    productoModel.agregarImagenProducto(
      id_producto,
      ruta_imagen,
      (imagenData) => {
        if (!imagenData) {
          return res.status(500).json({
            message: "Error al agregar la imagen.",
            ok: false,
          });
        }
        res.status(200).json({
          message: "Imagen agregada con exito.",
          ok: true,
        });
      },
    );
  }

  //Metodo para agregar el stock
  async agregarStock(req, res) {
    const { id_producto, stocks } = req.body;
    // stocks = [{ id_talle: null, cantidad: 10 }, { id_talle: 1, cantidad: 5 }, ...]

    if (!id_producto || !Array.isArray(stocks) || stocks.length === 0) {
      return res.status(400).json({
        message: "Faltan datos para agregar el stock.",
        ok: false,
      });
    }
    for (let s of stocks) {
      if (s.cantidad !== undefined && s.cantidad !== null) {
        const cantidad = s.cantidad;
        const id_talle = s.id_talle;
        productoModel.agregarStockProducto(
          id_producto,
          id_talle,
          cantidad,
          (stockData) => {
            if (!stockData) {
              return res.status(500).json({
                message: "Error al agregar el stock.",
                ok: false,
              });
            }
          },
        );
      }
    }

    res.status(200).json({
      message: "Stock agregado con éxito.",
      ok: true,
    });
  }

  //Metodo para editar un producto
  editarProducto(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, precio, id_categoria } = req.body;

    // Verificamos que los campos obligatorios estén completos
    if (!id || !nombre || !descripcion || !precio || !id_categoria) {
      return res.status(400).json({
        message: "Faltan datos obligatorios.",
        ok: false,
      });
    }

    const precioNum = parseFloat(precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      return res
        .status(400)
        .json({ message: "El precio debe ser un numero positivo.", ok: false });
    }

    //Llamamos al método para editar el producto
    productoModel.editarProducto(
      id,
      nombre,
      descripcion,
      precio,
      id_categoria,
      (productoData) => {
        if (!productoData) {
          return res.status(500).json({
            message: "Error al editar el producto.",
            ok: false,
          });
        }
        res.status(200).json({
          message: "Producto editado con exito.",
          ok: true,
        });
      },
    );
  }

  borrarProducto(req, res) {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json({ message: "ID de producto inválido.", ok: false });
    }

    // Traer primero las imágenes asociadas
    productoModel.obtenerImagenesPorProducto(id, async (imagenes) => {
      try {
        // Eliminar producto con sus relaciones
        await productoModel.eliminarProductoConAsociados(id);

        // Eliminar imágenes físicas del sistema
        if (imagenes && imagenes.length > 0) {
          imagenes.forEach((img) => {
            // Extraemos solo el nombre del archivo de la URL
            // ej: "https://media.club.com/productos/abc123.jpg" → "abc123.jpg"
            const filename = img.ruta_imagen.split("/").pop();
            const filePath = path.join("/root/imagenes/productos", filename);

            if (fs.existsSync(filePath)) {
              fs.unlink(filePath, (err) => {
                if (err) console.error("Error al eliminar la imagen:", err);
              });
            }
          });
        }

        return res
          .status(200)
          .json({ message: "Producto eliminado con éxito.", ok: true });
      } catch (error) {
        console.error("Error al borrar producto:", error);
        return res
          .status(500)
          .json({ message: "Error al eliminar el producto.", ok: false });
      }
    });
  }

  crearCategoria(req, res) {
    const { nombre, descripcion } = req.body;
    productoModel.crearCategoria(nombre, descripcion, (categoriaData) => {
      if (!categoriaData) {
        return res
          .status(500)
          .json({ message: "Error al crear la categoria.", ok: false });
      }
      res
        .status(200)
        .json({ message: "Categoria creada con éxito.", ok: true });
    });
  }

  crearTalle(req, res) {
    const { nombre, descripcion } = req.body;
    productoModel.crearTalle(nombre, descripcion, (talleData) => {
      if (!talleData) {
        return res
          .status(500)
          .json({ message: "Error al crear el talle.", ok: false });
      }
      res.status(200).json({ message: "Talle creado con éxito.", ok: true });
    });
  }

  editarCategoria(req, res) {
    const { nombre, descripcion } = req.body;
    const { id_categoria } = req.params;
    productoModel.editarCategoria(
      id_categoria,
      nombre,
      descripcion,
      (categoriaData) => {
        if (!categoriaData) {
          return res
            .status(500)
            .json({ message: "Error al editar la categoria.", ok: false });
        }
        res
          .status(200)
          .json({ message: "Categoria editada con éxito.", ok: true });
      },
    );
  }

  editarTalle(req, res) {
    const { nombre, descripcion } = req.body;
    const { id_talle } = req.params;
    productoModel.editarTalle(id_talle, nombre, descripcion, (talleData) => {
      if (!talleData) {
        return res
          .status(500)
          .json({ message: "Error al editar el talle.", ok: false });
      }
      res.status(200).json({ message: "Talle editado con éxito.", ok: true });
    });
  }

  borrarCategoria(req, res) {
    const { id_categoria } = req.params;
    productoModel.borrarCategoria(id_categoria, (categoriaData) => {
      if (!categoriaData) {
        return res
          .status(500)
          .json({ message: "Error al borrar la categoria.", ok: false });
      }
      res
        .status(200)
        .json({ message: "Categoria borrada con éxito.", ok: true });
    });
  }

  borrarTalle(req, res) {
    const { id_talle } = req.params;
    productoModel.borrarTalle(id_talle, (talleData) => {
      if (!talleData) {
        return res
          .status(500)
          .json({ message: "Error al borrar el talle.", ok: false });
      }
      res.status(200).json({ message: "Talle borrado con éxito.", ok: true });
    });
  }
}

//Exportamos la clase ProductoController
module.exports = ProductoController;
