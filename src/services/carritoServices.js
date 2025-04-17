import { validarProductosModels, obtenerDatosCorregidos,obtenerCarritoModels ,cargarCarritoModels} from '../models/carritoModels.js';

export async function validarStockCarritoServices(carrito) {
    if (!Array.isArray(carrito)) {
        return { valid: false, message: 'Carrito no válido' };
    }
    let validacion;
    try{
        // Validar todos los productos en una sola consulta
        validacion = await validarProductosModels(carrito);
       
    }catch (error) {
        console.error('Error al validar el carrito:', error);
    }

    let carritoCorregido = [];

    for (const producto of carrito) {
        let productoCorregido = { ...producto }; // Copiar producto original

        // Si hay errores en este producto, corregir datos
        const erroresProducto = validacion.errores.filter(e => e.includes(producto.productoId));

        if (erroresProducto.length > 0) {
            const datosCorrectos = await obtenerDatosCorregidos(producto.productoId);
            if (datosCorrectos) {
                productoCorregido.nombre = datosCorrectos.nombre;
                productoCorregido.descripcion = datosCorrectos.descripcion;
                productoCorregido.precio = datosCorrectos.precio;
                productoCorregido.cantidad = Math.min(producto.cantidad, datosCorrectos.stock); // Ajustar stock
                productoCorregido.imagenes = datosCorrectos.imagenes.join(','); // Corregir imágenes
                productoCorregido.stock = datosCorrectos.stock;
            }
        }

        carritoCorregido.push(productoCorregido);
    }
    return { valid: true, carrito: carritoCorregido };
};

export async function cargarCarritoServices(carrito, userId) {
    // // Guardar el carrito del usuario
    await cargarCarritoModels(carrito, userId);
    
    // // Luego cuando entra a la página:
    const carritoActualizado = await obtenerCarritoModels(userId);
    return carritoActualizado;
};

export async function consultarCarritoServies(userId) {
    const carrito = await obtenerCarritoModels(userId);
    return carrito;
};

export async function restarStockCarritoServices(carrito, userId) {
    // Restar stock de los productos del carrito
    const carritoActualizado = await cargarCarritoModels(carrito, userId);
    
    // Luego cuando entra a la página:
    const carritoFinal = await obtenerCarritoModels(userId);
    return carritoFinal;
}

export async function vaciarCarritoServices(userId) {
    await cargarCarritoModels([], userId);
    const carrito = await obtenerCarritoModels(userId);
    return carrito;
}