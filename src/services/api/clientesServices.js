import {obtenerClientesPendientesModels} from "../../models/clientesModels.js";

export async function obtenerClientesPendientesServices() {
    try{
        const clientesPendientes = await obtenerClientesPendientesModels();
        return clientesPendientes;
    }catch(e){
        console.error("Error en obtenerClientesPendientesServices: ", e);
    }
    }