import express from "express";
const router = express.Router();

import { verificarAutenticacionApi, verificarAdmin } from '../../../middlewares/sesionMiddlewares.js'
import pool from "../../../models/bd.js";
import * as dashboardController from '../../../controllers/api/admin/finanzasAdminControllers.js';

// API routes for orders

router.get('/orders/pending', verificarAutenticacionApi, verificarAdmin, async (req, res) => {
    console.log(req.user)
    try {
        const [result] = await pool.query(`
           SELECT 
                p.id_pedido,
                p.fecha_creacion,
                p.metodo_pago,
                p.cuotas,
                p.fecha_limite,
                p.comentarios,
                u.name AS nombre_cliente,
                u.profile_picture,
                SUM(dp.cantidad * dp.precio_unitario) AS total,
                p.estado,
                e.ciudad,
                e.direccion,
                e.numero AS telefono_contacto,
                GROUP_CONCAT(
                    CONCAT(
                        'Producto: ', pr.nombre, 
                        ', Cantidad: ', dp.cantidad, 
                        ', Precio: $', pe.precio -- Cambié de 'dp.precio_unitario' a 'pe.precio' para acceder a la tabla 'precios'
                    ) 
                    SEPARATOR ' | '
                ) AS detalles_productos, -- Concatenar detalles del producto
                GROUP_CONCAT(
                    pr.nombre
                    SEPARATOR ', '
                ) AS productos, -- Lista de nombres de productos
                GROUP_CONCAT(
                    pe.precio -- Usamos 'pe.precio' para acceder al precio en la tabla 'precios'
                    SEPARATOR ', '
                ) AS precios, -- Lista de precios de los productos desde la tabla 'precios'
                GROUP_CONCAT(
                    pr.id
                    SEPARATOR ', '
                ) AS ids_productos -- Lista de ids de los productos
            FROM 
                pedidos p
            JOIN 
                usuarios u ON HEX(u.id) = p.id_usuario
            JOIN 
                detalle_pedido dp ON p.id_pedido = dp.id_pedido
            LEFT JOIN 
                envios e ON p.id_envio = e.id_envio
            JOIN 
                productos pr ON dp.producto_id = pr.id
            LEFT JOIN 
                categoria cat ON pr.id_categoria = cat.id
            LEFT JOIN 
                subcategoria subcat ON pr.id_subcategoria = subcat.id
            JOIN 
                precios pe ON dp.producto_id = pe.id_producto -- Nos aseguramos de hacer JOIN con la tabla 'precios'
            WHERE 
                p.estado = 'pendiente'
            GROUP BY 
                p.id_pedido, p.fecha_creacion, p.metodo_pago, p.cuotas, p.fecha_limite, p.comentarios,
                u.name, u.profile_picture, p.estado,
                e.ciudad, e.direccion, e.numero
            ORDER BY 
                p.fecha_creacion DESC;
        `);
        res.json(result);
    } catch (e) {
        console.error('Error al consultar pedidos pendientes');
        console.error(e);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/orders/:id/status', verificarAutenticacionApi, verificarAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const estadosValidos = ['pendiente', 'aprobado', 'cancelado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                message: 'Invalid status',
                error: 'Status must be: pendiente, aprobado or cancelado'
            });
        }
        let pedidoActual
        if (estado === 'cancelado') {
            [pedidoActual] = await pool.query(
                'SELECT estado FROM pedidos WHERE id_pedido = ?',
                [id]
            );

            if (pedidoActual[0].estado === 'cancelado') {
                return res.status(400).json({
                    message: 'Invalid operation',
                    error: 'Order is already canceled'
                });
            }

            const [detallesPedido] = await pool.query(
                'SELECT HEX(producto_id) as producto_id, cantidad FROM detalle_pedido WHERE id_pedido = ?',
                [id]
            );

            for (const detalle of detallesPedido) {
                const [stockActual] = await pool.query(
                    'SELECT cantidad FROM stock WHERE id_producto = UNHEX(?) ORDER BY ultima_actualizacion DESC LIMIT 1',
                    [detalle.producto_id]
                );

                const nuevaCantidad = stockActual[0].cantidad + detalle.cantidad;

                await pool.query(
                    'INSERT INTO stock (id_producto, cantidad) VALUES (UNHEX(?), ?)',
                    [detalle.producto_id, nuevaCantidad]
                );
            }
        }

        const [result] = await pool.query(
            'UPDATE pedidos SET estado = ?  WHERE id_pedido = ?',
            [estado, id]
        );

        const [rows] = await pool.query(`
            SELECT 
                SUM(dp.precio_unitario * dp.cantidad) AS total
            FROM detalle_pedido dp
            WHERE dp.id_pedido = ?
        `, [id]);

        const [resultpagos] = await pool.query(`
            INSERT INTO pagos (id_pedido, monto, metodo_pago, estado, referencia, comprobante)
            VALUES (?, ?, ?, 'pendiente', ?, ?)
        `, [id, rows[0].total, 'efectivo', null, null]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Order not found',
                error: `No order found with ID ${id}`
            });
        }

        res.json({
            message: `Order #${id} updated to "${estado}" correctly`,
            status: estado
        });

    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

