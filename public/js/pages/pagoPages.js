import { consultarCarritoFechtch } from "../fetch/api.js";

(async function main() {

  // Cierra otros tooltips si se abre uno nuevo
  function toggleTooltip(el) {
    document.querySelectorAll('.tooltip-container').forEach(t => {
      if (t !== el) t.classList.remove('show');
    });
    el.classList.toggle('show');
  }

  // Cierra el tooltip al tocar fuera
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.tooltip-container').forEach(t => {
      if (!t.contains(e.target)) t.classList.remove('show');
    });
  });

  const carrito = await consultarCarritoFechtch();
  if (!carrito || carrito.length === 0) {
    return window.location.href = '/carrito';
  }

  const contenedor = document.getElementById('carritoContainer');
  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const productoHTML = `
      <article class="producto">
        <img src="${item.imagenes[0]}" alt="${item.nombre}" class="producto__imagen" />
        <div class="producto__info">
          <h3>${item.nombre}</h3>
          <p>${item.descripcion}</p>
          <p>Precio unitario: $${item.precio.toLocaleString()}</p>
          <p>Cantidad: ${item.cantidad}</p>
          <p>Subtotal: $${subtotal.toLocaleString()}</p>
        </div>
      </article>
    `;
    contenedor.insertAdjacentHTML('beforeend', productoHTML);
  });


  fetch('/sesion/formularioPago', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ total: total, carrito: carrito }),
    credentials: 'include'
  })
    .then(res => res.text()) // o .json()
    .then(data => {
      console.log("Respuesta:", data);
      const contenedor = document.querySelector(".acciones"); // el lugar donde lo insertas
      contenedor.insertAdjacentHTML("beforeend", data);
    })
    .catch(error => {
      console.error("Error al enviar formulario:", error);
    });


  // Muestra el total
  document.getElementById('total').textContent = `$${total.toLocaleString()}`;

  // Llamada a la función que configura el modal de pago
  setupModalPago(total);
})();

function setupModalPago(total) {
  const continuarBtn = document.getElementById('continuarPago');
  const modal = document.getElementById('modalPago');
  const cancelarBtn = document.getElementById('cancelarModal');
  const form = document.getElementById('formMetodoPago');
  const cuotasSelect = document.getElementById('cuotasSelect');
  const valorCuota = document.getElementById('valorCuota');
  const opcionesCuotas = document.getElementById('opcionesCuotas');

  continuarBtn.addEventListener('click', () => {
    modal.classList.remove('oculto');
  });

  cancelarBtn.addEventListener('click', () => {
    modal.classList.add('oculto');
  });

  form.metodo.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked && radio.value === 'cuotas') {
        opcionesCuotas.classList.remove('oculto');
        renderOpcionesCuotas();
        actualizarValorCuota();
      } else {
        opcionesCuotas.classList.add('oculto');
      }
    });
  });

  cuotasSelect.addEventListener('change', actualizarValorCuota);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const metodo = form.metodo.value;
    const cuotas = metodo === 'cuotas' ? parseInt(cuotasSelect.value) : 1;
    const fechaLimite = metodo === 'cuotas' ? form.fecha_limite.value : null;

    modal.classList.add('oculto');

    // Por ahora, solo redirige a una página temporal de "procesando"
    window.location.href = `/procesando?metodo=${metodo}&cuotas=${cuotas}&fecha=${fechaLimite}`;
  });

  function renderOpcionesCuotas() {
    cuotasSelect.innerHTML = ''; // Limpia opciones anteriores
    for (let i = 1; i <= 6; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `${i} cuota${i > 1 ? 's' : ''}`;
      cuotasSelect.appendChild(option);
    }
  }

  function actualizarValorCuota() {
    const cuotas = parseInt(cuotasSelect.value);
    const valor = total / cuotas;
    valorCuota.textContent = `$${Math.round(valor).toLocaleString()}`;
  }
}
