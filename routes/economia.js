const express = require("express");
const router = express.Router();

const controllerEconomia =  require("../controllers/economia");
const EconomiaController = new controllerEconomia();


router.get('/dashboard/economia', EconomiaController.mostrarEconomia);
router.post('/economia', EconomiaController.añadirEconomia);


module.exports = router;