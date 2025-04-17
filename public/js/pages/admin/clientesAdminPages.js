import {insertarClientesPendientes} from '../../components/admin/insertarClientesComponents.js';
import {botonesClientesUtils} from '../../utils/admin/botonesClientesUtils.js'

(async function main() {
    await insertarClientesPendientes();
    await botonesClientesUtils();
})();

