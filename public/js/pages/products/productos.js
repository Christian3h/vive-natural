import { obtenerProductos } from '../../fetch/products/productsFetch.js';
import { crearProductoCard } from './insertarProductos.js';
import { initSlider } from '../../components/cart/sliderCart.js';

export async function insertarProductos(productos) {
    const productosContainer = document.getElementById('productosContainer');
    if (!productosContainer) return console.error("No se encontró el contenedor de productos.");

    if (!Array.isArray(productos) || productos.length === 0) {
        productosContainer.innerHTML = '<h1>No se encontraron productos.</h1>';
        return;
    }

    const fragment = document.createDocumentFragment();
    let contador = 0;
    productos.forEach(producto => {
        const productoCard = crearProductoCard(producto, 'null', contador);
        contador++;
        if (!(productoCard instanceof Node)) {
            console.error("Error: crearProductoCard no devolvió un nodo válido", producto, productoCard);
            return; // Evita errores en appendChild()
        }

        fragment.appendChild(productoCard);
    });

    productosContainer.innerHTML = '';
    productosContainer.appendChild(fragment);
    initSlider();
}

export async function cargarProductos() {
    try {
        const productos = await obtenerProductos(); // Esperamos la respuesta
        if (!productos || productos.length === 0) {
            console.error("No se recibieron productos.");
            return;
        }
        insertarProductos(productos); // Insertamos productos en el DOM
        return productos;
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}
