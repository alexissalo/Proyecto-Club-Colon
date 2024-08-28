// Importamos Express y creamos un router
const express = require("express");
const router = express.Router();

// Importamos los middlewares de autenticación
const middlewaresAuth = require("../middlewares/auth");
const authMiddlewares = new middlewaresAuth();

// Importamos el controlador de usuarios
const controllerUsuario = require("../controllers/usuario");
const usuarioController = new controllerUsuario();

// Ruta para mostrar la página de inicio del dashboard
router.get("/dashboard/inicio", [
  // Verificamos que el usuario esté logueado y tenga el rol correcto
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["todos"])
],
usuarioController.mostrarInicio
)

// Ruta para mostrar el formulario de login
router.get('/login', usuarioController.mostrarFormulario);

// Ruta para procesar el login
router.post('/login', usuarioController.login);

// Ruta para cerrar sesión
router.get("/logout", usuarioController.logout);

// Ruta para mostrar la lista de usuarios (solo para administradores generales)
router.get("/dashboard/usuarios", [
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["admin_general"])
],
usuarioController.mostrarUsuarios
)

// Ruta para crear un nuevo usuario (solo para administradores generales)
router.post("/crearUsuario", [
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["admin_general"])
],
usuarioController.registrarUsuario
)

// Ruta para mostrar la cuenta del usuario
router.get("/dashboard/cuenta", [
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["todos"])
],
usuarioController.mostrarCuenta
)

// Ruta para cambiar el nombre del usuario
router.put("/cambiarNombre", [
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["todos"])
],
usuarioController.cambiarNombre
)

// Ruta para cambiar la contraseña del usuario
router.put("/cambiarContrasenia", [
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["todos"])
],
usuarioController.cambiarContraseña
)

//Ruta para borrar usuario

router.delete("/borrarUsuario/:id",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["admin_general"]),
],
usuarioController.borrarUsuario
)

// Exportamos el router
module.exports = router;