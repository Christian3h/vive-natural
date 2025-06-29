import express from 'express'
import {inicioSesionControllers} from '../../../controllers/sesionControllers.js'

const router = express.Router();

router.use('/login', inicioSesionControllers)

export default router;
