import {obtenerProductos} from '../../fetch/api.js';
import { insertarProductosAdmin } from "../../components/admin/insertarProductosAdmin.js";
import {initSlider} from "../../components/cart/sliderCart.js";
import { eliminarProductoBoton } from "../../components/admin/botones.js";


(async function main() {
    const productos = await obtenerProductos();
    await insertarProductosAdmin(productos);
    initSlider();   
    eliminarProductoBoton();
})();
