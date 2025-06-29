import express from "express";
const router = express.Router();

// import { verificarAutenticacion, verificarAdmin } from '../../../middlewares/sesionMiddlewares.js'
// import pool from "../../../models/bd.js";
// import crypto from 'crypto';

// // Rutas para administrar a los clientes desde el panel del administrador

// import { clientesPendientesControllers, clientesPendientesListarControllers, clientesListarControllers, clientesPagosPendientes, clientesPagosPendientesCon, clienetsPagosAbonosControllers } from '../../../controllers/api/admin/clientesAdminControllers.js'

// router.get('/clients/payments', verificarAutenticacion, verificarAdmin, clientesPagosPendientes)
// router.post('/clients/payments', verificarAutenticacion, verificarAdmin, clientesPagosPendientesCon)
// router.post('/clients/payments/deposit', verificarAutenticacion, verificarAdmin, clienetsPagosAbonosControllers)
// router.get('/clients/pending', verificarAutenticacion, verificarAdmin, clientesPendientesControllers);
// router.post('/clients/pending', verificarAutenticacion, verificarAdmin, clientesPendientesListarControllers);
// router.post('/clients/query', verificarAutenticacion, verificarAdmin, clientesListarControllers)

// router.put('/clients/status-modify', verificarAutenticacion, verificarAdmin, async (req, res) => {
//     try {
//         const { id_usuario, estado } = req.body;

//         if (!id_usuario || !['aprobado', 'rechazado'].includes(estado)) {
//             return res.status(400).json({ error: 'Invalid data' });
//         }

//         const idBuffer = Buffer.from(id_usuario, 'hex');
//         const [result] = await pool.query(
//             'UPDATE usuarios_aprobacion SET estado = ? WHERE id_usuario = ?',
//             [estado, idBuffer]
//         );

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: 'Client not found' });
//         }

//         res.json({ message: `Status updated to ${estado}` });

//     } catch (error) {
//         console.error('Error on /status route:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Create temporary user (only name and number, rest null)
// router.post('/temporary-users', verificarAutenticacion, verificarAdmin, async (req, res) => {
//     console.log('Received POST request for /api/admin/temporary-users');
//     const { nombre, numero } = req.body;
//     console.log('Body received:', { nombre, numero });

//     if (!nombre || !numero) {
//         console.log('Error: Name or number missing');
//         return res.status(400).json({ error: 'Name and number are required' });
//     }
//     try {
//         const uuid = crypto.randomBytes(16).toString('hex');
//         const idBuffer = Buffer.from(uuid, 'hex');
//         console.log('Generated UUID:', uuid);
//         console.log('ID Buffer:', idBuffer);

//         const googleIdTemp = crypto.randomBytes(16).toString('hex');
//         console.log('[DEBUG] googleIdTemp generated:', googleIdTemp);
//         await pool.query(
//             'INSERT INTO usuarios (id, name, numero, es_temporal, rol, email, profile_picture, google_id) VALUES (?, ?, ?, 1, "usuario", "usuariotemporal@temporal.com", NULL, ?)',
//             [idBuffer, nombre, numero, googleIdTemp]
//         );
//         console.log('Temporary user inserted successfully');
//         res.json({ id: uuid, nombre, numero });
//     } catch (err) {
//         console.error('Error on /temporary-users route:', err);
//         res.status(500).json({ error: 'Error creating temporary user', details: err.message });
//     }
// });

// // Rutas para usuarios logueados

// export const getPedidosUsuario = async (req, res) => {
//     try {
//         const idHex = req.user.id; // id_usuario en formato hexadecimal
//         const [rows] = await pool.query(
//             `
//           SELECT 
//             p.id_pedido,
//             p.fecha_creacion,
//             p.metodo_pago,
//             p.precio,
//             p.estado AS estado_pedido,
//             p.comentarios AS comentarios_pedido,
//             p.fecha_actualizacion,
//             pg.estado AS estado_pago,
//             pg.monto AS monto_pago,
//             pg.metodo_pago AS metodo_pago_real,
//             sp.estado AS seguimiento_estado,
//             sp.fecha_cambio AS seguimiento_fecha,
//             sp.comentario AS comentario_seguimiento,
//             pa.monto_abono,
//             pa.fecha_abono
//           FROM pedidos p
//           LEFT JOIN pagos pg ON p.id_pedido = pg.id_pedido
//           LEFT JOIN pagos_abono pa ON pg.id_pago = pa.id_pago
//           LEFT JOIN seguimiento_pedidos sp ON p.id_pedido = sp.id_pedido
//           WHERE p.id_usuario = ?  -- id_usuario en formato binario
//           ORDER BY p.fecha_creacion DESC, sp.fecha_cambio DESC;
//         `,
//             [idHex] // Solo pasamos el id_usuario
//         );

//         // Retornamos los datos obtenidos
//         console.log(rows)
//         res.json(rows);
//     } catch (error) {
//         console.error('Error al obtener pedidos del usuario:', error);
//         res.status(500).json({ error: 'Error al obtener pedidos del usuario' });
//     }
// };

// router.get('/profile/orders', verificarAutenticacion, getPedidosUsuario)

export default router; 