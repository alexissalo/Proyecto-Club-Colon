const modelUsuario = require("../models/usuario");
const usuarioModel = new modelUsuario();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UsuarioController {
  mostrarFormulario(req, res) {
    res.render("panel/login");
  }

  async login(req, res) {
    const { email, password } = req.body;

    usuarioModel.validarUsuario(email, password, (usuarioData) => {
      console.log(usuarioData);
      
      if (usuarioData === null) {
        return res.status(500).send("Error al obtener los datos de los socios");
      }

      if (usuarioData==[]) {
        console.log("entro");
        
        return res.status(401).json({ message: "Correo o contraseña incorrectos" });
      }

      const usuario = usuarioData[0];

      const isValidContraseña = bcrypt.compare(password, usuario.password);

      if (!isValidContraseña) {
        return res
          .status(401)
          .json({ message: "Correo o contraseña incorrectos" });
      }

      const token = jwt.sign({ userId: usuario.id, rolId:usuario.id_rol }, "secret", {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.json({ message: "Logged in successfully", token: token });

      console.log(usuarioData);
    });
  }

  logout(req, res) {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
    });
    return res.sendStatus(200);
  }
}

module.exports = UsuarioController;
