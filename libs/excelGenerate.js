const ExcelJS = require("exceljs");
const modelSocio=require("../models/socio")
const socioModel= new modelSocio()

async function exportarSociosExcel(req, res) {

  try {
    const socios= await socioModel.listarSociosParaExcel()

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Socios");

    // Agregar encabezados
    worksheet.columns = [
      { header: "Nombre", key: "nombre", width: 25 },
      { header: "DNI", key: "dni", width: 15 },
      { header: "Fecha de nacimiento", key: "fechanacimiento", width: 20 },
      { header: "Teléfono", key: "telefono", width: 15 },
      { header: "Domicilio", key: "direccion", width: 30 },
      { header: "Fecha de inscripcion", key: "fechainscripcion", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Tipo de socio", key: "tiposocio", width: 20 },
      { header: "Deporte", key: "deporte", width: 15 },
    ];

    // Agregar filas con los datos de los socios
    socios.forEach((socio) => {
      worksheet.addRow({
        nombre: socio.nombre,
        dni: socio.dni,
        fechanacimiento:socio.fechaNacimiento,
        telefono: socio.telefono,
        direccion: socio.domicilio,
        fechainscripcion: socio.fechaInscripcion,
        email: socio.email,
        tiposocio:socio.tipodesocio,
        deporte: socio.deporte
      });
    });

    // Estilo opcional para encabezados
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
    });

    // Enviar el archivo como respuesta
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=Socios.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error al exportar socios a Excel:", error);
    res.status(500).send("Error interno del servidor");
  }
}

module.exports = { exportarSociosExcel };
