import{ obtenerClientesPendientesServices , 
        obtenerListaClientes, 
        clientesPagosPendientesConService,
        clientesPagosAbonosServices} from "../../../services/api/clientesServices.js";
import pool  from "../../../models/bd.js";

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
    if (!idPago || !monto || !metodo) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
    try {
        // Validar que el pago existe y obtener el monto total y abonos
        const [pagos] = await pool.query('SELECT monto FROM pagos WHERE id_pago = ?', [idPago]);
        if (!pagos.length) return res.status(404).json({ error: 'Pago no encontrado' });
        const montoPago = parseFloat(pagos[0].monto);
        const [abonos] = await pool.query('SELECT COALESCE(SUM(monto_abono),0) AS total_abonado FROM pagos_abono WHERE id_pago = ?', [idPago]);
        const totalAbonado = parseFloat(abonos[0].total_abonado);
        if (parseFloat(monto) + totalAbonado > montoPago) {
            return res.status(400).json({ error: 'El abono supera el monto pendiente' });
        }
        // Registrar abono
        await pool.query('INSERT INTO pagos_abono (id_pago, monto_abono, metodo_abono) VALUES (?, ?, ?)', [idPago, monto, metodo]);
        res.json({ mensaje: 'Abono registrado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar abono' });
    }
} 
