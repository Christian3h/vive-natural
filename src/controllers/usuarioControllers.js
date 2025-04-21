
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

import {consultarCategoria} from '../models/productoModels.js'

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