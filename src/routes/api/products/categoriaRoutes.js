import express from "express";

const router = express.Router();

import { verificarAutenticacionApi, verificarAdmin } from '../../../middlewares/sesionMiddlewares.js'

// importar funciones encargadas de categorias
import * as catCon from '../../../controllers/api/categoriaControllers.js'


// rutas
router.post("/crearCategoria", 
    verificarAutenticacionApi,
    verificarAdmin,    
    catCon.crearCategoria    
);

router.post("/crearSubCategoria",
    verificarAutenticacionApi,
    verificarAdmin,  
    catCon.crearSubCategoria
);


export default router;
