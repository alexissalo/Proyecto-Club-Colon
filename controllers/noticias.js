const NoticiasCategoriasModel = require("../models/noticias");
const modelNoticiasCategorias = new NoticiasCategoriasModel(); 

const modelDisciplina = require("../models/disciplina");
const disciplinaModel = new modelDisciplina();

const sanitizeHtml = require("sanitize-html");

// URL base del servidor de imágenes
const MEDIA_URL = "https://media.clubcolonchivilcoy.com"

class NoticiasCategoriasController {
    
    // LISTAR NOTICIAS
    listarNoticias(req, res) {
        const orden = req.query.orden || "reciente";
        const busqueda = req.query.busqueda || "";
        const pagina = parseInt(req.query.pagina) || 1;
        const filasPorPagina = parseInt(req.query.filasPorPagina) || 5;

        disciplinaModel.listarDisciplinas((disciplinaData) => {
            modelNoticiasCategorias.listarCategorias((categoriasData) => {
                modelNoticiasCategorias.listarNoticias((noticiasData) => {
                    if (!noticiasData) {
                        return res.status(500).send("Error al obtener las noticias");
                    }
                    
                    // Filtrado
                    let noticiasFiltradas = noticiasData;
                    if (busqueda.trim() !== "") {
                        const termino = busqueda.toLowerCase();
                        noticiasFiltradas = noticiasFiltradas.filter(noticia =>
                            noticia.titulo.toLowerCase().includes(termino) ||
                            (noticia.subtitulo && noticia.subtitulo.toLowerCase().includes(termino))
                        );
                    }

                    // Ordenamiento
                    switch (orden) {
                        case "reciente": noticiasFiltradas.sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion)); break;
                        case "antiguo": noticiasFiltradas.sort((a, b) => new Date(a.fecha_publicacion) - new Date(b.fecha_publicacion)); break;
                        case "az": noticiasFiltradas.sort((a, b) => a.titulo.localeCompare(b.titulo)); break;
                        case "za": noticiasFiltradas.sort((a, b) => b.titulo.localeCompare(a.titulo)); break;
                    }

                    // Paginación
                    const totalNoticias = noticiasFiltradas.length;
                    const totalPaginas = Math.ceil(totalNoticias / filasPorPagina);
                    const indiceInicio = (pagina - 1) * filasPorPagina;
                    const noticiasPaginadas = noticiasFiltradas.slice(indiceInicio, indiceInicio + filasPorPagina);

                    res.render("dashboard/noticias", {
                        rolId: req.rolId,
                        rolNombre: req.rolNombre,
                        noticias: noticiasPaginadas,
                        disciplinas: disciplinaData,
                        categorias: categoriasData,
                        orden,
                        busqueda,
                        pagina,
                        totalPaginas
                    });
                }); 
            });
        });
    }

    // MOSTRAR EDICIÓN (Corregido: Sin duplicados)
    mostrarEdicionNoticia(req, res) {
        const { id } = req.params;

        // 1. Buscamos TODAS las categorías
        modelNoticiasCategorias.listarCategorias((categoriasData) => {
            // 2. Buscamos la noticia
            modelNoticiasCategorias.obtenerNoticiaPorId(id, (noticiaData) => {
                if (!noticiaData || noticiaData.length === 0) {
                    return res.status(404).send("Noticia no encontrada");
                }

                res.render("dashboard/editarNoticia", {
                    rolId: req.rolId,
                    rolNombre: req.rolNombre,
                    noticia: noticiaData[0],
                    categorias: categoriasData // Enviamos las categorías para el select
                });
            });
        });
    }

    // AGREGAR NOTICIA
    agregarNoticia(req, res) {
        const { titulo, subtitulo, contenido, id_categoria, tags } = req.body;
        // La imagen viene de Multer
        const imagen_principal = req.file
            ? `${MEDIA_URL}/noticias/${req.file.filename}`
            : null;

        if (!titulo || !contenido || !id_categoria || !tags) {
            return res.status(400).json({ message: "Falta completar campos obligatorios", ok: false });
        }

        const contenidoSeguro = sanitizeHtml(req.body.contenido, {
            allowedTags: [
                'p', 'b', 'i', 'u', 'strong', 'em',
                'ul', 'ol', 'li',
                'a', 'br'
            ],
            allowedAttributes: {
                a: ['href', 'target']
            }
        });

        modelNoticiasCategorias.agregarNoticia(
            { titulo, subtitulo, contenidoSeguro, id_categoria, tags, imagen_principal },
            (noticiaData) => {
                if (!noticiaData) {
                    return res.status(500).json({ message: "Error al agregar la noticia", ok: false });
                }
                res.json({ message: "Noticia agregada con éxito", ok: true });
            }
        );
    }

    // ACTUALIZAR NOTICIA
    actualizarNoticia(req, res) {
        const { id } = req.params;
        const { titulo, subtitulo, contenido, id_categoria, tags } = req.body;
        
        if (!titulo || !contenido || !id_categoria || !tags) {
            return res.status(400).json({ message: "Falta completar campos obligatorios", ok: false });
        }


        console.log(contenido);
        
        const contenidoSeguro = sanitizeHtml(String(contenido || ""), {
            allowedTags: [
                'p', 'b', 'i', 'u', 'strong', 'em',
                'ul', 'ol', 'li',
                'a', 'br'
            ],
            allowedAttributes: {
                a: ['href', 'target']
            }
        });

        // 1. Buscamos la noticia actual para ver la foto vieja
        modelNoticiasCategorias.obtenerNoticiaPorId(id, (data) => {
            if (!data || data.length === 0) {
                return res.status(404).json({ message: "Noticia no encontrada", ok: false });
            }
            const noticiaActual = data[0]; 
            
            // 2. Decidimos qué imagen usar
            let imagenFinal;
            if (req.file) {
                // Nueva foto
                imagenFinal = `/var/www/media/noticias/${req.file.filename}`;
            } else {
                // Mantenemos la vieja
                imagenFinal = noticiaActual.imagen_principal;
            }

            // 3. Actualizamos en base de datos
            modelNoticiasCategorias.actualizarNoticia(
                id,
                { titulo, subtitulo, contenidoSeguro, id_categoria, tags, imagen_principal: imagenFinal },
                (noticiaData) => {
                    if (!noticiaData) {
                        return res.status(500).json({ message: "Error al actualizar", ok: false });
                    }
                    res.json({ message: "Noticia actualizada con éxito", ok: true });
                }
            );
        });
    }

    // ELIMINAR NOTICIA
    eliminarNoticia(req, res) {
        const { id } = req.params;
        modelNoticiasCategorias.eliminarNoticia(id, (noticiaData) => {
            if (!noticiaData) {
                return res.status(500).json({ message: "Error al eliminar", ok: false });
            }
            res.status(200).json({ message: "Noticia eliminada con éxito", ok: true });
        });
    }
}

module.exports = NoticiasCategoriasController;