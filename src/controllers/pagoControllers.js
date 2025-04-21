import { consultarEstadoCliente, insertarEstadoPendiente, verificarDatosDeEnvio} from "../models/pagoModels.js";

export async function validarUsuario(req, res, next) {
    if (!req.user) {
        return res.redirect('/sesion');
    }

    try {
        const resultado = await consultarEstadoCliente(req.user.id);

        if (!resultado || resultado.length === 0) {
            // Si no existe, lo insertamos como pendiente
            await insertarEstadoPendiente(req.user.id);
            return res.redirect('/perfil');
        }
        const estado = resultado[0].estado;

        if (estado === 'rechazado') {
            return res.redirect('/perfil');
        }

        if (estado === 'pendiente') {
            return res.res('/perfil');
        }

        // Verificamos si el usuario tiene datos de envío
        const datosEnvio = await verificarDatosDeEnvio(req.user.id);

        if (!datosEnvio || datosEnvio.length === 0) {
            // Si no tiene datos de envío, redirigimos para que los ingrese
            return res.redirect('/datos-envio');
        }

        // Si todo está bien, pasamos al siguiente middleware o controlador
        return next();

    } catch (error) {
        console.error('Error validando usuario:', error);
        return res.redirect('/');
    }
}

export async function pagoUsuarioControllers (req, res) {
    res.render('pago', {
        usuario: req.user
    })
}


export function renderDatosEnvio(req, res) {
    res.render('datos-envio'); // Renderiza la vista para que el usuario ingrese sus datos
}
