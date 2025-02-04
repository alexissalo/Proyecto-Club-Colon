const PDFDocument = require("pdfkit-table");
const path = require("path");
const modelSocio = require("../models/socio");
const socioModel = new modelSocio();

function buildPDF(balance, title, dataCallback, endCallback) {
  const doc = new PDFDocument({
    margins: { top: 50, left: 50, right: 50, bottom: 50 },
    size: "A4",
  });

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  // Fecha
  const hoy = new Date();
  doc.fontSize(12).text(`${hoy.toLocaleDateString()}`, { align: "right" });

  doc.moveDown(2);

  // Título
  doc.fontSize(24).text(title, { align: "center" });

  // Tabla de Ingresos
  const ingresosTable = {
    title: "Ingresos",
    headers: ["Fecha", "Valor", "Descripcion"],
    rows: balance.ingresos.map((ingreso) => [
      ingreso.fecha,
      `$${ingreso.valor}`,
      ingreso.descripcion,
    ]),
  };

  doc.moveDown(2);
  doc.table(ingresosTable, {
    prepareHeader: () => doc.fontSize(16).font("Helvetica-Bold"),
    prepareRow: (row, i) => doc.fontSize(12).font("Helvetica"),
    columnSpacing: 10, // Ajustar la separación de las columnas
    rowHeight: 8, // Reducir el alto de las filas
    padding: 1, // Reducir el padding dentro de cada celda
    width: 500,
  });

  // Espacio entre tablas
  doc.moveDown(2);

  // Tabla de Egresos
  const egresosTable = {
    title: "Egresos",
    headers: ["Fecha", "Valor", "Descripcion"],
    rows: balance.egresos.map((egreso) => [
      egreso.fecha,
      `$${egreso.valor}`,
      egreso.descripcion,
    ]),
  };

  doc.table(egresosTable, {
    prepareHeader: () => doc.fontSize(16).font("Helvetica-Bold"),
    prepareRow: (row, i) => doc.fontSize(12).font("Helvetica"),
    columnSpacing: 10,
    rowHeight: 8,
    padding: 1,
    width: 500,
  });

  if (doc.y > doc.page.height - 150) {
    doc.addPage();
  }

  // Espacio antes de Totales
  doc.moveDown(2);

  // Totales
  doc
    .fontSize(18)
    .text(`Total Ingresos: $${balance.totalIngresos}`, { align: "right" });
  doc
    .fontSize(18)
    .text(`Total Egresos: $${balance.totalEgresos}`, { align: "right" });
  doc.fontSize(18).text("__________________________", { align: "right" });
  doc.fontSize(18).text(`Total: $${balance.total}`, { align: "right" });

  doc.end();
}

