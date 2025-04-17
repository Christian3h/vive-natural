import {obtenerClientesPendientes} from '../../fetch/admin/clientesFetch.js';

export async function insertarClientesPendientes(){ 
    const clientesPendientes = await obtenerClientesPendientes();
    if(!clientesPendientes){
        return;
    }
    const clientesPendientesContainer = document.querySelector('#clientesPendientesContainer');
    //bucle para recorrer todo el array de clientes pendientes e insertarlos en el html
    clientesPendientes.clientesPendientes.forEach(cliente => {
        const clienteDiv = document.createElement('div');
        clienteDiv.classList.add('cliente');
        clienteDiv.innerHTML = `
            <div class="foto-cliente">
                <img src="${cliente.profile_picture}" alt="foto de perfil de ${cliente.name}">
            </div>
            <div class="info-cliente">
                <p id="idCliente" style="display: none">${cliente.id_usuario_hex}</p>
                <h3>${cliente.name}</h3>
                <p>${cliente.email}</p>
                <p>${cliente.estado}</p>
            </div>
            <div class="botones-cliente">
                <button class="btn btn-primary" data-id ="${cliente.id_usuario_hex}" >Aprobar</button>
                <button class="btn btn-danger" data-id ="${cliente.id_usuario_hex}" >Rechazar</button>
            </div>
            <div class="estado-cliente">
                <p>${cliente.estado}</p>
            </div>
        `;
        clientesPendientesContainer.appendChild(clienteDiv);
    });
    console.log(clientesPendientes);
}