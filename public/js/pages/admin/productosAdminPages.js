import {obtenerProductos} from '../../fetch/products/productsFetch.js';
import { insertarProductosAdmin } from "../../components/admin/insertarProductosAdmin.js";
import {initSlider} from "../../components/cart/sliderCart.js";
import { eliminarProductoBoton } from "../../components/admin/botones.js";


(async function main() {
    const productos = await obtenerProductos();
    console.log(productos)
    await insertarProductosAdmin(productos);
    initSlider();   
    eliminarProductoBoton();
})();
