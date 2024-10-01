// Importamos los modelos de socio y disciplina
const modelSocio = require("../models/socio");
const socioModel = new modelSocio();
const modelDisciplina = require("../models/disciplina");
const disciplinaModel = new modelDisciplina();
const { generarTicketPago } = require("../middlewares/generarPdf");

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
      deporte,
      tipodesocio,
    } = req.body;

    socioModel.insertSocio(
      nombre,
      dni,
      telefono,
      fechaNacimiento,
      domicilio,
      deporte,
      tipodesocio,
      (socioData) => {
        if (socioData==null) {
          return res.status(500).json({message:"Error del servidor al crear el socio",ok:false});
        }

        res.status(200).json({message:"Socio creado con exito", ok:true})
      }
    );
  }

  actualizarSocio(req, res) {
    const { id } = req.params;
    const { nombre, telefono, domicilio, tipodesocio,deporte } = req.body;

    socioModel.updateSocio(
      id,
      nombre,
      telefono,
      domicilio,
      tipodesocio,
      deporte,
      (socioData) => {
        if (socioData==null) {
          return res
            .status(500)
            .json({message:"Error del servidor al actualizar los datos de los socios", ok:false});
        }
        res.status(200).json({message:"Los datos del socio fueron actualizados con exito", ok:true});
      }
    );
  }

  borrarSocio(req, res) {
    const { id } = req.params;

    socioModel.deleteSocio(id, (socioData) => {
      if (socioData==null) {
        return res.status(500).json({message:"Error del servidor al borrar el socio",ok:false});
      }

      res.status(200).json({message:"Socio borrado con exito",ok:true});
    });
  }

  crearPago(req,res){
    const {id_socio,valor}=req.body

    socioModel.insertPago(id_socio,valor,(socioData)=>{
      if (socioData==null) {
        return res.status(500).json({message:"Error del servidor al crear el pago", ok:false})
      }

      res.status(200).json({message:"Pago creado con exito", ok: true})
    })
  }

  crearTipoDeSocio(req,res){
    const {nombre,valordecuota}=req.body;

    socioModel.insertTipoDeSocio(nombre,valordecuota,(tiposDeSocioData)=>{
      if (tiposDeSocioData==null) {
        return res.status(500).json({message:"Error del servidor al crear el tipo de socio", ok:false})
      }

      res.status(200).json({message:"Tipo de socio creado con exito",ok:true})
    })
  }

  editarTipoDeSocio(req,res){
    const {id}=req.params;
    const {nombre,valordecuota}=req.body;

    socioModel.updateTipoDeSocio(id,nombre,valordecuota,(tiposDeSocioData)=>{
      if (tiposDeSocioData==null) {
        return res.status(500).json({message:"Error del servidor al actualizar el tipo de socio", ok:false})
      }

      res.status(200).json({message:"Tipo de socio actualizado con exito",ok:true})
    })
  }

  borrarTipoDeSocio(req,res){
    const {id}=req.params;

    socioModel.deleteTipoDeSocio(id,(tiposDeSocioData)=>{
      if (tiposDeSocioData==null) {
        return res.status(500).json({message:"Error del servidor al borrar el tipo de socio", ok:false})
      }

      res.status(200).json({message:"Tipo de socio borrado con exito",ok:true})
    })
  }
}

// Exportamos la clase SocioController
module.exports = SocioController;
