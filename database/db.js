const mysql=require("mysql2/promise")
const {db}=require("../config")

const conexion = mysql.createPool({
    host: db.host,
    port: db.port,
    user: db.user,
    password: "colonapp24",
    database: db.database,
  });


module.exports=conexion