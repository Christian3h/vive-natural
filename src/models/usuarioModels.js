import pool from '../models/bd.js'; // Asegúrate de que esta ruta sea correcta

export async function obtenerDetallesUsuario(id_usuario) {
    try {
        const idBuffer = Buffer.from(id_usuario, 'hex');
        const [rows] = await pool.query(
            `SELECT id, name, email, profile_picture, rol FROM usuarios WHERE id = ?`,
            [idBuffer]
        );
        return rows[0] || null;
    } catch (error) {
        console.error('Error al obtener detalles del usuario:', error);
        throw error;
    }
}

export async function obtenerUltimosDatosEnvio(id_usuario) {
    try {
        const idBuffer = Buffer.from(id_usuario, 'hex');
        const [rows] = await pool.query(
            `SELECT nombre, numero, ciudad, direccion 
             FROM envios 
             WHERE id_usuario = ? 
             ORDER BY fecha_envio DESC 
             LIMIT 1`,
            [idBuffer]
        );
        return rows[0] || null;
    } catch (error) {
        console.error('Error al obtener datos de envío:', error);
        throw error;
    }
}

export async function obtenerEstadoAprobacion(id_usuario) {
    try {
        const idBuffer = Buffer.from(id_usuario, 'hex');
        const [rows] = await pool.query(
            `SELECT estado FROM usuarios_aprobacion WHERE id_usuario = ?`,
            [idBuffer]
        );
        return rows[0] ? rows[0].estado : 'no_disponible'; // O un estado por defecto si no existe
    } catch (error) {
        console.error('Error al obtener estado de aprobación:', error);
        throw error;
    }
}

export async function actualizarDatosEnvio(id_usuario, nombre, numero, ciudad, direccion) {
    try {
        // Verificar si ya existen datos de envío para este usuario
        const existingEnvio = await obtenerUltimosDatosEnvio(id_usuario);
        const idBuffer = Buffer.from(id_usuario, 'hex');
        if (existingEnvio) {
            // Si existen, actualizar el último registro
            await pool.query(
                `UPDATE envios 
                 SET nombre = ?, numero = ?, ciudad = ?, direccion = ?, fecha_envio = NOW()
                 WHERE id_usuario = ? 
                 ORDER BY fecha_envio DESC 
                 LIMIT 1`,
                [nombre, numero, ciudad, direccion, idBuffer]
            );
        } else {
            // Si no existen, insertar un nuevo registro
            await pool.query(
                `INSERT INTO envios (id_usuario, nombre, numero, ciudad, direccion, fecha_envio) 
                 VALUES (?, ?, ?, ?, ?, NOW())`,
                [idBuffer, nombre, numero, ciudad, direccion]
            );
        }
        return true;
    } catch (error) {
        console.error('Error al actualizar/insertar datos de envío:', error);
        throw error;
    }
} 