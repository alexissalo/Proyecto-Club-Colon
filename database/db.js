const mysql=require("mysql2/promise")
const {db}=require("../config")

const conexion = mysql.createPool({
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.password,
    database: db.database,
  });


module.exports=conexion