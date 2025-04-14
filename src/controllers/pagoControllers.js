import { consultarEstadoCliente, insertarEstadoPendiente, verificarDatosDeEnvio} from "../models/pagoModels.js";

export async function validarUsuario(req, res, next) {
    if (!req.user) {
        return res.redirect('/sesion');
    }

    try {
        const resultado = await consultarEstadoCliente(req.user.id);
        console.log(req.user.id);
        
        if (!resultado || resultado.length === 0) {
            // Si no existe, lo insertamos como pendiente
            await insertarEstadoPendiente(req.user.id);
            return res.redirect('/perfil?mensaje=Tu+solicitud+fue+enviada+para+aprobación');
        }

        const estado = resultado[0].estado;
        console.log(estado);

        if (estado === 'rechazado') {
            return res.redirect('/perfil?mensaje=Tu+solicitud+fue+rechazada');
        }

        if (estado === 'pendiente') {
            return res.res('mi chino tenga paciencia');
        }

        // Verificamos si el usuario tiene datos de envío
        const datosEnvio = await verificarDatosDeEnvio(req.user.id);
        console.log(datosEnvio);
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
