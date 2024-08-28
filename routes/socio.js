// Importamos Express y creamos un router
const express = require("express");
const router = express.Router();

// Importamos los middlewares de autenticacion
const middlewaresAuth = require("../middlewares/auth");
const authMiddlewares = new middlewaresAuth();

// Importamos el controlador de socios
const controllerSocio = require("../controllers/socio");
const socioController = new controllerSocio();

// Ruta para listar socios (requiere sesión y rol "admin_general" o "admin_secretaria")
router.get(
  "/dashboard/socios",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general", "admin_secretaria"]),
  ],
  socioController.listarSocios
);

//Ruta para actualizar informacion del socio(requiere sesion y rol "admin_secretaria")
router.put("/actualizarSocio/:id",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["admin_secretaria"])
],
socioController.actualizarSocio
)

//Ruta para borrar el socio(requiere sesion y rol "admin_secretaria")
router.delete("/borrarSocio/:id",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["admin_secretaria"])
],
socioController.borrarSocio
)

// Exportamos el router
module.exports = router;