function generarTicketPagoSocial(socio, cuota, idPago, res) {
  const doc = new PDFDocument({
    margins: { top: 50, left: 50, right: 50, bottom: 50 },
    size: "A4",
  });

   // Cargar y mostrar la imagen en la esquina superior izquierda
   const logoPath = path.join(
    __dirname,
    "../public/img",
    "logo_colon_sin_fondo.png"
  );
  doc.image(logoPath, 50, 50, { width: 100 }); // Ajusta el ancho de la imagen

  doc.moveDown(2);

  // Fecha actual
  const hoy = new Date();
  doc
    .fontSize(12)
    .text(`Fecha: ${hoy.toLocaleDateString()}`, { align: "right" });

  doc.moveDown(6);

  // Título del ticket
  doc.fontSize(20).text("Ticket de Pago de Cuota Social", { align: "center" });

  doc.moveDown(2);

  // Información del socio
  doc.fontSize(16).text(`Socio: ${socio.nombre}`);
  doc.fontSize(14).text(`DNI: ${socio.dni}`);
  doc.moveDown(2);

  let fechaPago = new Date(cuota.fechaPago);
  fechaPago.setMinutes(fechaPago.getMinutes() + fechaPago.getTimezoneOffset());

  // Información de la cuota
  doc.fontSize(16).text("Detalles del Pago:");
  doc.fontSize(14).text(`Cuota: $${cuota.valor}`);
  doc.fontSize(14).text(`Fecha de Pago: ${fechaPago.toLocaleDateString()}`);
  doc.fontSize(14).text(`Método de Pago: ${cuota.metodoPago}`);
  doc.fontSize(14).text(`N° de Referencia: ${idPago}`);

  doc.moveDown(2);

  // Total pagado
  doc.fontSize(18).text(`Total Pagado: $${cuota.valor}`, { align: "right" });

  // Pie de página con agradecimiento
  doc.moveDown(3);
  doc.fontSize(12).text("Gracias por su pago.", { align: "center" });
  doc.end();

   // Generar un nombre personalizado para el archivo
  const fileName = `ticket_pago_${socio.nombre.replace(/\s+/g, '_').toLowerCase()}_${idPago}.pdf`;

  // Retornar el PDF como flujo de datos
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=${fileName}`);
  doc.pipe(res);
}

function generarTicketPagoDeportista(
  deportista,
  cuota,
  idPago,
  dataCallback,
  endCallback
) {
  const doc = new PDFDocument({
    margins: { top: 50, left: 50, right: 50, bottom: 50 },
    size: "A4",
  });

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  // Cargar y mostrar la imagen en la esquina superior izquierda
  const logoPath = path.join(
    __dirname,
    "../public/img",
    "logo_colon_sin_fondo.png"
  );
  doc.image(logoPath, 50, 50, { width: 100 }); // Ajusta el ancho de la imagen

  doc.moveDown(2);

  // Fecha actual
  const hoy = new Date();
  doc
    .fontSize(12)
    .text(`Fecha: ${hoy.toLocaleDateString()}`, { align: "right" });

  doc.moveDown(6);

  // Título del ticket
  doc.fontSize(20).text("Ticket de Pago", { align: "center" });

  doc.moveDown(2);

  // Información del socio
  doc.fontSize(16).text(`Deportista: ${deportista.nombre}`);
  doc.fontSize(14).text(`Fecha de Nacimiento: ${deportista.fechaNacimiento}`);
  doc.fontSize(14).text(`Domicilio: ${deportista.domicilio}`);
  doc.moveDown(2);

  let fechaPago = new Date(cuota.fechaPago);
  fechaPago.setMinutes(fechaPago.getMinutes() + fechaPago.getTimezoneOffset());

  // Información de la cuota
  doc.fontSize(16).text("Detalles del Pago:");
  doc.fontSize(14).text(`Cuota: $${cuota.valor}`);
  doc.fontSize(14).text(`Fecha de Pago: ${fechaPago.toLocaleDateString()}`);
  doc.fontSize(14).text(`Método de Pago: ${cuota.metodoPago}`);
  doc.fontSize(14).text(`N° de Referencia: ${idPago}`);

  doc.moveDown(2);

  // Total pagado
  doc.fontSize(18).text(`Total Pagado: $${cuota.valor}`, { align: "right" });

  // Pie de página con agradecimiento
  doc.moveDown(3);
  doc.fontSize(12).text("Gracias por su pago.", { align: "center" });

  doc.end();
}

function imprimirDeudoresMesSocios(req, res) {
  const { deudores, fecha } = req.body;

  try {
    res.setHeader(
      "Content-Disposition",
      'inline; filename="listado_deudores.pdf"'
    );
    res.setHeader("Content-Type", "application/pdf");

    // Crea un documento PDF
    const doc = new PDFDocument({ size: "A4", margin: 10 });
    const pageHeight = doc.page.height;

    // Título del documento
    doc.pipe(res);
    doc.fontSize(12).text(`Fecha: ${fecha}`, { align: "right" });
    doc.moveDown();
    doc
      .fontSize(16)
      .text("Listado de Socios Deudores del Mes", { align: "center" });
    doc.moveDown();

    // Variables de la tabla
    const tableTop = 100;
    const columnWidths = [100, 100, 100, 100, 100]; // Anchos de columnas
    const rowHeight = 40; // Altura de cada fila
    const startX = 50;
    let currentY = tableTop;

    // Función para dibujar encabezados de tabla
    const drawTableHeaders = () => {
      const headers = ["Nombre", "DNI", "Telefono", "Email", "Domicilio"];
      headers.forEach((header, i) => {
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text(
            header,
            startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
            currentY,
            { width: columnWidths[i], align: "center" }
          );
      });

      // Línea debajo de los encabezados
      doc
        .moveTo(startX, currentY + rowHeight - 10)
        .lineTo(
          startX + columnWidths.reduce((a, b) => a + b, 0),
          currentY + rowHeight - 10
        )
        .stroke();

      currentY += rowHeight; // Incrementar la posición Y
    };

    // Dibujar encabezados de la tabla
    drawTableHeaders();

    // Dibujar filas de la tabla
    deudores.forEach((deudor, rowIndex) => {
      if (currentY + rowHeight > pageHeight - 50) {
        // Nueva página si no hay espacio suficiente
        doc.addPage();
        currentY = tableTop;
        drawTableHeaders(); // Dibujar encabezados en la nueva página
      }

      const columns = [
        deudor.nombre,
        deudor.dni,
        deudor.telefono,
        deudor.email,
        deudor.domicilio,
      ];

      columns.forEach((text, colIndex) => {
        doc
          .font("Helvetica")
          .fontSize(10)
          .text(
            text,
            startX + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0),
            currentY,
            { width: columnWidths[colIndex], align: "center" }
          );
      });

      // Línea debajo de la fila
      doc
        .moveTo(startX, currentY + rowHeight - 10)
        .lineTo(
          startX + columnWidths.reduce((a, b) => a + b, 0),
          currentY + rowHeight - 10
        )
        .stroke();

      currentY += rowHeight; // Incrementar la posición Y
    });

    // Finalizar y cerrar el PDF
    doc.end();
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    res.status(500).send("Error al generar el PDF");
  }
}

function imprimirDeudoresMesDeportistas(req, res) {
  const { deudores, fecha } = req.body;

  try {
    res.setHeader(
      "Content-Disposition",
      'inline; filename="listado_deudores.pdf"'
    );
    res.setHeader("Content-Type", "application/pdf");

    // Crea un documento PDF
    const doc = new PDFDocument({ size: "A4", margin: 10 });
    const pageHeight = doc.page.height;

    // Título del documento
    doc.pipe(res);
    doc.fontSize(12).text(`Fecha: ${fecha}`, { align: "right" });
    doc.moveDown();
    doc
      .fontSize(16)
      .text("Listado de Deportistas Deudores del Mes", { align: "center" });
    doc.moveDown();

    // Variables de la tabla
    const tableTop = 100;
    const columnWidths = [80, 80, 80, 80, 80, 80]; // Anchos de columnas
    const rowHeight = 40; // Altura de cada fila
    const startX = 50;
    let currentY = tableTop;

    // Función para dibujar encabezados de tabla
    const drawTableHeaders = () => {
      const headers = [
        "Nombre",
        "Domicilio",
        "Localidad",
        "Teléfono",
        "Teléfono Emergencia",
        "Email",
      ];
      headers.forEach((header, i) => {
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text(
            header,
            startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
            currentY,
            { width: columnWidths[i], align: "center" }
          );
      });

      // Línea debajo de los encabezados
      doc
        .moveTo(startX, currentY + rowHeight - 10)
        .lineTo(
          startX + columnWidths.reduce((a, b) => a + b, 0),
          currentY + rowHeight - 10
        )
        .stroke();

      currentY += rowHeight; // Incrementar la posición Y
    };

    // Dibujar encabezados de la tabla
    drawTableHeaders();

    // Dibujar filas de la tabla
    deudores.forEach((deudor, rowIndex) => {
      if (currentY + rowHeight > pageHeight - 50) {
        // Nueva página si no hay espacio suficiente
        doc.addPage();
        currentY = tableTop;
        drawTableHeaders(); // Dibujar encabezados en la nueva página
      }

      const columns = [
        deudor.nombre,
        deudor.direccion,
        deudor.localidad,
        deudor.telefono,
        deudor.telefonoEmergencia,
        deudor.email,
      ];

      columns.forEach((text, colIndex) => {
        doc
          .font("Helvetica")
          .fontSize(10)
          .text(
            text,
            startX + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0),
            currentY,
            { width: columnWidths[colIndex], align: "center" }
          );
      });

      // Línea debajo de la fila
      doc
        .moveTo(startX, currentY + rowHeight - 10)
        .lineTo(
          startX + columnWidths.reduce((a, b) => a + b, 0),
          currentY + rowHeight - 10
        )
        .stroke();

      currentY += rowHeight; // Incrementar la posición Y
    });

    // Finalizar y cerrar el PDF
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
}

async function listarSociosenPdf(req, res) {
  try {
    const socios = await socioModel.listarSociosParaExcel();

    res.setHeader(
      "Content-Disposition",
      'inline; filename="listado_deudores.pdf"'
    );
    res.setHeader("Content-Type", "application/pdf");

    // Crea un documento PDF
    const doc = new PDFDocument({ size: "A3", margin: 10 });
    const pageHeight = doc.page.height;

    const hoy = new Date();

    // Título del documento
    doc.pipe(res);
    doc
      .fontSize(12)
      .text(`Fecha: ${hoy.toLocaleDateString()}`, { align: "right" });
    doc.moveDown();
    doc.fontSize(16).text("Listado de Socios", { align: "center" });
    doc.moveDown();

    // Variables de la tabla
    const tableTop = 100;
    const columnWidths = [100, 70, 70, 100, 100, 70, 100, 70, 70]; // Anchos de columnas
    const rowHeight = 40; // Altura de cada fila
    const startX = 50;
    let currentY = tableTop;

    // Función para dibujar encabezados de tabla
    const drawTableHeaders = () => {
      const headers = [
        "Nombre",
        "DNI",
        "Fec.Nacimiento",
        "Telefono",
        "Domicilio",
        "Fec.inscripcion",
        "Email",
        "Tipo de socio",
        "Deporte",
      ];
      headers.forEach((header, i) => {
        doc
          .font("Helvetica-Bold")
          .fontSize(11)
          .text(
            header,
            startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
            currentY,
            { width: columnWidths[i], align: "center" }
          );
      });

      // Línea debajo de los encabezados
      doc
        .moveTo(startX, currentY + rowHeight - 10)
        .lineTo(
          startX + columnWidths.reduce((a, b) => a + b, 0),
          currentY + rowHeight - 10
        )
        .stroke();

      currentY += rowHeight; // Incrementar la posición Y
    };

    // Dibujar encabezados de la tabla
    drawTableHeaders();

    // Dibujar filas de la tabla
    socios.forEach((socio, rowIndex) => {
      if (currentY + rowHeight > pageHeight - 50) {
        // Nueva página si no hay espacio suficiente
        doc.addPage();
        currentY = tableTop;
        drawTableHeaders(); // Dibujar encabezados en la nueva página
      }

      const columns = [
        socio.nombre,
        socio.dni,
        socio.fechaNacimiento,
        socio.telefono,
        socio.domicilio,
        socio.fechaInscripcion,
        socio.email,
        socio.tipodesocio,
        socio.deporte,
      ];

      columns.forEach((text, colIndex) => {
        doc
          .font("Helvetica")
          .fontSize(9)
          .text(
            text,
            startX + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0),
            currentY,
            { width: columnWidths[colIndex], align: "center" }
          );
      });

      // Línea debajo de la fila
      doc
        .moveTo(startX, currentY + rowHeight - 10)
        .lineTo(
          startX + columnWidths.reduce((a, b) => a + b, 0),
          currentY + rowHeight - 10
        )
        .stroke();

      currentY += rowHeight; // Incrementar la posición Y
    });

    // Finalizar y cerrar el PDF
    doc.end();
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    res.status(500).send("Error al generar el PDF");
  }
}

module.exports = {
  buildPDF,
  generarTicketPagoSocial,
  generarTicketPagoDeportista,
  imprimirDeudoresMesSocios,
  imprimirDeudoresMesDeportistas,
  listarSociosenPdf,
};
