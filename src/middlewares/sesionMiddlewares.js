
const verificarAutenticacionApi = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(202).json({ error: 'No autorizado' });
    }
    next();
};

const verificarAutenticacion = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/'); 
    }
    next();
};


const verificarAdmin = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.rol !== 'admin') {
        return res.redirect('/'); // 🔹 Redirige si no es admin
    }
    next(); // 🔹 Continúa con la ejecución si es admin
};

export { verificarAutenticacion, verificarAdmin, verificarAutenticacionApi };
