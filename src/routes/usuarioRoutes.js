import express from 'express'

const router = express.Router()

import {
    inicioUsuarioControllers,
    infoProductoUsuarioControllers,
    perfilUsuarioControllers,
    carritoUsuarioControllers,
    tiendaUsuarioControllers,
    contactoUsuarioControllers,
    infoUsuarioControllers,
    perfilSettingsControllers
} from '../controllers/front/usuarioControllers.js'

router.get('/', inicioUsuarioControllers);

router.get('/producto/:id', infoProductoUsuarioControllers)

// perfil 

router.get('/perfil', verificarAutenticacion, perfilUsuarioControllers)

router.get('/perfil/settings', verificarAutenticacion, perfilSettingsControllers)

// carrito de compras 
router.get('/carrito', carritoUsuarioControllers)

// tienda de productos donde va apoder filtrar bustar y todo el tema 
router.get('/tienda', tiendaUsuarioControllers)

// contacto 
router.get('/contacto', contactoUsuarioControllers)

// info 

router.get('/informacion', infoUsuarioControllers)

// tema de pagos en mi pagina jeje xd

import { validarUsuario, pagoUsuarioControllers, renderDatosEnvio } from '../controllers/pagoControllers.js'

router.get('/pago', validarUsuario, pagoUsuarioControllers)

router.get('/datos-envio', renderDatosEnvio)

import pool from '../models/bd.js'

router.post('/procesar-envio', async (req, res) => {

    procesarEnvio(req, res);

    async function procesarEnvio(req, res) {

        const { nombre, numero, ciudad, direccion } = req.body;
        const id_usuario = req.user.id; // Usuario autenticado
        const fecha_envio = new Date();

        try {
            const idBuffer = Buffer.from(id_usuario, 'hex');
            await pool.query(
                'INSERT INTO envios (id_usuario, nombre, numero, ciudad, direccion, fecha_envio) VALUES (?, ?, ?, ?, ?, ?)',
                [idBuffer, nombre, numero, ciudad, direccion, fecha_envio]
            );

            return res.redirect('/pago');
        } catch (error) {
            console.error('Error al guardar los datos de envío:', error);
            return res.status(500).send('Error al procesar los datos de envío');
        }
    }



});


import { obtenerCarritoModels } from "../models/carritoModels.js"; // Asegúrate de importar la conexión a la base de datos

// Ruta para procesar el pedido
router.get('/procesando', validarUsuario, async (req, res) => {
    const { metodo, cuotas, fecha } = req.query;

    if (!metodo || !cuotas || !fecha) {
        return res.status(400).send('Faltan parámetros en la solicitud');
    }

    try {
        // Llamamos a la función para procesar el pedido
        await procesarPedido(req, res);
    } catch (error) {
        console.error("Error al procesar el pedido:", error);
        return res.status(500).send('Hubo un error al procesar el pedido');
    }
});

import { insertarStock } from '../models/productoModels.js';
import { Console } from 'console';
import e from 'express';
import { verificarAutenticacion } from '../middlewares/sesionMiddlewares.js';

async function procesarPedido(req, res) {
    const id_usuario = req.user.id;
    const { metodo, cuotas, fecha } = req.query;
    let fechaLimite = null;
    if (fecha && !isNaN(Date.parse(fecha))) {
    fechaLimite = fecha;
    }
    try {
        // 1. Obtener productos del carrito
        const carrito = await obtenerCarritoModels(id_usuario);
        if (!carrito || carrito.length === 0) {
            return res.redirect('/carrito');
        }

        // 1.5. descontar stock para que si no hay stock suficiente no cargue una compra fantasma
        for (const item of carrito) {
            const nuevoStock = item.stock - item.cantidad;
            if (nuevoStock < 0) {
                return res.status(400).send('No hay suficiente stock para procesar el pedido');
            }
        }

        // 2. optiene el id de los datos de envio 
        const [envioRows] = await pool.query(
            `SELECT id_envio 
             FROM envios 
             WHERE id_usuario = UNHEX(?) 
             ORDER BY fecha_envio DESC 
             LIMIT 1`,
            [id_usuario.replace(/-/g, '')]
        );

        const id_envio = envioRows[0].id_envio;

        if (envioRows.length === 0) {
            return res.status(400).send('No se encontró información de envío para el usuario.');
        }

        let total = 0;

        carrito.forEach(e => {
            total += e.precio * e.cantidad;
        });

        console.log(total);

        
        // carga informacion del pedido a la base de datos -- todos los pedidos se suben como pendientes por que el admin los tiene que aprobar
        const [pedidoResult] = await pool.query(
            `INSERT INTO pedidos (id_usuario, id_envio, metodo_pago, cuotas, fecha_limite, precio, fecha_creacion, estado)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), 'pendiente')`,
            [id_usuario, id_envio, metodo, cuotas || null, fechaLimite, total]
        );
        const id_pedido = pedidoResult.insertId;

        // seguimiento pedido == aqui va la info de cuando se entrgue osea ver en donde va el pedido xd
        await pool.query(
            `INSERT INTO seguimiento_pedidos (id_pedido, estado, fecha_cambio, comentario) VALUES (?, ?, NOW(), ?)`,
            [id_pedido, 'pendiente', 'sin comentarios']
        );

        // 4. Insertar productos en detalle_pedido y descontar stock
        for (const item of carrito) {
            const productoIdBuffer = Buffer.from(item.productoId, 'hex');
            await pool.query(
                `INSERT INTO detalle_pedido (id_pedido, producto_id, cantidad, precio_unitario)
                 VALUES (?, ?, ?, ?)`,
                [id_pedido, productoIdBuffer, item.cantidad, item.precio]
            );
            // inserta el stock nuevo ya que ya hizo todo el recorrido y verifico que hay suficiente stock para hacer la compra 
            const nuevoStock = item.stock - item.cantidad;
            await insertarStock(item.productoId, nuevoStock);
        }


        // 6. Vaciar el carrito
        await pool.query(`DELETE FROM carrito_usuarios WHERE id_usuario = ?`, [id_usuario]);

        // 7. Redirigir
        res.redirect('/perfil');

    } catch (error) {
        console.error("Error al procesar el pedido:", error);
        return res.status(500).send("Error al procesar el pedido");
    }
}



export default router