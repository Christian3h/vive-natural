export async function inicioUsuarioControllers(req, res) {
    const usuario = req.isAuthenticated() ? req.user : null;
    res.render('index', {
        usuario, // Pasamos el usuario a la vista
    });
}

export async function infoProductoUsuarioControllers(req, res) {   
    res.render('producto', {
        usuario: req.user
    })
}

export async function perfilUsuarioControllers(req, res) {
    res.render('perfil', {
        usuario: req.user
    })
}

export async function carritoUsuarioControllers(req, res) {
    res.render('carrito', {
        usuario: req.user
    })
}

import {consultarCategoria} from '../../../models/productoModels.js'
import { obtenerDetallesUsuario, obtenerUltimosDatosEnvio, obtenerEstadoAprobacion, actualizarDatosEnvio } from '../../../models/usuarioModels.js'

export async function tiendaUsuarioControllers(req, res) {
    const categorias = await consultarCategoria()
    res.render('tienda', {
        usuario: req.user,
        categorias: categorias
    })
}
export async function contactoUsuarioControllers(req, res) {
    res.render('contacto', {
        usuario: req.user
    })
}

export async function infoUsuarioControllers(req, res){
    res.render('info', {
        usuario: req.user
    })
}

export async function perfilSettingsControllers(req, res){
    try {
        const id_usuario = req.user.id; // Asume que el ID de usuario está en req.user.id
        const usuarioDetalles = await obtenerDetallesUsuario(id_usuario);
        const datosEnvio = await obtenerUltimosDatosEnvio(id_usuario);
        const estadoAprobacion = await obtenerEstadoAprobacion(id_usuario);

        res.render('perfilSettingsControllers', {
            usuario: req.user, // Mantén esto si necesitas otros datos de req.user
            usuarioDetalles,
            datosEnvio,
            estadoAprobacion
        });
    } catch (error) {
        console.error('Error en perfilSettingsControllers:', error);
        res.status(500).send('Error al cargar la configuración del perfil');
    }
}

export async function actualizarDatosEnvioPerfil(req, res) {
    const { nombre, numero, ciudad, direccion } = req.body;
    const id_usuario = req.user.id; // Asume que el ID de usuario está en req.user.id

    try {
        await actualizarDatosEnvio(id_usuario, nombre, numero, ciudad, direccion);
        res.redirect('/perfil/settings?success=true'); // Redirigir con mensaje de éxito
    } catch (error) {
        console.error('Error al actualizar datos de envío:', error);
        res.redirect('/perfil/settings?error=true'); // Redirigir con mensaje de error
    }
}