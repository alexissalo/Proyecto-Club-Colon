// Importamos los modelos de socio y disciplina
const modelSocio = require("../models/socio");
const socioModel = new modelSocio();
const modelDisciplina = require("../models/disciplina");
const disciplinaModel = new modelDisciplina();

// Creamos la clase SocioController
class SocioController {
  // Método para listar los socios
  listarSocios(req, res) {
    // Obtenemos la página y el número de filas por página desde la query
    const pagina = parseInt(req.query.pagina) || 1;
    const filasPorPagina = parseInt(req.query.filasPorPagina) || 5;
    const buscar = req.query.buscar || '';

    // Consulta para contar el número total de registros
    socioModel.getTotalSocios(buscar,(totalSocios) => {
      // Consulta para obtener los socios paginados
      socioModel.getSocios(pagina, filasPorPagina,buscar, (sociosData) => {
        // Consulta para obtener las disciplinas
        disciplinaModel.listarDisciplinas((disciplinaData) => {
          // Verificamos si hay un error en la consulta
          if (!sociosData) {
            return res
              .status(500)
              .send("Error al obtener los datos de los socios");
          }

          // Obtenemos el rol del usuario
          const rolId = req.rolId;
          const rolNombre = req.rolNombre;

          // Renderizamos la vista de socios con los datos obtenidos
          res.render("dashboard/socios", {
            socios: sociosData,
            rolId: rolId,
            rolNombre: rolNombre,
            pagina: pagina,
            filasPorPagina: filasPorPagina,
            totalSocios: totalSocios,
            disciplinas: disciplinaData,
            buscar: buscar // Enviar el término de búsqueda a la vista
          });
        });
      });
    });
  }

  actualizarSocio(req, res){
    const {id}=req.params;
    const {nombre, telefono, domicilio,dni, fechaNacimiento}=req.body;

    socioModel.updateSocio(id,nombre,dni,telefono,fechaNacimiento,domicilio,(socioData)=>{
      if (!socioData) {
        return res
          .status(500)
          .send("Error al actualizar los datos de los socios");
      }
      res.json(socioData)
    })
  }

  borrarSocio(req,res){
    const {id}=req.params;

    socioModel.deleteSocio(id,(socioData)=>{
      if (!socioData) {
        return res
          .status(500)
          .send("Error al borrar el socio");
      }

      res.json(socioData)
    })
  }
}

// Exportamos la clase SocioController
module.exports = SocioController;