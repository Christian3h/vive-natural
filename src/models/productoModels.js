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
        [id_producto.toLowerCase(), stock]
    );
    if (result.affectedRows === 0) {
        throw new Error('Error al insertar el stock.');
    }
};

const insertarProducto = async (id_producto, nombre, descripcion, descripcion_larga, id_categoria, id_subcategoria, costo) => {
    const [result] = await pool.query(
        `INSERT INTO productos (
            id, nombre, descripcion, descripcion_larga, estado, id_categoria, id_subcategoria, costo, fecha_creacion
        ) VALUES (
            UNHEX(?), ?, ?, ?, '1', ?, ?, ?, NOW()
        )`,
        [id_producto.toLowerCase(), nombre, descripcion, descripcion_larga, id_categoria, id_subcategoria, costo]
    );
    
    if (result.affectedRows === 0) {
        throw new Error('Error al insertar el producto.');
    }
};


const insertarPrecio = async (id_producto, precio) => {
    const [result] = await pool.query(
        `INSERT INTO precios (id_producto, precio, fecha_creacion, activo) 
         VALUES (UNHEX(?), ?, NOW(), 1)`,
        [id_producto.toLowerCase(), precio]
    );
    if (result.affectedRows === 0) {
        throw new Error('Error al insertar el precio.');
    }
};

const insertarImagenes = async (imageValues) => {
    try {
        // Asegurarse de que los IDs del producto en imageValues también estén en minúsculas
        const processedImageValues = imageValues.map(img => [
            Buffer.from(img[0].toString('hex').toLowerCase(), 'hex'), // Convertir Buffer a hex, luego minúsculas, luego Buffer de nuevo
            img[1]
        ]);

        await pool.query(
            `INSERT INTO imagenes_productos (id_producto, ruta_imagen) VALUES ?`,
            [processedImageValues]
        );
    } catch (error) {
        console.error('Error al insertar imágenes en la base de datos:', error);
        throw error;
    }
};

// listar productos 

const listarProductos = async (id_categoria, id_subcategoria) => {
    const [result] = await pool.query(`
        SELECT 
            HEX(p.id) AS producto_id_hex,
            p.nombre AS producto_nombre,
            p.descripcion AS producto_descripcion,
            p.descripcion_larga AS producto_descripcion_larga,
            COALESCE(
                (SELECT s.cantidad 
                 FROM stock s 
                 WHERE s.id_producto = p.id 
                 ORDER BY s.ultima_actualizacion DESC 
                 LIMIT 1), 
            0) AS producto_stock,
            p.id_categoria AS producto_categoria,  
            p.id_subcategoria AS producto_subcategoria,
            c.nombre AS categoria_nombre,
            s.nombre AS subcategoria_nombre,
            MAX(pr.precio) AS precio_activo,
            GROUP_CONCAT(DISTINCT CONCAT('/uploads/productos/', i.ruta_imagen) ORDER BY i.id SEPARATOR ', ') AS imagenes
        FROM productos p
        JOIN categoria c ON p.id_categoria = c.id
        LEFT JOIN subcategoria s ON p.id_subcategoria = s.id
        LEFT JOIN precios pr ON p.id = pr.id_producto AND pr.activo = 1  
        LEFT JOIN imagenes_productos i ON p.id = i.id_producto
        WHERE 
            (IFNULL(?, p.id_categoria) = p.id_categoria)
            AND (IFNULL(?, p.id_subcategoria) = p.id_subcategoria)  
        GROUP BY 
            p.id, p.nombre, p.descripcion, p.descripcion_larga, 
            p.id_categoria, p.id_subcategoria, 
            c.nombre, s.nombre
        ORDER BY p.fecha_creacion DESC;
        `,
        [id_categoria, id_subcategoria]
    );

    // Convertir Buffer IDs a cadenas hexadecimales si es necesario
    return result.map(producto => {
        if (Buffer.isBuffer(producto.producto_id_hex)) {
            producto.producto_id_hex = producto.producto_id_hex.toString('hex');
        }
        return producto;
    });
};

// listar un solo produto 

// linea modificada 
//COALESCE(stk.cantidad, 0) AS producto_stock,

const listarProducto = async (id) => {
    console.log(`Modelo - Listar Producto: ID recibido: ${id}, Tipo: ${typeof id}`);
    const [result] = await pool.query(
        `
        SELECT 
            HEX(p.id) AS producto_id_hex,
            p.nombre AS producto_nombre,
            p.descripcion AS producto_descripcion,
            p.descripcion_larga AS producto_descripcion_larga,
            COALESCE(MAX(stk.cantidad), 0) AS producto_stock,
            p.id_categoria AS producto_categoria,  
            p.id_subcategoria AS producto_subcategoria,
            c.nombre AS categoria_nombre,
            sub.nombre AS subcategoria_nombre,
            MAX(pr.precio) AS precio_activo,  
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
            GROUP BY p.id, p.nombre, p.descripcion, p.descripcion_larga, p.id_categoria, p.id_subcategoria, c.nombre, sub.nombre
            ORDER BY p.fecha_creacion DESC;

        `,
        [id.toLowerCase()]
    );
    // Convertir Buffer ID a cadena hexadecimal si es necesario para un solo producto
    if (result && result.length > 0 && Buffer.isBuffer(result[0].producto_id_hex)) {
        result[0].producto_id_hex = result[0].producto_id_hex.toString('hex');
    }
    console.log('Modelo - Listar Producto: Resultado de la consulta:', result);
    return result;
};


