import pool from './bd.js'


const generarIdProducto = async () => {
    const [id_result] = await pool.query('SELECT UUID() AS id_producto');
    if (!id_result || id_result.length === 0 || !id_result[0].id_producto) {
        throw new Error('No se pudo generar un ID de producto.');
    }
    return id_result[0].id_producto.replace(/-/g, '');
};

const insertarStock = async (id_producto, stock) => {
    const [result] = await pool.query(
        `INSERT INTO stock (id_producto, cantidad, ultima_actualizacion) 
         VALUES (UNHEX(?), ?, NOW())`,
        [id_producto, stock]
    );
    if (result.affectedRows === 0) {
        throw new Error('Error al insertar el stock.');
    }
};

const insertarProducto = async (id_producto, nombre, descripcion, id_categoria, id_subcategoria) => {
    const [result] = await pool.query(
        `INSERT INTO productos (id, nombre, descripcion, estado, id_categoria, id_subcategoria, fecha_creacion) 
         VALUES (UNHEX(?), ?, ?, 1, ?, ?, NOW())`,
        [id_producto, nombre, descripcion, id_categoria, id_subcategoria]
    );
    if (result.affectedRows === 0) {
        throw new Error('Error al insertar el producto.');
    }
};

const insertarPrecio = async (id_producto, precio) => {
    const [result] = await pool.query(
        `INSERT INTO precios (id_producto, precio, fecha_creacion, activo) 
         VALUES (UNHEX(?), ?, NOW(), 1)`,
        [id_producto, precio]
    );
    if (result.affectedRows === 0) {
        throw new Error('Error al insertar el precio.');
    }
};

const insertarImagenes = async (imageValues) => {
    await pool.query(
        `INSERT INTO imagenes_productos (id_producto, ruta_imagen) VALUES ?`,
        [imageValues]
    );
};

// listar productos 

const listarProductos = async (id_categoria, id_subcategoria) => {
    const [result] = await pool.query(`
        SELECT 
            HEX(p.id) AS producto_id_hex,
            p.nombre AS producto_nombre,
            p.descripcion AS producto_descripcion,
            COALESCE(stk.cantidad, 0) AS producto_stock,  -- ✅ Evita valores NULL en stock
            p.id_categoria AS producto_categoria,  
            p.id_subcategoria AS producto_subcategoria,
            c.nombre AS categoria_nombre,
            s.nombre AS subcategoria_nombre,
            MAX(pr.precio) AS precio_activo,  -- ✅ Asegura que no haya problemas con GROUP BY
            GROUP_CONCAT(CONCAT('/uploads/productos/', i.ruta_imagen) ORDER BY i.id SEPARATOR ', ') AS imagenes
        FROM productos p
        JOIN categoria c ON p.id_categoria = c.id
        LEFT JOIN subcategoria s ON p.id_subcategoria = s.id
        LEFT JOIN precios pr ON p.id = pr.id_producto AND pr.activo = 1  
        LEFT JOIN imagenes_productos i ON p.id = i.id_producto
        LEFT JOIN stock stk ON p.id = stk.id_producto
        WHERE 
            (IFNULL(?, p.id_categoria) = p.id_categoria)  -- ✅ Manejo correcto de valores NULL
            AND (IFNULL(?, p.id_subcategoria) = p.id_subcategoria)  
        GROUP BY p.id, p.nombre, p.descripcion, p.id_categoria, p.id_subcategoria, c.nombre, s.nombre
        ORDER BY p.fecha_creacion DESC;
        `,
        [id_categoria, id_subcategoria]
    );

    return result;
};

// listar un solo produto 


const listarProducto = async (id) => {
    const [result] = await pool.query(
        `
        SELECT 
            HEX(p.id) AS producto_id_hex,
            p.nombre AS producto_nombre,
            p.descripcion AS producto_descripcion,
            COALESCE(stk.cantidad, 0) AS producto_stock,
            p.id_categoria AS producto_categoria,  
            p.id_subcategoria AS producto_subcategoria,
            c.nombre AS categoria_nombre,
            sub.nombre AS subcategoria_nombre,
            MAX(pr.precio) AS precio_activo,  -- ✅ Se usa MAX() en lugar de ANY_VALUE()
            GROUP_CONCAT(CONCAT('/uploads/productos/', i.ruta_imagen) ORDER BY i.id SEPARATOR ', ') AS imagenes
        FROM productos p
            JOIN categoria c ON p.id_categoria = c.id
            LEFT JOIN subcategoria sub ON p.id_subcategoria = sub.id
            LEFT JOIN precios pr ON p.id = pr.id_producto AND pr.activo = 1  
            LEFT JOIN imagenes_productos i ON p.id = i.id_producto
            LEFT JOIN stock stk 
                ON p.id = stk.id_producto 
                AND stk.ultima_actualizacion = (
                    SELECT MAX(ultima_actualizacion) 
                    FROM stock 
                    WHERE stock.id_producto = p.id
                )  
            WHERE p.id = UNHEX(?)  
            GROUP BY p.id, p.nombre, p.descripcion, p.id_categoria, p.id_subcategoria, c.nombre, sub.nombre
            ORDER BY p.fecha_creacion DESC;

        `,
        [id]
    );
    return result;
};


