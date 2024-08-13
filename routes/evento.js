const express = require("express");
const router = express.Router();

const controllerEvento = require("../controllers/evento");
const eventoController = new controllerEvento();

router.get('/dashboard/eventos', eventoController.mostrarEventos);
router.get('/dashboard/eventos', eventoController.mostrarEventos);
router.delete("/eventos/:id",eventoController.borrarEvento)
router.post('/eventos', eventoController.añadirEvento);
router.get("/eventos",eventoController.listarEventos)

module.exports = router;