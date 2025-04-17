
export async function clientesPendientesControllers(req, res) {
    res.render('admin/clientes/clientesPendientes', {
        usuario: req.user
    });   
}

export async function clientesPendientesListarControllers(req, res){
    res.send({
        message: "Listar clientes pendientes"
    });
}