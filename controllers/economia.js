

class EconomiaController {

	mostrarEconomia (req, res) {
		res.render("dashboard/economia",{});
	}


	añadirEconomia(req,res){
		const {nombre,descripcion,fechaInicio,fechaFin}=req.body

		console.log(fechaFin);
		


		
	}


}

module.exports = EconomiaController;