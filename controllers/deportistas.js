// Importamos el modelo de disciplina
const modelDisciplina = require("../models/disciplina");
const disciplinaModel = new modelDisciplina();
const modelDeportista = require("../models/deportistas");
const deportistaModel = new modelDeportista();

// Definimos la clase DeportistasController
class DeportistasController {
  // Método para mostrar la lista de deportistas
  mostrarDeportistasPorDisciplina(req, res) {
    // Obtenemos la página y el número de filas por página desde la query
    const { disciplina } = req.params;
    const pagina = parseInt(req.query.pagina) || 1;
    const filasPorPagina = parseInt(req.query.filasPorPagina) || 5;
    const buscar = req.query.buscar || "";

    deportistaModel.getTotalDeportistas(buscar, (totalDeportistaData) => {
      // Llamamos al método listarDisciplinas del modelo de disciplina
      deportistaModel.listarDeportistas(
        pagina,
        filasPorPagina,
        buscar,
        (deportistaData) => {
          if (!deportistaData) {
            return res
              .status(500)
              .send("Error al obtener los datos de los deportistas");
          }
          disciplinaModel.listarDisciplinas((disciplinaData) => {
            // Verificamos si hubo un error al obtener los datos
            if (disciplinaData === null) {
              return res
                .status(500)
                .send("Error al obtener los datos de las disciplinas");
            }

            // Obtenemos el rol ID y nombre del request
            const rolId = req.rolId;
            const rolNombre = req.rolNombre;

            // Renderizamos la vista "dashboard/deportistas" con los datos obtenidos
            res.render("dashboard/deportistas", {
              deportistas: deportistaData,
              rolId: rolId,
              rolNombre: rolNombre,
              disciplinas: disciplinaData,
              disciplina:disciplina,
              pagina: pagina,
              filasPorPagina: filasPorPagina,
              totalDeportistas: totalDeportistaData,
              buscar: buscar, // Enviar el término de búsqueda a la vista
            });
          });
        }
      );
    });
  }

  mostrarCargaDeportista(req, res) {
    const { disciplina } = req.params;
    // Llamamos al método listarDisciplinas del modelo de disciplina
    disciplinaModel.listarDisciplinas((disciplinaData) => {
      // Verificamos si hubo un error al obtener los datos
      if (disciplinaData === null) {
        return res.status(500).send("Error al obtener los datos de los socios");
      }

      // Obtenemos el rol ID y nombre del request
      const rolId = req.rolId;
      const rolNombre = req.rolNombre;

      // Renderizamos la vista "dashboard/deportistas" con los datos obtenidos
      res.render("dashboard/cargarDeportista", {
        rolId: rolId,
        rolNombre: rolNombre,
        disciplinas: disciplinaData,
        disciplina:disciplina
      });
    });
  }

  cargarDeportista(req,res){
    const {datos}=req.body;
    const { disciplina } = req.params;

    deportistaModel.insertDeportista(datos,(deportistaData)=>{
      if (deportistaData==null) {
        return res.status(500).json({message:"Error del servidor al cargar el deportista", ok:false})
      }

      res.status(200).json({message:"Deportista creado con exito",ok:true})
    })
  }

  borrarDeportista(req,res){
    const {id}=req.params;

    deportistaModel.deleteDeportista(id,(deportistaData)=>{
      if (deportistaData==null) {
        return res.status(500).json({message:"Error del servidor al borrar el deportista", ok:false})
      }

      res.status(200).json({message:"Deportista borrado con exito",ok:true})
    })
  }

  editarDeportista(req,res){
    const {id}=req.params;
    const {datos}=req.body;

    deportistaModel.updateDeportista(id,datos,(deportistaData)=>{
      if (deportistaData==null) {
        return res.status(500).json({message:"Error del servidor al actualizar el deportista", ok:false})
      }

      res.status(200).json({message:"Deportista actualizado con exito",ok:true})
    })
  }
}

// Exportamos la clase DeportistasController
module.exports = DeportistasController;
