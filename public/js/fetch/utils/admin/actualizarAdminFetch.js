export async function updateProductAdmin(productoId, formData) {
    try {
        const url = `/api/products/updateProduct/${productoId}`;
        
        const response = await fetch(url, {
            method: "PATCH",
            credentials: 'include',
            body: formData
        });

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(`Error al actualizar el producto: ${response.status} - ${responseText}`);
        }

        return JSON.parse(responseText);
    } catch (error) {
        console.error("🚨 Error en updateProductAdmin:", error);
        throw error;
    }
} 