import { cargarProductos } from './products/productos.js'
import { productoFuncionalidad } from '../utils/cart/productoFuncionalidad.js'
import { botonProductoCom } from "../components/products/botonProducto.js";
import { carritoEvent } from "../components/cart/carrito.js";
import { initSlider } from "../components/cart/sliderCart.js";

import { cargarCarritoAlIniciarSesion } from '../utils/cart/carrito.js'

/* parte de filtrado y busqueda de productos */
import { guardarProductosLocalStorage } from '../utils/productosUtils.js'
import { buscarProducto,buscarPorCategoria, ordenarPorPrecio } from '../components/botonesBusqueda.js';

(async function iniciarApp(){
    const productos = await cargarProductos(); // Esperamos que los productos se carguen en el DOM
    guardarProductosLocalStorage(productos); // Guardamos los productos en el localStorage
    productoFuncionalidad(); // Ahora ejecutamos la funcionalidad de los botones
    carritoEvent();
    botonProductoCom();
    initSlider();
    buscarProducto();
    buscarPorCategoria();
    ordenarPorPrecio(); 
    await cargarCarritoAlIniciarSesion();
}) ();
