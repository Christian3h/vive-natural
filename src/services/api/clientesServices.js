import {obtenerClientesPendientesModels, obtenerClientesModels} from "../../models/clientesModels.js";

export async function obtenerClientesPendientesServices() {
    try{
        const clientesPendientes = await obtenerClientesPendientesModels();
        return clientesPendientes;
    }catch(e){
        console.error("Error en obtenerClientesPendientesServices: ", e);
    }
}

export async function obtenerListaClientes(estado){
    try{
        const listaClientes = await obtenerClientesModels(estado)
        return listaClientes;
    }catch(e){
        console.error('error al obtener listado de clientes', estado)
    }
}