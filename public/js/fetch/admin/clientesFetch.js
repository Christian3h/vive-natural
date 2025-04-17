
export async function obtenerClientesPendientes() {
    try {
        const response = await fetch('/sesion/admin/clientes/pendientes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener producto:', error.message);
        return null;
    }
}

export async function actualizarEstadoCliente(id, accion) {
    try {
        const response = await fetch('/api/admin/clientes/estado-modificar', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                id_usuario: id,
                estado: accion // 'aprobado' o 'rechazado'
            })
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        return await response.json();
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        throw error;
    }
}