const express = require("express");
const router = express.Router();

const middlewaresAuth = require("../middlewares/auth");
const authMiddlewares = new middlewaresAuth();
const controllerEvento = require("../controllers/evento");
const eventoController = new controllerEvento();

router.get('/dashboard/eventos',[
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["todos"]),
  ], 
  eventoController.mostrarEventos
);
router.delete("/eventos/:id",[
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general"]),
  ], eventoController.borrarEvento
);
router.post('/eventos',[
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general"]),
  ],  
  eventoController.añadirEvento
);

router.get("/eventos",eventoController.listarEventos)

module.exports = router;