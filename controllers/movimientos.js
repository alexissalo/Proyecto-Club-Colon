// Importamos los modelos de disciplina y movimientos
const modelDisciplina = require("../models/disciplina");
const disciplinaModel = new modelDisciplina();
const modelMovimientos = require("../models/movimientos");
const movimientoModel = new modelMovimientos();

// Definimos la clase MovimientoController
class MovimientoController {
  // Método para mostrar la lista de movimientos
  mostrarMovimientos(req, res) {
    // Obtenemos la página y filas por página desde la solicitud
    const pagina = parseInt(req.query.pagina) || 1;
    const filasPorPagina = parseInt(req.query.filasPorPagina) || 5;
    const buscar = req.query.buscar || '';

    // Llamamos al método listarDisciplinas del modelo de disciplina
    disciplinaModel.listarDisciplinas((disciplinasData) => {
      // Consulta para contar el número total de registros
      movimientoModel.getTotalMovimientos((totalMovimientos) => {
        // Llamamos al método listarMovimiento del modelo de movimientos
        movimientoModel.listarMovimiento(
          pagina,
          filasPorPagina,
          (movimientosData) => {
            // Verificamos si hubo un error al obtener los datos
            if (!movimientosData) {
              return res
                .status(500)
                .send("Error al obtener los datos de los socios");
            }

            // Obtenemos el rol ID y nombre del request
            const rolId = req.rolId;
            const rolNombre = req.rolNombre;

            // Renderizamos la vista "dashboard/movimientos" con los datos obtenidos
            res.render("dashboard/movimientos", {
              movimientos: movimientosData,
              pagina: pagina,
              filasPorPagina: filasPorPagina,
              totalMovimientos: totalMovimientos,
              rolId: rolId,
              rolNombre: rolNombre,
              disciplinas: disciplinasData,
            });
          }
        );
      });
    });
  }

  // Método para mostrar la lista de movimientos por disciplina
  mostrarMovimientosPorDisciplina(req, res) {
    // Obtenemos la disciplina desde los parámetros de la solicitud
    const { disciplina } = req.params;

    // Obtenemos la página y filas por página desde la solicitud
    const pagina = parseInt(req.query.pagina) || 1;
    const filasPorPagina = parseInt(req.query.filasPorPagina) || 5;
    const buscar = req.query.buscar || '';

    // Llamamos al método listarDisciplinas del modelo de disciplina
    disciplinaModel.listarDisciplinas((disciplinasData) => {
      // Consulta para contar el número total de registros por disciplina
      movimientoModel.getTotalMovimientosPorDisciplina(disciplina, (totalMovimientos) => {
        // Llamamos al método listarMovimientosPorDisciplina del modelo de movimientos
        movimientoModel.listarMovimientosPorDisciplina(
          disciplina,
          pagina,
          filasPorPagina,
          (movimientosData) => {
            // Verificamos si hubo un error al obtener los datos
            if (!movimientosData) {
              return res
                .status(500)
                .send("Error al obtener los datos de los socios");
            }

            // Obtenemos el rol ID y nombre del request
            const rolId = req.rolId;
            const rolNombre = req.rolNombre;

            // Renderizamos la vista "dashboard/movimientos" con los datos obtenidos
            res.render("dashboard/movimientos", {
              movimientos: movimientosData,
              pagina: pagina,
              filasPorPagina: filasPorPagina,
              totalMovimientos: totalMovimientos,
              rolId: rolId,
              rolNombre: rolNombre,
              disciplinas: disciplinasData,
              disciplina: disciplina
            });
          }
        );
      });
    });
  }
}

// Exportamos la clase MovimientoController
module.exports = MovimientoController;