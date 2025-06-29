import * as dashboardModel from '../../models/finanzasAdminModels.js';

export const ventasDelMes = () => dashboardModel.ventasDelMes();
export const pedidosAprobadosVsEntregados = () => dashboardModel.pedidosAprobadosVsEntregados();
export const pedidosPorMetodoDePago = () => dashboardModel.pedidosPorMetodoDePago();
export const pedidosVencidos = () => dashboardModel.pedidosVencidos();
export const historialVentasMensual = () => dashboardModel.historialVentasMensual();
export const tiempoPromedioPago = () => dashboardModel.tiempoPromedioPago();
export const productoMasYMenosVendido = () => dashboardModel.productoMasYMenosVendido();
export const inventarioActual = () => dashboardModel.inventarioActual();
export const productosSinVentas = () => dashboardModel.productosSinVentas();
export const utilidadBrutaDelMes = () => dashboardModel.utilidadBrutaDelMes();
export const topClientesConMasDeuda = () => dashboardModel.topClientesConMasDeuda();
