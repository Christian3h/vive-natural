import express from 'express';

import * as usersCon from '../../../controllers/views/users/usersControllers.js'
import { verificarAutenticacion } from '../../../middlewares/sesionMiddlewares.js'


const router = express.Router();

//index
router.get('/', usersCon.inicioUsuarioControllers);

//carito de compras 
router.get('/carrito', usersCon.carritoUsuarioControllers)

// tienda de productos donde va apoder filtrar bustar y todo el tema 
router.get('/tienda', usersCon.tiendaUsuarioControllers)

// contacto 
router.get('/contacto', usersCon.contactoUsuarioControllers)

// info 
router.get('/informacion', usersCon.infoUsuarioControllers)

//informacion especifica productos
router.get('/producto/:id', usersCon.infoProductoUsuarioControllers)


// perfil
router.get('/perfil', verificarAutenticacion, usersCon.perfilUsuarioControllers)
router.get('/perfil/settings', verificarAutenticacion, usersCon.perfilSettingsControllers)
router.post('/perfil/settings/editar-envio', verificarAutenticacion, usersCon.actualizarDatosEnvioPerfil)

export default router;