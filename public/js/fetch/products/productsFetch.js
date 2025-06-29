export async function obtenerProductos(categoria = null, subcategoria = null)  {
    try {
        const response = await fetch('/api/products/listProducts', {
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
        const response = await fetch(`/api/products/listProduct/${id}`, {
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
