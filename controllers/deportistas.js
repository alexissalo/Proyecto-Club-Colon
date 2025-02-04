// Importamos el modelo de disciplina
const modelDisciplina = require("../models/disciplina");
const disciplinaModel = new modelDisciplina();
const modelDeportista = require("../models/deportistas");
const deportistaModel = new modelDeportista();
const { encrypt, decrypt } = require("../middlewares/encriptacion");
const moment = require("moment");

// Definimos la clase DeportistasController
class DeportistasController {
  // Método para mostrar la lista de deportistas
  mostrarDeportistasPorDisciplina(req, res) {
    // Obtenemos la página y el número de filas por página desde la query
    const { disciplina } = req.params;
    const pagina = parseInt(req.query.pagina) || 1;
    const filasPorPagina = parseInt(req.query.filasPorPagina) || 5;
    const buscar = req.query.buscar || "";

    deportistaModel.getTotalDeportistasPorDisciplina(
      buscar,
      disciplina,
      (totalDeportistaData) => {
        // Llamamos al método listarDisciplinas del modelo de disciplina
        deportistaModel.listarDeportistas(
          pagina,
          filasPorPagina,
          buscar,
          disciplina,
          (deportistaData) => {
            if (!deportistaData) {
              return res
                .status(500)
                .send("Error al obtener los datos de los deportistas");
            }

            deportistaData = deportistaData.map((deportista) => {
              return {
                ...deportista,
                domicilio: deportista.domicilio
                  ? decrypt(deportista.domicilio)
                  : null,
                localidad: deportista.localidad
                  ? decrypt(deportista.localidad)
                  : null,
                escolaridad: deportista.escolaridad
                  ? decrypt(deportista.escolaridad)
                  : null,
                email: deportista.email ? decrypt(deportista.email) : null,
                instagram: deportista.instagram
                  ? decrypt(deportista.instagram)
                  : null,
                facebook: deportista.facebook
                  ? decrypt(deportista.facebook)
                  : null,
                telefonoJugador: deportista.telefonoJugador
                  ? decrypt(deportista.telefonoJugador)
                  : null,
                telefonoEmergencia: deportista.telefonoEmergencia
                  ? decrypt(deportista.telefonoEmergencia)
                  : null,
                tutorNombre: deportista.tutorNombre
                  ? decrypt(deportista.tutorNombre)
                  : null,
                domicilioTutor: deportista.domicilioTutor
                  ? decrypt(deportista.domicilioTutor)
                  : null,
                telefonoTutor: deportista.telefonoTutor
                  ? decrypt(deportista.telefonoTutor)
                  : null,
                telefonoFijoTutor: deportista.telefonoFijoTutor
                  ? decrypt(deportista.telefonoFijoTutor)
                  : null,
                facebookTutor: deportista.facebookTutor
                  ? decrypt(deportista.facebookTutor)
                  : null,
                instagramTutor: deportista.instagramTutor
                  ? decrypt(deportista.instagramTutor)
                  : null,
                emailResponsable: deportista.emailResponsable
                  ? decrypt(deportista.emailResponsable)
                  : null,
                coberturaMedica: deportista.coberturaMedica
                  ? decrypt(deportista.coberturaMedica)
                  : null,
                numeroAfiliado: deportista.numeroAfiliado
                  ? decrypt(deportista.numeroAfiliado)
                  : null,
                lesiones: deportista.lesiones
                  ? decrypt(deportista.lesiones)
                  : null,
                alergias: deportista.alergias
                  ? decrypt(deportista.alergias)
                  : null,
                patologias: deportista.patologias
                  ? decrypt(deportista.patologias)
                  : null,
                tratamientos: deportista.tratamientos
                  ? decrypt(deportista.tratamientos)
                  : null,
              };
            });
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
                disciplina: disciplina,
                pagina: pagina,
                filasPorPagina: filasPorPagina,
                totalDeportistas: totalDeportistaData,
                buscar: buscar, // Enviar el término de búsqueda a la vista
              });
            });
          }
        );
      }
    );
  }

  mostrarCargaDeportista(req, res) {
    const { disciplina } = req.params;

    deportistaModel.selectCuotasDeportista(disciplina, (cuotasDeportistas) => {
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
        res.render("dashboard/cargarDeportista", {
          rolId: rolId,
          rolNombre: rolNombre,
          disciplinas: disciplinaData,
          disciplina: disciplina,
          tiposdecuotas: cuotasDeportistas,
        });
      });
    });
  }

  mostrarEdicionDeportista(req, res) {
    const { disciplina, id } = req.params;

    deportistaModel.selectCuotasDeportista(disciplina, (cuotasDeportista) => {
      // Llamamos al método listarDisciplinas del modelo de disciplina
      disciplinaModel.listarDisciplinas((disciplinaData) => {
        deportistaModel.getDeportistaById(id, (deportistaData) => {
          // Verificamos si hubo un error al obtener los datos
          if (disciplinaData === null) {
            return res
              .status(500)
              .send("Error al obtener los datos de los socios");
          }

          deportistaData = {
            ...deportistaData,
            domicilio: deportistaData.domicilio
              ? decrypt(deportistaData.domicilio)
              : null,
            localidad: deportistaData.localidad
              ? decrypt(deportistaData.localidad)
              : null,
            escolaridad: deportistaData.escolaridad
              ? decrypt(deportistaData.escolaridad)
              : null,
            email: deportistaData.email ? decrypt(deportistaData.email) : null,
            instagram: deportistaData.instagram
              ? decrypt(deportistaData.instagram)
              : null,
            facebook: deportistaData.facebook
              ? decrypt(deportistaData.facebook)
              : null,
            telefonoJugador: deportistaData.telefonoJugador
              ? decrypt(deportistaData.telefonoJugador)
              : null,
            telefonoEmergencia: deportistaData.telefonoEmergencia
              ? decrypt(deportistaData.telefonoEmergencia)
              : null,
            tutorNombre: deportistaData.tutorNombre
              ? decrypt(deportistaData.tutorNombre)
              : null,
            domicilioTutor: deportistaData.domicilioTutor
              ? decrypt(deportistaData.domicilioTutor)
              : null,
            localidadTutor: deportistaData.localidadTutor
              ? decrypt(deportistaData.localidadTutor)
              : null,
            telefonoTutor: deportistaData.telefonoJugador
              ? decrypt(deportistaData.telefonoJugador)
              : null,
            telefonoFijoTutor: deportistaData.telefonoFijoTutor
              ? decrypt(deportistaData.telefonoFijoTutor)
              : null,
            facebookTutor: deportistaData.facebookTutor
              ? decrypt(deportistaData.facebookTutor)
              : null,
            instagramTutor: deportistaData.instagramTutor
              ? decrypt(deportistaData.instagramTutor)
              : null,
            emailResponsable: deportistaData.emailResponsable
              ? decrypt(deportistaData.emailResponsable)
              : null,
            coberturaMedica: deportistaData.coberturaMedica
              ? decrypt(deportistaData.coberturaMedica)
              : null,
            numeroAfiliado: deportistaData.numeroAfiliado
              ? decrypt(deportistaData.numeroAfiliado)
              : null,
            lesiones: deportistaData.lesiones
              ? decrypt(deportistaData.lesiones)
              : null,
            alergias: deportistaData.alergias
              ? decrypt(deportistaData.alergias)
              : null,
            patologias: deportistaData.patologias
              ? decrypt(deportistaData.patologias)
              : null,
            tratamientos: deportistaData.tratamientos
              ? decrypt(deportistaData.tratamientos)
              : null,
          };

          // Obtenemos el rol ID y nombre del request
          const rolId = req.rolId;
          const rolNombre = req.rolNombre;

          // Renderizamos la vista "dashboard/deportistas" con los datos obtenidos
          res.render("dashboard/editarDeportista", {
            rolId: rolId,
            rolNombre: rolNombre,
            disciplinas: disciplinaData,
            disciplina: disciplina,
            deportista: deportistaData,
            idDeportista: deportistaData.id,
            tiposdecuotas: cuotasDeportista,
          });
        });
      });
    });
  }

  cargarDeportista(req, res) {
    let datos = req.body;
    const { disciplina } = req.params;

    const datosCifrados = {
      nombre: datos.nombre,
      dni: datos.dni,
      fechaNacimiento: datos.fechaNacimiento,
      domicilio: encrypt(datos.domicilio),
      localidad: encrypt(datos.localidad),
      escolaridad: encrypt(datos.escolaridad),
      gradoEscolar: datos.gradoEscolar,
      categoria: datos.categoria,
      posicionJuego: datos.posicionJuego,
      altura: datos.altura,
      peso: datos.peso,
      talleCalzado: datos.talleCalzado,
      talleCamiseta: datos.talleCamiseta,
      tallePantalon: datos.tallePantalon,
      email: encrypt(datos.email),
      instagram: encrypt(datos.instagram),
      facebook: encrypt(datos.facebook),
      telefonoJugador: encrypt(datos.telefonoJugador),
      telefonoEmergencia: encrypt(datos.telefonoEmergencia),
      tutorNombre: encrypt(datos.tutorNombre),
      domicilioTutor: encrypt(datos.domicilioTutor),
      localidadTutor: encrypt(datos.localidadTutor),
      telefonoTutor: encrypt(datos.telefonoJugador),
      telefonoFijoTutor: encrypt(datos.telefonoFijoTutor),
      facebookTutor: encrypt(datos.facebookTutor),
      instagramTutor: encrypt(datos.instagramTutor),
      emailResponsable: encrypt(datos.emailResponsable),
      grupoSanguineo: datos.grupoSanguineo,
      factor: datos.factor,
      coberturaMedica: encrypt(datos.coberturaMedica),
      numeroAfiliado: encrypt(datos.numeroAfiliado),
      lesiones: encrypt(datos.lesiones),
      alergias: encrypt(datos.alergias),
      patologias: encrypt(datos.patologias),
      tratamientos: encrypt(datos.tratamientos),
      tipodecuota: datos.tipodecuota,
    };

    deportistaModel.insertDeportista(
      datosCifrados,
      disciplina,
      (deportistaData) => {
        if (deportistaData == null) {
          return res.status(500).json({
            message: "Error del servidor al cargar el deportista",
            ok: false,
          });
        }

        res
          .status(200)
          .json({ message: "Deportista creado con éxito", ok: true });
      }
    );
  }

  borrarDeportista(req, res) {
    const { id } = req.params;

    deportistaModel.deleteDeportista(id, (deportistaData) => {
      if (deportistaData == null) {
        return res.status(500).json({
          message: "Error del servidor al borrar el deportista",
          ok: false,
        });
      }

      res
        .status(200)
        .json({ message: "Deportista borrado con exito", ok: true });
    });
  }

  editarDeportista(req, res) {
    const { id } = req.params;
    let datos = req.body;

    const datosCifrados = {
      nombre: datos.nombre,
      dni: datos.dni,
      fechaNacimiento: datos.fechaNacimiento,
      domicilio: encrypt(datos.domicilio),
      localidad: encrypt(datos.localidad),
      escolaridad: encrypt(datos.escolaridad),
      gradoEscolar: datos.gradoEscolar,
      categoria: datos.categoria,
      posicionJuego: datos.posicionJuego,
      altura: datos.altura,
      peso: datos.peso,
      talleCalzado: datos.talleCalzado,
      talleCamiseta: datos.talleCamiseta,
      tallePantalon: datos.tallePantalon,
      email: encrypt(datos.email),
      instagram: encrypt(datos.instagram),
      facebook: encrypt(datos.facebook),
      telefonoJugador: encrypt(datos.telefonoJugador),
      telefonoEmergencia: encrypt(datos.telefonoEmergencia),
      tutorNombre: encrypt(datos.tutorNombre),
      domicilioTutor: encrypt(datos.domicilioTutor),
      localidadTutor: encrypt(datos.localidadTutor),
      telefonoTutor: encrypt(datos.telefonoJugador),
      telefonoFijoTutor: encrypt(datos.telefonoFijoTutor),
      facebookTutor: encrypt(datos.facebookTutor),
      instagramTutor: encrypt(datos.instagramTutor),
      emailResponsable: encrypt(datos.emailResponsable),
      grupoSanguineo: datos.grupoSanguineo,
      factor: datos.factor,
      coberturaMedica: encrypt(datos.coberturaMedica),
      numeroAfiliado: encrypt(datos.numeroAfiliado),
      lesiones: encrypt(datos.lesiones),
      alergias: encrypt(datos.alergias),
      patologias: encrypt(datos.patologias),
      tratamientos: encrypt(datos.tratamientos),
      tipodecuota: datos.tipodecuota,
    };

    deportistaModel.updateDeportista(id, datosCifrados, (deportistaData) => {
      if (deportistaData == null) {
        return res.status(500).json({
          message: "Error del servidor al actualizar el deportista",
          ok: false,
        });
      }

      res
        .status(200)
        .json({ message: "Deportista actualizado con exito", ok: true });
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

    deportistaModel.insertPago(null, monto, metodoPago, facturas, (result) => {
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

  traerPagosPorDeportista(req, res) {
    const { id } = req.params;

    deportistaModel.getPagosPorDeportista(id, (deportistaData) => {
      if (deportistaData == null) {
        return res.status(500).json({
          message: "Error del servidor al traer los pagos",
          ok: false,
        });
      }

      res.status(200).json({
        message: "Pagos traidos con exito",
        ok: true,
        data: deportistaData,
      });
    });
  }

  mostrarPagosDeportista = (req, res) => {
    const id_deportista = req.params.id;
    const { disciplina } = req.params;

    disciplinaModel.listarDisciplinas((disciplinaData) => {
      deportistaModel.getDeportistaById(id_deportista, (deportistaResult) => {
        if (deportistaResult == null)
          return res.status(500).send("Error en el servidor");
        if (deportistaResult.length === 0)
          return res.status(404).send("Deportista no encontrado");

        // Obtener las facturas pendientes
        deportistaModel.getFacturasById(id_deportista, (facturasResult) => {
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
          res.render("dashboard/pagosDeportistas", {
            disciplinas: disciplinaData,
            disciplina: disciplina,
            rolId: req.rolId,
            rolNombre: req.rolNombre,
            deportista: deportistaResult,
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
    const id_deportista = req.params.id;

    deportistaModel.getFacturasById(id_deportista, (facturasResult) => {
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

  listarDeudoresMesDeportistas = (req, res) => {
    const { fecha, disciplina } = req.params; // Mes y año recibido en formato YYYY-MM

    disciplinaModel.listarDisciplinas((disciplinaData) => {
      deportistaModel.listarDeportistasParaDeuda(
        disciplina,
        (deportistasResult) => {
          if (deportistasResult == null)
            return res.status(500).send("Error en el servidor");
          if (deportistasResult.length === 0)
            return res.status(404).send("No hay deportistas registrados");

          // Lista de todos los deportistas
          const deportistas = deportistasResult.map((deportista) => {
            return {
              ...deportista,
              direccion: deportista.direccion
                ? decrypt(deportista.direccion)
                : "",
              localidad: deportista.localidad
                ? decrypt(deportista.localidad)
                : "",
              email: deportista.email ? decrypt(deportista.email) : "",
              telefonoJugador: deportista.telefonoJugador
                ? decrypt(deportista.telefonoJugador)
                : "",
              telefonoEmergencia: deportista.telefonoEmergencia
                ? decrypt(deportista.telefonoEmergencia)
                : "",
            };
          });

          // Obtener la lista de pagos del mes
          deportistaModel.getFacturasPendientesDelMes(fecha, (facturasResult) => {
            if (facturasResult == null) {
              return res.status(500).send("Error en el servidor");
            }

            // Filtrar socios que tienen facturas impagas en el mes solicitado
            const deudores = deportistas.filter((deportista) => {
              facturasResult.filter(
                (factura) =>
                  factura.id_deportista === deportista.id &&
                  factura.estado === "pendiente" // Consideramos solo facturas impagas
              );
            });

            // Obtenemos el rol del usuario
            const rolId = req.rolId;
            const rolNombre = req.rolNombre;

            // Renderizar la vista de deudores
            res.render("dashboard/listaDeportistasDeudores", {
              rolId: rolId,
              rolNombre: rolNombre,
              disciplinas: disciplinaData,
              deudores,
              fecha,
              disciplina: disciplina,
            });
          });
        }
      );
    });
  };

  mostrarCuotasDeportistas(req, res) {
    // Obtenemos la página y el número de filas por página desde la query
    const { disciplina } = req.params;

    deportistaModel.selectCuotasDeportista(disciplina, (deportistaData) => {
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
        res.render("dashboard/cuotasDeportistas", {
          rolId: rolId,
          rolNombre: rolNombre,
          disciplinas: disciplinaData,
          disciplina: disciplina,
          data: deportistaData,
        });
      });
    });
  }

  crearCuotaDeportista(req, res) {
    const { disciplina } = req.params;
    const { nombre, valordecuota } = req.body;

    if (!nombre || !valordecuota) {
      return res.status(500).json({
        message: "Falta completar campos obligatorios",
        ok: false,
      });
    }

    deportistaModel.insertCuotaDeportista(
      nombre,
      valordecuota,
      disciplina,
      (cuotaDeportistaData) => {
        if (cuotaDeportistaData == null) {
          return res.status(500).json({
            message: "Error del servidor al crear la cuota de deportistas",
            ok: false,
          });
        }

        res
          .status(200)
          .json({ message: "Cuota de deportista creada con exito", ok: true });
      }
    );
  }

  editarCuotaDeportista(req, res) {
    const { id } = req.params;
    const { nombre, valordecuota } = req.body;

    if (!nombre || !valordecuota) {
      return res.status(500).json({
        message: "Falta completar campos obligatorios",
        ok: false,
      });
    }

    deportistaModel.updateCuotaDeportista(
      id,
      nombre,
      valordecuota,
      (cuotaDeportistaData) => {
        if (cuotaDeportistaData == null) {
          return res.status(500).json({
            message: "Error del servidor al actualizar la cuota de deportista",
            ok: false,
          });
        }

        res.status(200).json({
          message: "Cuota de deportista actualizada con exito",
          ok: true,
        });
      }
    );
  }

  borrarCuotaDeportista(req, res) {
    const { id } = req.params;

    deportistaModel.deleteCuotaDeportista(id, (cuotaDeportistaData) => {
      if (cuotaDeportistaData == null) {
        return res.status(500).json({
          message: "Error del servidor al borrar la cuota de deportista",
          ok: false,
        });
      }

      res
        .status(200)
        .json({ message: "Cuota de deportista borrada con exito", ok: true });
    });
  }
}

// Exportamos la clase DeportistasController
module.exports = DeportistasController;
