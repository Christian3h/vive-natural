import express from 'express';
import { validarStockCarritoControllers, 
        cargarCarritoControllers, 
        consultarCarritoControllers,
        restarStockCarritoControllers,
        vaciarCarritoControllers } from '../../controllers/carritoControllers.js';

const router = express.Router();

router.post('/validar-stock', validarStockCarritoControllers);

router.post('/cargar-carrito', cargarCarritoControllers);

router.post('/consultar-carrito', consultarCarritoControllers);

router.post('/restar-stock', restarStockCarritoControllers);

router.delete('/vaciar-carrito', vaciarCarritoControllers);

export default router;
