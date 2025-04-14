
export async function inicioSesionControllers(req, res) {
    res.render('login/login', {
        user: req.user
    })
}

export async function inicioSesionGoogleControllers (req, res){

}

import passport  from "passport";

export async function creacionRedireccionSesionGoogleControllers (req, res){
    passport.authenticate('google', { failureRedirect: '/sesion'}),
    (req, res) => {
        res.redirect('/sesion/admin/dashboard');
    }
}

export async function cerrarSesionControllers (req, res) {
    req.logout(() => {
        res.redirect('/');
    });
}