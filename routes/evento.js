// Importamos Express y creamos un router
const express = require("express");
const router = express.Router();

// Importamos los middlewares de autenticacion
const middlewaresAuth = require("../middlewares/auth");
const authMiddlewares = new middlewaresAuth();

// Importamos el controlador de eventos
const controllerEvento = require("../controllers/evento");
const eventoController = new controllerEvento();

// Ruta para mostrar todos los eventos (requiere sesion y rol "todos")
router.get(
  "/dashboard/eventos",
  [authMiddlewares.verificarSesion, authMiddlewares.verificarRol(["todos"])],
  eventoController.mostrarEventos
);

// Ruta para mostrar eventos por disciplina (requiere sesion y acceso a la disciplina)
router.get(
  "/dashboard/eventos/:disciplina",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarAccesoDisciplina("disciplina"),
  ],
  eventoController.mostrarEventosPorDisciplina
);

// Ruta para eliminar un evento (requiere sesion y rol "admin_general")
router.delete(
  "/eventos/:id",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general"]),
  ],
  eventoController.borrarEvento
);

// Ruta para eliminar un evento de una disciplina (requiere sesion y rol "admin_general")
router.delete(
  "/eventosDisciplina/:id",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol([
      "admin_futbol",
      "admin_tenis",
      "admin_voley",
      "admin_basquet",
      "admin_patin",
    ]),
  ],
  eventoController.borrarEvento
);

// Ruta para agregar un nuevo evento (requiere sesion y rol "admin_general")
router.post(
  "/eventos",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general"]),
  ],
  eventoController.añadirEvento
);

// Ruta para agregar un nuevo evento por disciplina (requiere sesion y rol "admin_futbol")
router.post(
  "/eventos/:disciplina",
  [
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
  eventoController.añadirEventoPorDisciplina
);

// Exportamos el router
module.exports = router;
