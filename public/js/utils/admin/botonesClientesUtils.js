
import { actualizarEstadoCliente } from '../../fetch/admin/clientesFetch.js';
import {recargarContenedorEstado} from '../../components/admin/insertarClientesComponents.js' 

export function botonesClientesUtils() {
    document.addEventListener("click", async (event) => {
        try {
            if (event.target.classList.contains("btn-primary") || 
                event.target.classList.contains("btn-danger")) {
                
                const id = event.target.getAttribute("data-id");
                const accion = event.target.classList.contains("btn-primary") ? 'aprobado' : 'rechazado';
                const clienteDiv = event.target.closest('.cliente');

                // Animación de transición
                clienteDiv.style.transition = 'all 0.3s ease';
                clienteDiv.style.opacity = '0';
                clienteDiv.style.height = '0';
                clienteDiv.style.margin = '0';
                clienteDiv.style.padding = '0';
                clienteDiv.style.overflow = 'hidden';

                // Enviar petición al backend
                await actualizarEstadoCliente(id, accion);

                // Eliminar después de la animación y recargar el contenedor del nuevo estado
                setTimeout(async () => {
                    clienteDiv.remove(); // Eliminar el cliente del DOM actual
                    await recargarContenedorEstado(accion); // Recargar contenedor con el nuevo estado
                }, 300);
            }
        } catch (error) {
            console.error('Error:', error);
            //mostrarNotificacion('Error al procesar la solicitud', 'error');
        }
    });
}

