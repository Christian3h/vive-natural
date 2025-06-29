export async function fetchPedidosEnviosPendientes() {
    try {
        const response = await fetch('/api/sales/orders/pending-shipments', {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('authToken') || '')
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener pedidos pendientes de envío:', error);
        return null;
    }
}

export async function marcarPedidoEnvio(pedidoId, nuevoEstado) {
    try {
        const response = await fetch(`/api/sales/orders/${pedidoId}/status/shipments`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + (localStorage.getItem('authToken') || '')
            },
            body: JSON.stringify({
                estado: nuevoEstado
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar el pedido de envío');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al actualizar el pedido de envío:', error);
        throw error; 
    }
} 