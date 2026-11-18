// api/crear-pago.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const carrito = body.carrito;

    const itemsMercadoPago = carrito.map(prod => ({
      title: prod.titulo,
      description: prod.descripcion || 'Compra en El Mercadito de Rimo',
      picture_url: prod.imagen,
      quantity: Number(prod.cantidad),
      unit_price: Number(prod.precio),
      currency_id: 'ARS'
    }));

    // IMPORTANTE: Volver a /checkout/preferences (no /v1/orders)
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': 'APP_USR-7240682100006664-111616-db850b3aad92d2775b723c8e3b1ab7e0-178952498',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: itemsMercadoPago,
        statement_descriptor: 'EL MERCADITO DE RIMO',
        back_urls: {
          success: 'https://rimoliale.github.io/ElMercaditoDelMundo/gracias.html',
          failure: 'https://rimoliale.github.io/ElMercaditoDelMundo/error.html',
          pending: 'https://rimoliale.github.io/ElMercaditoDelMundo/pendiente.html'
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error_mp: data });
    }

    res.status(200).json({ link_pago: data.init_point });
  } catch (err) {
    res.status(500).json({ error_servidor: err.message });
  }
}