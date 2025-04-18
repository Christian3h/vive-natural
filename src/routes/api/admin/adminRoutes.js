import express from "express";
const router = express.Router();

import {infoProducto, crearProductoAdmin} from '../../../controllers/api/productoControllers.js'

import { verificarAutenticacion, verificarAdmin } from '../../../middlewares/sesionMiddlewares.js'

// importaciones de controllers para las rutas 

import {adminInicioControllers,
        productosInicioControllers,
        categoriaCrearAdminControllers
        
} from '../../../controllers/api/admin/adminControllers.js'

// 🔹 Dashboard (solo autenticados)

// RUTAS NUEVAS PARA PROGRAMAR 

router.get('/' , verificarAutenticacion, verificarAdmin, adminInicioControllers);

// rutas para los productos

router.get('/productos', verificarAutenticacion, verificarAdmin, productosInicioControllers );

router.get("/producto/crear", verificarAutenticacion, verificarAdmin, crearProductoAdmin)

router.get("/producto/:id", verificarAutenticacion, verificarAdmin, infoProducto);

router.get("/categoria/crear", verificarAutenticacion, verificarAdmin, categoriaCrearAdminControllers)

// rutas para administrar a los clientes desde el panel del administrador 

import { clientesPendientesControllers,clientesPendientesListarControllers, clientesListarControllers } from '../../../controllers/api/admin/clientesAdminControllers.js'

router.get('/clientes/pendientes', verificarAutenticacion, verificarAdmin, clientesPendientesControllers);

router.post('/clientes/pendientes' , verificarAutenticacion, verificarAdmin, clientesPendientesListarControllers);

router.post('/clientes/consulta', verificarAutenticacion ,verificarAdmin, clientesListarControllers)

import pool from "../../../models/bd.js";

router.put('/clientes/estado-modificar', verificarAutenticacion, verificarAdmin, async (req, res) => {
        try {
            const { id_usuario, estado } = req.body;
    
            // Validar datos
            if (!id_usuario || !['aprobado', 'rechazado'].includes(estado)) {
                return res.status(400).json({ error: 'Datos inválidos' });
            }
    
            // Actualizar en la base de datos
            const [result] = await pool.query(
                'UPDATE usuarios_aprobacion SET estado = ? WHERE id_usuario = UNHEX(?)',
                [estado, id_usuario.replace(/-/g, '')]
            );
    
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }
    
            res.json({ mensaje: `Estado actualizado a ${estado}` });
    
        } catch (error) {
            console.error('Error en la ruta /estado:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
    

//rutas para todo el tema de pedidos 

router.get('/pedidos/', verificarAutenticacion, verificarAdmin, async (req, res)=>{
    res.render('admin/pedidos/pedidos', {
        usuario: req.user
    })
})


//consultas para hacer eso iria mas del lado de la api todo lo que valla del lado de la api lo voy a comentar con api
router.get('/pedidos/pendientes', verificarAutenticacion, verificarAdmin, async (req, res) => {
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
        console.log(result)
    } catch (e) {
        console.error('Error al consultar pedidos pendientes');
        console.log(e);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/pedidos/:id/estado', verificarAutenticacion, verificarAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        // Validar estado
        const estadosValidos = ['pendiente', 'entregado', 'cancelado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ 
                message: 'Estado inválido',
                error: 'El estado debe ser: pendiente, entregado o cancelado'
            });
        }
        let pedidoActual
        // Si el pedido se va a cancelar, primero obtenemos los detalles
        if (estado === 'cancelado') {
            // 1. Obtener los detalles del pedido actual
            [pedidoActual] = await pool.query(
                'SELECT estado FROM pedidos WHERE id_pedido = ?',
                [id]
            );

            if (pedidoActual[0].estado === 'cancelado') {
                return res.status(400).json({
                    message: 'Operación inválida',
                    error: 'El pedido ya está cancelado'
                });
            }

            // 2. Obtener los productos del pedido
            const [detallesPedido] = await pool.query(
                'SELECT HEX(producto_id) as producto_id, cantidad FROM detalle_pedido WHERE id_pedido = ?',
                [id]
            );

            // 3. Insertar nuevo registro de stock para cada producto
            for (const detalle of detallesPedido) {
                // Primero obtenemos el stock actual
                const [stockActual] = await pool.query(
                    'SELECT cantidad FROM stock WHERE id_producto = UNHEX(?) ORDER BY ultima_actualizacion DESC LIMIT 1',
                    [detalle.producto_id]
                );

                // Calculamos el nuevo stock (actual + cantidad del pedido cancelado)
                const nuevaCantidad = stockActual[0].cantidad + detalle.cantidad;

                // Insertamos el nuevo registro de stock con el ID en formato hexadecimal
                await pool.query(
                    'INSERT INTO stock (id_producto, cantidad) VALUES (UNHEX(?), ?)',
                    [detalle.producto_id, nuevaCantidad]
                );
            }
        }

        // Actualizar estado del pedido
        const [result] = await pool.query(
            'UPDATE pedidos SET estado = ?  WHERE id_pedido = ?',
            [estado, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                message: 'Pedido no encontrado',
                error: `No se encontró el pedido con ID ${id}`
            });
        }

        res.json({ 
            mensaje: `Pedido #${id} actualizado a "${estado}" correctamente`,
            estado: estado
        });

    } catch (error) {
        console.error('Error al actualizar pedido:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
});


export default router;
