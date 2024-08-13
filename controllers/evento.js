const modelEvento = require("../models/evento");
const eventoModel = new modelEvento();

class EventoController {

	mostrarEventos (req, res) {
		const rolId = req.rolId;
		res.render("dashboard/eventos",{rolId});
	}

	listarEventos(req,res){
		eventoModel.listarEventos((eventoData)=>{
			console.log(eventoData)
			res.json(eventoData)
		})
	}

	añadirEvento(req,res){
		const {nombre,descripcion,fechaInicio,fechaFin}=req.body

		console.log(fechaFin);
		

		eventoModel.añadirEvento(nombre,descripcion,fechaInicio,fechaFin,(eventoData)=>{
			res.json(eventoData)
			console.log(eventoData);
		})
	}

	borrarEvento(req,res){
		const {id}=req.params

		eventoModel.borrarEvento(id,(eventoData)=>{
			console.log(eventoData);
			
		})
	}
}

module.exports = EventoController;