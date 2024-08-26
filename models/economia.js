const pool = require("../database/db")

class EconomiaModel {

    async listarEconomia(callback){
		try{
			let sql=""

			const [result] = await pool.query(sql, []);

      		callback(result);
		}catch(error){
			console.error(error)
		}
	}

	async añadirEconomia(nombre,descripcion,fechaInicio,fechaFin,callback){
		try{
			let sql=""

			const [result] = await pool.query(sql, [nombre,descripcion,fechaInicio,fechaFin]);

      		callback(result);
		}catch(error){
			console.error(error)
		}
	}

	async borrarEconomia(id,callback){
		try {
			let sql=""

			const [result]=await pool.query(sql,[id])

			callback(result)
		} catch (error) {
			console.error(error)
		}
	}


}

module.exports = EconomiaModel;
