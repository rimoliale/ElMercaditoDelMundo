// api/crear-pago.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { carrito } = req.body;

  const itemsMercadoPago = carrito.map(prod => ({
    title: prod.titulo,
    description: prod.descripcion || 'Compra en El Mercadito de Rimo',
    picture_url: prod.imagen,
    quantity: Number(prod.cantidad),
    unit_price: Number(prod.precio),
    currency_id: 'ARS'
  }));

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer TU_ACCESS_TOKEN_DE_PRODUCCION',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: itemsMercadoPago,
      statement_descriptor: 'EL MERCADITO DE RIMO',
      back_urls: {
        success: 'https://rimoliale.github.io/ElMercaditoDelMundo/gracias.html',
        failure: 'https://rimoliale.github.io/ElMercaditoDelMundo/error.html',
        pending: 'https://rimoliale.github.io/ElMercaditoDelMundo/pendiente.html'
      },
      auto_return: 'approved'
    })
  });

  const data = await response.json();
  res.status(200).json({ link_pago: data.init_point });
}


