import { obtenerProductos } from '../../fetch/api.js';
import { insertarProductosAdmin } from '../pages/productos.js';


const productosBoton = document.getElementById('productos');

productosBoton.addEventListener('click', (e)=>{
    obtenerProductos().then(productos => {
        if (productos) {
            console.log('Productos recibidos:', productos);
            insertarProductosAdmin(productos);
        } else {
            console.error("No se recibieron productos.");
        }
    });
    
})


