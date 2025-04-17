import {obtenerClientesPendientes} from '../../fetch/admin/clientesFetch.js';

export async function insertarClientesPendientes(){ 
    const clientesPendientes = await obtenerClientesPendientes();
    console.log(clientesPendientes);
}