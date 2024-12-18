// Importamos los modelos de socio y disciplina
const modelSocio = require("../models/socio");
const socioModel = new modelSocio();
const modelDisciplina = require("../models/disciplina");
const disciplinaModel = new modelDisciplina();
const { generarTicketPago } = require("../middlewares/generarPdf");
const moment = require("moment");

// Creamos la clase SocioController
class SocioController {
  // Método para listar los socios
  listarSocios(req, res) {
    // Obtenemos la página y el número de filas por página desde la query
    const pagina = parseInt(req.query.pagina) || 1;
    const filasPorPagina = parseInt(req.query.filasPorPagina) || 5;
    const buscar = req.query.buscar || "";

    // Consulta para contar el número total de registros
    socioModel.getTotalSocios(buscar, (totalSocios) => {
      // Consulta para obtener los socios paginados
      socioModel.getSocios(pagina, filasPorPagina, buscar, (sociosData) => {
        // Consulta para obtener las disciplinas
        disciplinaModel.listarDisciplinas((disciplinaData) => {
          socioModel.getTiposDeSocios((tiposDeSociosData) => {
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
              buscar: buscar, // Enviar el término de búsqueda a la vista
              tiposdesocios: tiposDeSociosData,
            });
          });
        });
      });
    });
  }

  listarTiposDeSocios(req, res) {
    socioModel.getTiposDeSocios((sociosData) => {
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
        res.render("dashboard/tiposdesocios", {
          tiposdesocios: sociosData,
          rolId: rolId,
          rolNombre: rolNombre,
          disciplinas: disciplinaData,
        });
      });
    });
  }

  crearSocio(req, res) {
    const {
      nombre,
      telefono,
      domicilio,
      dni,
      fechaNacimiento,
      email,
      deporte,
      tipodesocio,
    } = req.body;

    if (!nombre || !telefono || !domicilio || !dni || !fechaNacimiento) {
      return res.status(500).json({
        message: "Falta completar campos obligatorios",
        ok: false,
      });
    }

    socioModel.insertSocio(
      nombre,
      dni,
      telefono,
      fechaNacimiento,
      domicilio,
      email,
      deporte,
      tipodesocio,
      (socioData) => {
        if (socioData == null) {
          return res.status(500).json({
            message: "Error del servidor al crear el socio",
            ok: false,
          });
        }

        res.status(200).json({ message: "Socio creado con exito", ok: true });
      }
    );
  }

  actualizarSocio(req, res) {
    const { id } = req.params;
    const { nombre, telefono, domicilio, tipodesocio, deporte, email } =
      req.body;

    if (!nombre || !telefono || !domicilio) {
      return res.status(500).json({
        message: "Falta completar campos obligatorios",
        ok: false,
      });
    }

    socioModel.updateSocio(
      id,
      nombre,
      telefono,
      domicilio,
      email,
      tipodesocio,
      deporte,
      (socioData) => {
        if (socioData == null) {
          return res.status(500).json({
            message: "Error del servidor al actualizar los datos de los socios",
            ok: false,
          });
        }
        res.status(200).json({
          message: "Los datos del socio fueron actualizados con exito",
          ok: true,
        });
      }
    );
  }

  borrarSocio(req, res) {
    const { id } = req.params;

    socioModel.deleteSocio(id, (socioData) => {
      if (socioData == null) {
        return res.status(500).json({
          message: "Error del servidor al borrar el socio",
          ok: false,
        });
      }

      res.status(200).json({ message: "Socio borrado con exito", ok: true });
    });
  }

  crearPago(req, res) {
    const { id_socio, valor, fechaPago } = req.body;

    if (!id_socio || !valor || !fechaPago) {
      return res.status(500).json({
        message: "Falta completar campos obligatorios",
        ok: false,
      });
    }

    socioModel.insertPago(id_socio, valor, fechaPago, (socioData) => {
      if (socioData == null) {
        return res
          .status(500)
          .json({ message: "Error del servidor al crear el pago", ok: false });
      }

      res.status(200).json({
        message: "Pago creado con exito",
        ok: true,
        idPago: socioData.insertId,
      });
    });
  }

  mostrarPagosSocio = (req, res) => {
    const id_socio = req.params.id;

    disciplinaModel.listarDisciplinas((disciplinaData) => {
      // 1. Obtener información del socio
      socioModel.getSocioById(id_socio, (socioResult) => {
        if (socioResult == null)
          return res.status(500).send("Error en el servidor");
        if (socioResult.length === 0)
          return res.status(404).send("Socio no encontrado");

        const socio = socioResult[0];
        const fechaInscripcion = moment(socio.fechaInscripcion);

        // 2. Obtener pagos realizados por el socio
        socioModel.getPagosById(id_socio, (pagosResult) => {
          if (pagosResult == null)
            return res.status(500).send("Error en el servidor");

          const pagos = pagosResult;
          const cuotas = [];
          const cuotasPagadas = pagos.map((pago) =>
            moment(pago.fecha, "DD-MM-YYYY").format("YYYY-MM")
          );

          // 3. Calcular cuotas mensuales desde la fecha de inscripción hasta hoy
          let fechaActual = moment();
          let fechaIterativa = moment(fechaInscripcion);

          while (
            fechaIterativa.isBefore(fechaActual, "month") ||
            fechaIterativa.isSame(fechaActual, "month")
          ) {
            const mes = fechaIterativa.format("YYYY-MM");
            const pagado = cuotasPagadas.includes(mes);

            cuotas.push({
              mes,
              estado: pagado ? "Pagado" : "Pendiente",
            });

            // Avanzar al siguiente mes
            fechaIterativa.add(1, "month");
          }

          // Obtenemos el rol del usuario
          const rolId = req.rolId;
          const rolNombre = req.rolNombre;

          // 4. Renderizar vista con datos
          res.render("dashboard/pagosSocios", {
            disciplinas: disciplinaData,
            rolId: rolId,
            rolNombre: rolNombre,
            socio,
            pagos,
            cuotas,
          });
        });
      });
    });
  };

  listarDeudoresMes = (req, res) => {
    const { fecha } = req.params; // Mes y año recibido en formato YYYY-MM

    disciplinaModel.listarDisciplinas((disciplinaData) => {
      socioModel.listarSociosParaDeuda((sociosResult) => {
        if (sociosResult == null)
          return res.status(500).send("Error en el servidor");
        if (sociosResult.length === 0)
          return res.status(404).send("No hay socios registrados");

        // Lista de todos los socios
        const socios = sociosResult;

        socioModel.getPagosDelMes(fecha, (pagosResult) => {
          if (pagosResult == null)
            return res.status(500).send("Error en el servidor");

          // Obtenemos IDs de socios que ya pagaron este mes
          const idsPagados = pagosResult.map((pago) => pago.id_socio);

          // Filtrar socios que no han pagado este mes y cuya inscripción sea anterior al mes solicitado
          const deudores = socios.filter((socio) => {
            const fechaInscripcion = moment(
              socio.fechaInscripcion,
              "YYYY-MM-DD"
            );
            const mesConsulta = moment(fecha, "YYYY-MM");

            // Verificar si el socio está inscrito antes del mes consultado y no ha pagado
            return (
              fechaInscripcion.isSameOrBefore(mesConsulta, "month") &&
              !idsPagados.includes(socio.id)
            );
          });

          // Obtenemos el rol del usuario
          const rolId = req.rolId;
          const rolNombre = req.rolNombre;

          // Renderizar la vista de deudores
          res.render("dashboard/listaSociosDeudores", {
            rolId: rolId,
            rolNombre: rolNombre,
            disciplinas: disciplinaData,
            deudores,
            fecha,
          });
        });
      });
    });
  };

  crearTipoDeSocio(req, res) {
    const { nombre, valordecuota } = req.body;

    if (!nombre || !valordecuota) {
      return res.status(500).json({
        message: "Falta completar campos obligatorios",
        ok: false,
      });
    }

    socioModel.insertTipoDeSocio(nombre, valordecuota, (tiposDeSocioData) => {
      if (tiposDeSocioData == null) {
        return res.status(500).json({
          message: "Error del servidor al crear el tipo de socio",
          ok: false,
        });
      }

      res
        .status(200)
        .json({ message: "Tipo de socio creado con exito", ok: true });
    });
  }

  editarTipoDeSocio(req, res) {
    const { id } = req.params;
    const { nombre, valordecuota } = req.body;

    if (!nombre || !valordecuota) {
      return res.status(500).json({
        message: "Falta completar campos obligatorios",
        ok: false,
      });
    }

    socioModel.updateTipoDeSocio(
      id,
      nombre,
      valordecuota,
      (tiposDeSocioData) => {
        if (tiposDeSocioData == null) {
          return res.status(500).json({
            message: "Error del servidor al actualizar el tipo de socio",
            ok: false,
          });
        }

        res
          .status(200)
          .json({ message: "Tipo de socio actualizado con exito", ok: true });
      }
    );
  }

  borrarTipoDeSocio(req, res) {
    const { id } = req.params;

    socioModel.deleteTipoDeSocio(id, (tiposDeSocioData) => {
      if (tiposDeSocioData == null) {
        return res.status(500).json({
          message: "Error del servidor al borrar el tipo de socio",
          ok: false,
        });
      }

      res
        .status(200)
        .json({ message: "Tipo de socio borrado con exito", ok: true });
    });
  }
}

// Exportamos la clase SocioController
module.exports = SocioController;
