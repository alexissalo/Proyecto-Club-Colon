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
  deportistasController.mostrarDeportistasPorDisciplina
);

router.get(
  "/dashboard/cargardeportista/:disciplina",
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
  deportistasController.mostrarCargaDeportista
);

router.post("/cargarDeportista",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol([
    "coordinador_futbol",
    "coordinador_tenis",
    "coordinador_voley",
    "coordinador_basquet",
    "coordinador_patin",
  ]),
  authMiddlewares.verificarAccesoDisciplina("disciplina")
],
deportistasController.cargarDeportista
)

router.delete("/borrarDeportista/:id",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol([
    "coordinador_futbol",
    "coordinador_tenis",
    "coordinador_voley",
    "coordinador_basquet",
    "coordinador_patin",
  ]),
  authMiddlewares.verificarAccesoDisciplina("disciplina")
],
deportistasController.borrarDeportista
)

router.put("/editarDeportista",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol([
    "coordinador_futbol",
    "coordinador_tenis",
    "coordinador_voley",
    "coordinador_basquet",
    "coordinador_patin",
  ]),
  authMiddlewares.verificarAccesoDisciplina("disciplina")
],
deportistasController.editarDeportista
)

module.exports = router;
