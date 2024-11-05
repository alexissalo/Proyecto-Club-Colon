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

router.post(
  "/cargarDeportista/:disciplina",
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
  deportistasController.cargarDeportista
);

router.delete(
  "/borrarDeportista/:id",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol([
      "coordinador_futbol",
      "coordinador_tenis",
      "coordinador_voley",
      "coordinador_basquet",
      "coordinador_patin",
    ]),
  ],
  deportistasController.borrarDeportista
);

router.put(
  "/editarDeportista/:id",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol([
      "coordinador_futbol",
      "coordinador_tenis",
      "coordinador_voley",
      "coordinador_basquet",
      "coordinador_patin",
    ]),
  ],
  deportistasController.editarDeportista
);

router.post(
  "/crearPagoDeportista",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol([
      "coordinador_futbol",
      "coordinador_tenis",
      "coordinador_voley",
      "coordinador_basquet",
      "coordinador_patin",
    ]),
  ],
  deportistasController.crearPago
);

router.get(
  "/dashboard/editardeportista/:disciplina/:id",
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
  deportistasController.mostrarEdicionDeportista
);

router.get(
  "/getPagos/:id",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol([
      "coordinador_futbol",
      "coordinador_tenis",
      "coordinador_voley",
      "coordinador_basquet",
      "coordinador_patin",
    ]),
  ],
  deportistasController.traerPagosPorDeportista
);

module.exports = router;
