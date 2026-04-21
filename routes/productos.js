const express = require("express");
const router = express.Router();
const multer = require("multer");

const middlewaresAuth = require("../middlewares/auth");
const authMiddlewares = new middlewaresAuth();

const ProductoController = require("../controllers/productos");
const productoController = new ProductoController();

// Cambiamos uploads por uploadsMedia
const { uploadsMedia } = require("../middlewares/upload");

router.get(
  "/dashboard/productos",
  [authMiddlewares.verificarSesion, authMiddlewares.verificarRol(["admin_tienda"])],
  productoController.mostrarProductos
);

router.get(
  "/dashboard/categoriaProducto",
  [authMiddlewares.verificarSesion, authMiddlewares.verificarRol(["admin_tienda"])],
  productoController.mostrarCategorias
);

router.get(
  "/producto/:id",
  [authMiddlewares.verificarSesion, authMiddlewares.verificarRol(["admin_tienda"])],
  productoController.obtenerProducto
);

router.post(
  "/crearProducto",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_tienda"]),
    function (req, res, next) {

      uploadsMedia("productos").array("imagenes", 10)(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          if (err.message == "File too large") {
            return res.status(400).json({ message: "Archivo muy pesado" });
          }
          return res.status(400).json({ message: err.message });
        } else if (err) {
          return res.status(400).json({ message: err.message });
        }
        next();
      });
    },
  ],
  productoController.agregarProducto
);

router.post(
  "/agregarStock",
  [authMiddlewares.verificarSesion, authMiddlewares.verificarRol(["admin_tienda"])],
  productoController.agregarStock
);

router.put(
  "/editarProducto/:id",
  [authMiddlewares.verificarSesion, authMiddlewares.verificarRol(["admin_tienda"])],
  productoController.editarProducto
);

router.delete(
  "/eliminarProducto/:id",
  [authMiddlewares.verificarSesion, authMiddlewares.verificarRol(["admin_tienda"])],
  productoController.borrarProducto
);

router.post(
  "/crearCategoria",
  [authMiddlewares.verificarSesion, authMiddlewares.verificarRol(["admin_tienda"])],
  productoController.crearCategoria
);

router.post(
  "/crearTalle",
  [authMiddlewares.verificarSesion, authMiddlewares.verificarRol(["admin_tienda"])],
  productoController.crearTalle
);

router.put(
  "/editarCategoria/:id_categoria",
  [authMiddlewares.verificarSesion, authMiddlewares.verificarRol(["admin_tienda"])],
  productoController.editarCategoria
);

router.put(
  "/editarTalle/:id_talle",
  [authMiddlewares.verificarSesion, authMiddlewares.verificarRol(["admin_tienda"])],
  productoController.editarTalle
);

router.delete(
  "/eliminarCategoria/:id_categoria",
  [authMiddlewares.verificarSesion, authMiddlewares.verificarRol(["admin_tienda"])],
  productoController.borrarCategoria
);

router.delete(
  "/eliminarTalle/:id_talle",
  [authMiddlewares.verificarSesion, authMiddlewares.verificarRol(["admin_tienda"])],
  productoController.borrarTalle
);

module.exports = router;