import multer from 'multer' 
import path from 'path'
import crypto from 'crypto'


// Configuración de multer para el almacenamiento de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'public/uploads/productos'))
    },
    filename: function (req, file, cb) {
        // Generar un nombre único usando UUID y mantener la extensión original
        const uniqueFilename = crypto.randomUUID() + path.extname(file.originalname);
        cb(null, uniqueFilename);
    }
})

// Middleware para validar campos requeridos de la creacion de productos 
const validateFields = (req, res, next) => {
    const { nombre, descripcion, categoria, id_subcategoria, precio } = req.body
    
    if (!nombre || !descripcion || !categoria || !id_subcategoria || !precio) {
        return res.status(400).json({
            error: 'Faltan campos requeridos',
            camposRequeridos: {
                nombre: 'string',
                descripcion: 'string',
                categoria: 'string (ID)',
                id_subcategoria: 'string (ID)',
                precio: 'number'
            }
        })
    }
    next()
}

// Configuración de multer con validación de archivos de la creacion de productos 
const uploadMiddleware = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.mimetype)) {
            cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG y WEBP'))
            return
        }
        cb(null, true)
    }
}).array('imagenes', 10)


// Middleware para manejar la subida de archivos de la creacion de productos
const handleUpload = (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({ 
                    error: 'Campo de archivo incorrecto',
                    detalles: 'Usa "imagenes" como nombre del campo en form-data'
                })
            } else if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({ 
                    error: 'Límite de archivos excedido',
                    detalles: 'Solo puedes subir hasta 10 imágenes por producto.'
                })
            }
            return res.status(400).json({ 
                error: 'Error en la subida de archivos',
                detalles: err.message
            })
        }
        if (err) {
            return res.status(400).json({ 
                error: 'Error en la validación de archivos',
                detalles: err.message
            })
        }
        next()
    })
}

export { uploadMiddleware, handleUpload, validateFields }

