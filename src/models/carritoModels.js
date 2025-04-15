import pool from './bd.js';

export async function validarProductosModels(productos) {
    const errores = [];

    for (const producto of productos) {
        const { productoId, nombre, descripcion, precio, cantidad, imagenes } = producto;

        // Consultar si el producto existe
        const [productoExistente] = await pool.query(
            `SELECT 
                HEX(p.id) AS producto_id,
                p.nombre AS nombre_db,
                p.descripcion AS descripcion_db,
                COALESCE(MAX(pr.precio), 0) AS precio_db,
                COALESCE(stk.cantidad, 0) AS stock_db,
                GROUP_CONCAT(DISTINCT CONCAT('/uploads/productos/', i.ruta_imagen) ORDER BY i.id SEPARATOR ',') AS imagenes_db
            FROM productos p
            LEFT JOIN precios pr ON p.id = pr.id_producto AND pr.activo = 1
            LEFT JOIN stock stk ON p.id = stk.id_producto
            LEFT JOIN imagenes_productos i ON p.id = i.id_producto
            WHERE p.id = UNHEX(?)
            GROUP BY p.id`,
            [productoId]
        );

        if (!productoExistente || productoExistente.length === 0) {
            errores.push(`Producto con ID ${productoId} no existe.`);
            continue;
        }

        // Validar nombre
        if (productoExistente.nombre_db !== nombre) {
            errores.push(`El nombre del producto ${productoId} no coincide (Esperado: ${productoExistente.nombre_db}, Recibido: ${nombre}).`);
        }

        // Validar descripción
        if (productoExistente.descripcion_db !== descripcion) {
            errores.push(`La descripción del producto ${productoId} no coincide.`);
        }

        // Validar precio
        if (productoExistente.precio_db !== precio) {
            errores.push(`El precio del producto ${productoId} no coincide (Esperado: ${productoExistente.precio_db}, Recibido: ${precio}).`);
        }

        // Validar stock
        if (productoExistente.stock_db < cantidad) {
            errores.push(`Stock insuficiente para el producto ${productoId} (Disponible: ${productoExistente.stock_db}, Requerido: ${cantidad}).`);
        }

        // Validar imágenes
        try {
            const imagenesDbArray = productoExistente.imagenes_db ? productoExistente.imagenes_db.split(',') : [];
            const imagenesApiArray = imagenes ? imagenes.split(',') : [];
            if (imagenesDbArray.sort().join(',') !== imagenesApiArray.sort().join(',')) {
                errores.push(`Las imágenes del producto ${productoId} no coinciden.`);
            }
        } catch (e) {
            console.error("Error al comparar imágenes: ", e);
        }
    }

    return errores.length > 0 ? { valid: false, errores } : { valid: true, mensaje: "Todos los productos son válidos." };
};

export async function obtenerDatosCorregidos(productoId) {
    const [result] = await pool.query(
        `SELECT 
            HEX(p.id) AS productoId,
            p.nombre AS nombre,
            p.descripcion AS descripcion,
            MAX(pr.precio) AS precio,
            COALESCE(
                (SELECT s.cantidad 
                 FROM stock s 
                 WHERE s.id_producto = p.id 
                 ORDER BY s.ultima_actualizacion DESC 
                 LIMIT 1), 
            0) AS stock,
            GROUP_CONCAT(DISTINCT CONCAT('/uploads/productos/', i.ruta_imagen) ORDER BY i.id SEPARATOR ',') AS imagenes
        FROM productos p
        LEFT JOIN precios pr ON p.id = pr.id_producto AND pr.activo = 1
        LEFT JOIN imagenes_productos i ON p.id = i.id_producto
        WHERE p.id = UNHEX(?)
        GROUP BY p.id`,
        [productoId]
    );

    if (!result || result.length === 0) {
        return null; // Producto no encontrado
    }
    
    const productoExistente = result[0];
    return {
        productoId: productoExistente.productoId,
        nombre: productoExistente.nombre,
        descripcion: productoExistente.descripcion,
        precio: Number(productoExistente.precio) || 0,
        stock: Number(productoExistente.stock) || 0,
        imagenes: productoExistente.imagenes ? productoExistente.imagenes.split(',') : []
    };
};

export async function cargarCarritoModels(carrito, userId) {
    // Eliminar todo el carrito anterior del usuario
    await pool.query(`DELETE FROM carrito_usuarios WHERE id_usuario = UNHEX(?)`, [userId]);
    
    try {
        // Insertar los productos nuevos (o actualizar si ya existen)
        for (const item of carrito) {
            const { productoId, cantidad } = item;

            await pool.query(
                `INSERT INTO carrito_usuarios (id_usuario, id_producto, cantidad)
                VALUES (UNHEX(?), UNHEX(?), ?)
                ON DUPLICATE KEY UPDATE cantidad = VALUES(cantidad)`,
                [userId, productoId, cantidad]
            );
        }

        return { ok: true, mensaje: "Carrito reemplazado correctamente" };
    } catch (e) {
        console.error("Error al cargar el carrito:", e);
        return { ok: false, mensaje: "Error al cargar el carrito" };
    }
}


export async function obtenerCarritoModels(userId) {
    const [rows] = await pool.query(
        `SELECT 
            HEX(c.id_producto) AS productoId,
            c.cantidad,
            p.nombre,
            p.descripcion,
            COALESCE(stk.cantidad, 0) AS stock,
            COALESCE(MAX(pr.precio), 0) AS precio,
            GROUP_CONCAT(DISTINCT CONCAT('/uploads/productos/', i.ruta_imagen) ORDER BY i.id SEPARATOR ',') AS imagenes
        FROM carrito_usuarios c
        INNER JOIN productos p ON c.id_producto = p.id
        LEFT JOIN precios pr ON p.id = pr.id_producto AND pr.activo = 1
        LEFT JOIN (
            SELECT id_producto, cantidad
            FROM stock
            WHERE (id_producto, ultima_actualizacion) IN (
                SELECT id_producto, MAX(ultima_actualizacion)
                FROM stock
                GROUP BY id_producto
            )
        ) stk ON p.id = stk.id_producto
        LEFT JOIN imagenes_productos i ON p.id = i.id_producto
        WHERE c.id_usuario = UNHEX(?)
        GROUP BY c.id_producto`,
        [userId]
    );

    // Verificar si hay productos
    if (!rows || rows.length === 0) {
        return { ok: false, mensaje: "No se encontraron productos en el carrito." };
    }

    return rows.map(producto => ({
        productoId: producto.productoId,
        precio: Number(producto.precio),
        cantidad: producto.cantidad,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        imagenes: producto.imagenes ? producto.imagenes.split(',') : [],
        stock: Number(producto.stock)
    }));
};
