// Importamos el modelo de usuario
const modelUsuario = require("../models/usuario");
const usuarioModel = new modelUsuario();

// Clase que contiene middleware para autenticación y autorización
class authMiddlewares {
  // Verifica si el usuario tiene una sesión activa
  verificarSesion(req, res, next) {
    // Si no hay sesión, redirigimos al login
    if (!req.session.userId) {
      return res.redirect("/login"); 
    }
    // Si hay sesión, establecemos las propiedades userId, rolId y rolNombre en req
    req.userId = req.session.userId;
    req.rolId = req.session.rolId;
    req.rolNombre = req.session.rolNombre;

    // Continuamos con el siguiente middleware o controlador
    next();
  }

  // Verifica si el usuario tiene un rol específico
  verificarRol(roles) {
    return async (req, res, next) => {
      try {
        // Validamos el rol del usuario
        const rol = await usuarioModel.validarRol(req.rolId);
        if (!rol) {
          // Si el rol no existe, devolvemos un error 404
          return res
            .status(404)
            .render("404", { status: 404, message: "Rol no encontrado" });
        }

        // Verificamos si el rol del usuario se encuentra en el arreglo de roles permitidos
        if (roles.includes(rol.nombre) || roles.includes("todos")) {
          // Si el rol es permitido, continuamos con el siguiente middleware o controlador
          next();
        } else {
          // Si el rol no es permitido, devolvemos un error 401
          return res.status(401).render("404", {
            status: 401,
            message: "No tenes el rol necesario para acceder a este recurso.",
          });
        }
      } catch (error) {
        // Si ocurre un error, devolvemos un error 500
        res.status(500).send(error);
      }
    };
  }

  // Verifica si el usuario tiene acceso a una disciplina específica
  verificarAccesoDisciplina(disciplinaParam) {
    return async (req, res, next) => {
      try {
        // Validamos el rol del usuario
        const rol = await usuarioModel.validarRol(req.rolId);
        if (!rol) {
          // Si el rol no existe, devolvemos un error 404
          return res
            .status(404)
            .render("404", { status: 404, message: "Rol no encontrado" });
        }

        // Obtenemos la disciplina desde los parámetros o el cuerpo de la solicitud
        const disciplina = req.params[disciplinaParam] || req.body[disciplinaParam];

        // Verificamos si el rol del usuario es admin o coordinador de la disciplina
        if (
          rol.nombre === `admin_${disciplina}` ||
          rol.nombre === `coordinador_${disciplina}`
        ) {
          // Si el usuario tiene acceso, continuamos con el siguiente middleware o controlador
          next();
        } else {
          // Si el usuario no tiene acceso, devolvemos un error 401
          return res.status(401).render("404", {
            status: 401,
            message: "No tenes el rol necesario para acceder a este recurso.",
          });
        }
      } catch (error) {
        // Si ocurre un error, devolvemos un error 500
        res.status(500).send(error);
      }
    };
  }
}

// Exportamos la clase authMiddlewares
module.exports = authMiddlewares;
