import { insertarCarrito } from "./carrito.js";
import {productoFuncionalidad, 
        manejarCantidadCarrito
} from "../../utils/cart/productoFuncionalidad.js";

import {cargarCarritoAlIniciarSesion} from "../../utils/cart/carrito.js";
import {initSlider} from "../../components/cart/sliderCart.js";
import {carritoEvent, botonComprar} from "../../components/cart/carrito.js";



(async function main() {
        await cargarCarritoAlIniciarSesion(); 
        await insertarCarrito();              
        initSlider();                         
        manejarCantidadCarrito();            
        productoFuncionalidad();             
        carritoEvent();                      
        botonComprar();
    })();
    