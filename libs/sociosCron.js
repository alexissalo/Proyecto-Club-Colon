const cron = require("node-cron");
const pool = require("../database/db"); // Importar conexión a la base de datos

let sociosCronJob = null;
let sociosCronActive = false;

function setupSociosCron() {
  if (!sociosCronActive) {
    sociosCronJob = cron.schedule("10 0 1 * *", async () => {
      try {
        console.log("Generando facturas de socios...");
        const [socios] = await pool.query(`
          SELECT s.id AS socio_id, t.valorDeCuota, s.estado 
          FROM socios s 
          JOIN tiposdesocios t ON s.id_tipo_socio = t.id
        `, []);

        for (const socio of socios) {
          // Verificar si el valor de la cuota es mayor a 0
          if (socio.valorDeCuota > 0 && socio.estado=="activo") {
            await pool.query(`
              INSERT INTO facturas_socios (id_socio, fecha_emision, monto, estado) 
              VALUES (?, now(), ?, 'pendiente')
            `, [socio.socio_id, socio.valorDeCuota]);
          } else {
            console.log(
              `Factura no generada para el socio con ID ${socio.socio_id}: valor de cuota no válido (${socio.valorDeCuota}).`
            );
          }
        }
        console.log("Facturas de socios generadas exitosamente.");
      } catch (error) {
        console.error("Error generando facturas de socios:", error);
      }
    });
    sociosCronActive = true;
    sociosCronJob.start();
  }
}

function stopSociosCron() {
  if (sociosCronActive) {
    sociosCronJob.stop();
    sociosCronActive = false;
    console.log("Cron job de socios detenido.");
  }
}

module.exports = { setupSociosCron, stopSociosCron, isActive: () => sociosCronActive };
