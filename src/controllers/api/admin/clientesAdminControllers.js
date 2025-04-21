import{ obtenerClientesPendientesServices , 
        obtenerListaClientes, 
        clientesPagosPendientesConService,
        clientesPagosAbonosServices} from "../../../services/api/clientesServices.js";

export async function clientesPendientesControllers(req, res) {
    res.render('admin/clientes/clientesPendientes', {
        usuario: req.user
    });   
}

export async function clientesPendientesListarControllers(req, res){
   const clientesPendientes = await obtenerClientesPendientesServices();
   if(clientesPendientes){
       res.json({clientesPendientes}); 
    }
}

export async function clientesListarControllers(req, res){
    const estado = req.body.estado;
    const clientesPendientes = await obtenerListaClientes(estado);
    if(clientesPendientes){
        res.json({clientesPendientes}); 
     }
}

export async function clientesPagosPendientes(req,res){
    res.render('admin/clientes/pagos', {
        usuario: req.user
    })
}

export async function clientesPagosPendientesCon(req, res) {
   const clientesConPagos = await clientesPagosPendientesConService();
   if(clientesConPagos){
        res.json({clientesConPagos});
   }
}

export async function clienetsPagosAbonosControllers(req, res) {
    const { idPago, monto, metodo } = req.body;
    const pago = clientesPagosAbonosServices(idPago, monto, metodo);
    res.status(200).json({
        success: true,
        message: 'Pago registrado exitosamente',
        data: {
            idPago,
            monto,
            metodo
        }
    });
} 
