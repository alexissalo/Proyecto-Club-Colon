const pool = require("../database/db");

class EventoModel {

	async listarEventos(callback){
		try{
			let sql="SELECT id, nombre AS title, descripcion AS description, DATE_FORMAT(fechaInicio, '%Y-%m-%d') AS start, DATE_FORMAT(fechaFin, '%Y-%m-%d') AS end FROM eventos"

			const [result] = await pool.query(sql, []);

      		callback(result);
		}catch(error){
			console.error(error)
		}
	}

	async añadirEvento(nombre,descripcion,fechaInicio,fechaFin,callback){
		try{
			let sql="INSERT INTO eventos (nombre,descripcion,fechaInicio,fechaFin) VALUES (?,?,?,?)"

			const [result] = await pool.query(sql, [nombre,descripcion,fechaInicio,fechaFin]);

      		callback(result);
		}catch(error){
			console.error(error)
		}
	}

	async borrarEvento(id,callback){
		try {
			let sql="DELETE FROM eventos WHERE id=?"

			const [result]=await pool.query(sql,[id])

			callback(result)
		} catch (error) {
			console.error(error)
		}
	}


}

module.exports = EventoModel;