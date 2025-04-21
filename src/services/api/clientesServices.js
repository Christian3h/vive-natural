import {
    obtenerClientesPendientesModels,
    obtenerClientesModels,
    obtenerClientesConPagosClientesModels,
    crearAbonoClientesModels
} from "../../models/clientesModels.js";

export async function obtenerClientesPendientesServices() {
    try {
        const clientesPendientes = await obtenerClientesPendientesModels();
        return clientesPendientes;
    } catch (e) {
        console.error("Error en obtenerClientesPendientesServices: ", e);
    }
}

export async function obtenerListaClientes(estado) {
    try {
        const listaClientes = await obtenerClientesModels(estado)
        return listaClientes;
    } catch (e) {
        console.error('error al obtener listado de clientes', estado)
    }
}

export async function clientesPagosPendientesConService() {
    try {
        const datos = await obtenerClientesConPagosClientesModels();

        const pedidosMap = new Map();

        for (const row of datos) {
            const pedidoId = row.id_pedido;
            const pagoId = row.id_pago;
            const abonoId = row.id_abono;

            // Si el pedido no existe en el mapa, lo agregamos
            if (!pedidosMap.has(pedidoId)) {
                pedidosMap.set(pedidoId, {
                    id_pedido: row.id_pedido,
                    precio: row.precio,
                    cuotas: row.cuotas,
                    usuario: {
                        name: row.name,
                        profile_picture: row.profile_picture
                    },
                    seguimiento: {
                        id: row.id_seguimiento,
                        estado: row.estado_seguimiento
                    },
                    pagos: []
                });
            }

            const pedido = pedidosMap.get(pedidoId);

            // Buscar si ya agregamos este pago
            let pago = pedido.pagos.find(p => p.id_pago === pagoId);

            if (!pago && pagoId) {
                pago = {
                    id_pago: row.id_pago,
                    monto: row.monto_pago,
                    estado: row.estado_pago,
                    metodo_pago: row.metodo_pago,
                    referencia: row.referencia,
                    fecha_pago: row.fecha_pago,
                    abonos: []
                };
                pedido.pagos.push(pago);
            }

            // Agregar abono si existe
            if (pago && abonoId) {
                pago.abonos.push({
                    id_abono: row.id_abono,
                    monto_abono: row.monto_abono,
                    metodo_abono: row.metodo_abono,
                    fecha_abono: row.fecha_abono
                });
            }
        }

        return Array.from(pedidosMap.values());
    } catch (e) {
        console.error('Error al obtener clientes con pagos pendientes', e);
    }
}

export async function clientesPagosAbonosServices(idPago, monto, metodo) {
    try {
        console.log(idPago, monto, metodo)
        crearAbonoClientesModels(idPago, monto, metodo);
        return true
    } catch(e) {
        console.error('mi chino tenemos un error, nos jodieron marino ')
        console.error(e)
    }
}