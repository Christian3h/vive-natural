async function obtenerPedidosPendientes() {
    try {
        const response = await fetch('/sesion/admin/pedidos/pendientes', {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('authToken') || '')
            }
        });

        

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Verificar si hay datos y procesarlos
        if (data && data.length > 0) {
            renderPedidosPendientes(data);
        } else {
            renderNoPedidosPendientes();
        }
        return data;
    } catch (error) {
        c
        renderError('No se pudieron cargar los pedidos pendientes. Por favor intenta nuevamente.');
    }
}

// Función para renderizar el mensaje de "No hay pedidos pendientes"
function renderNoPedidosPendientes() {
    const container = document.getElementById('pedidos-container');
    container.innerHTML = '<div class="pedido-card">No hay pedidos pendientes</div>';
}

// Función para renderizar el mensaje de error
function renderError(message) {
    const container = document.getElementById('pedidos-container');
    container.innerHTML = `<div class="error">${message}<button onclick="location.reload()">Reintentar</button></div>`;
}

// Función para renderizar los pedidos pendientes
function renderPedidosPendientes(pedidos) {
    const container = document.getElementById('pedidos-container');
    container.innerHTML = '';  // Limpiar contenedor

    pedidos.forEach(pedido => {
        // Agrupar productos por nombre y sumar las cantidades
        const productosAgrupados = {};
        const nombresProductos = pedido.productos.split(', '); // Convertir la lista de productos en un arreglo
        const detallesProductos = pedido.detalles_productos.split(' | '); // Convertir los detalles del producto en un arreglo
        const precios = pedido.precios.split(', '); // Convertir los precios en un arreglo

        // Recorremos los detalles de los productos y agrupamos por nombre
        nombresProductos.forEach((producto, index) => {
            // Extraer la cantidad del detalle del producto
            const cantidadStr = detallesProductos[index].split(', ')[1]; // "Cantidad: X"
            const cantidad = parseInt(cantidadStr.split(': ')[1]); // Extraemos el número de la cantidad

            // Verificar si la cantidad es un número válido
            if (isNaN(cantidad)) {
                console.error(`Error: La cantidad para el producto "${producto}" no es válida.`);
                return; // Saltar este producto si la cantidad no es válida
            }

            // Agrupar por producto y sumar la cantidad
            if (productosAgrupados[producto]) {
                productosAgrupados[producto].cantidad += cantidad; // Sumar la cantidad
            } else {
                productosAgrupados[producto] = {
                    cantidad: cantidad,
                    precio: precios[index], // Guardamos el precio
                    detalle: detallesProductos[index] // Guardamos el detalle para mostrar
                };
            }
        });

        // Ahora podemos crear el HTML con los productos agrupados
        let productosHtml = '';
        Object.keys(productosAgrupados).forEach(producto => {
            const info = productosAgrupados[producto];
            productosHtml += `
                <p>Producto: ${producto}, Cantidad: ${info.cantidad}, Precio: $${info.precio}</p>
            `;
        });

        const pedidoElement = document.createElement('div');
        pedidoElement.className = 'pedido-card';
        pedidoElement.innerHTML = `
            <div class="pedido-header">
                <h3>Pedido de #${pedido.nombre_cliente}</h3>
                <span class="estado-pedido ${pedido.estado}"> ${pedido.estado}</span>
            </div>
            
            <div class="cliente-info">
                <div class="cliente-perfil">
                    <img src="${pedido.profile_picture || '/img/default-user.png'}" alt="Foto de perfil" class="profile-pic">
                    <p class="nombre-cliente">${pedido.nombre_cliente || 'N/A'}</p>
                </div>
                
                <div class="detalles-contacto">
                    <p>
                        <i class="fas fa-phone"></i>
                            <a href="tel:${pedido.telefono_contacto || ''}" class="phone-link">
                                ${pedido.telefono_contacto || 'No disponible'}
                            </a>
                    </p>
                    <p><i class="fas fa-map-marker-alt"></i> ${pedido.ciudad || 'No especificada'}</p>
                    <p><i class="fas fa-home"></i> ${pedido.direccion || 'No especificada'}</p>
                </div>
            </div>

            <div class="detalles-pago">
                <p><strong>Método de pago:</strong> ${pedido.metodo_pago}</p>
                <p><strong>Cuotas:</strong> ${pedido.cuotas || 'N/A'}</p>
                <p><strong>Total:</strong> $${Number(pedido.total).toLocaleString()}</p>
                <p><strong>Fecha de creación:</strong> ${formatDate(pedido.fecha_creacion)}</p>
                ${pedido.fecha_limite ? `<p><strong>Fecha límite:</strong> ${formatDate(pedido.fecha_limite)}</p>` : ''}
            </div>

            ${pedido.comentarios ? `
                <div class="comentarios">
                    <p><strong>Comentarios:</strong> ${pedido.comentarios}</p>
                </div>
            ` : ''}

            <div class="productos-lista">
                <h4>Productos:</h4>
                ${productosHtml}
            </div>

            <div class="btn-container">
                <button class="btn btn-entregar")">
                    <i class="fas fa-check"></i> Pedido Entregado
                </button>
                <button class="btn btn-cancelar")">
                    <i class="fas fa-times"></i> Cancelar Pedido
                </button>
            </div>
        `;

        // Agregar evento a los botones después de insertarlos
        const btnEntregar = pedidoElement.querySelector('.btn-entregar');
        const btnCancelar = pedidoElement.querySelector('.btn-cancelar');

        btnEntregar.addEventListener('click', () => marcarPedido(pedido.id_pedido, 'entregado'));
        btnCancelar.addEventListener('click', () => marcarPedido(pedido.id_pedido, 'cancelado'));

        container.appendChild(pedidoElement);
    });
}


// Función para formatear la fecha
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

async function marcarPedido(pedidoId, nuevoEstado) {
    if (!confirm(`¿Estás seguro de marcar este pedido como ${nuevoEstado}?`)) {
        return;
    }

    try {
        const response = await fetch(`/sesion/admin/pedidos/${pedidoId}/estado`, {
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

        const result = await response.json();
        alert(result.mensaje);
        location.reload();
    } catch (error) {
        console.error('Error al actualizar el pedido:', error);
        alert('Error al actualizar el pedido: ' + error.message);
    }
}

// Llamar a la función al cargar el documento
obtenerPedidosPendientes();
