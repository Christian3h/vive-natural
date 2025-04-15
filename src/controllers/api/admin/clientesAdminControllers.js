
export async function clientesPendientesControllers(req, res) {
    res.render('admin/clientes/clientesPendientes', {
        usuario: req.user
    });
    
}