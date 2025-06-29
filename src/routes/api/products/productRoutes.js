import express from 'express'

import { handleUpload, validateFields } from '../../../middlewares/ProductosMiddlewares.js'
import { verificarAutenticacionApi, verificarAdmin } from '../../../middlewares/sesionMiddlewares.js'

// importar funciones encargadas de productos
import * as prodCon from '../../../controllers/api/productoControllers.js'

import * as adminCon from '../../../controllers/api/admin/adminControllers.js'


const router = express.Router()

// rutas
router.post('/createProduct', 
    verificarAutenticacionApi,
    verificarAdmin,
    handleUpload,    // Maneja la subida de archivos y sus errores
    validateFields,  // Valida los campos del formulario
    prodCon.crearProducto    // Procesa la creación del producto
)

router.post('/listProducts', prodCon.listarProductos)

router.post('/listProduct/:id', prodCon.listarProducto)

router.delete('/deleteProduct/:id', 
    verificarAutenticacionApi,
    verificarAdmin,
    prodCon.eliminarProducto)

router.patch('/updateProduct/:id', 
    verificarAutenticacionApi,
    verificarAdmin,
    handleUpload,    // Maneja la subida de archivos y sus errores
    validateFields,  // Valida los campos del formulario
    prodCon.actualizarProducto)

// Rutas para los productos (desde adminRoutes)
router.get('/products/overview', verificarAutenticacionApi, verificarAdmin, adminCon.productosInicioControllers)

//router.get("/products/create-form", verificarAutenticacionApi, verificarAdmin, crearProductoAdmin)

router.get("/products/:id/info", verificarAutenticacionApi, verificarAdmin, prodCon.infoProducto)

router.get("/categories/create-form", verificarAutenticacionApi, verificarAdmin, adminCon.categoriaCrearAdminControllers)

router.get("/subcategories/create-form", verificarAutenticacionApi, verificarAdmin, adminCon.subCategoriaCrearAdminControllers)


export default router
