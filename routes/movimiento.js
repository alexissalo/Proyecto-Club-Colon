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

// Exportamos el router
module.exports = router;