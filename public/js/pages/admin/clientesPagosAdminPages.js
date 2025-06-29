import { formatoCOP } from '../../utils/formatoMoneda.js';
import { fetchClientesPagos, addPagoAbono, createTemporaryUser, createQuickOrder } from '../../fetch/pages/admin/clientesPagosAdminFetch.js';

let clientesOriginales = [];

// Obtener clientes desde backend
const obtenerClientesPagos = async () => {
    try {
        const datos = await fetchClientesPagos(); // Usar la nueva función
        return datos;
    } catch (err) {
        console.error('Error al obtener clientes:', err.message);
        return null;
    }
};


// Calcular abonos únicos
const calcularTotalAbonado = (pagos = []) => {
    const abonosSet = new Set();
    return pagos.reduce((acc, pago) => {
        if (!pago.abonos) return acc;
        const total = pago.abonos.reduce((sum, abono) => {
            if (!abonosSet.has(abono.id_abono)) {
                abonosSet.add(abono.id_abono);
                return sum + parseFloat(abono.monto_abono || 0);
            }
            return sum;
        }, 0);
        return acc + total;
    }, 0);
};

// Mostrar clientes
async function mostrarClientes(filtrados = null) {
    const datos = filtrados ? { clientesConPagos: filtrados } : await obtenerClientesPagos();
    if (!datos?.clientesConPagos) return;

    if (!filtrados) clientesOriginales = datos.clientesConPagos;

    const contenedorDeuda = document.getElementById('clientes-deuda-container');
    const contenedorPagados = document.getElementById('clientes-pagados-container');
    contenedorDeuda.innerHTML = '';
    contenedorPagados.innerHTML = '';

    const clientes = [...datos.clientesConPagos];

    clientes.sort((a, b) => {
        const deudaA = (a.precio || 0) - calcularTotalAbonado(a.pagos);
        const deudaB = (b.precio || 0) - calcularTotalAbonado(b.pagos);
        if (deudaA === 0 && deudaB === 0) return b.id_pedido - a.id_pedido;
        if (deudaA === 0) return 1;
        if (deudaB === 0) return -1;
        return b.id_pedido - a.id_pedido;
    });

    clientes.forEach((cliente, index) => {
        const totalPedido = cliente.precio || 0;
        const totalAbonado = calcularTotalAbonado(cliente.pagos);
        const deuda = totalPedido - totalAbonado;

        const esTemporal = cliente.usuario.es_temporal === 1 || cliente.usuario.es_temporal === true;
        const badgeTemporal = esTemporal ? '<span class="badge-temporal">Temporal</span>' : '';
        const badgePedidoRapido = cliente.comentarios && cliente.comentarios.length > 0 ? '<span class="badge-rapido">Pedido rápido</span>' : '';

        const clienteDiv = document.createElement('div');
        clienteDiv.className = 'cliente-card';
        if (deuda <= 0) clienteDiv.classList.add('pagado');
        clienteDiv.dataset.idUsuario = cliente.usuario.id_usuario_hex || cliente.usuario.id || '';

        clienteDiv.innerHTML = `
            <div class="cliente-header" data-index="${index}">
                <div class="cliente-info">
                    <img src="${cliente.usuario.profile_picture}" alt="foto" class="cliente-img" />
                    <div>
                        <p class="cliente-name">${cliente.usuario.name} ${badgeTemporal}</p>
                        <p class="cliente-pedido">Pedido #${cliente.id_pedido} ${badgePedidoRapido}</p>
                        <p class="cliente-monto">Monto total: ${formatoCOP.format(totalPedido)}</p>
                        <p class="cliente-abonado">Pagado: ${formatoCOP.format(totalAbonado)}</p>
                        <p class="cliente-deuda">Debe: ${formatoCOP.format(deuda)}</p>
                        <p class="cliente-seguimiento">Estado: ${cliente.seguimiento.estado}</p>
                    </div>
                </div>
                <div class="toggle-button" data-index="${index}">▼</div>
            </div>
            <div id="abonos-${index}" class="abonos-container hidden">
                ${renderAbonos(cliente.pagos || [])}
            </div>
        `;

        (deuda > 0 ? contenedorDeuda : contenedorPagados).appendChild(clienteDiv);
    });
    agregarBotonRegistrarDeuda();
}

