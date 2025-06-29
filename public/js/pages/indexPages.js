import { cargarProductos } from "./products/productos.js";
import { productoFuncionalidad } from '../utils/cart/productoFuncionalidad.js';
import {botonProductoCom} from "../components/products/botonProducto.js";
import {carritoEvent} from "../components/cart/carrito.js";
import {initSlider} from "../components/cart/sliderCart.js";

//import {animacionProducto} from "../components/products/productoAnimation.js"
//import {cargarCarritoAlIniciarSesion} from "../utils/cart/carrito.js";

(async function iniciarApp() {
    await cargarProductos(); // Esperamos que los productos se carguen en el DOM
    productoFuncionalidad(); // Ahora ejecutamos la funcionalidad de los botones
    carritoEvent();
    botonProductoCom();
    initSlider();
    //animacionProducto(); // animacion para los productos 
    //await cargarCarritoAlIniciarSesion();

})();