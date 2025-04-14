
const verificarAutenticacion = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/'); // 🔹 Redirige si el usuario no está autenticado
    }
    next(); // 🔹 Continúa con la ejecución si está autenticado
};

const verificarAdmin = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.rol !== 'admin') {
        return res.redirect('/'); // 🔹 Redirige si no es admin
    }
    next(); // 🔹 Continúa con la ejecución si es admin
};

export { verificarAutenticacion, verificarAdmin };
