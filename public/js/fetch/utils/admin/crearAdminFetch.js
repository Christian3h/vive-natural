export async function createProductAdmin(formData) {
    try {
        const url = "/api/products/createProduct";
        
        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            body: formData
        });

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(`Error al crear el producto: ${response.status} - ${responseText}`);
        }

        return JSON.parse(responseText);
    } catch (error) {
        console.error("🚨 Error en createProductAdmin:", error);
        throw error;
    }
} 