import {    generarIdProducto, 
            insertarProducto, 
            insertarPrecio, 
            insertarStock,
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
            consultarCategoria,
            consultarSubcategoriaAdmin,
            consultarInfoProductoM,
            consultarStock,
            consultarImagenesAdmin,
            consultarPrecio
} from '../../models/productoModels.js';


import fs from 'fs/promises';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public/uploads/productos');


//crear producto 
export async function crearProductoService({
    nombre,
    descripcion,
    descripcion_larga, 
    categoria,
    id_subcategoria,
    precio,
    stock,
    imagenes,
    costo
}) {
    if (!imagenes || imagenes.length === 0) {
        throw new Error('Debes subir al menos una imagen');
    }

    const id_producto = await generarIdProducto();

    await insertarProducto(id_producto, nombre, descripcion, descripcion_larga, categoria, id_subcategoria, costo);
    await insertarPrecio(id_producto, precio);
    await insertarStock(id_producto, stock);

    const imageValues = imagenes.map(file => [Buffer.from(id_producto, 'hex'), file.filename]);
    if (imageValues.length > 0) {
        await insertarImagenes(imageValues);
    }

    return {
        message: 'Producto creado correctamente',
        id_producto,
        nombre,
        precio,
        stock
    };
}


// procesar imagenes 

export async function procesarImagenes (imagenes, id_producto) {
    if (!imagenes || imagenes.length === 0) return [];
    const imageValues = imagenes.map(file => [
        Buffer.from(id_producto, 'hex'), 
        file.filename // Usar el nombre de archivo generado por Multer (UUID)
    ]);
    return imageValues;
};

// listar productos
export async function listarProductosService(id_categoria, id_subcategoria) {
    const productos = await listarProductos(id_categoria, id_subcategoria);
    if (!productos || productos.length === 0) {
        return { message: 'No hay productos' };
    }
    return productos;
};

// listar un producto (osea solo un produto )
export async function listarProductoService(id) {
    const producto = await listarProducto(id);
    if (!producto || producto.length === 0) {
        return { message: 'Producto no encontrado' };
    }
    return producto;
};

// eliminar producto
export async function eliminarProductoService(id) {
    eliminarImagenesDelServidor(id);
    const resultado = await eliminarProducto(id);
    return resultado;
}


// eliminar imagenes del servidor
export async function  eliminarImagenesDelServidor (id) {
    try {
        const imagenes = await consultarImagenes(id);
        await Promise.all(imagenes.map(async (img) => {
            const imgPath = path.join(uploadDir, img.ruta_imagen);
            try {
                await fs.unlink(imgPath); // Eliminar la imagen
                
            } catch (error) {
                console.error(`No se pudo eliminar la imagen ${img.ruta_imagen}:`, error.message);
            }
        }));
    } catch (error) {
        console.error('Error al eliminar imágenes del servidor:', error);
    }
};

//validar existencia de producto en el servidor 
export async function  validarExistenciaDeProducto (id) {
    const producto = await listarProducto(id);
    if (!producto || producto.length === 0) {  
        return false;
    }
    return true;
};

