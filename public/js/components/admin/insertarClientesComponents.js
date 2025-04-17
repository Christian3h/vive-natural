import { obtenerClientesPendientes, obtenerClientes, actualizarEstadoCliente } from '../../fetch/admin/clientesFetch.js';

// Estados posibles
const ESTADOS = {
  PENDIENTE: 'pendiente',
  APROBADO: 'aprobado',
  RECHAZADO: 'rechazado',
  BLOQUEADO: 'bloqueado'
};

// Función principal para cargar todos los tipos de clientes
export async function cargarTodosClientes() {
  await cargarClientes(ESTADOS.PENDIENTE);
  await cargarClientes(ESTADOS.APROBADO);
  await cargarClientes(ESTADOS.RECHAZADO);
}

// Función para cargar clientes según tipo
async function cargarClientes(tipo) {
  const contenedorId = `clientes-${tipo}-container`;
  const contenedor = document.getElementById(contenedorId);
  
  if (!contenedor) return;
  
  contenedor.innerHTML = '';
  
  const respuesta = await obtenerClientes(tipo);

  
  if (!respuesta?.clientesPendientes?.length) {
    mostrarMensajeSinClientes(contenedor, tipo);
    return;
  }
  
  respuesta.clientesPendientes.forEach(cliente => {
    const clienteElement = crearElementoCliente(cliente, tipo);
    contenedor.appendChild(clienteElement);
  });

  agregarManejadoresEventos(contenedor);
}

// Función para crear el HTML de un cliente
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

// Función para manejar eventos
function agregarManejadoresEventos(contenedor) {
  contenedor.addEventListener('click', async (e) => {
    const boton = e.target.closest('.btn-accion');
    if (!boton) return;
    
    const clienteDiv = boton.closest('.cliente');
    const clienteId = boton.dataset.id;
    let nuevoEstado;

    if (boton.classList.contains('btn-aprobar')) {
      nuevoEstado = ESTADOS.APROBADO;
    } else if (boton.classList.contains('btn-rechazar')) {
      nuevoEstado = ESTADOS.RECHAZADO;
    } else if (boton.classList.contains('btn-bloquear')) {
      nuevoEstado = ESTADOS.RECHAZADO; // bloquear equivale a rechazar
    } else if (boton.classList.contains('btn-reactivar')) {
      nuevoEstado = ESTADOS.APROBADO;
    }

    await manejarCambioEstado(clienteDiv, clienteId, nuevoEstado);
  });
}

// Función para manejar el cambio de estado
async function manejarCambioEstado(clienteDiv, clienteId, nuevoEstado) {
  try {
    const botones = clienteDiv.querySelectorAll('.btn-accion');
    botones.forEach(btn => {
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;
    });

    const resultado = await actualizarEstadoCliente(clienteId, nuevoEstado);

    if (resultado.success) {
      mostrarNotificacion(`Cliente ${nuevoEstado} correctamente`, 'success');

      clienteDiv.remove();

      await recargarContenedorEstado(nuevoEstado);
      const estadoAnterior = clienteDiv.dataset.estado;
      await recargarContenedorEstado(estadoAnterior);
    }
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    mostrarNotificacion('Error al actualizar el estado', 'error');
  }
}

// Función para recargar clientes de un estado específico
async function recargarContenedorEstado(estado) {
  const contenedor = document.getElementById(`clientes-${estado}-container`);
  if (!contenedor) return;

  contenedor.innerHTML = '';

  const respuesta = await obtenerClientes(estado);
  if (!respuesta?.clientesPendientes?.length) {
    mostrarMensajeSinClientes(contenedor, estado);
    return;
  }

  respuesta.clientesPendientes.forEach(cliente => {
    const clienteElement = crearElementoCliente(cliente, estado);
    contenedor.appendChild(clienteElement);
  });

  agregarManejadoresEventos(contenedor);
}

// Función para mostrar mensaje si no hay clientes
function mostrarMensajeSinClientes(contenedor, tipo) {
  const tipoTexto = tipo === 'pendiente' ? 'pendientes de aprobación' : 'rechazados';
  contenedor.innerHTML = `
    <div class="sin-clientes">
      <i class="fas fa-users-slash"></i>
      <p>No hay clientes ${tipoTexto} en este momento</p>
    </div>
  `;
}

// 🚨 NUEVA FUNCIÓN: Recarga al cambiar de pestaña
function configurarCambioDePestanas() {
  const botones = document.querySelectorAll('.tabs button');

  botones.forEach(boton => {
    boton.addEventListener('click', async (e) => {
      const tipo = e.target.dataset.tab;
      await cargarClientes(tipo); // Siempre recarga al cambiar de pestaña
    });
  });
}

// ⏳ Ejecutar todo al cargar
document.addEventListener('DOMContentLoaded', async () => {
  await cargarTodosClientes();
  configurarCambioDePestanas();
});