router.get('/orders/pending-shipments', verificarAutenticacionApi, verificarAdmin, async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT 
                p.id_pedido,
                p.fecha_creacion,
                p.metodo_pago,
                p.cuotas,
                p.fecha_limite,
                p.comentarios,
                u.name AS nombre_cliente,
                u.profile_picture,
                SUM(dp.cantidad * dp.precio_unitario) AS total,
                p.estado,
                e.ciudad,
                e.direccion,
                e.numero AS telefono_contacto,
                GROUP_CONCAT(
                    CONCAT('Producto: ', pr.nombre, ', Cantidad: ', dp.cantidad, ', Precio: $', pe.precio)
                    SEPARATOR ' | '
                ) AS detalles_productos,
                GROUP_CONCAT(pr.nombre SEPARATOR ', ') AS productos,
                GROUP_CONCAT(pe.precio SEPARATOR ', ') AS precios,
                GROUP_CONCAT(pr.id SEPARATOR ', ') AS ids_productos
            FROM 
                pedidos p
            JOIN usuarios u ON HEX(u.id) = p.id_usuario
            JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
            LEFT JOIN envios e ON p.id_envio = e.id_envio
            JOIN productos pr ON dp.producto_id = pr.id
            LEFT JOIN categoria cat ON pr.id_categoria = cat.id
            LEFT JOIN subcategoria subcat ON pr.id_subcategoria = subcat.id
            JOIN precios pe ON dp.producto_id = pe.id_producto
            JOIN (
                SELECT id_pedido, MAX(fecha_cambio) AS ultima_fecha
                FROM seguimiento_pedidos
                GROUP BY id_pedido
            ) ult ON ult.id_pedido = p.id_pedido
            JOIN seguimiento_pedidos sp ON sp.id_pedido = ult.id_pedido AND sp.fecha_cambio = ult.ultima_fecha
            WHERE sp.estado = 'pendiente'
            GROUP BY 
                p.id_pedido, p.fecha_creacion, p.metodo_pago, p.cuotas, p.fecha_limite, p.comentarios,
                u.name, u.profile_picture, p.estado,
                e.ciudad, e.direccion, e.numero
            ORDER BY p.fecha_creacion DESC;
        `);
        res.json(result);
    } catch (e) {
        console.error('Error al consultar pedidos pendientes');
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/orders/:id/status/shipments', verificarAutenticacionApi, verificarAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        let { estado, comentario = null } = req.body;
        
        const estadosValidos = ['pendiente', 'pagado', 'cancelado', 'aprobado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                message: 'Invalid status',
                error: 'Status must be: pendiente, pagado or cancelado'
            });
        }

        if(estado === 'aprobado'){
            estado = 'pagado'
            console.log(estado + 'esto es el valor nuevo')
        }

        console.log(estado)
        
        const [pedido] = await pool.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?',
            [id]
        );
        
        if (pedido.length === 0) {
            return res.status(404).json({
                message: 'Order not found',
                error: `No order found with ID ${id}`
            });
        }

        const [result] = await pool.query(`
            INSERT INTO seguimiento_pedidos (id_pedido, estado, fecha_cambio, comentario)
            VALUES (?, ?, NOW(), ?)
        `, [id, estado, comentario]);
        

        res.json({
            message: `Order #${id} updated to "${estado}" correctly`,
            status: estado
        });

    } catch (error) {
        console.error('Error al actualizar estado del pedido:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

router.post('/orders/quick', verificarAutenticacionApi, verificarAdmin, async (req, res) => {
    console.log('Received POST request for /api/admin/pedidos/rapido');
    const { id_usuario, monto, descripcion } = req.body;
    console.log('Body received (quick order):', { id_usuario, monto, descripcion });

    if (!id_usuario || !monto) {
        console.log('Error: User ID or amount missing for quick order');
        return res.status(400).json({ error: 'Required data missing' });
    }
    try {
        const idBuffer = Buffer.from(id_usuario, 'hex');
        console.log('User ID Buffer (quick order):', idBuffer);

        const [result] = await pool.query(
            'INSERT INTO pedidos (id_usuario, precio, estado, comentarios, fecha_creacion, metodo_pago, id_envio, cuotas, fecha_limite) VALUES (?, ?, "pendiente", ?, NOW(), "efectivo", NULL, NULL, NULL)',
            [idBuffer, monto, descripcion || null]
        );
        console.log('Quick order inserted with ID:', result.insertId);
        res.json({ order_id: result.insertId });
    } catch (err) {
        console.error('Error creating quick order:', err);
        res.status(500).json({ error: 'Error creating quick order', details: err.message });
    }
});

// Routes for finance/sales dashboard
router.get('/sales/monthly', dashboardController.getVentasDelMes);
router.get('/sales/approved-vs-delivered', dashboardController.getPedidosAprobadosVsEntregados);
router.get('/sales/payment-method', dashboardController.getPedidosPorMetodoDePago);
router.get('/sales/overdue-orders', dashboardController.getPedidosVencidos);
router.get('/sales/history', dashboardController.getHistorialVentasMensual);
router.get('/sales/average-payment-time', dashboardController.getTiempoPromedioPago);
router.get('/sales/products-sales-performance', dashboardController.getProductoMasYMenosVendido);
router.get('/sales/current-inventory', dashboardController.getInventarioActual);
router.get('/sales/products-without-sales', dashboardController.getProductosSinVentas);
router.get('/sales/gross-profit', dashboardController.getUtilidadBrutaDelMes);
router.get('/sales/top-debt-clients', dashboardController.getTopClientesConMasDeuda);

// New route to view all completed purchases (sales history)
router.get('/sales/completed', verificarAutenticacionApi, verificarAdmin, async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT 
                p.id_pedido,
                p.fecha_creacion,
                p.metodo_pago,
                p.cuotas,
                p.precio,
                p.estado,
                u.name AS nombre_cliente,
                u.profile_picture,
                e.ciudad,
                e.direccion,
                e.numero AS telefono_contacto,
                GROUP_CONCAT(pr.nombre SEPARATOR ', ') AS productos,
                GROUP_CONCAT(dp.cantidad SEPARATOR ', ') AS cantidades,
                GROUP_CONCAT(dp.precio_unitario SEPARATOR ', ') AS precios
            FROM pedidos p
            JOIN usuarios u ON u.id = p.id_usuario
            LEFT JOIN envios e ON p.id_envio = e.id_envio
            JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
            JOIN productos pr ON dp.producto_id = pr.id
            WHERE p.estado = 'aprobado'
            GROUP BY p.id_pedido, p.fecha_creacion, p.metodo_pago, p.cuotas, p.precio, p.estado, u.name, u.profile_picture, e.ciudad, e.direccion, e.numero
            ORDER BY p.fecha_creacion DESC;
        `);
        res.json(result);
    } catch (e) {
        console.error('Error al consultar compras realizadas:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router; 