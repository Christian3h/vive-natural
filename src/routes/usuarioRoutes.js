import express from 'express'

const router = express.Router()

import {inicioUsuarioControllers,
        infoProductoUsuarioControllers,
        perfilUsuarioControllers,
        carritoUsuarioControllers,
        tiendaUsuarioControllers,
        contactoUsuarioControllers
} from '../controllers/usuarioControllers.js'

router.get('/', inicioUsuarioControllers);

router.get('/producto/:id',infoProductoUsuarioControllers)

// perfil 

router.get('/perfil', perfilUsuarioControllers)

// carrito de compras 
router.get('/carrito', carritoUsuarioControllers)

// tienda de productos donde va apoder filtrar bustar y todo el tema 
router.get('/tienda', tiendaUsuarioControllers)

// contacto 
router.get('/contacto', contactoUsuarioControllers)

// tema de pagos en mi pagina jeje xd

import {validarUsuario, pagoUsuarioControllers, renderDatosEnvio} from '../controllers/pagoControllers.js'

router.get('/pago',validarUsuario, pagoUsuarioControllers)

router.get('/datos-envio', renderDatosEnvio)

import pool from '../models/bd.js'

router.post('/procesar-envio', async (req, res) => {

        procesarEnvio(req, res);
        
        async function procesarEnvio(req, res) {
                console.log(req.user)
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
router.get('/procesando', async (req, res) => {
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

// Función para procesar el pedido
async function procesarPedido(req, res) {
    const id_usuario = req.user.id;
    const { metodo, cuotas, fecha } = req.query;
    const fechaLimite = (fecha && fecha !== 'null') ? fecha : null; // Ajustar fecha para evitar error de 'null' como cadena

    try {
        // 1. Consultamos el carrito del usuario
        const carrito = await obtenerCarritoModels(id_usuario);

        if (!carrito || carrito.length === 0) {
            return res.redirect('/carrito'); // Si no hay productos en el carrito, redirigimos
        }

        // 2. Insertamos en la tabla 'pedidos' el nuevo pedido
        const [pedidoResult] = await pool.query(
            `INSERT INTO pedidos (id_usuario, metodo_pago, cuotas, fecha_limite, fecha_creacion, estado)
            VALUES (?, ?, ?, ?, NOW(), 'pendiente')`,
            [id_usuario, metodo, cuotas || null, fechaLimite]
        );
        const id_pedido = pedidoResult.insertId;

        // 3. Insertamos los productos en la tabla 'detalle_pedido' y descontamos el stock
        for (const item of carrito) {
                console.log(item.productoId)
            // Guardar el producto en el detalle del pedido
            await pool.query(
                `INSERT INTO detalle_pedido (id_pedido, producto_id, cantidad, precio_unitario)
                VALUES (?, ?, ?, ?)`,
                [id_pedido, item.productoId, item.cantidad, item.precio]
            );

            // Descontar el stock del producto
            await pool.query(
                `UPDATE productos SET stock = stock - ? WHERE id_producto = ?`,
                [item.cantidad, item.productoId]
            );
        }

        // 4. Guardar el carrito en la tabla historial_carrito
        for (const item of carrito) {
            await pool.query(
                `INSERT INTO historial_carrito (id_pedido, id_usuario, id_producto, nombre, descripcion, imagenes, cantidad, precio_unitario)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    id_pedido,
                    id_usuario,
                    item.productoId,
                    item.nombre,
                    item.descripcion,
                    item.imagenes,
                    item.cantidad,
                    item.precio
                ]
            );
        }

        // 5. Vaciar el carrito del usuario
        await pool.query(`DELETE FROM carrito WHERE id_usuario = ?`, [id_usuario]);

        // 6. Redirigir a la página de confirmación
        res.redirect('/confirmacion'); // Solo se redirige al final del flujo exitoso

    } catch (error) {
        console.error("Error al procesar el pedido:", error);
        return res.status(500).send("Error al procesar el pedido"); // Solo respondemos una vez
    }
}


export default router