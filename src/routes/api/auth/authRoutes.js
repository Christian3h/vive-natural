import express from 'express'

import { verificarAutenticacionApi } from '../../../middlewares/sesionMiddlewares.js'
import {cerrarSesionControllers} from '../../../controllers/sesionControllers.js'

const router = express.Router()

// Logout
router.get('/logout', verificarAutenticacionApi, cerrarSesionControllers);

// Validar usuario
router.get('/user/current', verificarAutenticacionApi, (req, res) => {
    res.json({ user: req.user });
});

export default router

