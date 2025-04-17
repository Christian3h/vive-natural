import pool from './bd.js'

export async function obtenerClientesPendientesModels() {
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