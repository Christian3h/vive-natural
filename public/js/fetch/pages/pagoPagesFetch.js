export async function fetchFormularioPago(total, carrito) {
    try {
        const response = await fetch('/api/sales/payment-form-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ total: total, carrito: carrito }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }

        return await response.text(); // Devuelve texto, ya que el original usaba .text()
    } catch (error) {
        console.error("Error al enviar formulario:", error);
        return null;
    }
} 