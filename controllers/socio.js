const modelSocio = require("../models/socio");
const socioModel = new modelSocio();
const modelDisciplina = require("../models/disciplina");
const disciplinaModel = new modelDisciplina();
const pool = require("../database/db");

class SocioController {
  listarSocios(req, res) {
    const pagina = parseInt(req.query.pagina) || 1;
    const filasPorPagina = parseInt(req.query.filasPorPagina) || 5;

    socioModel.getSocios(pagina, filasPorPagina, (sociosData) => {
      disciplinaModel.listarDisciplinas((disciplinaData) => {
        if (sociosData === null) {
          return res
            .status(500)
            .send("Error al obtener los datos de los socios");
        }
        const rolId = req.rolId;
        const rolNombre=req.rolNombre

        res.render("dashboard/socios", {
          socios: sociosData,
          rolId: rolId,
          rolNombre:rolNombre,
          pagina: pagina,
          filasPorPagina: filasPorPagina,
          totalSocios: sociosData.length + 1,
          disciplinas:disciplinaData
        });
      });
    });
  }
}
module.exports = SocioController;
