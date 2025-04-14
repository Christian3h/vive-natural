import pool from "./bd.js"

export async function crearCategoriaModels(categoria) {
    const [result] = await pool.query("INSERT INTO categoria (nombre) VALUES (?)", categoria);
    return result;
}

export async function crearSubCategoriaModels(subcategoria, id_categoria) {
    const [result] = await pool.query("INSERT INTO subcategoria (nombre, id_categoria) VALUES (?, ?)", [subcategoria, id_categoria]);
    return result;
}


