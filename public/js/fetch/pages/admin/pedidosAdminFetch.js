export async function fetchPedidosAdminPendientes() {
    try {
        const response = await fetch('/api/sales/orders/pending', {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('authToken') || '')
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener pedidos pendientes:', error);
        return null;
    }
}

export async function marcarPedidoAdmin(pedidoId, nuevoEstado) {
    try {
        const response = await fetch(`/api/sales/orders/${pedidoId}/status`, {
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
            throw new Error(error.message || 'Error al actualizar el pedido');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al actualizar el pedido:', error);
        throw error;
    }
} 