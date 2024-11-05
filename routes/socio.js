// Importamos Express y creamos un router
const express = require("express");
const router = express.Router();

// Importamos los middlewares de autenticacion
const middlewaresAuth = require("../middlewares/auth");
const authMiddlewares = new middlewaresAuth();

// Importamos el controlador de socios
const controllerSocio = require("../controllers/socio");
const socioController = new controllerSocio();

const { generarTicketPagoSocial, generarTicketPagoDeportista } = require('../middlewares/generarPdf');

// Ruta para listar socios (requiere sesión y rol "admin_general" o "admin_secretaria")
router.get(
  "/dashboard/socios",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general", "admin_secretaria"]),
  ],
  socioController.listarSocios
);

router.get(
  "/dashboard/tiposdesocios",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general"]),
  ],
  socioController.listarTiposDeSocios
);

router.post("/crearSocio",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["admin_secretaria","admin_general"])
],
socioController.crearSocio
)


//Ruta para actualizar informacion del socio(requiere sesion y rol "admin_secretaria")
router.put("/actualizarSocio/:id",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["admin_secretaria","admin_general"])
],
socioController.actualizarSocio
)

//Ruta para borrar el socio(requiere sesion y rol "admin_secretaria")
router.delete("/borrarSocio/:id",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["admin_secretaria", "admin_general"])
],
socioController.borrarSocio
)

router.post("/crearPago",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["admin_secretaria", "admin_general"])
],
socioController.crearPago
)

router.post("/crearTipoSocio",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["admin_general"])
],
socioController.crearTipoDeSocio
)

router.put("/editarTipoSocio/:id",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["admin_general"])
],
socioController.editarTipoDeSocio
)

router.delete("/borrarTipoSocio/:id",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["admin_general"])
],
socioController.borrarTipoDeSocio
)

router.post('/descargarTicket/:id', (req, res) => {
  const {socio,infoPago, idPago}=req.body;

  // Generar el ticket de pago
  generarTicketPagoSocial(socio, infoPago, idPago, (chunk) => res.write(chunk), () => res.end());
});

router.post('/descargarTicketDeportista/:id', (req, res) => {
  const {deportista,infoPago, idPago}=req.body;

  // Generar el ticket de pago
  generarTicketPagoDeportista(deportista, infoPago, idPago, (chunk) => res.write(chunk), () => res.end());
});

// Exportamos el router
module.exports = router;
