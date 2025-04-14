import express from 'express'

import { handleUpload, validateFields } from '../../middlewares/ProductosMiddlewares.js'
import { verificarAutenticacion, verificarAdmin } from '../../middlewares/sesionMiddlewares.js'

// importar funciones encargadas de productos
import {crearProducto, 
        listarProductos, 
        eliminarProducto, 
        actualizarProducto, 
        listarProducto, 
        } from '../../controllers/api/productoControllers.js'


const router = express.Router()

// rutas
router.post('/crearProducto', 
    verificarAutenticacion,
    verificarAdmin,
    handleUpload,    // Maneja la subida de archivos y sus errores
    validateFields,  // Valida los campos del formulario
    crearProducto    // Procesa la creación del producto
)

router.post('/listarProductos', listarProductos)

router.post('/listarProducto/:id', listarProducto)

router.delete('/eliminarProducto/:id', 
    verificarAutenticacion,
    verificarAdmin,
    eliminarProducto)

router.patch('/actualizarProducto/:id', 
    verificarAutenticacion,
    verificarAdmin,
    handleUpload,    // Maneja la subida de archivos y sus errores
    validateFields,  // Valida los campos del formulario
    actualizarProducto)


export default router
