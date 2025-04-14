
import { agregarAlCarrito, eliminarProductoDelCarrito, vaciarCarrito, obtenerCarrito } from '../../utils/cart/carrito.js';
import { insertarCarrito } from '../../pages/cart/carrito.js';
import { insertarCantidadCarrito } from '../../components/nav.js';

export function carritoEvent() {
    document.addEventListener("click", async (event) => {
        const target = event.target;
        if (target.classList.contains("agregar-carrito")) {
            const id = target.getAttribute("data-id");
            const precio = parseInt(target.getAttribute("data-precio"));
            const stock = parseInt(target.getAttribute("data-stock"), 10);
            const nombre = target.getAttribute("data-nombre");
            const descripcion = target.getAttribute("data-descripcion");
            const imagenes = target.getAttribute("data-imagenes");

            const contenedor = target.closest('.producto-card');
            const inputCantidad = contenedor.querySelector('.cantidad');
            const cantidad = parseInt(inputCantidad.value, 10) || 1;

            const carrito = await obtenerCarrito();
            const productoEnCarrito = carrito.find(item => item.productoId === id);
            const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;
            
            if (cantidadEnCarrito + cantidad <= stock) {
                await agregarAlCarrito(id, precio, cantidad, nombre, descripcion, imagenes);
                await insertarCantidadCarrito();
            } else {
                alert('No hay suficiente stock disponible.');
            }
        }

        if (target.classList.contains("eliminar-carrito")) {
            const id = target.getAttribute("data-id");
            await eliminarProductoDelCarrito(id);
            await insertarCantidadCarrito();
        }

        if (target.classList.contains("vaciar-carrito")) {
            await vaciarCarrito();
            insertarCarrito([]);
            insertarCantidadCarrito();
        }
    });
}

export function botonComprar() {
    const comprar = document.getElementById("comprarCarrito");

    comprar.addEventListener("click", async (e) => {
        const carrito = await obtenerCarrito();
        let cantidad = 0;
        carrito.forEach(element => {
            cantidad += element.cantidad = parseInt(element.cantidad, 10);
        });
        
        if (cantidad === 0) {
            alert('No hay productos en el carrito.');
            return;
        }
        window.location.href = "/pago";
    })}