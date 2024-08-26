const express = require("express");
const router = express.Router();
const middlewaresAuth=require("../middlewares/auth")
const authMiddlewares=new middlewaresAuth()
const controllerUsuario = require("../controllers/usuario");
const usuarioController = new controllerUsuario();

router.get('/login', usuarioController.mostrarFormulario);
router.post('/login', usuarioController.login);
router.get("/logout", usuarioController.logout);


module.exports = router;