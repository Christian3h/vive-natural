
export async function eliminarProductoFetch(id) {
    fetch(`/api/producto/eliminarProducto/${id}`, {
        method: "DELETE",
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al eliminar el producto");
        return response.json();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un problema al eliminar el producto. Revisa la consola para más detalles.");
    });
}


