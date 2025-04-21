import { obtenerClientes, actualizarEstadoCliente } from '../../fetch/admin/clientesFetch.js';

const ESTADOS = {
    PENDIENTE: 'pendiente',
    APROBADO: 'aprobado',
    RECHAZADO: 'rechazado',
    BLOQUEADO: 'bloqueado'
};

export async function cargarTodosClientes() {
    await recargarContenedorEstado(ESTADOS.PENDIENTE);
    await recargarContenedorEstado(ESTADOS.APROBADO);
    await recargarContenedorEstado(ESTADOS.RECHAZADO);
}

export async function recargarContenedorEstado(estado) {
    const contenedor = document.getElementById(`clientes-${estado}-container`);
    if (!contenedor) return;

    // Clonar el contenedor para eliminar eventos anteriores
    const nuevoContenedor = contenedor.cloneNode(false);
    contenedor.parentNode.replaceChild(nuevoContenedor, contenedor);

    const respuesta = await obtenerClientes(estado);

    if (!respuesta?.clientesPendientes?.length) {
        mostrarMensajeSinClientes(nuevoContenedor, estado);
        return;
    }

    respuesta.clientesPendientes.forEach(cliente => {
        const clienteElement = crearElementoCliente(cliente, estado);
        nuevoContenedor.appendChild(clienteElement);
    });

    agregarManejadoresEventos(nuevoContenedor);
}

function crearElementoCliente(cliente, tipo) {
    const div = document.createElement('div');
    div.className = `cliente cliente-${tipo}`;
    div.dataset.id = cliente.id_usuario_hex;
    div.dataset.estado = cliente.estado;

    const mostrarAprobar = cliente.estado === ESTADOS.PENDIENTE;
    const mostrarRechazar = cliente.estado === ESTADOS.PENDIENTE;
    const mostrarBloquear = cliente.estado === ESTADOS.APROBADO;
    const mostrarReactivar = [ESTADOS.RECHAZADO, ESTADOS.BLOQUEADO].includes(cliente.estado);

    div.innerHTML = `
        <div class="foto-cliente">
            <img src="${cliente.profile_picture}" alt="Foto de ${cliente.name}" loading="lazy">
        </div>
        <div class="info-cliente">
            <h3>${cliente.name}</h3>
            <p>${cliente.email}</p>
            <p class="estado">Estado: ${cliente.estado}</p>
        </div>
        <div class="botones-cliente">
            ${mostrarAprobar ? `<button class="btn btn-accion btn-aprobar" data-id="${cliente.id_usuario_hex}">Aprobar</button>` : ''}
            ${mostrarRechazar ? `<button class="btn btn-accion btn-rechazar" data-id="${cliente.id_usuario_hex}">Rechazar</button>` : ''}
            ${mostrarBloquear ? `<button class="btn btn-accion btn-bloquear" data-id="${cliente.id_usuario_hex}">Bloquear</button>` : ''}
            ${mostrarReactivar ? `<button class="btn btn-accion btn-reactivar" data-id="${cliente.id_usuario_hex}">Reactivar</button>` : ''}
        </div>
    `;

    return div;
}

function agregarManejadoresEventos(contenedor) {
    contenedor.addEventListener('click', async (e) => {
        const boton = e.target.closest('.btn-accion');
        if (!boton) return;

        const clienteDiv = boton.closest('.cliente');
        const clienteId = boton.dataset.id;
        const estadoAnterior = clienteDiv.dataset.estado;

        // Feedback visual
        boton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        boton.disabled = true;

        let nuevoEstado;

        if (boton.classList.contains('btn-aprobar')) {
            nuevoEstado = ESTADOS.APROBADO;
        } else if (boton.classList.contains('btn-rechazar')) {
            nuevoEstado = ESTADOS.RECHAZADO;
        } else if (boton.classList.contains('btn-bloquear')) {
            nuevoEstado = ESTADOS.RECHAZADO;
        } else if (boton.classList.contains('btn-reactivar')) {
            nuevoEstado = ESTADOS.APROBADO;
        }

        // 🚨 Animación de desaparición en JS:
        // Paso 1: Aplicamos la animación de fade out
        clienteDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        clienteDiv.style.opacity = '0';
        clienteDiv.style.transform = 'translateY(-10px)'; // Movimiento hacia arriba

        // Paso 2: Después de la animación, eliminamos el contenedor del DOM
        setTimeout(() => {
            clienteDiv.remove();
        }, 300); // Espera a que la animación termine

        await manejarCambioEstado(clienteId, estadoAnterior, nuevoEstado);
    });
}

async function manejarCambioEstado(clienteId, estadoAnterior, nuevoEstado) {
    try {
        const resultado = await actualizarEstadoCliente(clienteId, nuevoEstado);

        if (resultado.success) {
            mostrarNotificacion(`Cliente ${nuevoEstado} correctamente`, 'success');

            // Recargar contenedores afectados
            await Promise.all([
                recargarContenedorEstado(estadoAnterior),
                recargarContenedorEstado(nuevoEstado)
            ]);
        }
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        mostrarNotificacion('Error al actualizar el estado', 'error');
    }
}

function mostrarMensajeSinClientes(contenedor, tipo) {
    const tipoTexto = tipo === 'pendiente' ? 'pendientes de aprobación' : tipo;
    contenedor.innerHTML = `
        <div class="sin-clientes">
            <i class="fas fa-users-slash"></i>
            <p>No hay clientes ${tipoTexto} en este momento</p>
        </div>
    `;
}

function mostrarNotificacion(mensaje, tipo) {
    // Aquí iría tu lógica de notificación visual (ej. toastr, alert personalizado, etc.)
    console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
}
