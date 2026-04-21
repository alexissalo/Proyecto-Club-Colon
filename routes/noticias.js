const express = require("express");
const router = express.Router();
const multer = require("multer");

const middlewaresAuth = require("../middlewares/auth");
const authMiddlewares = new middlewaresAuth();

const NoticiasCategoriasController = require("../controllers/noticias");
const noticiasCategoriasController = new NoticiasCategoriasController();

// Reemplazamos el multer local por uploadsMedia
const { uploadsMedia } = require("../middlewares/upload");

// Wrapper igual al de productos para manejo de errores y subcarpeta fija
function uploadNoticia(req, res, next) {
  uploadsMedia("noticias").single("imagen_principal")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.message === "File too large") {
        return res.status(400).json({ message: "Archivo muy pesado" });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}

router.get(
  "/dashboard/noticias",
  [authMiddlewares.verificarSesion, authMiddlewares.verificarRol("admin_noticias")],
  noticiasCategoriasController.listarNoticias
);

router.get(
  "/dashboard/editar-noticia/:id",
  [authMiddlewares.verificarSesion, authMiddlewares.verificarRol("admin_noticias")],
  noticiasCategoriasController.mostrarEdicionNoticia
);

router.post(
  "/agregar-noticia",
  uploadNoticia,
  noticiasCategoriasController.agregarNoticia
);

router.put(
  "/actualizar-noticia/:id",
  [authMiddlewares.verificarSesion, authMiddlewares.verificarRol("admin_noticias")],
  uploadNoticia,
  noticiasCategoriasController.actualizarNoticia
);

router.delete(
  "/eliminar-noticia/:id",
  [authMiddlewares.verificarSesion, authMiddlewares.verificarRol("admin_noticias")],
  noticiasCategoriasController.eliminarNoticia
);

module.exports = router;