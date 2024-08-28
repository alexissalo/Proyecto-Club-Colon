const express = require("express");
const router = express.Router();

const middlewaresAuth = require("../middlewares/auth");
const authMiddlewares = new middlewaresAuth();
const controllerDeportista = require("../controllers/deportistas");
const deportistasController = new controllerDeportista();

router.get(
  "/dashboard/deportistas/:disciplina",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol([
      "coordinador_futbol",
      "coordinador_tenis",
      "coordinador_voley",
      "coordinador_basquet",
      "coordinador_patin",
    ]),
    authMiddlewares.verificarAccesoDisciplina("disciplina"),
  ],
  deportistasController.mostrarDeportistas
);

module.exports = router;
