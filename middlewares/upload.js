const multer= require("multer")
const path= require("path")

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

module.exports={uploads}