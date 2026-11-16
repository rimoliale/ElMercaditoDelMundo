// api/crear-pago.js (Actualizado a Orders API de Mercado Pago)
import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { carrito } = req.body;

    // 1. Calculamos el total exacto y armamos los items
    let totalMonto = 0;
    const itemsOrden = carrito.map(prod => {
      const precioUnitario = Number(prod.precio);
      const cantidad = Number(prod.cantidad);
      totalMonto += precioUnitario * cantidad;

      return {
        title: prod.titulo,
        unit_price: precioUnitario.toFixed(2), // Orders API exige string con 2 decimales (ej: "15000.00")
        quantity: cantidad,
        picture_url: prod.imagen,
        description: prod.descripcion || 'Compra en El Mercadito de Rimo'
      };
    });

    // 2. Llamada a la nueva Orders API
    const response = await fetch('https://api.mercadopago.com/v1/orders', {
      method: 'POST',
      headers: {
        // PEGA TU ACCESS TOKEN REAL DE PRODUCCIÓN AQUÍ:
        'Authorization': 'APP_USR-2932770982304777-111616-4a97bcd87be13a02a60c4447a5493889-3852045672',
        'Content-Type': 'application/json',
        // Orders API exige una clave única por cada intento de compra (Idempotency Key)
        'X-Idempotency-Key': crypto.randomUUID()
      },
      body: JSON.stringify({
        type: 'online',
        processing_mode: 'automatic',
        total_amount: totalMonto.toFixed(2),
        external_reference: `PEDIDO-${Date.now()}`,
        items: itemsOrden,
        config: {
          online: {
            callback_url: 'https://rimoliale.github.io/ElMercaditoDelMundo/gracias.html',
            auto_return: 'approved'
          }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error_mp: data });
    }

    // 3. Extraemos el link de pago generado y se lo devolvemos a tu web
    const linkGenerado = data.init_point || data.integration_data?.init_point || data.transactions?.payments?.[0]?.payment_method?.ticket_url;

    res.status(200).json({ link_pago: linkGenerado, detalle_orden: data });
  } catch (err) {
    res.status(500).json({ error_servidor: err.message });
  }
}