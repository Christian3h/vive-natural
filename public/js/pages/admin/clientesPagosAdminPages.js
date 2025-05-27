import { formatoCOP } from '../../utils/formatoMoneda.js';

let clientesOriginales = [];

// Obtener clientes desde backend
const obtenerClientesPagos = async () => {
    try {
        const res = await fetch('/sesion/admin/clientes/pagos', {
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

        const clienteDiv = document.createElement('div');
        clienteDiv.className = 'cliente-card';
        if (deuda <= 0) clienteDiv.classList.add('pagado');

        clienteDiv.innerHTML = `
            <div class="cliente-header" data-index="${index}">
                <div class="cliente-info">
                    <img src="${cliente.usuario.profile_picture}" alt="foto" class="cliente-img" />
                    <div>
                        <p class="cliente-name">${cliente.usuario.name}</p>
                        <p class="cliente-pedido">Pedido #${cliente.id_pedido}</p>
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
            const res = await fetch('/sesion/admin/clientes/pagos/abono', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idPago, monto, metodo })
            });

            const result = await res.json();
            if (res.ok) {
                alert('Pago agregado con éxito');
                mostrarClientes(); // recarga datos sin reload
                document.getElementById('modalAgregarPago').style.display = 'none';
            } else {
                alert('Error al agregar el pago');
            }
        } catch (err) {
            console.error('Error al agregar el pago:', err);
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
