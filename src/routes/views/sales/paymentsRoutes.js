import express from 'express'

const router = express.Router();

// tema de pagos en mi pagina jeje xd

import * as sakesCon from '../../../controllers/pagoControllers.js'

// Import the new processing controllers
import { procesarEnvioController, procesarPedidoController } from '../../../controllers/views/orderProcessingControllers.js';

// perfil 

// tema de pagos en mi pagina jeje xd

router.get('/pago', sakesCon.validarUsuario, sakesCon.pagoUsuarioControllers)

router.get('/datos-envio', sakesCon.renderDatosEnvio)

// Ruta para procesar el pedido // tiene logica
router.get('/procesando', sakesCon.validarUsuario, async (req, res) => {
    await procesarPedidoController(req, res); // Llamar al controlador importado
});

export default router;

//ruta que falta por corregir

// router.post('/procesar-envio', sakesCon.verificarAutenticacion, async (req, res) => {
//     await procesarEnvioController(req, res); // Llamar al controlador importado
// });

