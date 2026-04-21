const modelDisciplina = require("../models/disciplina");
const SolicitudModel = require("../models/solicitudes");

const disciplinaModel = new modelDisciplina();
const solicitudModel = new SolicitudModel();

class SolicitudesController {
  async mostrarSolicitudes(req, res) {
    const {disciplina}=req.params
    try {
      const estadoFiltro = req.query.estado || "";

      const solicitudes = await solicitudModel.listarSolicitudesPorDisciplina(
        disciplina,
        estadoFiltro // 👈 lo pasamos al modelo
      );

      disciplinaModel.listarDisciplinas((disciplinas) => {
        res.render("dashboard/solicitudes", {
          rolId: req.rolId,
          rolNombre: req.rolNombre,
          disciplinas,
          solicitudes,
          estadoFiltro, // 👈 lo mandamos a la vista para marcar el select
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener solicitudes");
    }
  }


  async mostrarDetalleSolicitud(req, res) {
    try {
      const solicitud = await solicitudModel.obtenerSolicitudPorId(req.params.id);

      console.log(solicitud);
      

      let datosSolicitud = solicitud.datos_solicitud;
      
      disciplinaModel.listarDisciplinas((disciplinas) => {
        res.render("dashboard/detalleSolicitud", {
          rolId: req.rolId,
          rolNombre: req.rolNombre,
          disciplinas,
          solicitud,
          datosSolicitud, // ya parseado para usar en EJS
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener detalle de solicitud");
    }
  }

  borrarSolicitud(req,res){
    const {id}=req.params;
    
    solicitudModel.eliminarSolicitud(id, (solicitudData) => {
      if (solicitudData == null) {
        return res.status(500).json({
          message: "Error del servidor al borrar la solicitud",
          ok: false,
        });
      }

      res.status(200).json({ message: "Solicitud borrada con exito", ok: true });
    });

  }

  cambiarEstadoSolicitud(req,res){
    const {id}=req.params
    const {estado}=req.body

    solicitudModel.actualizarEstadoSolicitud(id,estado,(solicitudData)=>{
      if (solicitudData == null) {
        return res.status(500).json({
          message: "Error del servidor al actualizar el estado de la solicitud",
          ok: false,
        });
      }

      res.status(200).json({ message: "Estado de solicitud cambiado con exito", ok: true });

    })
  }
}

module.exports = SolicitudesController;
