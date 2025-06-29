

//generar formulario de pago
import crypto from "crypto";

router.post('/formularioPago', verificarAutenticacionApi, (req, res) => {

    const total = req.body.total;
    const usuario = req.user;
    const carrito = req.body.carrito;

    let descripcion = `compra con el valor de ${total}, con los siguientes productos: `;
    carrito.forEach(e => {
        descripcion += ' ' + e.nombre;
    });

    if (descripcion.length >= 200) {
        descripcion = descripcion.slice(0, 200) + '...';
    }


    let asar = Math.random();
    let datos = {
        merchantId: "508029",
        accountId: "512321",
        apiKey: "4Vj8eK4rloUd272L48hsrarnUA",
        referenceCode: `pedidoo N. ${asar} - vive natural`,
        amount: total,
        currency: "COP",
        buyerEmail: usuario.email,
        // payerMobilePhone: '137808772',
        payerFullName: usuario.name,
        // payerDocumentType: "CC",
        // payerDocument: '1213124112',
    };


    const signatureString = `${datos.apiKey}~${datos.merchantId}~${datos.referenceCode}~${datos.amount}~${datos.currency}`;
    datos.signature = crypto
        .createHash("md5")
        .update(signatureString)
        .digest("hex");

    const htmlFormulario = `
    <form method="post" action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/">
      <input name="merchantId" type="hidden" value="${datos.merchantId}" />
      <input name="accountId" type="hidden" value="${datos.accountId}" />
      <input name="description" type="hidden" value="${descripcion}" />
      <input name="referenceCode" type="hidden" value="${datos.referenceCode}" />
      <input name="amount" type="hidden" value="${datos.amount}" />
      <input name="tax" type="hidden" value="0" />
      <input name="taxReturnBase" type="hidden" value="0" />
      <input name="currency" type="hidden" value="${datos.currency}" />
      <input name="signature" type="hidden" value="${datos.signature}" />
      <input name="test" type="hidden" value="1" />
      <input name="buyerEmail" type="hidden" value="${datos.buyerEmail}" />
      <input name="payerFullName" type="hidden" value="${datos.payerFullName}" />
      <input type="hidden" name="responseUrl" value="http://localhost:3000/procesando?metodo=payU&cuotas=1&fecha=null />
      <input type="hidden" name="confirmationUrl" value="http://localhost:3000/confirmation" />
      <input name="Submit" class = "btn" type="submit" value="Pagar" />
    </form>

  `;

    res.send(htmlFormulario)

})


// seccion del admin (se encarga de las rutas del admin, para todo el teca de adminstracion de producttos y finanzas )
import adminRoutes from '../../views/admin/adminRoutes.js'
router.use('/admin', adminRoutes)

