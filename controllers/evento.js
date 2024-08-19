const modelEvento = require("../models/evento");
const eventoModel = new modelEvento();
const modelDisciplina = require("../models/disciplina");
const disciplinaModel = new modelDisciplina();

class EventoController {

	mostrarEventos (req, res) {
		disciplinaModel.listarDisciplinas((disciplinaData) => {
			if (disciplinaData === null) {
			  return res
				.status(500)
				.send("Error al obtener los datos de los socios");
			}
			const rolId = req.rolId;
			const rolNombre=req.rolNombre
	
			res.render("dashboard/eventos", {
			  rolId: rolId,
			  rolNombre:rolNombre,
			  disciplinas:disciplinaData
			});
		  });
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