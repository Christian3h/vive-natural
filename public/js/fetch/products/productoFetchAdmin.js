export async function eliminarProductoFetch(id) {
    try {
        const response = await fetch(`/api/products/deleteProduct/${id}`, {
            method: "DELETE",
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar el producto: ${response.status} - ${await response.text()}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        alert("Hubo un problema al eliminar el producto. Revisa la consola para más detalles.");
        throw error;
    }
}