// Renderizar abonos
function renderAbonos(pagos) {
    console.log(pagos)
    if (!pagos.length) return `<p class="no-pagos">Sin pagos registrados</p>`;

    return pagos.map(pago => {
        const abonosUnicos = pago.abonos
            ? Array.from(new Map(pago.abonos.map(a => [a.id_abono, a])).values())
            : [];

        const totalAbonado = abonosUnicos.reduce(
            (acc, abono) => acc + parseFloat(abono.monto_abono || 0), 0
        );

        const deuda = pago.monto - totalAbonado;

        return `
            <div class="pago-card">
                <p class="pago-header">Pago #${pago.id_pago}</p>
                <ul class="abonos-list">
                    ${abonosUnicos.length
                        ? abonosUnicos.map(abono => `
                            <li>Abono #${abono.id_abono} - ${formatoCOP.format(abono.monto_abono)}</li>
                        `).join('')
                        : `<li>No hay abonos</li>`}
                </ul>
                <div class="pago-info">
                    <p><strong>Monto pago:</strong> ${formatoCOP.format(pago.monto)}</p>
                    <p><strong>Abonado:</strong> ${formatoCOP.format(totalAbonado)}</p>
                    <p><strong>Debe:</strong> ${formatoCOP.format(deuda)}</p>
                </div>
                <button class="add-payment-btn" data-id="${pago.id_pago}" data-deuda="${deuda}">
                    Agregar Pago
                </button>
            </div>
        `;
    }).join('');
}

// Alternar visibilidad de abonos
function toggleAbonos(index) {
    document.getElementById(`abonos-${index}`)?.classList.toggle('hidden');
}

// Eventos delegados
document.getElementById('clientes-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('add-payment-btn')) {
        const idPago = e.target.dataset.id;
        const deuda = parseFloat(e.target.dataset.deuda);
        abrirModalAgregarPago(idPago, deuda);
    }

    if (e.target.classList.contains('toggle-button')) {
        toggleAbonos(e.target.dataset.index);
    }
});

// Abrir modal de pago
function abrirModalAgregarPago(idPago, deuda) {
    const modal = document.getElementById('modalAgregarPago');
    const idPagoInput = document.getElementById('idPago');
    const montoInput = document.getElementById('monto');
    const montoMaxSpan = document.getElementById('montoMax');
    const closeModalBtn = document.getElementById('closeModal');

    if (!modal || !idPagoInput || !montoInput || !montoMaxSpan || !closeModalBtn) {
        console.warn('Faltan elementos del modal.');
        return;
    }

    idPagoInput.value = idPago;
    montoInput.value = '';
    montoInput.max = deuda;
    montoMaxSpan.textContent = `Máximo permitido: ${formatoCOP.format(deuda)}`;

    modal.style.display = 'block';

    closeModalBtn.onclick = () => {
        modal.style.display = 'none';
    };
}

// Validar monto en tiempo real
document.getElementById('monto').addEventListener('input', function () {
    const max = parseFloat(this.max);
    if (parseFloat(this.value) > max) {
        this.value = max;
    }
});

// Enviar abono
document.getElementById('agregarPagoForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const idPago = document.getElementById('idPago').value;
    const monto = document.getElementById('monto').value;
    const metodo = document.getElementById('metodo').value;

    if (parseFloat(monto) > 0) {
        try {
            const result = await addPagoAbono(idPago, monto, metodo); // Usar la nueva función
            alert('Pago agregado con éxito');
            mostrarClientes(); // recarga datos sin reload
            document.getElementById('modalAgregarPago').style.display = 'none';
        } catch (err) {
            console.error('Error al agregar el pago:', err);
            alert('Error al agregar el pago: ' + err.message);
        }
    } else {
        alert('El monto debe ser mayor a cero');
    }
});

// Buscar clientes
export function buscarClientesPorNombre() {
    const input = document.getElementById('buscador-clientes');
    input.addEventListener('input', () => {
        const valor = input.value.trim().toLowerCase();
        const filtrados = clientesOriginales.filter(c =>
            c.usuario.name.toLowerCase().includes(valor)
        );
        mostrarClientes(filtrados);
    });
}

// Inicializar
mostrarClientes().then(buscarClientesPorNombre);

// Lógica para crear usuario temporal
const btnCrearTemporal = document.getElementById('btn-crear-temporal');

