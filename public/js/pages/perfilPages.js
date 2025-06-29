import { formatoCOP } from '../utils/formatoMoneda.js';
import { fetchPedidosUsuario } from '../fetch/pages/perfilFetch.js';

document.addEventListener("DOMContentLoaded", async () => {

  try {
    const pedidos = await fetchPedidosUsuario();

    if (!pedidos) {
      document.getElementById("pedidos-ul").innerHTML = "<li>Error al cargar pedidos.</li>";
      return;
    }

    const lista = document.getElementById("pedidos-ul");

    if (pedidos.length === 0) {
      lista.innerHTML = "<li>No tienes pedidos todavía.</li>";
      return;
    }
    const idPedidos = new Set();

    pedidos.forEach(pedido => {
      if (idPedidos.has(pedido.id_pedido)) {
        return;
      }
    
      idPedidos.add(pedido.id_pedido);
    
      const item = document.createElement("li");
      item.innerHTML = `
        <strong>ID:</strong> ${pedido.id_pedido}<br>
        <strong>Fecha:</strong> ${new Date(pedido.fecha_creacion).toLocaleString()}<br>
        <strong>Precio:</strong> ${formatoCOP.format(pedido.precio)}<br>
        <strong>Estado Pedido:</strong> ${pedido.estado_pedido}<br>
        <strong>Estado Pago:</strong> ${pedido.estado_pago || 'N/A'}<br>
        <strong>Abono:</strong> ${formatoCOP.format(pedido.monto_abono || 0)}
        <hr>
      `;
      lista.appendChild(item);
    });

  } catch (error) {
    console.error("Error en fetch de perfil:", error);
    document.getElementById("pedidos-ul").innerHTML = "<li>Error al cargar pedidos.</li>";
  }



});

