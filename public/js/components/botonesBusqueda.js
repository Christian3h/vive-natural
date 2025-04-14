
import{ BuscarProductosLocalStorage, 
        BuscarPorCategoriaLocalStorage,
        OrdenarProPrecioLocalStorage } from '../utils/productosUtils.js';

import { insertarProductos } from '../pages/products/productos.js';

export async function buscarProducto() {
    const input = document.getElementById('buscador');
    input.addEventListener('input', async () => {
        const productosFiltrados = await BuscarProductosLocalStorage(input);
        // Aquí puedes actualizar la interfaz de usuario con los productos filtrados
        insertarProductos(productosFiltrados);
    });
}

export async function buscarPorCategoria() {
    console.log('buscando por categoria');
    const categoria = document.getElementById('filtro');
    categoria.addEventListener('change', async () => {
        const categoriaSeleccionada = categoria.value;
        const productosFiltrados = await BuscarPorCategoriaLocalStorage(categoriaSeleccionada);
        // Aquí puedes actualizar la interfaz de usuario con los productos filtrados
        insertarProductos(productosFiltrados);
    });
}

export async function ordenarPorPrecio() {
    const orden = document.getElementById('ordenar');
    orden.addEventListener('change', async () => {
        const ordenSeleccionado = orden.value;
        const productosFiltrados = await OrdenarProPrecioLocalStorage(ordenSeleccionado);
        // Aquí puedes actualizar la interfaz de usuario con los productos filtrados
        insertarProductos(productosFiltrados);
    });
}