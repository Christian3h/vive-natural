import pool from '../config/db.js'

const autenticarUsuario = async (profile) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE google_id = ?', [profile.id]);
    return [rows];
}

const crearUsuario = async (profile) => {
    const [result] = await pool.query(
        'INSERT INTO usuarios (google_id, name, email, profile_picture) VALUES (?, ?, ?, ?)',
        [profile.id, profile.displayName, profile.emails[0].value, profile.photos[0].value]
    );
    return result;
}

const deserializarUsuario = async (id) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return [rows];
}


export { autenticarUsuario, crearUsuario, deserializarUsuario }
