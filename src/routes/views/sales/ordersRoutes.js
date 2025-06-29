import express from "express";
const router = express.Router();

import { verificarAutenticacion, verificarAdmin } from '../../../middlewares/sesionMiddlewares.js'

// Rutas para el tema de pedidos que renderizan vistas
router.get('/orders/overview', verificarAutenticacion, verificarAdmin, async (req, res) => {
    res.render('admin/pedidos/pedidos', {
        usuario: req.user
    })
})

router.get('/orders/shipments-overview', verificarAutenticacion, verificarAdmin, async (req, res) => {
    res.render('admin/pedidos/envios', {
        usuario: req.user
    })
})

export default router; 