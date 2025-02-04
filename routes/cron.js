const express = require("express");
const router = express.Router();
const sociosCron = require("../libs/sociosCron");
const deportistasCron = require("../libs/deportistasCron");

// Activar cron de socios
router.post("/activar-socios", (req, res) => {
  if (!sociosCron.isActive()) {
    sociosCron.setupSociosCron();
    return res.json({ message: "Facturacion de socios activado." });
  }
  res.json({ message: "Facturacion de socios ya está activo." });
});

// Desactivar cron de socios
router.post("/desactivar-socios", (req, res) => {
  if (sociosCron.isActive()) {
    sociosCron.stopSociosCron();
    return res.json({ message: "Facturacion de socios desactivado." });
  }
  res.json({ message: "Facturacion de socios ya está inactivo." });
});

// Obtener el estado del cron de socios
router.get("/estado-socios-cron", (req, res) => {
  return res.json({ activo: sociosCron.isActive() });
});


// Activar cron de deportistas
router.post("/activar-deportistas", (req, res) => {
  if (!deportistasCron.isActive()) {
    deportistasCron.setupDeportistasCron();
    return res.json({ message: "Facturacion de deportistas activada." });
  }
  res.json({ message: "Facturacion de deportistas ya está activa." });
});

// Desactivar cron de deportistas
router.post("/desactivar-deportistas", (req, res) => {
  if (deportistasCron.isActive()) {
    deportistasCron.stopDeportistasCron();
    return res.json({ message: "Facturacion de deportistas desactivada." });
  }
  res.json({ message: "Facturacion de deportistas ya está inactiva." });
});

// Obtener el estado del cron de socios
router.get("/estado-deportistas-cron", (req, res) => {
  return res.json({ activo: deportistasCron.isActive() });
});

module.exports = router;
