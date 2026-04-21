const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;
const {keysecretsession}=require("./config")


const rutasSocios= require("./routes/socio")
const rutasUsuarios = require('./routes/usuario');
const rutasEventos= require("./routes/evento")
const rutasEconomia= require("./routes/economia")
const rutasDeportistas= require("./routes/deportistas")
const rutasMovimientos= require("./routes/movimiento")
const rutasCron= require("./routes/cron")
const rutasSolicitudes= require("./routes/solicitudes")
const rutasProductos= require("./routes/productos")
const rutasNoticias= require("./routes/noticias")




// MiddleWare


app.use(session({
  secret: keysecretsession,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000, // 1 hora
  }
}));


app.use(express.urlencoded({
  extended: true,
}));
app.use(express.json());

// Templates
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

//Rutas
app.use("/",rutasSocios)
app.use("/",rutasUsuarios);
app.use("/",rutasEventos)
app.use("/",rutasEconomia)
app.use("/",rutasDeportistas)
app.use("/", rutasMovimientos)
app.use("/cron",rutasCron)
app.use("/", rutasSolicitudes)
app.use("/",rutasProductos)
app.use("/",rutasNoticias)



app.listen(port, () => {
  console.log(`El servidor corre en el puerto ${port}`);
});