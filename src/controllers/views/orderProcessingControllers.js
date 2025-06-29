import pool from '../../models/bd.js';
import { obtenerCarritoModels } from "../../models/carritoModels.js";
import { insertarStock } from '../../models/productoModels.js';

export const procesarEnvioController = async (req, res) => {
    const { nombre, numero, ciudad, direccion } = req.body;
    const id_usuario = req.user.id; 
    const fecha_envio = new Date();

    try {
        const idBuffer = Buffer.from(id_usuario, 'hex');
        await pool.query(
            'INSERT INTO envios (id_usuario, nombre, numero, ciudad, direccion, fecha_envio) VALUES (?, ?, ?, ?, ?, ?)',
            [idBuffer, nombre, numero, ciudad, direccion, fecha_envio]
        );

        // Considerar si el redirect debe estar aquí o en la ruta
        return res.redirect('/pago');
    } catch (error) {
        console.error('Error al guardar los datos de envío:', error);
        return res.status(500).send('Error al procesar los datos de envío');
    }
};

export const procesarPedidoController = async (req, res) => {
    const id_usuario = req.user.id;
    const { metodo, cuotas, fecha } = req.query;
    let fechaLimite = null;
    if (fecha && !isNaN(Date.parse(fecha))) {
        fechaLimite = fecha;
    }
    try {
        const carrito = await obtenerCarritoModels(id_usuario);
        if (!carrito || carrito.length === 0) {
            // Considerar si el redirect debe estar aquí o en la ruta
            return res.redirect('/carrito');
        }

        for (const item of carrito) {
            const nuevoStock = item.stock - item.cantidad;
            if (nuevoStock < 0) {
                return res.status(400).send('No hay suficiente stock para procesar el pedido');
            }
        }

        const idBuffer = Buffer.from(id_usuario, 'hex');
        const [envioRows] = await pool.query(
            `SELECT id_envio 
             FROM envios 
             WHERE id_usuario = ? 
             ORDER BY fecha_envio DESC 
             LIMIT 1`,
            [idBuffer]
        );

        if (envioRows.length === 0) {
            return res.status(400).send('No se encontró información de envío para el usuario.');
        }
        const id_envio = envioRows[0].id_envio;

        let total = 0;
        carrito.forEach(e => {
            total += e.precio * e.cantidad;
        });

        console.log(total);

        const [pedidoResult] = await pool.query(
            `INSERT INTO pedidos (id_usuario, id_envio, metodo_pago, cuotas, fecha_limite, precio, fecha_creacion, estado)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), 'pendiente')`,
            [idBuffer, id_envio, metodo, cuotas || null, fechaLimite, total]
        );
        const id_pedido = pedidoResult.insertId;

        await pool.query(
            `INSERT INTO seguimiento_pedidos (id_pedido, estado, fecha_cambio, comentario) VALUES (?, ?, NOW(), ?)`,
            [id_pedido, 'pendiente', 'sin comentarios']
        );

        for (const item of carrito) {
            const productoIdBuffer = Buffer.from(item.productoId, 'hex');
            await pool.query(
                `INSERT INTO detalle_pedido (id_pedido, producto_id, cantidad, precio_unitario)
                 VALUES (?, ?, ?, ?)`,
                [id_pedido, productoIdBuffer, item.cantidad, item.precio]
            );
            const nuevoStock = item.stock - item.cantidad;
            await insertarStock(item.productoId, nuevoStock);
        }

        await pool.query(`DELETE FROM carrito_usuarios WHERE id_usuario = ?`, [idBuffer]);

        // Considerar si el redirect debe estar aquí o en la ruta
        res.redirect('/perfil');

    } catch (error) {
        console.error("Error al procesar el pedido:", error);
        return res.status(500).send("Error al procesar el pedido");
    }
} 