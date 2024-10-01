// Importamos el modelo de disciplina
const modelDisciplina = require("../models/disciplina");
const disciplinaModel = new modelDisciplina();
const modelEconomia = require("../models/economia");
const economiaModel = new modelEconomia();

// Definimos la clase EconomiaController
class EconomiaController {
  // Método para mostrar la economía por disciplina
  mostrarEconomiaPorDisciplina(req, res) {
    // Obtenemos la disciplina desde los parámetros de la solicitud
    const { disciplina } = req.params;

    const userId = req.userId;

    // Llamamos al método listarDisciplinas del modelo de disciplina
    disciplinaModel.listarDisciplinas((disciplinaData) => {
      // Verificamos si hubo un error al obtener los datos
      if (!disciplinaData) {
        return res.status(500).send("Error al obtener los datos de los socios");
      }

      // Obtenemos el rol ID y nombre del request
      const rolId = req.rolId;
      const rolNombre = req.rolNombre;

      // Renderizamos la vista "dashboard/economia" con los datos obtenidos
      res.render("dashboard/economia", {
        rolId: rolId,
        rolNombre: rolNombre,
        disciplinas: disciplinaData,
        disciplina: disciplina,
        userId: userId,
      });
    });
  }

  añadirMovimiento(req, res) {
    const { disciplina } = req.params;
    const { monto, descripcion, es_ingreso } = req.body;
    const id_responsable = req.userId;
    const documentacion = req.file ? "/" + req.file.path : null;

    console.log(documentacion);

    economiaModel.nuevoMovimiento(
      monto,
      descripcion,
      documentacion,
      es_ingreso,
      disciplina,
      id_responsable,
      (economiaData) => {
        if (economiaData == null) {
          return res
            .status(500)
            .json({
              message: "Error del servidor al crear un nuevo movimiento",
              ok: false,
            });
        }
        res.json({ message: "Movimiento creado con Exito", ok: true });
      }
    );
  }
}

// Exportamos la clase EconomiaController
module.exports = EconomiaController;
