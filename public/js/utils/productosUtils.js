
export async function guardarProductosLocalStorage(productos) {
    if(!productos || !Array.isArray(productos)) {
        console.error('No se proporcionaron productos válidos');
        return;
    }
    // Guardar los productos en el localStorage
    localStorage.setItem('productos', JSON.stringify(productos));
}

export async function BuscarProductosLocalStorage(input) {

    const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
    const inputValue = input.value.toLowerCase();
    const productosFiltrados = productosGuardados.filter(producto => {
        return producto.producto_nombre.toLowerCase().includes(inputValue);
    });
    return productosFiltrados;
}

export async function BuscarPorCategoriaLocalStorage(categoria) {
    const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
    if(!categoria || categoria === 'null' || categoria === '0') {
        return productosGuardados;
    }
    const productosFiltrados = productosGuardados.filter(producto => {
        return Number(producto.producto_categoria) === Number(categoria);
    });
    return productosFiltrados;
}

export async function OrdenarProPrecioLocalStorage(orden) {
    const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
    if(!productosGuardados || productosGuardados.length === 0) {
        console.error('No hay productos guardados en el localStorage');
        return [];
    }

    const productosOrdenados = [...productosGuardados];
    console.log(productosOrdenados)
    if(orden === 'asc') {
        productosOrdenados.sort((a, b) => a.precio_activo - b.precio_activo);
    } else if(orden === 'desc') {
        productosOrdenados.sort((a, b) => b.precio_activo - a.precio_activo);
    }
    return productosOrdenados;
}