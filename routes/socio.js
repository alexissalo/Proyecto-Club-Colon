const express = require("express");
const router = express.Router();

const middlewaresAuth = require("../middlewares/auth");
const authMiddlewares = new middlewaresAuth();
const controllerSocio = require("../controllers/socio");
const socioController = new controllerSocio();

router.get(
  "/dashboard/socios",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general","admin_secretaria", "todos"]),
  ],
  socioController.listarSocios
);


module.exports = router;
