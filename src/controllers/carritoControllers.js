import * as cartSer from '../services/carritoServices.js'

export async function validarStockCarritoControllers(req, res) {
    const carrito = req.body;
    const resultado = await cartSer.validarStockCarritoServices(carrito);
    res.json(resultado);
};

export async function cargarCarritoControllers(req, res) {
    const usuario = req.user;
    const carrito = req.body;
    const resultado = await cartSer.cargarCarritoServices(carrito, usuario.id);
    res.json(resultado);
};

export async function consultarCarritoControllers(req, res) {
    const usuario = req.user;
    const resultado = await cartSer.consultarCarritoServies(usuario.id);
    res.json(resultado);
}

export async function restarStockCarritoControllers(req, res) {
    const usuario = req.user;
    const carrito = req.body;
    const resultado = await cartSer.restarStockCarritoServices(carrito, usuario.id);
    res.json(resultado);
};
export async function vaciarCarritoControllers(req, res) {
    const usuario = req.user;
    const resultado = await cartSer.vaciarCarritoServices(usuario.id);
    res.json(resultado);
};