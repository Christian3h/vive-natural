import { obtenerProducto } from '../../fetch/api.js';
import { crearProductoCard } from './insertarProductos.js';

const id = window.location.href.split('/').pop();

obtenerProducto(id).then(producto => {
    if (producto) {
        insertarProducto(producto[0]);
    } else {
        console.error("No se encontró el producto.");
    }
})

export function insertarProducto(producto) {
    const productoContainer = document.getElementById('productoContainer');
    if (!productoContainer) return console.error("No se encontró el contenedor de productos.");

    const fragment = document.createDocumentFragment();
    fragment.appendChild(crearProductoCard(producto, 'none')); // Solo uno

    productoContainer.innerHTML = '';
    productoContainer.appendChild(fragment);
}


const manejarCantidad = (stockMaximo) => {
    const cantidadInput = document.getElementById('cantidad');
    const restarBtn = document.getElementById('restar');
    const sumarBtn = document.getElementById('sumar');

    // Función para actualizar la cantidad del input
    function actualizarCantidad() {
        let cantidad = parseInt(cantidadInput.value);

        // Si la cantidad excede el stock, la ajustamos al stock máximo
        if (cantidad > stockMaximo) {
            cantidad = stockMaximo; 
        } else if (cantidad < 1) {
            cantidad = 1; // No permitir cantidades menores que 1
        }

        cantidadInput.value = cantidad;
    }

    // Evento de restar
    restarBtn.addEventListener('click', () => {
        let cantidad = parseInt(cantidadInput.value);
        if (cantidad > 1) {
            cantidad--; // Restar 1 a la cantidad
            cantidadInput.value = cantidad;
        }
        actualizarCantidad(); // Actualizamos la cantidad después de modificarla
    });

    // Evento de sumar
    sumarBtn.addEventListener('click', () => {
        let cantidad = parseInt(cantidadInput.value);
        if (cantidad < stockMaximo) {
            cantidad++; // Sumar 1 a la cantidad
            cantidadInput.value = cantidad;
        }
        actualizarCantidad(); // Actualizamos la cantidad después de modificarla
    });

    // Evento cuando el usuario escriba en el input
    cantidadInput.addEventListener('input', () => {
        actualizarCantidad(); // Validamos que la cantidad no exceda el stock
    });
}
