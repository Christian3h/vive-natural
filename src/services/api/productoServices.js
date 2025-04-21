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
export async function crearProductoService({ nombre, descripcion, categoria, id_subcategoria, precio, stock, imagenes, costo}) {
    if (!imagenes || imagenes.length === 0) {
        throw new Error('Debes subir al menos una imagen');
    }
    const id_producto = await generarIdProducto();
    // Insertar datos en la BD
    await insertarProducto(id_producto, nombre, descripcion, categoria, id_subcategoria, costo);
    await insertarPrecio(id_producto, precio);
    await insertarStock(id_producto, stock);
    // Procesar imágenes
    const imageValues = await procesarImagenes(imagenes, id_producto);
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
};

// procesar imagenes 

export async function procesarImagenes (imagenes, id_producto) {
    if (!imagenes || imagenes.length === 0) return [];
    // Consultar imágenes existentes en la BD
    const imagenesExistentes = await consultarImagenes(id_producto);
    const formattedId = id_producto.replace(/-/g, '').toLowerCase();
    // Obtener los números de imágenes ya usados para evitar conflictos
    const numerosUsados = new Set(
        imagenesExistentes.map(img => {
            if (typeof img === "object" && img.ruta_imagen) {
                const match = img.ruta_imagen.match(/_(\d+)\.webp$/);
                return match ? parseInt(match[1]) : null;
            }
            return null;
        }).filter(num => num !== null)
    );
    let newIndex = 0;
    while (numerosUsados.has(newIndex)) {
        newIndex++; // Buscar el próximo número disponible
    }
    const imageValues = await Promise.all(
        imagenes.map(async (file) => {
            // Asignar un número único para cada nueva imagen
            while (numerosUsados.has(newIndex)) {
                newIndex++;
            }
            numerosUsados.add(newIndex);
            const newFileName = `${formattedId}_${newIndex}.webp`;
            const newPath = path.join(uploadDir, newFileName);

            try {
                await fs.rename(file.path, newPath);
                return [Buffer.from(formattedId, 'hex'), newFileName];
            } catch (error) {
                console.error('Error al mover imagen:', error);
                try {
                    await fs.unlink(file.path); // Eliminar archivo temporal en caso de error
                } catch (unlinkError) {
                    console.error('Error al eliminar archivo temporal:', unlinkError);
                }
                throw new Error('Error al procesar la imagen');
            }
        })
    );
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
export async function  actualizarProductoService (id, { nombre, descripcion, categoria, id_subcategoria, precio, stock, imagenes, imagenes_delete }) {
    
    try {
        const validar = await validarExistenciaDeProducto(id);
        if (!validar) {
            return { error: 'Producto no existe' };
        }
        const [producto] = await listarProducto(id);

        // Validar existencia de subcategoría
        if (id_subcategoria) {
            const [subcategoria] = await consultarSubcategoria(id_subcategoria);
            if (!subcategoria.length) {
                return { error: 'La subcategoría especificada no existe' };
            }
        }

        let valores = [];
        let camposActualizar = [];

        if (nombre && nombre !== producto.nombre) {
            camposActualizar.push('nombre = ?');
            valores.push(nombre);
        }
        if (descripcion && descripcion !== producto.descripcion) {
            camposActualizar.push('descripcion = ?');
            valores.push(descripcion);
        }
        if (categoria && categoria !== producto.id_categoria) {
            camposActualizar.push('id_categoria = ?');
            valores.push(categoria);
        }
        if (id_subcategoria && id_subcategoria !== producto.id_subcategoria) {
            camposActualizar.push('id_subcategoria = ?');
            valores.push(id_subcategoria);
        }

        // Actualizar campos del producto
        if (camposActualizar.length > 0) {
            await actualizarProducto(id, camposActualizar, valores);
        }
        // Manejo de precios
        if (precio && precio !== producto.precio) {
            await desactivarPrecio(id);
            await crearPrecio(id, precio);
        }
        // Manejo de stock
        if (stock && stock !== producto.stock) {
            
            await insertarStock(id, stock);
        }
        // Eliminar imágenes
        if (imagenes_delete && imagenes_delete.length > 0) {
            await elimiarImagenes(imagenes_delete);
        }
        // Procesar imágenes
        const imageValues = await procesarImagenes(imagenes, id);
        if (imageValues.length > 0) {
            await insertarImagenes(imageValues); 
        }
        return { message: 'Producto actualizado correctamente' };
    } catch (error) {
        console.error(error);
        return { error: 'Error al actualizar el producto' };
    }
};

export async function  elimiarImagenes (imagenes_delete) {
    try {
        // Convertir string a array y limpiar las rutas
        const imagenes = imagenes_delete
            .replace(/"/g, '')  // Eliminar comillas
            .split(',')         // Separar por comas
            .map(img => img.trim().replace('/img/uploads/', '')); // Limpiar cada ruta
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
        throw error;
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


