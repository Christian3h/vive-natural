import {formatoCOP} from '../../utils/formatoMoneda.js';

let clientesOriginales = []; // Para almacenar los clientes completos

// Función para obtener los clientes desde el backend
const obtenerClientesPagos = async () => {
    try {
        const response = await fetch('/sesion/admin/clientes/pagos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener clientes:', error.message);
        return null;
    }
};

// Función para mostrar los clientes
async function mostrarClientes(filtrados = null) {
    const datos = filtrados ? { clientesConPagos: filtrados } : await obtenerClientesPagos();
    if (!datos || !datos.clientesConPagos) return;

    if (!filtrados) clientesOriginales = datos.clientesConPagos;

    const contenedorDeuda = document.getElementById('clientes-deuda-container');
    const contenedorPagados = document.getElementById('clientes-pagados-container');
    contenedorDeuda.innerHTML = '';
    contenedorPagados.innerHTML = '';

    datos.clientesConPagos.forEach((cliente, index) => {
        const totalAbonado = cliente.pagos?.reduce((acc, pago) => {
            return acc + (pago.abonos?.reduce((sum, abono) => sum + parseFloat(abono.monto_abono || 0), 0) || 0);
        }, 0) || 0;

        const totalPedido = cliente.precio || 0;
        const deuda = totalPedido - totalAbonado;

        const clienteDiv = document.createElement('div');
        clienteDiv.className = 'cliente-card';
        if (deuda <= 0) {
            clienteDiv.classList.add('pagado');
        }

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

        if (deuda > 0) {
            contenedorDeuda.appendChild(clienteDiv);
        } else {
            contenedorPagados.appendChild(clienteDiv);
        }
    });
}

// Función para renderizar los pagos y abonos
function renderAbonos(pagos) {
    let contenido = '';

    if (!pagos.length) {
        contenido += `<p class="no-pagos">Sin pagos registrados</p>`;
    } else {
        contenido += pagos.map(pago => {
            const totalAbonado = pago.abonos?.reduce((acc, ab) => acc + parseFloat(ab.monto_abono || 0), 0) || 0;
            const deuda = pago.monto - totalAbonado;

            return `
                <div class="pago-card">
                    <p class="pago-header">Pago #${pago.id_pago}</p>
                    <ul class="abonos-list">
                        ${pago.abonos?.length
                            ? pago.abonos.map(abono => `
                                <li>Abono #${abono.id_abono} - ${formatoCOP.format(abono.monto_abono)}</li>
                            `).join('')
                            : `<li>No hay abonos</li>`}
                    </ul>
                    <div class="pago-info">
                        <p><strong>Monto pago:</strong> ${formatoCOP.format(pago.monto)}</p>
                        <p><strong>Abonado:</strong> ${formatoCOP.format(totalAbonado)}</p>
                        <p><strong>Debe:</strong> ${formatoCOP.format(deuda)}</p>
                    </div>
                    <button class="add-payment-btn" data-id="${pago.id_pago}" data-deuda="${deuda}">Agregar Pago</button>
                </div>
            `;
        }).join('');
    }

    return contenido;
}

// Función para manejar la visibilidad de los abonos
function toggleAbonos(index) {
    const abonosDiv = document.getElementById(`abonos-${index}`);
    abonosDiv.classList.toggle('hidden');
}

// Delegar eventos
const contenedorClientes = document.getElementById('clientes-container');
contenedorClientes.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('add-payment-btn')) {
        const idPago = event.target.getAttribute('data-id');
        const deuda = parseFloat(event.target.getAttribute('data-deuda'));
        abrirModalAgregarPago(idPago, deuda);
    }
    if (event.target && event.target.classList.contains('toggle-button')) {
        const index = event.target.getAttribute('data-index');
        toggleAbonos(index);
    }
});

function abrirModalAgregarPago(idPago, deuda) {
    const modal = document.getElementById('modalAgregarPago');
    const idPagoInput = document.getElementById('idPago');
    const montoInput = document.getElementById('monto');
    const montoMaxSpan = document.getElementById('montoMax');
    const closeModalBtn = document.getElementById('closeModal');

    if (!modal || !idPagoInput || !montoInput || !montoMaxSpan || !closeModalBtn) {
        console.warn('Alguno de los elementos del modal no se encontró en el DOM.');
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


// Validación en tiempo real del monto
const montoInput = document.getElementById('monto');
montoInput.addEventListener('input', function () {
    const max = parseFloat(this.max);
    const valor = parseFloat(this.value);

    if (valor > max) {
        this.value = max;
    }
});

// Enviar el pago
const agregarPagoForm = document.getElementById('agregarPagoForm');
agregarPagoForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const idPago = document.getElementById('idPago').value;
    const monto = document.getElementById('monto').value;
    const metodo = document.getElementById('metodo').value;

    if (parseFloat(monto) > 0) {
        try {
            const response = await fetch('/sesion/admin/clientes/pagos/abono', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idPago,
                    monto,
                    metodo
                })
            });

            const result = await response.json();
            if (response.ok) {
                alert('Pago agregado con éxito');
                location.reload();
            } else {
                alert('Error al agregar el pago');
            }
        } catch (error) {
            console.error('Error al agregar el pago:', error);
        }
    } else {
        alert('El monto debe ser mayor a cero');
    }
});

// Función de búsqueda de clientes por nombre
export function buscarClientesPorNombre() {
    const input = document.getElementById('buscador-clientes');
    input.addEventListener('input', () => {
        const valor = input.value.trim().toLowerCase();
        const filtrados = clientesOriginales.filter(cliente =>
            cliente.usuario.name.toLowerCase().includes(valor)
        );

        mostrarClientes(filtrados);
    });
}

// Inicialización
mostrarClientes().then(() => {
    buscarClientesPorNombre();
});
