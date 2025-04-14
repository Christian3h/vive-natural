import express from "express";

const router = express.Router();

import { verificarAutenticacion, verificarAdmin } from '../../middlewares/sesionMiddlewares.js'

// importar funciones encargadas de categorias
import { crearCategoria, crearSubCategoria } from '../../controllers/api/categoriaControllers.js'


// rutas
router.post("/crearCategoria", 
    verificarAutenticacion,
    verificarAdmin,    
    crearCategoria    
);

router.post("/crearSubCategoria",
    verificarAutenticacion,
    verificarAdmin,  
    crearSubCategoria
);


export default router;
