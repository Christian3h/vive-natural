import express from 'express';
import * as cartCon from '../../../controllers/carritoControllers.js';
import { verificarAutenticacionApi } from '../../../middlewares/sesionMiddlewares.js';

const router = express.Router();

router.post('/validate-stock', verificarAutenticacionApi, cartCon.validarStockCarritoControllers);

router.post('/load-cart', verificarAutenticacionApi, cartCon.cargarCarritoControllers);

router.post('/get-cart', verificarAutenticacionApi, cartCon.consultarCarritoControllers);

router.post('/decrease-stock', verificarAutenticacionApi, cartCon.restarStockCarritoControllers);

router.delete('/empty-cart', verificarAutenticacionApi, cartCon.vaciarCarritoControllers);

export default router;
