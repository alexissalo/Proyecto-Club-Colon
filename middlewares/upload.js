const multer= require("multer")
const path= require("path")
const crypto = require("crypto")

const storage= multer.diskStorage({
    destination:"./public/uploads",
    filename: function(req,file,cb){
        cb(null, file.fieldname+"-"+Date.now()+ path.extname(file.originalname))
    }
})

const uploads= multer({
    storage:storage,
    limits:{fileSize:1024 * 1024},
    fileFilter: function (req, file, cb){
        const mimeTypePermitidos=["image/jpg","image/png","image/jpeg","application/pdf"]
        if (mimeTypePermitidos.includes(file.mimetype)) {
            cb(null,true)
        }else{
            cb(new Error("Solo se permiten archivos de tipo imagen (jpg, jpeg, png) y PDF"));
        }
    }

})


// ─── FUNCIÓN PARA /root/imagenes (nueva) ────────────────────────────────────

const CARPETAS_PERMITIDAS = ["productos", "noticias", "otros"]
const BASE_PATH = "/var/www/media"

// ✅ Recibe la subcarpeta como parámetro en vez de leerla del body
function uploadsMedia(subcarpeta) {
    const carpeta = CARPETAS_PERMITIDAS.includes(subcarpeta) ? subcarpeta : "otros"

    const storageMedia = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(BASE_PATH, carpeta))
        },
        filename: function (req, file, cb) {
            const nombreAleatorio = crypto.randomBytes(16).toString("hex")
            const ext = path.extname(file.originalname).toLowerCase()
            cb(null, nombreAleatorio + ext)
        }
    })

    return multer({
        storage: storageMedia,
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: function (req, file, cb) {
            const mimeTypesPermitidos = ["image/jpg", "image/png", "image/jpeg", "application/pdf"]
            const extsPermitidas = [".jpg", ".jpeg", ".png", ".pdf"]

            const ext = path.extname(file.originalname).toLowerCase()
            const mimeValido = mimeTypesPermitidos.includes(file.mimetype)
            const extValida = extsPermitidas.includes(ext)

            if (mimeValido && extValida) {
                cb(null, true)
            } else {
                cb(new Error("Solo se permiten archivos de tipo imagen (jpg, jpeg, png) y PDF"))
            }
        }
    })
}

module.exports = { uploads, uploadsMedia, BASE_PATH }
