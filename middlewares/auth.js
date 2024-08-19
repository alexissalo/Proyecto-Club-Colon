const jwt = require("jsonwebtoken");
const modelUsuario = require("../models/usuario");
const usuarioModel = new modelUsuario();

class authMiddlewares {
  verificarSesion(req, res, next) {
    const token = req.headers.cookie;

    if (!token) {
      return res.redirect("/login"); // Redirige al login si no hay token
    }

    try {
      const tokenSpliteado = token.split("=")[1];

      jwt.verify(tokenSpliteado, "secret", (err, decoded) => {
        if (err) {
          return res.redirect("/login"); // Redirige al login si el token es inválido
        }
        req.userId = decoded.userId;
        req.rolId = decoded.rolId;
        req.rolNombre=decoded.rolNombre
        next();
      });
    } catch (error) {
      return res.redirect("/login");
    }
  }

  verificarRol(roles) {
    return async (req, res, next) => {
      try {
        const rol = await usuarioModel.validarRol(req.rolId);
        if (!rol) return res.status(404).send({ message: "Rol no encontrado" });

        if (roles.includes(rol.nombre) || roles.includes("todos")) {
          next();
        } else {
          res
            .status(403)
            .send({
              message:
                "No tienes el rol necesario para acceder a este recurso.",
            });
        }
      } catch (error) {
        res.status(500).send(error);
      }
    };
  }
}

module.exports = authMiddlewares;
