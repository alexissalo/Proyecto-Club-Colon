// Importamos los modelos de evento y disciplina
const modelEvento = require("../models/evento");
const eventoModel = new modelEvento();
const modelDisciplina = require("../models/disciplina");
const disciplinaModel = new modelDisciplina();

// Creamos la clase EventoController
class EventoController {
  // Metodo para mostrar todos los eventos
  mostrarEventos(req, res) {
    // Consulta para obtener todos los eventos
    eventoModel.listarEventos((eventoData) => {
      if (!eventoData) {
        return res.status(500).send("Error al obtener los datos de los eventos");
      }
      // Consulta para obtener todas las disciplinas
      disciplinaModel.listarDisciplinas((disciplinaData) => {
        if (!disciplinaData) {
          return res
            .status(500)
            .send("Error al obtener los datos de las disciplinas");
        }
        // Obtenemos el rol del usuario
        const rolId = req.rolId;
        const rolNombre = req.rolNombre;

        // Renderizamos la vista de eventos con los datos obtenidos
        res.render("dashboard/eventos", {
          eventos: eventoData,
          rolId: rolId,
          rolNombre: rolNombre,
          disciplinas: disciplinaData,
          disciplina: null, // No se selecciono una disciplina específica
        });
      });
    });
  }

  // Método para mostrar eventos por disciplina
  mostrarEventosPorDisciplina(req, res) {
    const { disciplina } = req.params; // Obtenemos la disciplina seleccionada

    // Consulta para obtener los eventos de la disciplina seleccionada
    eventoModel.listarEventosPorDisciplina(disciplina, (eventoData) => {
      if (!eventoData) {
        return res
          .status(500)
          .send("Error al obtener los datos de los eventos de la disciplina");
      }
      // Consulta para obtener todas las disciplinas
      disciplinaModel.listarDisciplinas((disciplinaData) => {
        if (!disciplinaData) {
          return res
            .status(500)
            .send("Error al obtener los datos de las disciplinas");
        }
        // Obtenemos el rol del usuario
        const rolId = req.rolId;
        const rolNombre = req.rolNombre;

        // Renderizamos la vista de eventos con los datos obtenidos
        res.render("dashboard/eventosPorDisciplina", {
          eventos: eventoData,
          rolId: rolId,
          rolNombre: rolNombre,
          disciplinas: disciplinaData,
          disciplina: disciplina, // Seleccionamos la disciplina especifica
        });
      });
    });
  }

  // Metodo para agregar un nuevo evento
  añadirEvento(req, res) {
    const { nombre, descripcion, fechaInicio, fechaFin} = req.body;

    if (!nombre || !descripcion || !fechaInicio) {
      return res.status(500).json({
        message: "Falta completar campos obligatorios",
        ok: false,
      });
  }

    eventoModel.añadirEvento(
      nombre,
      descripcion,
      fechaInicio,
      fechaFin,
      (eventoData) => {
        res.json(eventoData);
      }
    );
  }

  añadirEventoPorDisciplina(req,res){
    const { nombre, descripcion, fechaInicio, fechaFin,disciplina } = req.body;

    if (!nombre || !descripcion || !fechaInicio) {
      return res.status(500).json({
        message: "Falta completar campos obligatorios",
        ok: false,
      });
  }

    eventoModel.añadirEventoPorDisciplina(
      nombre,
      descripcion,
      fechaInicio,
      fechaFin,
      disciplina,
      (eventoData) => {
        res.json(eventoData);
      }
    );

  }

  // Metodo para eliminar un evento
  borrarEvento(req, res) {
    const { id } = req.params;

    eventoModel.borrarEvento(id, (eventoData) => {
      console.log(eventoData);
    });
  }
}

// Exportamos la clase EventoController
module.exports = EventoController;
