// Importamos el modelo de disciplina
const modelDisciplina = require("../models/disciplina");
const disciplinaModel = new modelDisciplina();
const modelDeportista = require("../models/deportistas");
const deportistaModel = new modelDeportista();
const { encrypt, decrypt } = require("../middlewares/encriptacion");

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
                domicilio: decrypt(deportista.domicilio),
                localidad: decrypt(deportista.localidad),
                escolaridad: decrypt(deportista.escolaridad),
                email: decrypt(deportista.email),
                instagram: decrypt(deportista.instagram),
                facebook: decrypt(deportista.facebook),
                telefonoJugador: decrypt(deportista.telefonoJugador),
                telefonoEmergencia: decrypt(deportista.telefonoEmergencia),
                tutorNombre: decrypt(deportista.tutorNombre),
                domicilioTutor: decrypt(deportista.domicilioTutor),
                telefonoTutor: decrypt(deportista.telefonoJugador),
                telefonoFijoTutor: decrypt(deportista.telefonoFijoTutor),
                facebookTutor: decrypt(deportista.facebookTutor),
                instagramTutor: decrypt(deportista.instagramTutor),
                emailResponsable: decrypt(deportista.emailResponsable),
                coberturaMedica: decrypt(deportista.coberturaMedica),
                numeroAfiliado: decrypt(deportista.numeroAfiliado),
                lesiones: decrypt(deportista.lesiones),
                alergias: decrypt(deportista.alergias),
                patologias: decrypt(deportista.patologias),
                tratamientos: decrypt(deportista.tratamientos),
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

        deportistaData = 
          {
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
            localidadTutor:decrypt(deportistaData.localidadTutor),
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
}

// Exportamos la clase DeportistasController
module.exports = DeportistasController;
