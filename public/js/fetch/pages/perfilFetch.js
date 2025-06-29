export async function fetchPedidosUsuario() {
  try {
    const res = await fetch("/api/users/profile/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });

    if (!res.ok) {
      throw new Error(`Error al obtener los pedidos: ${res.status}`);
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("La respuesta no es JSON");
    }

    return await res.json();
  } catch (error) {
    console.error("Error en fetch de perfil:", error);
    return null;
  }
} 