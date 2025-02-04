// Importamos Express y creamos un router
const express = require("express");
const router = express.Router();

// Importamos los middlewares de autenticacion
const middlewaresAuth = require("../middlewares/auth");
const authMiddlewares = new middlewaresAuth();

// Importamos el controlador de socios
const controllerSocio = require("../controllers/socio");
const socioController = new controllerSocio();

const {
  generarTicketPagoSocial,
  generarTicketPagoDeportista,
  imprimirDeudoresMesDeportistas,
  imprimirDeudoresMesSocios,
  listarSociosenPdf
} = require("../middlewares/generarPdf");

const {exportarSociosExcel}=require("../libs/excelGenerate")

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
  "/dashboard/socios/pagos/:id",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general", "admin_secretaria"]),
  ],
  socioController.mostrarPagosSocio
);

router.get(
  "/dashboard/socios/pagos/listadeudores/:fecha",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general", "admin_secretaria"]),
  ],
  socioController.listarDeudoresMes
);

router.post(
  "/imprimirDeudoresMes",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general", "admin_secretaria"]),
  ],
  imprimirDeudoresMesSocios
);

router.get(
  "/dashboard/tiposdesocios",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general"]),
  ],
  socioController.listarTiposDeSocios
);

// router.get(
//   "/dashboard/escaner",
//   [
//     authMiddlewares.verificarSesion,
//     authMiddlewares.verificarRol(["admin_general", "admin_secretaria"]),
//   ],
//   socioController.mostrarEscanerSocios
// );

router.post(
  "/crearSocio",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_secretaria", "admin_general"]),
  ],
  socioController.crearSocio
);

//Ruta para actualizar informacion del socio(requiere sesion y rol "admin_secretaria")
router.put(
  "/actualizarSocio/:id",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_secretaria", "admin_general"]),
  ],
  socioController.actualizarSocio
);

//Ruta para borrar el socio(requiere sesion y rol "admin_secretaria")
router.delete(
  "/borrarSocio/:id",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_secretaria", "admin_general"]),
  ],
  socioController.borrarSocio
);

router.post(
  "/crearPago",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_secretaria", "admin_general"]),
  ],
  socioController.crearPago
);

router.post(
  "/crearTipoSocio",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general"]),
  ],
  socioController.crearTipoDeSocio
);

router.put(
  "/editarTipoSocio/:id",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general"]),
  ],
  socioController.editarTipoDeSocio
);

router.delete(
  "/borrarTipoSocio/:id",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general"]),
  ],
  socioController.borrarTipoDeSocio
);

router.get("/descargarExcelSocios",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["admin_general", "admin_secretaria"]),
],
exportarSociosExcel)

router.get("/listarPdfSocios",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["admin_general", "admin_secretaria"]),
],
listarSociosenPdf)

router.get("/getsocio/:id",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["admin_general", "admin_secretaria"]),
], socioController.getSocioById)

router.get("/listarFacturasImpagas/:id",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["admin_general", "admin_secretaria"]),
],
socioController.listarFacturasImpagas)

router.post('/generarTicketCuotaSocial', (req, res) => {
  const { socio, cuota, idPago } = req.body;
  generarTicketPagoSocial(socio, cuota, idPago, res);
});

router.put("/darDeBajaSocio/:id",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["admin_general", "admin_secretaria"]),
],
socioController.darDeBajaSocio)

router.put("/darDeAltaSocio/:id",[
  authMiddlewares.verificarSesion,
  authMiddlewares.verificarRol(["admin_general", "admin_secretaria"]),
],
socioController.darDeAltaSocio)

// Exportamos el router
module.exports = router;
