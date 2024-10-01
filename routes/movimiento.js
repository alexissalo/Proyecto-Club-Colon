// Importamos el framework Express y creamos una instancia de Router
const express = require("express");
const router = express.Router();

// Importamos los middlewares de autenticación y autorización
const middlewaresAuth = require("../middlewares/auth");
const authMiddlewares = new middlewaresAuth();

// Importamos el controlador de movimientos
const controllerMovimiento = require("../controllers/movimientos");
const movimientoController = new controllerMovimiento();

// Definimos la ruta GET para obtener todos los movimientos
router.get(
  "/dashboard/movimientos",
  [
    // Verificamos si el usuario tiene una sesión activa
    authMiddlewares.verificarSesion,

    // Verificamos si el usuario tiene el rol de admin_general
    authMiddlewares.verificarRol("admin_general"),
  ],
  // Llamamos al método del controlador para mostrar todos los movimientos
  movimientoController.mostrarMovimientos
);

// Definimos la ruta GET para obtener los movimientos por disciplina
router.get(
  "/dashboard/movimientos/:disciplina",
  [
    // Verificamos si el usuario tiene una sesión activa
    authMiddlewares.verificarSesion,

    // Verificamos si el usuario tiene uno de los roles permitidos
    authMiddlewares.verificarRol([
      "admin_futbol",
      "admin_tenis",
      "admin_voley",
      "admin_basquet",
      "admin_patin",
    ]),

    // Verificamos si el usuario tiene acceso a la disciplina especificada
    authMiddlewares.verificarAccesoDisciplina("disciplina"),
  ],
  // Llamamos al método del controlador para mostrar los movimientos por disciplina
  movimientoController.mostrarMovimientosPorDisciplina
);

//Rutas para balance general
router.get(
  "/ultimos-30-dias",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general"]),
  ],
  movimientoController.getBalanceUltimos30Dias
);
router.get(
  "/ultimos-90-dias",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general"]),
  ],
  movimientoController.getBalanceUltimos90Dias
);
router.get(
  "/anual",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general"]),
  ],
  movimientoController.getBalanceAnual
);
router.post(
  "/personalizado",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol(["admin_general"]),
  ],
  movimientoController.getBalancePersonalizado
);

// Rutas para balance por disciplina
router.get(
  "/ultimos-30-dias/:disciplina",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol([
      "admin_futbol",
      "admin_tenis",
      "admin_voley",
      "admin_basquet",
      "admin_patin",
    ]),
    authMiddlewares.verificarAccesoDisciplina("disciplina"),
  ],
  movimientoController.getBalanceUltimos30DiasPorDisciplina
);
router.get(
  "/ultimos-90-dias/:disciplina",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol([
      "admin_futbol",
      "admin_tenis",
      "admin_voley",
      "admin_basquet",
      "admin_patin",
    ]),
    authMiddlewares.verificarAccesoDisciplina("disciplina"),
  ],
  movimientoController.getBalanceUltimos90DiasPorDisciplina
);
router.get(
  "/anual/:disciplina",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol([
      "admin_futbol",
      "admin_tenis",
      "admin_voley",
      "admin_basquet",
      "admin_patin",
    ]),
    authMiddlewares.verificarAccesoDisciplina("disciplina"),
  ],
  movimientoController.getBalanceAnualPorDisciplina
);
router.post(
  "/personalizado/:disciplina",
  [
    authMiddlewares.verificarSesion,
    authMiddlewares.verificarRol([
      "admin_futbol",
      "admin_tenis",
      "admin_voley",
      "admin_basquet",
      "admin_patin",
    ]),
    authMiddlewares.verificarAccesoDisciplina("disciplina"),
  ],
  movimientoController.getBalancePersonalizadoPorDisciplina
);

// Exportamos el router
module.exports = router;
