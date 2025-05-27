import pool from './bd.js'

export async function ventasDelMes() {
    const [result] = await pool.query(
        `SELECT 
            COUNT(DISTINCT p.id_pedido) AS total_pedidos_mes,
            SUM(pa.monto) AS ingresos_esperados,
            SUM(ab.monto_abono) AS ingresos_reales
        FROM pedidos p
        LEFT JOIN pagos pa ON p.id_pedido = pa.id_pedido
        LEFT JOIN pagos_abono ab ON ab.id_pago = pa.id_pago
        WHERE p.estado = 'aprobado'
        AND MONTH(p.fecha_creacion) = MONTH(CURRENT_DATE())
        AND YEAR(p.fecha_creacion) = YEAR(CURRENT_DATE())`
    );
    return result;
}

export async function pedidosAprobadosVsEntregados() {
    const [result] = await pool.query(
        `SELECT 
            COUNT(DISTINCT p.id_pedido) AS pedidos_aprobados,
            COUNT(DISTINCT CASE WHEN sp.estado = 'pagado' THEN sp.id_pedido END) AS pedidos_entregados
        FROM pedidos p
        LEFT JOIN seguimiento_pedidos sp ON sp.id_pedido = p.id_pedido
        WHERE p.estado = 'aprobado'`
    );
    return result;
}


export async function pedidosPorMetodoDePago() {
    const [result] = await pool.query(
        `SELECT 
            pa.metodo_pago,
            SUM(ab.monto_abono) AS total_ingresado
        FROM pagos pa
        JOIN pagos_abono ab ON ab.id_pago = pa.id_pago
        GROUP BY pa.metodo_pago`
    );
    return result;
}

export async function pedidosVencidos() {
    const [result] = await pool.query(
        `SELECT 
            COUNT(*) AS pedidos_vencidos
        FROM pedidos
        WHERE fecha_limite < NOW()
        AND estado != 'completado'`
    );
    return result;
}


export async function historialVentasMensual() {
    const [result] = await pool.query(
        `SELECT 
            DATE_FORMAT(p.fecha_creacion, '%Y-%m') AS mes,
            COUNT(DISTINCT p.id_pedido) AS pedidos,
            SUM(pa.monto) AS total_ventas
        FROM pedidos p
        LEFT JOIN pagos pa ON pa.id_pedido = p.id_pedido
        WHERE p.estado = 'aprobado'
        AND p.fecha_creacion >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY mes
        ORDER BY mes`
    );
    return result;
}

export async function tiempoPromedioPago() {
    const [result] = await pool.query(
        `SELECT 
            AVG(DATEDIFF(ab.fecha_abono, p.fecha_creacion)) AS promedio_dias_pago
        FROM pedidos p
        JOIN pagos pa ON pa.id_pedido = p.id_pedido
        JOIN pagos_abono ab ON ab.id_pago = pa.id_pago
        WHERE ab.fecha_abono IS NOT NULL
        GROUP BY p.id_pedido`
    );
    return result;
}

export async function productoMasYMenosVendido() {
    const [result] = await pool.query(
        `SELECT 
        p.nombre,
        SUM(dp.cantidad) AS total_vendido
        FROM detalle_pedido dp
        JOIN productos p ON dp.producto_id = p.id
        GROUP BY p.id
        ORDER BY total_vendido DESC`
    );
    return result;
}
        
export async function inventarioActual() {
    const [result] = await pool.query(
        `SELECT 
            p.nombre,
            SUM(s.cantidad) AS stock_actual
        FROM stock s
        JOIN productos p ON s.id_producto = p.id
        GROUP BY p.id
        ORDER BY stock_actual ASC`
    );
    return result;
}

export async function productosSinVentas() {
    const [result] = await pool.query(
        `SELECT 
            p.nombre
        FROM productos p
        LEFT JOIN stock s ON s.id_producto = p.id
        WHERE s.id IS NULL`
    );
    return result;
}

export async function utilidadBrutaDelMes() {
    const [result] = await pool.query(
        `SELECT 
            p.nombre,
            DATE_FORMAT(pe.fecha_creacion, '%Y-%m') AS mes,
            SUM((dp.precio_unitario - p.costo) * dp.cantidad) AS ganancia
        FROM detalle_pedido dp
        JOIN pedidos pe ON dp.id_pedido = pe.id_pedido
        JOIN productos p ON dp.producto_id = p.id
        WHERE pe.estado = 'aprobado' -- considerar solo ventas efectivas
        GROUP BY p.nombre, mes
        ORDER BY mes DESC, p.nombre;`
    );
    console.log(result)
    return result;
}

export async function topClientesConMasDeuda() {
    const [result] = await pool.query(
        `SELECT 
            u.name AS cliente,
            SUM(pa.monto) AS total_deuda,
            COALESCE(SUM(ab.monto_abono), 0) AS total_pagado,
            (SUM(pa.monto) - COALESCE(SUM(ab.monto_abono), 0)) AS saldo_pendiente
        FROM usuarios u
        JOIN pedidos p ON p.id_usuario = u.id
        JOIN pagos pa ON pa.id_pedido = p.id_pedido
        LEFT JOIN pagos_abono ab ON ab.id_pago = pa.id_pago
        GROUP BY u.id
        ORDER BY saldo_pendiente DESC
        LIMIT 5`
    );
    return result;
}
