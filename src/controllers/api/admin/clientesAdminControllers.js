import { obtenerClientesPendientesServices } from "../../../services/api/clientesServices.js";

export async function clientesPendientesControllers(req, res) {
    res.render('admin/clientes/clientesPendientes', {
        usuario: req.user
    });   
}

export async function clientesPendientesListarControllers(req, res){
   const clientesPendientes = await obtenerClientesPendientesServices();
   if(clientesPendientes){
       res.json({
           status: true,
           clientesPendientes
       }); 
    }
}