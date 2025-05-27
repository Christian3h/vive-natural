
import pool from "./bd.js";

export async function consultarEstadoCliente(id_usuario) {
    const idBuffer = Buffer.from(id_usuario, 'hex');
    const [rows] = await pool.query('SELECT estado FROM usuarios_aprobacion WHERE id_usuario = ?', [idBuffer]);
    return rows;
}


export async function insertarEstadoPendiente(id_usuario) {
    const estado = 'pendiente';
    const idBuffer = Buffer.from(id_usuario, 'hex');
    await pool.query(
        'INSERT INTO usuarios_aprobacion (id_usuario, estado) VALUES (?, ?)',
        [idBuffer, estado]
    );
}


// Función para verificar si el usuario tiene datos de envío
export async function verificarDatosDeEnvio(id_usuario) {
    const idBuffer = Buffer.from(id_usuario, 'hex');
    const [rows] = await pool.query('SELECT * FROM envios WHERE id_usuario = ?', [idBuffer]);
    return rows; // Si no tiene datos, retorna un array vacío
}

