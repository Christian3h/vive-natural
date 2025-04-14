import express from "express";
const router = express.Router();

import {infoProducto, crearProductoAdmin} from '../../../controllers/api/productoControllers.js'

import { verificarAutenticacion, verificarAdmin } from '../../../middlewares/sesionMiddlewares.js'

// importaciones de controllers para las rutas 

import {adminInicioControllers,
        productosInicioControllers,
        categoriaCrearAdminControllers
        
} from '../../../controllers/api/admin/adminControllers.js'

// 🔹 Dashboard (solo autenticados)

// RUTAS NUEVAS PARA PROGRAMAR 

router.get('/' , verificarAutenticacion, verificarAdmin, adminInicioControllers);

// rutas para los productos

router.get('/productos', verificarAutenticacion, verificarAdmin, productosInicioControllers );

router.get("/producto/crear", verificarAutenticacion, verificarAdmin, crearProductoAdmin)

router.get("/producto/:id", verificarAutenticacion, verificarAdmin, infoProducto);

router.get("/categoria/crear", verificarAutenticacion, verificarAdmin, categoriaCrearAdminControllers)

// router.get('/dashboard', verificarAutenticacion, verificarAdmin, dashboardAdminControllers);

// router.get("/dashboard/:seccion", verificarAutenticacion, verificarAdmin, dashboardSeccionAdminControllers);

// 

// 

// 


// router.get("/categoria/crearSub", verificarAutenticacion, verificarAdmin, subCategoriaCrearAdminControllers)


export default router;
