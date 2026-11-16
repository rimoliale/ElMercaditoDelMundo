
document.getElementById('btn-pagar-mp').addEventListener('click', async () => {
  // 1. Abrimos la pestaña nueva INMEDIATAMENTE en el clic para evitar bloqueo de pop-ups
  const ventanaMP = window.open('', '_blank');
  
  if (ventanaMP) {
    ventanaMP.document.write('<p style="font-family:sans-serif; text-align:center; margin-top:50px;">Conectando con Mercado Pago...</p>');
  }

  // 2. Armamos el carrito (reemplaza esto por tus productos reales)
  const carritoParaEnviar = [
    {
      titulo: "Compra en El Mercadito de Rimo",
      descripcion: "Detalle de tus productos",
      imagen: "http://localhost:3000/images/Logo-1-Principal.png", // Tu imagen pública https://
      cantidad: 1,
      precio: 15000 // Tu total dinámico
    }
  ];

  try {
    // 3. Pedimos tu link real a tu función en Vercel
    const respuesta = await fetch('http://localhost:3000/js/pago-MP.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carrito: carritoParaEnviar })
    });

    const datos = await respuesta.json();

    // 4. Redirigimos esa pestaña nueva a TU checkout oficial de Mercado Pago
    if (datos.link_pago) {
      if (ventanaMP) {
        ventanaMP.location.href = datos.link_pago;
      } else {
        window.location.href = datos.link_pago; // Respaldo si el usuario tenía bloqueador estricto
      }
    } else {
      if (ventanaMP) ventanaMP.close();
      alert('No se pudo generar el link de pago.');
    }

  } catch (error) {
    if (ventanaMP) ventanaMP.close();
    console.error('Error:', error);
    alert('Error al conectar con el servidor de pagos.');
  }
});