// eliminar producto
const eliminarProducto = async (id) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {

        // Eliminar detalles de pedidos asociados al producto
        await connection.query(
            `DELETE FROM detalle_pedido WHERE producto_id = UNHEX(?)`,
            [id.toLowerCase()]
        );

        // Eliminar precios
        await connection.query(
            `DELETE FROM precios WHERE id_producto = UNHEX(?)`,
            [id.toLowerCase()]
        );

        // Eliminar imágenes
        await connection.query(
            `DELETE FROM imagenes_productos WHERE id_producto = UNHEX(?)`,
            [id.toLowerCase()]
        );

        // Eliminar producto
        const [result] = await connection.query(
            `DELETE FROM productos WHERE id = UNHEX(?)`,
            [id.toLowerCase()]
        );

        await connection.commit();
        return { message: 'Producto eliminado correctamente' };
    } catch (error) {
        await connection.rollback();
        console.error(`Modelo - Error en la transacción de eliminación para ID: ${id}:`, error);
        throw error; // Re-lanzar el error para que sea manejado por el servicio/controlador
    } finally {
        connection.release();
    }
};

const consultarImagenes = async (id) => {
    const [result] = await pool.query(
        `SELECT ruta_imagen FROM imagenes_productos WHERE id_producto = UNHEX(?)`,
        [id.toLowerCase()]
    );
    return result;
};

// actualizar producto (solo texto no imagenes )

const actualizarProducto = async (id, camposActualizar, valores) => {
    console.log(`Modelo - Actualizando producto con ID: ${id}`);
    console.log('Modelo - Campos a actualizar:', camposActualizar);
    console.log('Modelo - Valores:', valores);

    const idIndex = valores.length;
    valores.push(id.toLowerCase()); // Agregamos el id al final y lo normalizamos a minúsculas

    const sql = `UPDATE productos SET ${camposActualizar.join(", ")} WHERE id = UNHEX(?)`;
    console.log('Modelo - Consulta SQL de actualización:', sql);
    
    const [result] = await pool.query(sql, valores);
    console.log(`Modelo - Filas afectadas por la actualización: ${result.affectedRows}`);

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
    await pool.query('UPDATE precios SET activo = 0 WHERE id_producto = UNHEX(?) AND activo = 1', [id.toLowerCase()]);
};

const crearPrecio = async (id, precio) => {
    await pool.query('INSERT INTO precios (id_producto, precio, activo) VALUES (UNHEX(?), ?, 1)', [id.toLowerCase(), precio]);
};

// eliminar registro de las imagenes de la base de datos 

const eliminarImagenes = async (imagenes) => {
    try {
        await pool.query('DELETE FROM imagenes_productos WHERE ruta_imagen IN (?)', [imagenes]);
    } catch (error) {
        console.error('Modelo - Error al eliminar registros de imágenes de la base de datos:', error);
        throw error;
    }
};

//conultar info del producto para editarlo 

export async function consultarInfoProductoM(id) {
    const [result] = await pool.query(
        'SELECT HEX(id) AS id, nombre, descripcion, descripcion_larga, id_categoria, id_subcategoria FROM productos WHERE id = UNHEX(?)', 
        [id.toLowerCase()]
    );
    // Convertir Buffer ID a cadena hexadecimal si es necesario para información de producto
    if (result && result.length > 0 && Buffer.isBuffer(result[0].id)) {
        result[0].id = result[0].id.toString('hex');
    }
    return result;
}

export async function consultarPrecio(id) {
    const [result] = await pool.query('SELECT precio FROM precios WHERE id_producto = UNHEX(?) AND activo = 1', [id.toLowerCase()]);
    return result.length > 0 ? result[0].precio : null;
}

export async function consultarCategoria() {
    const [result] = await pool.query('SELECT id, nombre FROM categoria');
    return result;
}

export async function consultarImagenesAdmin(id) {
    const [result] = await pool.query('SELECT ruta_imagen FROM imagenes_productos WHERE id_producto = UNHEX(?)', [id.toLowerCase()]);
    return result;
}

export async function consultarStock(id) {
    const [result] = await pool.query(
        'SELECT cantidad FROM stock WHERE id_producto = UNHEX(?) ORDER BY ultima_actualizacion DESC LIMIT 1', 
        [id.toLowerCase()]
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