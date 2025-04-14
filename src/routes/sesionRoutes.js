import express from 'express'
import passport from 'passport'
import { verificarAutenticacion } from '../middlewares/sesionMiddlewares.js'

import {inicioSesionControllers,
        cerrarSesionControllers
} from '../controllers/sesionControllers.js'

const router = express.Router()

//pagina de inicioaaa
router.get('/', inicioSesionControllers)

// 🔹 Inicio de sesión con Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 🔹 Callback de Google
router.get('/auth/google/create',
    passport.authenticate('google', { failureRedirect: '/sesion'}),
    (req, res) => {
        res.redirect('/sesion/admin/');
    }
);

// 🔹 Logout
router.get('/logout', verificarAutenticacion,  cerrarSesionControllers);

//============== rutas

// VALIDAR USUARIO

router.post('/usuario/actual', verificarAutenticacion, (req, res) => {
    res.json({ usuario: req.user });
});


// seccion del admin (se encarga de las rutas del admin, para todo el teca de adminstracion de producttos y finanzas )
import adminRoutes from '../routes/api/admin/adminRoutes.js'
router.use('/admin', adminRoutes)


export default router