// actualizar producto
export async function  actualizarProductoService (id, { nombre, descripcion, descripcion_larga, categoria, id_subcategoria, precio, stock, imagenes, imagenes_delete }) {
    try {
        const validar = await validarExistenciaDeProducto(id)
        if (!validar) {
            return { error: 'Producto no existe' };
        }
        const [productoData] = await listarProducto(id);
        // Ensure productoData is not undefined.
        if (!productoData) {
            throw new Error('No se pudo cargar la información del producto para la actualización.');
        }

        // Validar existencia de subcategoría
        let final_id_subcategoria = id_subcategoria === '' ? null : id_subcategoria;
        if (final_id_subcategoria) { 
            const [subcategoria_result] = await consultarSubcategoria(final_id_subcategoria);
            if (!subcategoria_result || subcategoria_result.length === 0) {
                return { error: 'La subcategoría especificada no existe' };
            }
        }

        let valores = [];
        let camposActualizar = [];

        // Nombre
        if (nombre !== undefined && String(nombre).trim() !== String(productoData.producto_nombre || '').trim()) {
            camposActualizar.push('nombre = ?');
            valores.push(nombre.trim());
            console.log('Actualizando nombre', nombre);
        }

        // Descripcion
        if (descripcion !== undefined && String(descripcion).trim() !== String(productoData.producto_descripcion || '').trim()) {
            camposActualizar.push('descripcion = ?');
            valores.push(descripcion.trim());
            console.log('Actualizando descripcion', descripcion);
        }

        // Descripcion Larga
        if (descripcion_larga !== undefined && String(descripcion_larga).trim() !== String(productoData.producto_descripcion_larga || '').trim()) {
            camposActualizar.push('descripcion_larga = ?');
            valores.push(descripcion_larga.trim());
        }

        // Categoria
        if (categoria !== undefined && String(categoria).trim() !== String(productoData.producto_categoria || '').trim()) {
            camposActualizar.push('id_categoria = ?');
            valores.push(categoria.trim() === '' ? null : categoria.trim()); 
            console.log('Actualizando categoria', categoria);
        }

        // Subcategoria
        if (id_subcategoria !== undefined && final_id_subcategoria !== (productoData.producto_subcategoria || null)) {
            camposActualizar.push('id_subcategoria = ?');
            valores.push(final_id_subcategoria);
            console.log('Actualizando subcategoria', id_subcategoria);
        }
        
        // Precio
        if (precio !== undefined && parseFloat(precio) !== parseFloat(productoData.precio_activo || 0)) { 
            console.log('Actualizando precio', precio);
            await desactivarPrecio(id);
            await crearPrecio(id, precio);
        }
        
        // Stock
        if (stock !== undefined && parseInt(stock) !== parseInt(productoData.producto_stock || 0)) { 
            console.log('Actualizando stock', stock);
            await insertarStock(id, stock);
        }

        // Actualizar campos del producto (texto)
        console.log(camposActualizar)
        if (camposActualizar.length > 0) {
            console.log('Llamando a actualizarProducto con campos:', camposActualizar, 'y valores:', valores);
            await actualizarProducto(id, camposActualizar, valores);
            console.log('actualizarProducto completado.');
        }
        
        // Eliminar imágenes
        if (imagenes_delete && imagenes_delete.length > 0) {
            console.log('Eliminando imágenes:', imagenes_delete);
            await elimiarImagenes(imagenes_delete);
            console.log('Eliminar imágenes completado.');
        }
        // Procesar nuevas imágenes
        if (imagenes && imagenes.length > 0) {
            console.log('Procesando nuevas imágenes. Cantidad:', imagenes.length);
            const imageValues = await procesarImagenes(imagenes, id);
            if (imageValues.length > 0) {
                console.log('Insertando nuevas imágenes en la DB con valores:', imageValues);
                await insertarImagenes(imageValues); 
                console.log('Nuevas imágenes insertadas.');
            }
        } else {
            console.log('No hay nuevas imágenes para procesar.');
        }
        return { message: 'Producto actualizado correctamente' };
    } catch (error) {
        console.error('Error al actualizar el producto en servicio:', error); 
        return { error: 'Error al actualizar el producto' };
    }
};

export async function  elimiarImagenes (imagenes_delete) {
    try {
        // Convertir string a array y limpiar las rutas
        const imagenes = JSON.parse(imagenes_delete)
            .map(img => img.trim()); // No manipular la ruta, usarla directamente
        if (imagenes && imagenes.length > 0) {
            // Eliminar archivos del sistema
            await Promise.all(
                imagenes.map(async (imagen) => {
                    try {
                        const filePath = path.join(uploadDir, imagen);
                        await fs.unlink(filePath);
                    } catch (error) {
                        if (error.code === 'ENOENT') {
                            console.log(`El archivo ${imagen} ya no existe`);
                        } else {
                            console.error(`Error eliminando archivo ${imagen}:`, error);
                        }
                    }
                })
            );
            // Eliminar registros de la base de datos
            await eliminarImagenes(imagenes);
        }
    } catch (error) {
        console.error('Error eliminando imágenes:', error);
        throw error; // Re-lanzar el error para que sea manejado por el controlador
    }
};

export async function consultarInfoProducto(id) {
    const [categorias, subcategoria, stock, info, imagenes, precio] = await Promise.all([
        consultarCategoria(),
        consultarSubcategoriaAdmin(),
        consultarStock(id),
        consultarInfoProductoM(id),
        consultarImagenesAdmin(id),
        consultarPrecio(id)
    ]);

    return {
        categorias,
        subcategoria,
        stock,
        ...Array.isArray(info) ? info.flat(Infinity)[0] : info, // Desestructura info como un solo objeto
        imagenes,
        precio
    };
}

export async function categoriaSubCategoria() {
    const categorias = await consultarCategoria();
    const subcategorias = await consultarSubcategoriaAdmin();
    return { categorias, subcategorias };
}


