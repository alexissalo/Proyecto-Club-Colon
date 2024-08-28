// Importamos el modelo de disciplina
const modelDisciplina = require("../models/disciplina");
const disciplinaModel = new modelDisciplina();

// Definimos la clase DeportistasController
class DeportistasController {
  // Método para mostrar la lista de deportistas
  mostrarDeportistas(req, res) {
    // Llamamos al método listarDisciplinas del modelo de disciplina
    disciplinaModel.listarDisciplinas((disciplinaData) => {
      // Verificamos si hubo un error al obtener los datos
      if (disciplinaData === null) {
        return res
          .status(500)
          .send("Error al obtener los datos de los socios");
      }

      // Obtenemos el rol ID y nombre del request
      const rolId = req.rolId;
      const rolNombre = req.rolNombre;

      // Renderizamos la vista "dashboard/deportistas" con los datos obtenidos
      res.render("dashboard/deportistas", {
        rolId: rolId,
        rolNombre: rolNombre,
        disciplinas: disciplinaData
      });
    });
  }
}

// Exportamos la clase DeportistasController
module.exports = DeportistasController;