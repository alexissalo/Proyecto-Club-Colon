const express = require('express');
const app = express();
const port = 3000;

const rutasUsuarios = require('./routes/usuario');
const rutasSocios= require("./routes/socio")
const rutasEventos= require("./routes/evento")

// MiddleWare
app.use(express.urlencoded({
  extended: false,
}));
app.use(express.json());

// Templates
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

//Rutas
app.use("/",rutasUsuarios);
app.use("/",rutasSocios);
app.use("/",rutasEventos)


app.listen(port, () => {
  console.log(`El servidor corre en el puerto ${port}`);
});