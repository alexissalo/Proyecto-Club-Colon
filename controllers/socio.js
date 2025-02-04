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

  // mostrarEscanerSocios(req, res) {
  //   disciplinaModel.listarDisciplinas((disciplinaData) => {
  //     // Obtenemos el rol del usuario
  //     const rolId = req.rolId;
  //     const rolNombre = req.rolNombre;

  //     // Renderizamos la vista de socios con los datos obtenidos
  //     res.render("dashboard/escaner", {
  //       rolId: rolId,
  //       rolNombre: rolNombre,
  //       disciplinas: disciplinaData,
  //     });
  //   });
  // }

  crearSocio(req, res) {
    const {
      nombre,
      telefono,
      domicilio,
      dni,
      fechaNacimiento,
      fechaInscripcion,
      email,
      deporte,
      tipodesocio,
    } = req.body;

    // Validar campos obligatorios
    if (!nombre || !telefono || !domicilio || !dni || !fechaNacimiento) {
      return res.status(400).json({
        message: "Falta completar campos obligatorios",
        ok: false,
      });
    }

    socioModel.insertSocio(
      nombre,
      dni,
      telefono,
      fechaNacimiento,
      fechaInscripcion,
      domicilio,
      email,
      deporte,
      tipodesocio,
      (error, socioData) => {
        if (error) {
          // Manejar errores específicos
          if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              message: "El DNI ingresado ya está registrado.",
              ok: false,
            });
          }

          // Manejar otros errores
          return res.status(500).json({
            message: "Error del servidor al crear el socio.",
            ok: false,
            error: error.message, // Para depuración
          });
        }

        // Si no hubo errores, responde con éxito
        res.status(201).json({
          message: "Socio creado con éxito.",
          ok: true,
          data: socioData,
        });
      }
    );
  }

  darDeBajaSocio(req, res) {
    const { id } = req.params;

    socioModel.darDeBajaSocio(id, (data) => {
      if (data == null) {
        return res.status(500).json({
          message: "Error del servidor al dar de baja al socio",
          ok: false,
        });
      }

      if (data.affectedRows === 0) {
        return res.status(500).json({
          message: "Socio no encontrado",
          ok: false,
        });
      }

      res.status(200).json({
        message: "El socio fue dado de baja con exito",
        ok: true,
      });
    });
  }

  darDeAltaSocio(req, res) {
    const { id } = req.params;

    socioModel.darDeAltaSocio(id, (data) => {
      if (data == null) {
        return res.status(500).json({
          message: "Error del servidor al dar de alta al socio",
          ok: false,
        });
      }

      if (data.affectedRows === 0) {
        return res.status(500).json({
          message: "Socio no encontrado",
          ok: false,
        });
      }

      res.status(200).json({
        message: "El socio fue dado de alta con exito",
        ok: true,
      });
    });
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
    const { monto, metodoPago, facturas } = req.body;

    if (!monto || !metodoPago || !facturas || !facturas.length) {
      return res.status(400).json({
        message: "Faltan campos obligatorios o no se seleccionaron facturas",
        ok: false,
      });
    }

    socioModel.insertPago(null, monto, metodoPago, facturas, (result) => {
      if (!result) {
        return res.status(500).json({
          message: "Error del servidor al procesar el pago",
          ok: false,
        });
      }

      res.status(200).json({
        message: "Pago creado y facturas asociadas con éxito",
        ok: true,
        idPago: result.idPago,
      });
    });
  }

  mostrarPagosSocio = (req, res) => {
    const id_socio = req.params.id;

    disciplinaModel.listarDisciplinas((disciplinaData) => {
      socioModel.getSocioById(id_socio, (socioResult) => {
        if (socioResult == null)
          return res.status(500).send("Error en el servidor");
        if (socioResult.length === 0)
          return res.status(404).send("Socio no encontrado");

        const socio = socioResult[0];

        // Obtener las facturas pendientes
        socioModel.getFacturasById(id_socio, (facturasResult) => {
          if (facturasResult == null)
            return res.status(500).send("Error en el servidor");

          // Separar las facturas en pendientes y pagadas
          const facturasPendientes = facturasResult.filter(
            (factura) => factura.estado === "pendiente"
          );
          const facturasPagadas = facturasResult.filter(
            (factura) => factura.estado === "pagado"
          );

          // Calcular el total pendiente
          const totalPendiente = facturasPendientes.reduce(
            (total, factura) => total + parseFloat(factura.monto),
            0
          );

          // Renderizar la vista con las facturas
          res.render("dashboard/pagosSocios", {
            disciplinas: disciplinaData,
            rolId: req.rolId,
            rolNombre: req.rolNombre,
            socio,
            facturasPendientes,
            facturasPagadas,
            facturas: facturasResult,
            totalPendiente: totalPendiente.toFixed(2),
          });
        });
      });
    });
  };

  listarFacturasImpagas(req, res) {
    const id_socio = req.params.id;

    socioModel.getFacturasById(id_socio, (facturasResult) => {
      if (facturasResult == null) {
        return res.status(500).json({
          message: "Error del servidor a listar las facturas",
          ok: false,
        });
      }
      // Separar las facturas en pendientes y pagadas
      const facturasPendientes = facturasResult.filter(
        (factura) => factura.estado === "pendiente"
      );

      res.json({ data: facturasPendientes, ok: true });
    });
  }

  listarDeudoresMes(req, res) {
    const { fecha } = req.params; // Mes y año recibido en formato YYYY-MM

    disciplinaModel.listarDisciplinas((disciplinaData) => {
      socioModel.listarSociosParaDeuda((sociosResult) => {
        if (sociosResult == null) {
          return res.status(500).send("Error en el servidor");
        }
        if (sociosResult.length === 0) {
          return res.status(404).send("No hay socios registrados");
        }

        // Lista de todos los socios
        const socios = sociosResult;

        socioModel.getFacturasPendientesDelMes(fecha, (facturasResult) => {
          if (facturasResult == null) {
            return res.status(500).send("Error en el servidor");
          }

          // Filtrar socios que tienen facturas impagas en el mes solicitado
          const deudores = socios.filter((socio) => {
            const facturasSocio = facturasResult.filter(
              (factura) =>
                factura.id_socio === socio.id && factura.estado === "pendiente" // Consideramos solo facturas impagas
            );

            const fechaInscripcion = moment(
              socio.fechaInscripcion,
              "YYYY-MM-DD"
            );
            const mesConsulta = moment(fecha, "YYYY-MM");

            // Verificar si el socio está inscrito antes del mes consultado y tiene facturas impagas
            return (
              fechaInscripcion.isSameOrBefore(mesConsulta, "month") &&
              facturasSocio.length > 0
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
  }

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
        .json({ message: "Tipo de socio creado con éxito", ok: true });
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

        res.status(200).json({
          message: "Tipo de socio actualizado con éxito",
          ok: true,
        });
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

  getSocioById(req, res) {
    const { id } = req.params;

    socioModel.getSocioById(id, (socioData) => {
      if (socioData == null)
        return res
          .status(500)
          .json({ message: "Error en el servidor", ok: false });
      if (socioData.length === 0)
        return res
          .status(404)
          .json({ message: "Socio no encontrado", ok: false });

      const socio = socioData[0];
      res.json({ data: socio, ok: true });
    });
  }
}

// Exportamos la clase SocioController
module.exports = SocioController;
