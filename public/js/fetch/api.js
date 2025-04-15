export async function obtenerProductos(categoria = null, subcategoria = null)  {
    try {
        const response = await fetch('/api/producto/listarProductos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoria, subcategoria })
        });

        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        return null;
    }
};

export async function obtenerProducto(id) {
    try {
        const response = await fetch(`/api/producto/listarProducto/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener producto:', error.message);
        return null;
    }
}

export async function validarStockCarritoFetch(carrito) {
    try {
        const response = await fetch('/api/carrito/validar-stock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carrito)
        });
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        console.log('Respuesta de la validación de stock:', response);
        return await response.json();
    } catch (error) {
        console.error('Error al validar stock:', error.message);
        return null;
    }
}

export async function cargarCarritoFetch(carrito) {
    try {
        const response = await fetch('/api/carrito/cargar-carrito', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carrito)
        });
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error al cargar carrito:', error.message);
        return null;
    }
}

export async function estaLogueado() {
    try {
        const response = await fetch('/sesion/usuario/actual', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) {
            return false; // No autorizado o error
        }

        const data = await response.json();
        return data && data.usuario ? true : false;
    } catch (error) {
        //console.error('Error al verificar si el usuario está logueado:', error);
        return false;
    }
}

export async function consultarCarritoFechtch() {
    try {
        const response = await fetch('/api/carrito/consultar-carrito', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error al consultar carrito:', error.message);
        return null;
    }
}

export async function restarStockCarritoFetch(carrito) {
    try {
        const response = await fetch('/api/carrito/restar-stock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carrito)
        });
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error al restar stock:', error.message);
        return null;
    }
}

export async function vaciarCarritoFetch() {
    try {
        const response = await fetch('/api/carrito/vaciar-carrito', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error al vaciar carrito:', error.message);
        return null;
    }
}