// eliminar producto
const eliminarProducto = async (id) => {

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    // Verificar que el producto existe
    const [producto] = await connection.query(      
        `SELECT id FROM productos WHERE id = UNHEX(?)`,
        [id]
    );

    // Eliminar precios
    await connection.query(
        `DELETE FROM precios WHERE id_producto = UNHEX(?)`,
        [id]
    );

    // Eliminar imágenes
    await connection.query(
        `DELETE FROM imagenes_productos WHERE id_producto = UNHEX(?)`,
        [id]
    );

    // Eliminar producto
    const [result] = await connection.query(
        `DELETE FROM productos WHERE id = UNHEX(?)`,
        [id]
    );

    await connection.commit();

    return { message: 'Producto eliminado correctamente' };

};

const consultarImagenes = async (id) => {
    const [result] = await pool.query(
        `SELECT ruta_imagen FROM imagenes_productos WHERE id_producto = UNHEX(?)`,
        [id]
    );
    return result;
};

// actualizar producto (solo texto no imagenes )

const actualizarProducto = async (id, camposActualizar, valores) => {
    valores.push(id); // Agregamos el id al final
    const sql = `UPDATE productos SET ${camposActualizar.join(", ")} WHERE id = UNHEX(?)`;
    
    await pool.query(sql, valores);

    return { message: 'Producto actualizado correctamente' };
};

// validar existencia de id_categoria 
const consultarSubcategoria = async (id) => {
    const [result] = await pool.query('SELECT id FROM subcategoria WHERE id = ?', [id]);
    return [result];
};

//precios 

//desactivar precio
const desactivarPrecio = async (id) => {
    await pool.query('UPDATE precios SET activo = 0 WHERE id_producto = UNHEX(?) AND activo = 1', [id]);
};

const crearPrecio = async (id, precio) => {
    await pool.query('INSERT INTO precios (id_producto, precio, activo) VALUES (UNHEX(?), ?, 1)', [id, precio]);
};

// eliminar registro de las imagenes de la base de datos 

const eliminarImagenes = async (imagenes) => {
    await pool.query('DELETE FROM imagenes_productos WHERE ruta_imagen IN (?)', [imagenes]);
};

//conultar info del producto para editarlo 

export async function consultarInfoProductoM(id) {
    const [result] = await pool.query(
        'SELECT HEX(id) AS id, nombre, descripcion, id_categoria, id_subcategoria FROM productos WHERE id = UNHEX(?)', 
        [id]
    );
    return result;
}

export async function consultarPrecio(id) {
    const [result] = await pool.query('SELECT precio FROM precios WHERE id_producto = UNHEX(?) AND activo = 1', [id]);
    return result[0].precio;
}

export async function consultarCategoria() {
    const [result] = await pool.query('SELECT id, nombre FROM categoria');
    return result;
}

export async function consultarImagenesAdmin(id) {
    const [result] = await pool.query('SELECT ruta_imagen FROM imagenes_productos WHERE id_producto = UNHEX(?)', [id]);
    return result;
}

export async function consultarStock(id) {
    const [result] = await pool.query(
        'SELECT cantidad FROM stock WHERE id_producto = UNHEX(?) ORDER BY ultima_actualizacion DESC LIMIT 1', 
        [id]
    );
    return result.length > 0 ? result[0].cantidad : null;
}




export async function consultarSubcategoriaAdmin() {
    const [result] = await pool.query('SELECT id, nombre FROM subcategoria');
    return result;
}


export { 
    generarIdProducto, 
    insertarProducto, 
    insertarPrecio, 
    insertarImagenes,
    listarProductos,
    listarProducto,
    eliminarProducto,
    consultarImagenes,
    actualizarProducto,
    consultarSubcategoria,
    desactivarPrecio,
    crearPrecio,
    eliminarImagenes,
    insertarStock
}