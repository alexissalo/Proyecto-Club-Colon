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
        disciplina: disciplina,
      });
    });
  }

  mostrarEdicionDeportista(req, res) {
    const { disciplina, id } = req.params;
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
          domicilio: decrypt(deportistaData.domicilio),
          localidad: decrypt(deportistaData.localidad),
          escolaridad: decrypt(deportistaData.escolaridad),
          email: decrypt(deportistaData.email),
          instagram: decrypt(deportistaData.instagram),
          facebook: decrypt(deportistaData.facebook),
          telefonoJugador: decrypt(deportistaData.telefonoJugador),
          telefonoEmergencia: decrypt(deportistaData.telefonoEmergencia),
          tutorNombre: decrypt(deportistaData.tutorNombre),
          domicilioTutor: decrypt(deportistaData.domicilioTutor),
          localidadTutor: decrypt(deportistaData.localidadTutor),
          telefonoTutor: decrypt(deportistaData.telefonoJugador),
          telefonoFijoTutor: decrypt(deportistaData.telefonoFijoTutor),
          facebookTutor: decrypt(deportistaData.facebookTutor),
          instagramTutor: decrypt(deportistaData.instagramTutor),
          emailResponsable: decrypt(deportistaData.emailResponsable),
          coberturaMedica: decrypt(deportistaData.coberturaMedica),
          numeroAfiliado: decrypt(deportistaData.numeroAfiliado),
          lesiones: decrypt(deportistaData.lesiones),
          alergias: decrypt(deportistaData.alergias),
          patologias: decrypt(deportistaData.patologias),
          tratamientos: decrypt(deportistaData.tratamientos),
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
        });
      });
    });
  }

  cargarDeportista(req, res) {
    let datos = req.body;
    const { disciplina } = req.params;

    const datosCifrados = {
      nombre: datos.nombre,
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
    const { id_deportista, valor, fechaPago } = req.body;

    if (!id_deportista || !valor || !fechaPago) {
      return res.status(500).json({
        message: "Falta completar campos obligatorios",
        ok: false,
      });
    }

    deportistaModel.insertPago(
      id_deportista,
      valor,
      fechaPago,
      (deportistaData) => {
        if (deportistaData == null) {
          return res.status(500).json({
            message: "Error del servidor al ingresar el pago",
            ok: false,
          });
        }

        res.status(200).json({
          message: "Pago cargado con exito",
          ok: true,
          idPago: deportistaData.insertId,
        });
      }
    );
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
      // 1. Obtener información del deportista
      deportistaModel.getDeportistaById(id_deportista, (deportistaResult) => {
        if (deportistaResult == null)
          return res.status(500).send("Error en el servidor");
        if (deportistaResult.length === 0)
          return res.status(404).send("Deportista no encontrado");

        const deportista = deportistaResult;

        // 2. Obtener pagos realizados por el deportista
        deportistaModel.getPagosPorDeportista(id_deportista, (pagosResult) => {
          if (pagosResult == null)
            return res.status(500).send("Error en el servidor");

          const pagos = pagosResult;

          // Determinar la fecha del primer pago o usar la fecha actual si no hay pagos
          const fechaPrimerPago =
            pagos.length > 0
              ? moment(pagos[0].fecha, "DD-MM-YYYY") // Tomar la fecha del primer pago
              : moment(); // Usar la fecha actual si no hay pagos

          const cuotas = [];
          const cuotasPagadas = pagos.map((pago) =>
            moment(pago.fecha, "DD-MM-YYYY").format("YYYY-MM")
          );

          // 3. Calcular cuotas mensuales desde la fecha del primer pago hasta hoy
          let fechaActual = moment();
          let fechaIterativa = moment(fechaPrimerPago);

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
          res.render("dashboard/pagosDeportistas", {
            disciplinas: disciplinaData,
            disciplina: disciplina,
            rolId: rolId,
            rolNombre: rolNombre,
            deportista,
            pagos,
            cuotas,
          });
        });
      });
    });
  };

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
          deportistaModel.getPagosDelMes(fecha, (pagosResult) => {
            if (pagosResult == null)
              return res.status(500).send("Error en el servidor");

            // Obtener IDs de deportistas que ya pagaron este mes
            const idsPagados = pagosResult.map((pago) => pago.id_deportista);

            // Filtrar deportistas que no han pagado este mes y cuya fecha del primer pago sea anterior al mes solicitado
            deportistaModel.getPrimerPagoDeportistas((primerPagoResult) => {
              if (primerPagoResult == null)
                return res.status(500).send("Error en el servidor");

              // Crear un mapa de deportista -> fecha del primer pago
              const primerPagoMap = primerPagoResult.reduce((map, pago) => {
                map[pago.id_deportista] = moment(pago.fecha, "YYYY-MM-DD");
                return map;
              }, {});

              // Filtrar deudores
              const deudores = deportistas.filter((deportista) => {
                const fechaPrimerPago = primerPagoMap[deportista.id];
                const mesConsulta = moment(fecha, "YYYY-MM");

                // Verificar que la fecha del primer pago sea antes o igual al mes consultado
                return (
                  fechaPrimerPago &&
                  fechaPrimerPago.isSameOrBefore(mesConsulta, "month") &&
                  !idsPagados.includes(deportista.id)
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
          });
        }
      );
    });
  };
}

// Exportamos la clase DeportistasController
module.exports = DeportistasController;
