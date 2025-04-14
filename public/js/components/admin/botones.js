

// boton para eliminar los productos 

import { eliminarProductoFetch } from "../../fetch/productoFetchAdmin.js";

export async function eliminarProductoBoton(){
 
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("Editar")) {
            const id = event.target.getAttribute("data-id");
            window.location.href = `/sesion/admin/producto/${id}`;
        }
        if(event.target.classList.contains("Eliminar")) {
            const id = event.target.getAttribute("data-id");
            eliminarProductoFetch(id);
            
            const productoCard = event.target.closest('.producto-card');

            // Opcional: animación de desaparición
            productoCard.style.transition = 'opacity 0.3s ease';
            productoCard.style.opacity = '0';

            // Luego lo ocultas o lo remueves del DOM
            setTimeout(() => {
                productoCard.remove(); // o productoCard.style.display = 'none';
            }, 300);
            }
    });

}

