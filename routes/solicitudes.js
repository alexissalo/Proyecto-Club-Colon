// Importamos Express y creamos un router
const express = require("express");
const router = express.Router();

// Importamos los middlewares de autenticación
const middlewaresAuth = require("../middlewares/auth");
const authMiddlewares = new middlewaresAuth();

// Importamos el controlador de usuarios
const controllerSolicitudes = require("../controllers/solicitudes");
const solicitudController = new controllerSolicitudes();

// Ruta para mostrar la página de inicio del dashboard
router.get("/dashboard/solicitudes/:disciplina", [
  // Verificamos que el usuario esté logueado y tenga el rol correcto
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["todos"])
],
solicitudController.mostrarSolicitudes
)

router.get("/dashboard/solicitud/:id", [
    // Verificamos que el usuario esté logueado y tenga el rol correcto
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["todos"])
  ],
  solicitudController.mostrarDetalleSolicitud
  )

router.delete("/eliminarSolicitud/:id",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["todos"])],
  solicitudController.borrarSolicitud
)

router.put("/cambiarEstadoSolicitud/:id",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["todos"])
],
solicitudController.cambiarEstadoSolicitud
)
  

// Exportamos el router
module.exports = router;