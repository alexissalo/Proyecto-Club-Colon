// Importamos los modelos de usuario y disciplina
const modelUsuario = require("../models/usuario");
const usuarioModel = new modelUsuario();
const modelDisciplina = require("../models/disciplina");
const disciplinaModel = new modelDisciplina();

// Importamos la biblioteca bcrypt para encriptar contraseñas
const bcrypt = require("bcrypt");

class UsuarioController {
  // Muestra el formulario de login
  mostrarFormulario(req, res) {
    res.render("panel/login");
  }

  // Muestra la pagina de inicio del dashboard
  mostrarInicio(req, res) {
    // Obtenemos la lista de disciplinas
    disciplinaModel.listarDisciplinas((disciplinaData) => {
      if (disciplinaData === null) {
        return res.status(500).send("Error al obtener los datos de los socios");
      }
      // Renderizamos la pagina de inicio con los datos de la sesion y las disciplinas
      res.render("dashboard/inicio", {
        rolId: req.rolId,
        rolNombre: req.rolNombre,
        disciplinas: disciplinaData,
      });
    });
  }

  // Muestra la lista de usuarios
  mostrarUsuarios(req, res) {
    // Obtenemos la lista de roles
    usuarioModel.listarRoles((rolesData) => {
      if (!rolesData) {
        return res.status(500).send("Error al obtener los datos de los roles");
      }
      // Obtenemos la lista de usuarios
      usuarioModel.listarUsuarios((usuariosData) => {
        if (!usuariosData) {
          return res
            .status(500)
            .send("Error al obtener los datos de los usuarios");
        }
        // Obtenemos la lista de disciplinas
        disciplinaModel.listarDisciplinas((disciplinaData) => {
          if (!disciplinaData) {
            return res
              .status(500)
              .send("Error al obtener los datos de las disciplinas");
          }
          // Renderizamos la pagina de usuarios con los datos de la sesion, roles, usuarios y disciplinas
          res.render("dashboard/usuarios", {
            usuarios: usuariosData,
            rolId: req.rolId,
            rolNombre: req.rolNombre,
            disciplinas: disciplinaData,
            roles: rolesData,
          });
        });
      });
    });
  }

  // Maneja el login de un usuario
  login(req, res) {
    const { email, password } = req.body;

    // Validamos el usuario y contraseña
    usuarioModel.validarUsuario(email, password, (usuarioData) => {
      if (usuarioData === null) {
        return res.status(500).send("Error al obtener los datos de los socios");
      }

      if (!usuarioData) {
        return res
          .status(401)
          .json({ message: "Correo o contraseña incorrectos" });
      }

      // Verificamos la contraseña
      const isValidContraseña = bcrypt.compare(password, usuarioData.password);

      if (!isValidContraseña) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }

      // Establecemos la sesión del usuario
      req.session.userId = usuarioData.id;
      req.session.rolId = usuarioData.id_rol;
      req.session.rolNombre = usuarioData.rol_nombre;

      req.session.save((err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error al guardar la sesión" });
        }
        res.json({ message: "Logueado correctamente" });
      });
    });
  }

  // Maneja el logout de un usuario
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }
      res.redirect("/login");
    });
  }

  // Metodo para registrar un nuevo usuario
  async registrarUsuario(req, res) {
    // Obtenemos los datos del formulario de registro
    const { nombre, email, id_rol } = req.body;

    const contraseña="colon"

    try {
      // Encriptamos la contraseña
      const hashedContraseña = await bcrypt.hash(contraseña, 10);

      // Creamos el usuario
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

  // Metodo para mostrar la cuenta del usuario
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

  // Metodo para cambiar la contraseña de un usuario
  async cambiarContraseña(req, res) {
    // Obtenemos los datos del cuerpo de la solicitud
    const { id, contraseñaActual, nuevaContraseña } = req.body;

    const nuevaContraseñaHasheada = await bcrypt.hash(nuevaContraseña, 10);

    // Verificamos la contraseña actual del usuario
    usuarioModel.verificarContraseña(id, (usuarioData) => {
      // Si no se encuentra el usuario, devolvemos un error
      if (!usuarioData) {
        console.error("Error al verificar la contraseña actual:");
        res
          .status(500)
          .send({ mensaje: "Error al verificar la contraseña actual" });
        return;
      }

      // Obtenemos la contraseña actual hash del usuario
      const contraseñaActualHash = usuarioData.password;

      // Verificamos si la contraseña actual introducida es correcta
      const esContraseñaCorrecta = bcrypt.compare(
        contraseñaActual,
        contraseñaActualHash
      );

      // Si la contraseña actual es incorrecta, devolvemos un error
      if (!esContraseñaCorrecta) {
        res
          .status(401)
          .send({ mensaje: "La contraseña actual introducida es incorrecta" });
        return;
      }

      // Actualizamos la contraseña del usuario
      usuarioModel.actualizarContraseña(id, nuevaContraseñaHasheada, (usuarioData) => {
        // Si ocurre un error al actualizar la contraseña, devolvemos un error
        if (!usuarioData) {
          console.error("Error al actualizar la contraseña:");
          res
            .status(500)
            .send({ mensaje: "Error al actualizar la contraseña" });
          return;
        }

        // Si todo sale bien, devolvemos un mensaje de exito
        res.send({ mensaje: "Contraseña actualizada con exito" });
      });
    });
  }

  // Metodo para cambiar el nombre del usuario
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

  borrarUsuario(){
    const {id}=req.params

    usuarioModel.borrarUsuario(id,(usuarioData)=>{
      res.json(usuarioData)
    })
  }
}

module.exports = UsuarioController;
