// Importamos la conexion a la base de datos
const pool = require("../database/db")
// Definimos la clase NoticiasCategoriasModel
class NoticiasCategoriasModel {
    // Metodo para listar todas las categorias
    async listarCategorias(callback) {
        try {
            // Consulta SQL para obtener todas las categorias
            let sql = "SELECT * FROM categorias_noticias";
        
        // Ejecutamos la consulta con el pool de conexiones y obtenemos los resultados
        const [result] = await pool.query(sql, []);
        // Llamamos al callback con los resultados obtenidos de la consulta
        callback(result);

        } catch (error) {
            // Si ocurre un error, lo mostramos en la consola
            console.error('Error al listar las categorias:' , error);
    
        }
    }

    // Metodo para listar todas las noticias desde la base de datos
     async listarNoticias(callback) {
        try {
            // Calculamos el offset para la paginación
            
            // Consulta SQL para seleccionar todas las noticias, uniendo la tabla de categorías para obtener el nombre de la categoría
            let sql = `SELECT noticias.*, categorias_noticias.nombre AS categoria_nombre
                       FROM noticias
                       JOIN categorias_noticias ON noticias.id_categoria = categorias_noticias.id_categoria`;
            
            // Ejecutamos la consulta con el pool de conexiones y obtenemos los resultados
            const [result] = await pool.query(sql, []);

            // Llamamos al callback con los resultados obtenidos de la consulta
            callback(result);
            } catch (error) {
            // Si ocurre un error, lo mostramos en la consola
            console.error('Error al listar las noticias:' , error);
            }
        }
    
    // Metodo para agregar una nueva noticia a la base de datos
    async agregarNoticia(noticiaData, callback) {
        try {
            // Extraemos los datos de la noticia recibidos desde el frontend (como titulo, subtitulo, contenido, etc.)
         const { titulo, subtitulo, contenidoSeguro, id_categoria, tags, imagen_principal } = noticiaData;
        
            // Consulta SQL para insertar una nueva noticia en la base de datos
            let sql = `INSERT INTO noticias (titulo, subtitulo, contenido, id_categoria, tags, imagen_principal)
                       VALUES (?, ?, ?, ?, ?, ?)`;

            // Ejecutamos la consulta con los datos de la noticia recibidos
            const [result] = await pool.query(sql, [titulo, subtitulo, contenidoSeguro, id_categoria, JSON.stringify(tags), imagen_principal, ]);

            // Llamamos al callback con los resultados de la consulta, que es el ID de la noticia agregada
            callback(result);
        } catch (error) {
            // Si ocurre un error, lo mostramos en la consola
            console.error('Error al agregar la noticia:', error);
        }
    }

    // Metodo para obtener una noticia por su ID
    async obtenerNoticiaPorId(id, callback) {
        try {
            // Consulta SQL para obtener los detalles de una noticia por su ID
            let sql = `SELECT noticias.*, categorias_noticias.nombre AS categoria_nombre
                       FROM noticias
                       JOIN categorias_noticias ON noticias.id_categoria = categorias_noticias.id_categoria
                       WHERE id_noticia = ?`;
            
            // Ejecutamos la consulta con el ID de la noticia
            const [result] = await pool.query(sql, [id]);

            // Llamamos al callback con los resultados obtenidos
            callback(result);
        } catch (error) {
            // Si ocurre un error, lo mostramos en la consola
            console.error('Error al obtener la noticia por ID:' , error);
        }
    }

    // Metodo para actualizar una noticia
    async actualizarNoticia(id, noticiaData, callback) {
        try {
            const { titulo, subtitulo, contenidoSeguro, id_categoria, tags, imagen_principal } = noticiaData;


            // Consulta SQL para actualizar una noticia por su ID
            let sql = `UPDATE noticias
                       SET titulo = ?, subtitulo = ?, contenido = ?, id_categoria = ?, tags = ?, imagen_principal = ?
                       WHERE id_noticia = ?`;

            
            // Ejecutamos la consulta para actualizar la noticia
            const [result] = await pool.query(sql, [titulo, subtitulo, contenidoSeguro, id_categoria, JSON.stringify(tags), imagen_principal, id]);


            // Llamamos al callback con el resultado de la actualizacion
            callback(result);
        } catch (error) {
            // Si ocurre un error, lo mostramos en la consola
            console.error('Error al actualizar la noticia:' , error);
        }
    }


    // Metodo para eliminar una noticia por ID
    async eliminarNoticia(id, callback) {
        try {
            // Consulta SQL para eliminar una noticia por su ID
            let sql = "DELETE FROM noticias WHERE id_noticia = ?";

            // Ejecutamos la consulta para eliminar la noticia
            const [result] = await pool.query(sql, [id]);

            // Llamamos al callback con el resultado de la eliminacion
            callback(result);
        } catch (error) {
            // Si ocurre un error, lo mostramos en la consola
            console.error('Error al eliminar la noticia:' , error);
        }
    }
}    

// Exportamos el modelo para que pueda ser usado en otras partes del proyecto
module.exports = NoticiasCategoriasModel;