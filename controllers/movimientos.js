// Importamos los modelos de disciplina y movimientos
const modelDisciplina = require("../models/disciplina");
const disciplinaModel = new modelDisciplina();
const modelMovimientos = require("../models/movimientos");
const movimientoModel = new modelMovimientos();
const { buildPDF } = require("../middlewares/generarPdf");

// Definimos la clase MovimientoController
class MovimientoController {
  // Método para mostrar la lista de movimientos
  mostrarMovimientos(req, res) {
    // Obtenemos la página y filas por página desde la solicitud
    const pagina = parseInt(req.query.pagina) || 1;
    const filasPorPagina = parseInt(req.query.filasPorPagina) || 5;
    const buscar = req.query.buscar || "";
    const tipo = req.query.tipo || "";
    const fecha = req.query.fecha || "";
    const disciplina = req.query.disciplina || "";

    // Llamamos al método listarDisciplinas del modelo de disciplina
    disciplinaModel.listarDisciplinas((disciplinasData) => {
      // Consulta para contar el número total de registros
      movimientoModel.getTotalMovimientos(
        tipo,
        fecha,
        disciplina,
        (totalMovimientos) => {
          // Llamamos al método listarMovimiento del modelo de movimientos
          movimientoModel.listarMovimiento(
            pagina,
            filasPorPagina,
            tipo,
            fecha,
            disciplina,
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
                disciplina:null
              });
            }
          );
        }
      );
    });
  }

  // Método para mostrar la lista de movimientos por disciplina
  mostrarMovimientosPorDisciplina(req, res) {
    // Obtenemos la disciplina desde los parámetros de la solicitud
    const { disciplina } = req.params;

    // Obtenemos la página y filas por página desde la solicitud
    const pagina = parseInt(req.query.pagina) || 1;
    const filasPorPagina = parseInt(req.query.filasPorPagina) || 5;
    const buscar = req.query.buscar || "";

    // Llamamos al método listarDisciplinas del modelo de disciplina
    disciplinaModel.listarDisciplinas((disciplinasData) => {
      // Consulta para contar el número total de registros por disciplina
      movimientoModel.getTotalMovimientosPorDisciplina(
        disciplina,
        (totalMovimientos) => {
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
                disciplina: disciplina,
              });
            }
          );
        }
      );
    });
  }

  async getBalanceUltimos30Dias(req, res) {

    try {
      const balance = await movimientoModel.getBalanceUltimos30Dias(
        null
      );
      const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          "attachment; filename=Balance ultimos 30 dias.pdf",
      });

      buildPDF(
        balance,
        "Balance 30 dias",
        (data) => stream.write(data),
        () => stream.end()
      );
    } catch (error) {
      console.log(error);
    }
  }

  async getBalanceUltimos90Dias(req, res) {
    try {
      const balance = await movimientoModel.getBalanceUltimos90Dias(
        null
      );
      const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          "attachment; filename=Balance ultimos 90 dias.pdf",
      });

      buildPDF(
        balance,
        "Balance 90 dias",
        (data) => stream.write(data),
        () => stream.end()
      );
    } catch (error) {
      console.log(error);
    }
  }

  async getBalanceAnual(req, res) {
    
    try {
      const balance = await movimientoModel.getBalanceAnual(null);
      const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=Balance anual.pdf",
      });

      buildPDF(
        balance,
        "Balance anual",
        (data) => stream.write(data),
        () => stream.end()
      );
    } catch (error) {
      console.log(error);
    }
  }

  async getBalanceUltimos30DiasPorDisciplina(req, res) {
    const { disciplina } = req.params
    try {
      const balance = await movimientoModel.getBalanceUltimos30Dias(disciplina);
      const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          "attachment; filename=Balance ultimos 30 dias.pdf",
      });

      buildPDF(
        balance,
        `Balance 30 dias ${disciplina}`,
        (data) => stream.write(data),
        () => stream.end()
      );
    } catch (error) {
      console.log(error);
    }
  }

  async getBalanceUltimos90DiasPorDisciplina(req, res) {
    const { disciplina } = req.params
    try {
      const balance = await movimientoModel.getBalanceUltimos90Dias(disciplina);
      const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          "attachment; filename=Balance ultimos 90 dias.pdf",
      });

      buildPDF(
        balance,
        `Balance 90 dias ${disciplina}`,
        (data) => stream.write(data),
        () => stream.end()
      );
    } catch (error) {
      console.log(error);
    }
  }

  async getBalanceAnualPorDisciplina(req, res) {
    const { disciplina } = req.params
    try {
      const balance = await movimientoModel.getBalanceAnual(disciplina);
      const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=Balance anual.pdf",
      });

      buildPDF(
        balance,
        `Balance anual ${disciplina}`,
        (data) => stream.write(data),
        () => stream.end()
      );
    } catch (error) {
      console.log(error);
    }
  }

  async getBalancePersonalizado(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.body;
  
      // Validar que las fechas estén presentes
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Las fechas de inicio y fin son requeridas' });
      }
  
      // Obtener el balance personalizado
      const balance = await movimientoModel.getBalancePersonalizado(null, fechaInicio, fechaFin);
  
      const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Balance personalizado.pdf`,
      });
  
      // Generar el PDF del balance
      buildPDF(
        balance,
        `Balance personalizado desde ${fechaInicio} hasta ${fechaFin}`,
        (data) => stream.write(data),
        () => stream.end()
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Ocurrió un error al generar el balance' });
    }
  }

  async getBalancePersonalizadoPorDisciplina(req, res) {
    try {
      const {disciplina}=req.params
      const { fechaInicio, fechaFin } = req.body;
  
      // Validar que las fechas estén presentes
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Las fechas de inicio y fin son requeridas' });
      }
  
      // Obtener el balance personalizado
      const balance = await movimientoModel.getBalancePersonalizado(disciplina, fechaInicio, fechaFin);
  
      const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Balance personalizado.pdf`,
      });
  
      // Generar el PDF del balance
      buildPDF(
        balance,
        `Balance personalizado de ${disciplina} desde ${fechaInicio} hasta ${fechaFin}`,
        (data) => stream.write(data),
        () => stream.end()
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Ocurrió un error al generar el balance' });
    }
  }
}

// Exportamos la clase MovimientoController
module.exports = MovimientoController;
