import { actualizarCantidadCarrito } from './carrito.js';
import { insertarCantidadCarrito } from '../../components/nav.js';


export async function productoFuncionalidad() {

    // Esperar a que los productos existan antes de buscar los elementos
    setTimeout(() => {
        document.querySelectorAll(".cantidad-container").forEach(container => {
            const inputCantidad = container.querySelector(".cantidad");
            const botonSumar = container.querySelector(".sumar");
            const botonRestar = container.querySelector(".restar");
            const stockMaximo = parseInt(container.closest(".producto-card").querySelector("#stockProducto").textContent.replace("Stock: ", ""), 10);

            if (!inputCantidad || !botonSumar || !botonRestar) {
                console.warn("No se encontraron los elementos dentro de la cantidad-container.");
                return;
            }

            // Función para actualizar la cantidad
            const actualizarCantidad = (modificador) => {
                let cantidadActual = parseInt(inputCantidad.value, 10) || 1;
                cantidadActual += modificador;

                // Asegurar que la cantidad no sea menor que 1 ni mayor que el stock
                if (cantidadActual < 1) cantidadActual = 1;
                if (cantidadActual > stockMaximo) cantidadActual = stockMaximo;

                inputCantidad.value = cantidadActual;
            };

            // Eventos para los botones
            botonSumar.addEventListener("click", () => actualizarCantidad(1));
            botonRestar.addEventListener("click", () => actualizarCantidad(-1));

            // Evitar que el usuario ingrese valores mayores al stock manualmente
            inputCantidad.addEventListener("input", () => {
                let cantidad = parseInt(inputCantidad.value, 10) || 1;
                if (cantidad > stockMaximo) cantidad = stockMaximo;
                if (cantidad < 1) cantidad = 1;
                inputCantidad.value = cantidad;
            });
        });
    }, 500); // Pequeño retraso para asegurarnos de que los productos ya se cargaron
}


export function manejarCantidadCarrito() {
    const carritoContainer = document.getElementById("carritoContainer");

    if (!carritoContainer) {
        console.warn("No se encontró el contenedor del carrito.");
        return;
    }

    // Agregar eventos
    carritoContainer.addEventListener("click", manejarEventosCarrito);
    carritoContainer.addEventListener("input", manejarInputCantidad);
}

// Función que maneja los eventos de los botones (+) y (-)
async function manejarEventosCarrito(event) {
    const target = event.target;
    const container = target.closest(".cantidad-container");

    if (!container) return;

    const inputCantidad = container.querySelector(".cantidad");
    const stockMaximo = parseInt(
        container.closest(".producto-card").querySelector("#stockProducto").textContent.replace("Stock: ", ""),
        10
    );
    const productoID = container.closest(".producto-card").querySelector("#productoId").textContent;

    if (!inputCantidad || !productoID) {
        console.warn("No se encontraron los elementos necesarios.");
        return;
    }

    let cantidadActual = parseInt(inputCantidad.value, 10) || 1;

    if (target.classList.contains("sumar")) {
        cantidadActual = Math.min(stockMaximo, cantidadActual + 1);
    } else if (target.classList.contains("restar")) {

        cantidadActual = Math.max(1, cantidadActual - 1);
    }

    inputCantidad.value = cantidadActual;
    await actualizarCantidadCarrito(productoID, cantidadActual);

    // 🔹 Actualizar el contador del carrito en el navbar
    insertarCantidadCarrito();
}

// Función para manejar cambios manuales en el input de cantidad
async function manejarInputCantidad(event) {
    const input = event.target;

    if (!input.classList.contains("cantidad")) return;

    const container = input.closest(".cantidad-container");
    const stockMaximo = parseInt(
        container.closest(".producto-card").querySelector("#stockProducto").textContent.replace("Stock: ", ""),
        10
    );
    const productoID = container.closest(".producto-card").querySelector("#productoId").textContent;

    let cantidad = parseInt(input.value, 10) || 1;
    cantidad = Math.max(1, Math.min(stockMaximo, cantidad));

    input.value = cantidad;
    await actualizarCantidadCarrito(productoID, cantidad);

    // 🔹 Actualizar el contador del carrito en el navbar
    insertarCantidadCarrito();
}
