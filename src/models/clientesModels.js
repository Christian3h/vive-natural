import pool from './bd.js'

export async function obtenerClientesPendientesModels( ) {
    const [rows] = await pool.query(`
        SELECT 
            HEX(ua.id_usuario) AS id_usuario_hex,
            u.name,
            u.email,
            u.profile_picture,
            ua.estado
        FROM usuarios_aprobacion ua
        JOIN usuarios u ON ua.id_usuario = u.id
        WHERE ua.estado = 'pendiente'
    `);
    
    return rows;
}   

export async function obtenerClientesModels(estado) {
    const [rows] = await pool.query(`
        SELECT 
            HEX(ua.id_usuario) AS id_usuario_hex,
            u.name,
            u.email,
            u.profile_picture,
            ua.estado
        FROM usuarios_aprobacion ua
        JOIN usuarios u ON ua.id_usuario = u.id
        WHERE ua.estado = ?
    `, [estado]);
    
    return rows;
}

// 📝 Crea seguimiento 'pendiente' para todos los pedidos aprobados que no lo tengan
// 🔁 Usar antes de mostrar posibles pagos para asegurar integridad del seguimiento
// 📥 No recibe parámetros
// 📤 Retorna cantidad de filas insertadas

export async function crearSeguimientosPendientesClientesModels() {
    const [result] = await pool.query(`
        INSERT INTO seguimiento_pedidos (id_pedido, estado, comentario)
        SELECT p.id_pedido, 'pendiente', NULL
        FROM pedidos p
        LEFT JOIN seguimiento_pedidos sp ON p.id_pedido = sp.id_pedido
        WHERE p.estado = 'aprobado' AND sp.id_pedido IS NULL
    `);

    return result.affectedRows;
}


// 📦 Trae todos los clientes con pedidos aprobados y seguimiento pendiente, con sus pagos y abonos correctamente enlazados
// 🔁 Usar para mostrar historial completo de pagos y abonos por pedido
// 📥 No recibe parámetros
// 📤 Retorna un array con info del pedido, seguimiento, usuario, pagos y abonos

export async function obtenerClientesConPagosClientesModels() {
    const [rows] = await pool.query(`
        SELECT 
            sp.id_seguimiento,
            sp.estado AS estado_seguimiento,
            p.id_pedido,
            p.cuotas,
            p.precio,
            u.name,
            u.profile_picture,
            pa.id_pago,
            pa.monto AS monto_pago,
            pa.estado AS estado_pago,
            pa.metodo_pago,
            pa.referencia,
            pa.fecha_pago,
            ab.id_abono,
            ab.monto_abono,
            ab.metodo_abono,
            ab.fecha_abono
        FROM pedidos p
        JOIN seguimiento_pedidos sp ON p.id_pedido = sp.id_pedido
        JOIN envios e ON p.id_envio = e.id_envio
        JOIN usuarios u ON e.id_usuario = u.id
        LEFT JOIN pagos pa ON pa.id_pedido = p.id_pedido
        LEFT JOIN pagos_abono ab ON ab.id_pago = pa.id_pago
        WHERE p.estado = 'aprobado'
          AND sp.estado = 'pendiente'
        ORDER BY p.id_pedido, pa.id_pago, ab.fecha_abono ASC
    `);

    return rows;
}


// 💳 Registra un abono parcial de un pago
// 🔁 Usar para agregar un abono a un pago existente
// 📥 Recibe: id_pago, monto_abono, metodo_abono
// 📤 Retorna el ID insertado

export async function crearAbonoClientesModels( id_pago, monto_abono, metodo_abono ) {
    const [result] = await pool.query(`
        INSERT INTO pagos_abono (id_pago, monto_abono, metodo_abono)
        VALUES (?, ?, ?)
    `, [id_pago, monto_abono, metodo_abono]);

    return result.insertId;
}
