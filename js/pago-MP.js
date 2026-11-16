// js/pago-MP.js
document.getElementById('btn-pagar-mp').addEventListener('click', async () => {
  const ventanaMP = window.open('', '_blank');
  
  if (ventanaMP) {
    ventanaMP.document.write('<p style="font-family:sans-serif; text-align:center; margin-top:50px;">Conectando con Mercado Pago...</p>');
  }

  const carritoParaEnviar = [
    {
      titulo: "Compra en El Mercadito de Rimo",
      descripcion: "Detalle de tus productos",
      imagen: "https://rimoliale.github.io/ElMercaditoDelMundo/images/Logo-1-Principal.png",
      cantidad: 1,
      precio: 15000
    }
  ];

  try {
    // AQUÍ VA LA URL DE TU BACKEND EN VERCEL (NO localhost/js/pago-MP.js)
    const respuesta = await fetch('https://mercado-pago-api-vercel.vercel.app/api/crear-pago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carrito: carritoParaEnviar })
    });

    const datos = await respuesta.json();
    console.log('Respuesta de Vercel:', datos);

    if (datos.link_pago) {
      if (ventanaMP) {
        ventanaMP.location.href = datos.link_pago;
      } else {
        window.location.href = datos.link_pago;
      }
    } else {
      if (ventanaMP) ventanaMP.close();
      alert('Mercado Pago rechazó la solicitud. Revisa la consola (F12).');
    }

  } catch (error) {
    if (ventanaMP) ventanaMP.close();
    console.error('Error:', error);
    alert('Error al conectar con Vercel.');
  }
});