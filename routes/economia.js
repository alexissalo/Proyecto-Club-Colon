// Importamos el framework Express y creamos una instancia de Router
const express = require("express");
const router = express.Router();
const multer = require('multer');

// Importamos los middlewares de autenticación y autorización
const middlewaresAuth = require("../middlewares/auth");
const authMiddlewares = new middlewaresAuth();

// Importamos el controlador de economía
const controllerEconomia = require("../controllers/economia");
const economiaController = new controllerEconomia();
const { uploads } = require("../middlewares/upload");

// Definimos la ruta GET para obtener la economía por disciplina
router.get(
  "/dashboard/economia/:disciplina",
  [
    // Verificamos si el usuario tiene una sesión activa
    authMiddlewares.verificarSesion,

    // Verificamos si el usuario tiene uno de los roles permitidos
    authMiddlewares.verificarRol([
      "admin_futbol",
      "admin_tenis",
      "admin_voley",
      "admin_basquet",
      "admin_patin",
    ]),

    // Verificamos si el usuario tiene acceso a la disciplina especificada
    authMiddlewares.verificarAccesoDisciplina("disciplina"),
  ],
  // Llamamos al método del controlador para mostrar la economía por disciplina
  economiaController.mostrarEconomiaPorDisciplina
);

router.get(
  "/dashboard/editarEconomia/:disciplina/:id",
  [
    // Verificamos si el usuario tiene una sesión activa
    authMiddlewares.verificarSesion,

    // Verificamos si el usuario tiene uno de los roles permitidos
    authMiddlewares.verificarRol([
      "admin_futbol",
      "admin_tenis",
      "admin_voley",
      "admin_basquet",
      "admin_patin",
    ]),

    // Verificamos si el usuario tiene acceso a la disciplina especificada
    authMiddlewares.verificarAccesoDisciplina("disciplina"),
  ],
  // Llamamos al método del controlador para mostrar la economía por disciplina
  economiaController.mostrarEdicionEconomia
);

router.post("/nuevoMovimiento/:disciplina", [
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol([
    "admin_futbol",
    "admin_tenis",
    "admin_voley",
    "admin_basquet",
    "admin_patin",
  ]),
  authMiddlewares.verificarAccesoDisciplina("disciplina"),
  function (req, res, next) {
    uploads.single("documentacion")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // Si ocurre un error de multer (p.ej. tamaño de archivo)
        if(err.message=="File too large"){
          return res.status(400).json({ message: "Archivo muy pesado" });
        }
        return res.status(400).json({ message: err.message });
      } else if (err) {
        // Si el tipo de archivo no es permitido
        return res.status(400).json({ message: err.message });
      }
      // Si no hay error, pasar al siguiente middleware
      next();
    });
  },
],
economiaController.añadirMovimiento
);

router.put("/editarMovimiento/:disciplina/:id", [
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol([
    "admin_futbol",
    "admin_tenis",
    "admin_voley",
    "admin_basquet",
    "admin_patin",
  ]),
  authMiddlewares.verificarAccesoDisciplina("disciplina"),
  function (req, res, next) {
    uploads.single("documentacion")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // Si ocurre un error de multer (p.ej. tamaño de archivo)
        if(err.message=="File too large"){
          return res.status(400).json({ message: "Archivo muy pesado" });
        }
        return res.status(400).json({ message: err.message });
      } else if (err) {
        // Si el tipo de archivo no es permitido
        return res.status(400).json({ message: err.message });
      }
      // Si no hay error, pasar al siguiente middleware
      next();
    });
  },
],
economiaController.editarMovimiento
);

router.delete("/borrarMovimiento/:disciplina/:id", [
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol([
    "admin_futbol",
    "admin_tenis",
    "admin_voley",
    "admin_basquet",
    "admin_patin",
  ]),
  authMiddlewares.verificarAccesoDisciplina("disciplina"),
],
economiaController.borrarMovimiento
);

// Exportamos el router
module.exports = router;