// Crear modales independientes para usuario temporal y deuda
function crearModalTemporal() {
    const oldModal = document.getElementById('modalUsuarioTemporal');
    if (oldModal) oldModal.remove();
    let modal = document.createElement('div');
    modal.id = 'modalUsuarioTemporal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Crear Usuario Temporal</h3>
            <form id="formCrearTemporal">
                <label for="nombreTemporal">Nombre:</label>
                <input type="text" id="nombreTemporal" required><br>
                <label for="numeroTemporal">Número:</label>
                <input type="text" id="numeroTemporal" required><br>
                <button type="submit">Crear</button>
                <button type="button" id="closeModalTemporal">Cancelar</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';

    document.getElementById('formCrearTemporal').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombreTemporal').value;
        const numero = document.getElementById('numeroTemporal').value;
        try {
            const result = await createTemporaryUser(nombre, numero); // Usar la nueva función
            alert(`Usuario temporal ${result.nombre} creado con ID: ${result.id}`);
            modal.style.display = 'none';
            // Opcional: recargar clientes si el nuevo usuario necesita mostrarse inmediatamente
            // mostrarClientes();
        } catch (error) {
            console.error('Error al crear usuario temporal:', error);
            alert('Error al crear usuario temporal: ' + error.message);
        }
    });

    document.getElementById('closeModalTemporal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

function crearModalDeuda() {
    const oldModal = document.getElementById('modalRegistrarDeuda');
    if (oldModal) oldModal.remove();
    let modal = document.createElement('div');
    modal.id = 'modalRegistrarDeuda';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Registrar Deuda/Pedido Rápido</h3>
            <form id="formRegistrarDeuda">
                <label for="idUsuarioDeuda">ID Usuario:</label>
                <input type="text" id="idUsuarioDeuda" readonly><br>
                <label for="montoDeuda">Monto:</label>
                <input type="number" id="montoDeuda" step="0.01" required><br>
                <label for="descripcionDeuda">Descripción (opcional):</label>
                <textarea id="descripcionDeuda"></textarea><br>
                <button type="submit">Registrar Pedido</button>
                <button type="button" id="closeModalDeuda">Cancelar</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';

    document.getElementById('formRegistrarDeuda').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id_usuario = document.getElementById('idUsuarioDeuda').value;
        const monto = parseFloat(document.getElementById('montoDeuda').value);
        const descripcion = document.getElementById('descripcionDeuda').value;

        try {
            const result = await createQuickOrder(id_usuario, monto, descripcion); // Usar la nueva función
            alert(`Pedido rápido creado con ID: ${result.order_id}`);
            modal.style.display = 'none';
            mostrarClientes(); // Recargar la lista de clientes
        } catch (error) {
            console.error('Error al crear pedido rápido:', error);
            alert('Error al crear pedido rápido: ' + error.message);
        }
    });

    document.getElementById('closeModalDeuda').addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

function agregarBotonRegistrarDeuda() {
    const contenedorDeuda = document.getElementById('clientes-deuda-container');
    if (contenedorDeuda && !document.getElementById('btn-registrar-deuda')) {
        const buttonDiv = document.createElement('div');
        buttonDiv.innerHTML = `
            <button id="btn-registrar-deuda" class="btn btn-primary">Registrar Nueva Deuda/Pedido Rápido</button>
        `;
        contenedorDeuda.prepend(buttonDiv);

        document.getElementById('btn-registrar-deuda').addEventListener('click', () => {
            crearModalDeuda();
            document.getElementById('idUsuarioDeuda').value = ''; // Limpiar si se abre sin cliente seleccionado
        });
    }

    if (btnCrearTemporal && !btnCrearTemporal.dataset.listenerAdded) {
        btnCrearTemporal.addEventListener('click', crearModalTemporal);
        btnCrearTemporal.dataset.listenerAdded = 'true';
    }
}

// Llamada inicial para asegurar que los modales se pueden crear y el botón existe
document.addEventListener('DOMContentLoaded', () => {
    // Asegúrate de que el contenedor existe para evitar errores en producción
    const container = document.getElementById('clientes-container');
    if (container) {
        agregarBotonRegistrarDeuda();
    } else {
        console.error("El elemento 'clientes-container' no se encontró.");
    }
});
