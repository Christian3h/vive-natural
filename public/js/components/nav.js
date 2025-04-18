import { obtenerCarrito, cargarCarritoAlIniciarSesion} from "../utils/cart/carrito.js"; 
const carritoElemento = document.getElementById('carrito-cantidad');
const carritoElementoM = document.getElementById('carrito-cantidadM');

export async function insertarCantidadCarrito() {
    
    const carrito = await obtenerCarrito(); 

    const cantidad = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    if (carritoElemento && carritoElementoM) {
        carritoElemento.innerText = cantidad;
        carritoElementoM.innerText = cantidad;

        carritoElemento.style.display = cantidad > 0 ? "block" : "none";
    }
}

 insertarCantidadCarrito();


const menuToggle = document.getElementById('menu-toggle');
let menu = true;

menuToggle?.addEventListener('click', () => {
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');

    if (menu) {
        nav?.classList.remove('desactivo');
        nav?.classList.add('activo');
        header?.classList.add('activoH');
        menu = false;
        document.body.style.overflow = 'hidden';
    } else {
        nav?.classList.add('desactivo');
        nav?.classList.remove('activo');
        header?.classList.remove('activoH');
        menu = true;
        document.body.style.overflow = 'scroll';
    }
});
