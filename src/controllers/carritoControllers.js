
import { validarStockCarritoServices, 
        cargarCarritoServices, 
        consultarCarritoServies,restarStockCarritoServices, vaciarCarritoServices } from '../services/carritoServices.js'

export async function validarStockCarritoControllers(req, res) {
    const carrito = req.body;
    const resultado = await validarStockCarritoServices(carrito);
    res.json(resultado);
};

export async function cargarCarritoControllers(req, res) {
    const usuario = req.user;
    const carrito = req.body;
    const resultado = await cargarCarritoServices(carrito, usuario.id);
    res.json(resultado);
};

export async function consultarCarritoControllers(req, res) {
    const usuario = req.user;
    const resultado = await consultarCarritoServies(usuario.id);
    res.json(resultado);
}

export async function restarStockCarritoControllers(req, res) {
    const usuario = req.user;
    const carrito = req.body;
    const resultado = await restarStockCarritoServices(carrito, usuario.id);
    res.json(resultado);
};
export async function vaciarCarritoControllers(req, res) {
    const usuario = req.user;
    const resultado = await vaciarCarritoServices(usuario.id);
    res.json(resultado);
};