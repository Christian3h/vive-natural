export async function fetchClientesPagos() {
    try {
        const res = await fetch('/api/admin/clients/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return await res.json();
    } catch (err) {
        console.error('Error al obtener clientes:', err.message);
        return null;
    }
};

export async function addPagoAbono(idPago, monto, metodo) {
    try {
        const res = await fetch('/api/admin/clients/payments/deposit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idPago, monto, metodo })
        });

        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.message || 'Error al agregar el pago');
        }
        return result;
    } catch (err) {
        console.error('Error al agregar el abono:', err);
        throw err;
    }
}

export async function createTemporaryUser(nombre, numero) {
    try {
        const res = await fetch('/api/admin/temporary-users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, numero })
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Error al crear usuario temporal');
        }
        return await res.json();
    } catch (err) {
        console.error('Error en la creación de usuario temporal:', err);
        throw err;
    }
}

export async function createQuickOrder(id_usuario, monto, descripcion) {
    try {
        const res = await fetch('/api/sales/orders/quick', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario, monto, descripcion })
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Error al crear pedido rápido');
        }
        return await res.json();
    } catch (err) {
        console.error('Error al crear pedido rápido:', err);
        throw err;
    }
} 