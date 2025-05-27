import { formatoCOP } from '../utils/formatoMoneda.js';


document.addEventListener("DOMContentLoaded", async () => {

  try {
    const res = await fetch("/sesion/admin/perfil", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include" // Para enviar cookies/sesión si aplica
    });

    if (!res.ok) {
      throw new Error(`Error al obtener los pedidos: ${res.status}`);
    }

    const contentType = res.headers.get("content-type");
    console.log(contentType)
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("La respuesta no es JSON");
    }

    const pedidos = await res.json();

    const lista = document.getElementById("pedidos-ul");

    if (pedidos.length === 0) {
      lista.innerHTML = "<li>No tienes pedidos todavía.</li>";
      return;
    }
    const idPedidos = new Set(); // solo necesitamos guardar los ID únicos

    pedidos.forEach(pedido => {
      if (idPedidos.has(pedido.id_pedido)) {
        return; // ya se insertó este pedido
      }
    
      idPedidos.add(pedido.id_pedido); // registrar el ID
    
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

