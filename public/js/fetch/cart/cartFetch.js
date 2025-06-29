export async function validarStockCarritoFetch(carrito) {
    
    try {
        const response = await fetch('/api/cart/validate-stock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carrito)
        });
        if (response.status === 202 || response.status === 401) {
            return null;
        }
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        //console.log('Error al validar stock:', error.message);
        return null;
    }
}

export async function cargarCarritoFetch(carrito) {
    try {
        const response = await fetch('/api/cart/load-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carrito)
        });
        if (response.status === 202 || response.status === 401) {
            return null;
        }
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        //console.error('Error al cargar carrito:', error.message);
        return null;
    }
}

export async function estaLogueado() {
    try {
        const response = await fetch('/api/auth/auth/user/current', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data && data.usuario ? true : false;
    } catch (error) {
        return false;
    }
}

export async function consultarCarritoFechtch() {
    try {
        const response = await fetch('/api/cart/query-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (response.status === 202 || response.status === 401) {
            return null;
        }
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        //console.error('Error al consultar carrito:', error.message);
        return null;
    }
}

export async function restarStockCarritoFetch(carrito) {
    try {
        const response = await fetch('/api/cart/decrease-stock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carrito)
        });
        if (response.status === 202 || response.status === 401) {
            return null;
        }
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        //console.error('Error al restar stock:', error.message);
        return null;
    }
}

export async function vaciarCarritoFetch() {                                                                         
    try {                                                                                                            
        const response = await fetch('/api/cart/empty-cart', {                                                
            method: 'DELETE',                                                                                        
            headers: { 'Content-Type': 'application/json' },                                                         
            credentials: 'include'                                                                                   
        });                                                                                                          
        if (response.status === 202 || response.status === 401) {
            return null;
        }
        if (!response.ok) {
            return null;
        }
        return await response.json();                                                                                
    } catch (error) {                                                                                                
        //console.error('Error al vaciar carrito:', error.message);                                                    
        return null;                                                                                                 
    }                                                                                                                
}
