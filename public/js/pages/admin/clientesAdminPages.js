import {cargarTodosClientes} from '../../components/admin/insertarClientesComponents.js';
import {botonesClientesUtils} from '../../utils/admin/botonesClientesUtils.js'

(async function main() {
    document.addEventListener('DOMContentLoaded', async () => {
        await cargarTodosClientes();
        
        // Manejar pestañas
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // Actualizar botones de pestaña
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                cargarTodosClientes();
                // Mostrar contenido correspondiente
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`clientes-${tabId}-container`).classList.add('active');
            });
        });
    });
})();
