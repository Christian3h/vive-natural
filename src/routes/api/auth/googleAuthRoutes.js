
import express from 'express'
import passport from 'passport'

const router = express.Router()

// Inicio de sesión con Google
router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback de Google
router.get('/create',
    passport.authenticate('google', { failureRedirect: '/sesion' }),
    (req, res) => {
        res.redirect('/admin/');
    }
);

export default router;