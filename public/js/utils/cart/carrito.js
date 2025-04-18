import { insertarCarrito } from '../../pages/cart/carrito.js';
import { 
    validarStockCarritoFetch, 
    cargarCarritoFetch, 
    estaLogueado ,
    consultarCarritoFechtch
} from '../../fetch/api.js';

import { insertarCantidadCarrito } from '../../components/nav.js';

function getCarritoLocal() {
    const raw = localStorage.getItem("carrito");
    if (!raw || raw === "undefined" || raw === "null") return [];

    try {
        return JSON.parse(raw);
    } catch (e) {
        console.warn("Carrito corrupto en localStorage, limpiando...");
        localStorage.removeItem("carrito");
        return [];
    }
}

function setCarritoLocal(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Validar stock actual y corregir productos
export async function validarStockCarrito() {
    const carrito = getCarritoLocal();
    try {
        const data = await validarStockCarritoFetch(carrito);
        return data;
    } catch (error) {
        console.error("Error al validar stock del carrito:", error);
        return { carrito };
    }
}

// Agregar producto al carrito (local + backend)
export async function agregarAlCarrito(productoId, precio, cantidad = 1, nombre, descripcion, imagenes) {
    let carrito = getCarritoLocal();
    cantidad = parseInt(cantidad, 10);

    const productoExistente = carrito.find(p => p.productoId === productoId);

    if (productoExistente) {
        productoExistente.cantidad += cantidad;
    } else {
        carrito.push({ productoId, precio, cantidad, nombre, descripcion, imagenes });
    }

    setCarritoLocal(carrito);
    await insertarCarrito();
    await cargarCarrito(); // sincronizar con BD si está logueado
}

// Obtener carrito con productos validados
export async function obtenerCarrito() {
    const validacion = await validarStockCarrito();
    setCarritoLocal(validacion.carrito);
    return validacion.carrito;
}

// Cargar carrito a la base de datos si el usuario está logueado
export async function cargarCarrito() {
    await validarStockCarrito(); // ahora sí esperamos la validación
    const carrito = getCarritoLocal();
    const logueado = await estaLogueado();

    if (!logueado) {
        return carrito;
    }

    try {
        const respuesta = await cargarCarritoFetch(carrito);
        setCarritoLocal(respuesta);
        return respuesta;
    } catch (error) {
        console.error("Error al cargar carrito en backend:", error);
        return carrito;
    }
}


// Eliminar producto del carrito
export async function eliminarProductoDelCarrito(id) {
    let carrito = getCarritoLocal();
    carrito = carrito.filter(producto => producto.productoId !== id);
    setCarritoLocal(carrito);
    await cargarCarrito();
    await insertarCarrito();
}

// Vaciar carrito completamente
export async function vaciarCarrito() {
    localStorage.removeItem("carrito");
    await insertarCarrito();

    const logueado = await estaLogueado();
    if (logueado) {
        await cargarCarrito(); // actualiza carrito vacío en BD
    }
}

// Cambiar cantidad de producto
export async function actualizarCantidadCarrito(productoID, cantidad) {
    let carrito = getCarritoLocal();
    const producto = carrito.find(p => p.productoId === productoID);

    if (producto) {
        producto.cantidad = parseInt(cantidad, 10);
        setCarritoLocal(carrito);
        await cargarCarrito();
        await insertarCarrito();
        await insertarCantidadCarrito(); 
    }
}



export async function cargarCarritoAlIniciarSesion() {
    const logueado = await estaLogueado();
    if (!logueado) {
        return getCarritoLocal();
    }

    let carritoBackend = [];
    try {
        carritoBackend = await consultarCarritoFechtch();
    } catch (error) {
        console.error("Error obteniendo carrito backend:", error);
    }

    const carritoLocal = getCarritoLocal();
    const carritoValidado = (await validarStockCarritoFetch(carritoLocal))?.carrito || [];

    const carritoMap = new Map();
    let carritoFinal;

    // Agregar backend
    carritoBackend.forEach(p => carritoMap.set(p.productoId, { ...p }));

    // Fusionar local
    carritoValidado.forEach(p => {
        if (carritoMap.has(p.productoId)) {
            const producto = carritoMap.get(p.productoId);
            producto.cantidad = Math.max(producto.cantidad, p.cantidad);
        } else {
            carritoMap.set(p.productoId, { ...p });
        }
    });

    carritoFinal = Array.from(carritoMap.values());

    try {
        await cargarCarritoFetch(carritoFinal);
        setCarritoLocal(carritoFinal);
    } catch (error) {
        console.error("Error subiendo carrito combinado:", error);
    }

    await insertarCarrito();
    await insertarCantidadCarrito();
    return carritoFinal;
}


export async function vaciarCarritoCompleto() {
    // 1. Borrar del localStorage
    localStorage.removeItem("carrito");

    // 2. Borrar del backend (si está logueado)
    const logueado = await estaLogueado();
    if (logueado) {
        try {
            await cargarCarritoFetch([]); // envia carrito vacío
        } catch (error) {
            console.error("Error al vaciar carrito en backend:", error);
        }
    }

    // 3. Actualizar UI
    await insertarCarrito();
    await insertarCantidadCarrito();
}
