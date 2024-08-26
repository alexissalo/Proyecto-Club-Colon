const express = require('express');
const app = express();
const port = 3000;

const rutasUsuarios = require('./routes/usuario');
const rutasEventos= require("./routes/evento")
const rutasEconomia = require("./routes/economia")

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
app.use("/",rutasEventos)
app.use("/", rutasEconomia)


app.listen(port, () => {
  console.log(`El servidor corre en el puerto ${port}`);
});