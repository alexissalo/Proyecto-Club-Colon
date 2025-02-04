const cron = require("node-cron");
const pool = require("../database/db"); // Importar conexión a la base de datos

let deportistasCronJob = null;
let deportistasCronActive = false;

function setupDeportistasCron() {
  if (!deportistasCronActive) {
    deportistasCronJob = cron.schedule("10 0 1 * *", async () => {
      try {
        console.log("Generando facturas de deportistas...");
        const [deportistas] = await pool.query(`
          SELECT dp.id AS deportista_id, cd.valorDeCuota 
          FROM datospersonalesdeportista dp
          JOIN cuotas_deportistas cd ON dp.id_tipo_cuota = cd.id
        `, []);

        for (const deportista of deportistas) {
          // Verificar si el valor de la cuota es mayor a 0
          if (deportista.valorDeCuota > 0) {
            await pool.query(`
              INSERT INTO facturas_deportistas (id_deportista, fecha_emision, monto, estado) 
              VALUES (?, now(), ?, 'pendiente')
            `, [deportista.deportista_id, deportista.valorDeCuota]);
          } else {
            console.log(
              `Factura no generada para el deportista con ID ${deportista.deportista_id}: valor de cuota no válido (${deportista.valorDeCuota}).`
            );
          }
        }

        console.log("Facturas de deportistas generadas exitosamente.");
      } catch (error) {
        console.error("Error generando facturas de deportistas:", error);
      }
    });
    deportistasCronActive = true;
    deportistasCronJob.start();
  }
}

function stopDeportistasCron() {
  if (deportistasCronActive) {
    deportistasCronJob.stop();
    deportistasCronActive = false;
    console.log("Cron job de deportistas detenido.");
  }
}

module.exports = { setupDeportistasCron, stopDeportistasCron, isActive: () => deportistasCronActive };
