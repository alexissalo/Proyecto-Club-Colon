// Importamos el framework Express y creamos una instancia de Router
const express = require("express");
const router = express.Router();

// Importamos los middlewares de autenticación y autorización
const middlewaresAuth = require("../middlewares/auth");
const authMiddlewares = new middlewaresAuth();

// Importamos el controlador de economía
const controllerEconomia = require("../controllers/economia");
const economiaController = new controllerEconomia();

// Definimos la ruta GET para obtener la economía por disciplina
router.get("/dashboard/economia/:disciplina", [
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
// Llamamos al método del controlador para mostrar la economía por disciplina
economiaController.mostrarEconomiaPorDisciplina
);

// Exportamos el router
module.exports = router;