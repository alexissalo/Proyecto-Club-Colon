const express = require("express");
const router = express.Router();
const middlewaresAuth=require("../middlewares/auth")
const authMiddlewares=new middlewaresAuth()
const controllerUsuario = require("../controllers/usuario");
const usuarioController = new controllerUsuario();


router.get("/dashboard/inicio",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["todos"])
],
usuarioController.mostrarInicio
)
router.get('/login', usuarioController.mostrarFormulario);
router.post('/login', usuarioController.login);
router.get("/logout", usuarioController.logout);
router.get("/dashboard/usuarios",[
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general"])
  ],
  usuarioController.mostrarUsuarios
)
router.post("/crearUsuario",[
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general"])
  ],
  usuarioController.registrarUsuario
)
router.get("/dashboard/cuenta",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["todos"])
],
usuarioController.mostrarCuenta
)
router.put("/cambiarNombre",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["todos"])
],
usuarioController.cambiarNombre
)
router.put("/cambiarContrasenia",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["todos"])
],
usuarioController.cambiarContraseña
)

module.exports = router;