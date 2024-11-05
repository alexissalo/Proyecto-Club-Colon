const PDFDocument = require("pdfkit-table");
const path = require('path');

function buildPDF(balance, title, dataCallback, endCallback) {
  const doc = new PDFDocument({
    margins: { top: 50, left: 50, right: 50, bottom: 50 },
    size: 'A4',
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
    padding: 1,    // Reducir el padding dentro de cada celda
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

function generarTicketPagoSocial(socio, cuota, idPago, dataCallback, endCallback) {
  const doc = new PDFDocument({
    margins: { top: 50, left: 50, right: 50, bottom: 50 },
    size: 'A4',
  });

  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  // Cargar y mostrar la imagen en la esquina superior izquierda
  const logoPath = path.join(__dirname, '../public/img', 'logo_colon_sin_fondo.png');
  doc.image(logoPath, 50, 50, { width: 100 }); // Ajusta el ancho de la imagen

  doc.moveDown(2);

  // Fecha actual
  const hoy = new Date();
  doc.fontSize(12).text(`Fecha: ${hoy.toLocaleDateString()}`, { align: 'right' });

  doc.moveDown(6);

  // Título del ticket
  doc.fontSize(20).text('Ticket de Pago de Cuota Social', { align: 'center' });

  doc.moveDown(2);

  // Información del socio
  doc.fontSize(16).text(`Socio: ${socio.nombre}`);
  doc.fontSize(14).text(`DNI: ${socio.dni}`);
  doc.fontSize(14).text(`Fecha de Nacimiento: ${socio.fechaNacimiento}`);
  doc.fontSize(14).text(`Teléfono: ${socio.telefono}`);
  doc.fontSize(14).text(`Domicilio: ${socio.domicilio}`);
  doc.moveDown(2);


  let fechaPago = new Date(cuota.fechaPago);
  fechaPago.setMinutes(fechaPago.getMinutes() + fechaPago.getTimezoneOffset());

  // Información de la cuota
  doc.fontSize(16).text('Detalles del Pago:');
  doc.fontSize(14).text(`Cuota: $${cuota.valor}`);
  doc.fontSize(14).text(`Fecha de Pago: ${fechaPago.toLocaleDateString()}`);
  doc.fontSize(14).text(`Método de Pago: ${cuota.metodoPago}`);
  doc.fontSize(14).text(`N° de Referencia: ${idPago}`);

  doc.moveDown(2);

  // Total pagado
  doc.fontSize(18).text(`Total Pagado: $${cuota.valor}`, { align: 'right' });

  // Pie de página con agradecimiento
  doc.moveDown(3);
  doc.fontSize(12).text('Gracias por su pago.', { align: 'center' });

  doc.end();
}

function generarTicketPagoDeportista(deportista, cuota, idPago, dataCallback, endCallback) {
  const doc = new PDFDocument({
    margins: { top: 50, left: 50, right: 50, bottom: 50 },
    size: 'A4',
  });

  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  // Cargar y mostrar la imagen en la esquina superior izquierda
  const logoPath = path.join(__dirname, '../public/img', 'logo_colon_sin_fondo.png');
  doc.image(logoPath, 50, 50, { width: 100 }); // Ajusta el ancho de la imagen

  doc.moveDown(2);

  // Fecha actual
  const hoy = new Date();
  doc.fontSize(12).text(`Fecha: ${hoy.toLocaleDateString()}`, { align: 'right' });

  doc.moveDown(6);

  // Título del ticket
  doc.fontSize(20).text('Ticket de Pago', { align: 'center' });

  doc.moveDown(2);

  // Información del socio
  doc.fontSize(16).text(`Deportista: ${deportista.nombre}`);
  doc.fontSize(14).text(`Fecha de Nacimiento: ${deportista.fechaNacimiento}`);
  doc.fontSize(14).text(`Domicilio: ${deportista.domicilio}`);
  doc.moveDown(2);


  let fechaPago = new Date(cuota.fechaPago);
  fechaPago.setMinutes(fechaPago.getMinutes() + fechaPago.getTimezoneOffset());

  // Información de la cuota
  doc.fontSize(16).text('Detalles del Pago:');
  doc.fontSize(14).text(`Cuota: $${cuota.valor}`);
  doc.fontSize(14).text(`Fecha de Pago: ${fechaPago.toLocaleDateString()}`);
  doc.fontSize(14).text(`Método de Pago: ${cuota.metodoPago}`);
  doc.fontSize(14).text(`N° de Referencia: ${idPago}`);

  doc.moveDown(2);

  // Total pagado
  doc.fontSize(18).text(`Total Pagado: $${cuota.valor}`, { align: 'right' });

  // Pie de página con agradecimiento
  doc.moveDown(3);
  doc.fontSize(12).text('Gracias por su pago.', { align: 'center' });

  doc.end();
}


module.exports = { buildPDF, generarTicketPagoSocial, generarTicketPagoDeportista };
