const modelUsuario = require("../models/usuario");
const usuarioModel = new modelUsuario();
const modelDisciplina = require("../models/disciplina");
const disciplinaModel = new modelDisciplina();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: nodemon } = require("nodemon");

class UsuarioController {
  mostrarFormulario(req, res) {
    res.render("panel/login");
  }

  mostrarInicio(req, res) {
    disciplinaModel.listarDisciplinas((disciplinaData) => {
      if (disciplinaData === null) {
        return res.status(500).send("Error al obtener los datos de los socios");
      }
      const rolId = req.rolId;
      const rolNombre = req.rolNombre;

      res.render("dashboard/inicio", {
        rolId: rolId,
        rolNombre: rolNombre,
        disciplinas: disciplinaData,
      });
    });
  }

  mostrarUsuarios(req, res) {
    usuarioModel.listarRoles((rolesData) => {
      if (!rolesData) {
        return res
          .status(500)
          .send("Error al obtener los datos de los socios");
      }
      usuarioModel.listarUsuarios((usuariosData) => {
        if (!usuariosData) {
          return res
            .status(500)
            .send("Error al obtener los datos de los socios");
        }
        disciplinaModel.listarDisciplinas((disciplinaData) => {
          if (!disciplinaData) {
            return res
              .status(500)
              .send("Error al obtener los datos de los socios");
          }
          const rolId = req.rolId;
          const rolNombre = req.rolNombre;

          console.log(rolesData);
          
          res.render("dashboard/usuarios", {
            usuarios: usuariosData,
            rolId: rolId,
            rolNombre: rolNombre,
            disciplinas: disciplinaData,
            roles:rolesData
          });
        });
      });
    });
  }

  login(req, res) {
    const { email, password } = req.body;

    usuarioModel.validarUsuario(email, password, (usuarioData) => {
      console.log(usuarioData);

      if (usuarioData === null) {
        return res.status(500).send("Error al obtener los datos de los socios");
      }

      if (!usuarioData) {
        return res
          .status(401)
          .json({ message: "Correo o contraseña incorrectos" });
      }

      const isValidContraseña = bcrypt.compare(password, usuarioData.password);

      if (!isValidContraseña) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }

      const token = jwt.sign(
        {
          userId: usuarioData.id,
          rolId: usuarioData.id_rol,
          rolNombre: usuarioData.rol_nombre,
        },
        "secret",
        {
          expiresIn: "1h",
        }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.json({ message: "Logueado correctamente", token: token });
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

  async registrarUsuario(req, res) {
    const { nombre, email, contraseña, id_rol } = req.body;

    try {
      const hashedContraseña = await bcrypt.hash(contraseña, 10);

      usuarioModel.crearUsuario(
        nombre,
        email,
        hashedContraseña,
        id_rol,
        (usuarioData) => {
          if (!usuarioData) {
            return res
              .status(500)
              .json({ message: "Error al crear el usuario" });
          }

          res.json({ message: "Usuario registrado correctamente" });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al registrar el usuario" });
    }
  }

  mostrarCuenta(req, res) {
    const id = req.userId;
    usuarioModel.traerUsuario(id, (usuarioData) => {
      if (!usuarioData) {
        return res.status(500).send("Error al obtener los datos de los socios");
      }
      disciplinaModel.listarDisciplinas((disciplinaData) => {
        if (disciplinaData === null) {
          return res
            .status(500)
            .send("Error al obtener los datos de los socios");
        }
        const rolId = req.rolId;
        const rolNombre = req.rolNombre;

        res.render("dashboard/cuenta", {
          usuario: usuarioData,
          rolId: rolId,
          rolNombre: rolNombre,
          disciplinas: disciplinaData,
          userId: id,
        });
      });
    });
  }

  cambiarContraseña(req, res) {
    const { id, contraseñaActual, nuevaContraseña } = req.body;

    usuarioModel.verificarContraseña(id, (usuarioData) => {
      if (!usuarioData) {
        console.error("Error al verificar la contraseña actual:");
        res
          .status(500)
          .send({ mensaje: "Error al verificar la contraseña actual" });
        return;
      }

      const contraseñaActualHash = usuarioData.password;

      const esContraseñaCorrecta = bcrypt.compare(
        contraseñaActual,
        contraseñaActualHash
      );

      if (!esContraseñaCorrecta) {
        res
          .status(401)
          .send({ mensaje: "La contraseña actual introducida es incorrecta" });
        return;
      }

      usuarioModel.actualizarContraseña(id, nuevaContraseña, (usuarioData) => {
        if (!usuarioData) {
          console.error("Error al actualizar la contraseña:");
          res
            .status(500)
            .send({ mensaje: "Error al actualizar la contraseña" });
          return;
        }

        res.send({ mensaje: "Contraseña actualizada con éxito" });
      });
    });
  }

  cambiarNombre(req, res) {
    const { id, nuevoNombre } = req.body;

    usuarioModel.actualizarNombre(id, nuevoNombre, (usuarioData) => {
      if (!usuarioData) {
        console.error("Error al actualizar el nombre:");
        res.status(500).send({ mensaje: "Error al actualizar el nombre" });
        return;
      }

      res.send({ mensaje: "Nombre actualizado con éxito" });
    });
  }
}

module.exports = UsuarioController;
