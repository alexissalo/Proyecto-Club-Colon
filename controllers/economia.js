// Importamos el modelo de disciplina
const modelDisciplina = require("../models/disciplina");
const disciplinaModel = new modelDisciplina();

// Definimos la clase EconomiaController
class EconomiaController {
  // Método para mostrar la economía por disciplina
  mostrarEconomiaPorDisciplina(req, res) {
    // Obtenemos la disciplina desde los parámetros de la solicitud
    const { disciplina } = req.params;

    // Llamamos al método listarDisciplinas del modelo de disciplina
    disciplinaModel.listarDisciplinas((disciplinaData) => {
      // Verificamos si hubo un error al obtener los datos
      if (!disciplinaData) {
        return res
          .status(500)
          .send("Error al obtener los datos de los socios");
      }

      // Obtenemos el rol ID y nombre del request
      const rolId = req.rolId;
      const rolNombre = req.rolNombre;

      // Renderizamos la vista "dashboard/economia" con los datos obtenidos
      res.render("dashboard/economia", {
        rolId: rolId,
        rolNombre: rolNombre,
        disciplinas: disciplinaData,
        disciplina: disciplina
      });
    });
  }
}

// Exportamos la clase EconomiaController
module.exports = EconomiaController;