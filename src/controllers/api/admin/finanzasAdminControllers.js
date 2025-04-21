import * as dashboardService from '../../../services/api/finanzasAdminServices.js';

export const getVentasDelMes = async (req, res) => {
    const data = await dashboardService.ventasDelMes();
    res.json(data);
};

export const getPedidosAprobadosVsEntregados = async (req, res) => {
    const data = await dashboardService.pedidosAprobadosVsEntregados();
    res.json(data);
};

export const getPedidosPorMetodoDePago = async (req, res) => {
    const data = await dashboardService.pedidosPorMetodoDePago();
    res.json(data);
};

export const getPedidosVencidos = async (req, res) => {
    const data = await dashboardService.pedidosVencidos();
    res.json(data);
};

export const getHistorialVentasMensual = async (req, res) => {
    const data = await dashboardService.historialVentasMensual();
    res.json(data);
};

export const getTiempoPromedioPago = async (req, res) => {
    const data = await dashboardService.tiempoPromedioPago();
    res.json(data);
};

export const getProductoMasYMenosVendido = async (req, res) => {
    const data = await dashboardService.productoMasYMenosVendido();
    res.json(data);
};

export const getInventarioActual = async (req, res) => {
    const data = await dashboardService.inventarioActual();
    res.json(data);
};

export const getProductosSinVentas = async (req, res) => {
    const data = await dashboardService.productosSinVentas();
    res.json(data);
};

export const getUtilidadBrutaDelMes = async (req, res) => {
    const data = await dashboardService.utilidadBrutaDelMes();
    res.json(data);
};

export const getTopClientesConMasDeuda = async (req, res) => {
    const data = await dashboardService.topClientesConMasDeuda();
    res.json(data);
};
