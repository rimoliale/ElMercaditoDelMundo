

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el))
	
	
	
const textoQuienesSomos = `El Mercadito del Mundo se encarga de ofrecer al público la venta de productos cotidianos, hasta la llegada a su destino, sin moverse de su casa, fundada y gestionada por Alejandro D. Rimoli`;

    // Aplicar como title (tooltip)
    const btnQuienesSomos = document.getElementById("InfoQuienesSomos-Barra");
    btnQuienesSomos.setAttribute("title", textoQuienesSomos);

    // Activar Bootstrap tooltip
    new bootstrap.Tooltip(btnQuienesSomos);

    // Aplicar como contenido de <p>
    const parrafoQuienesSomos = document.getElementById("contenidoQuienesSomos");
    parrafoQuienesSomos.innerText = textoQuienesSomos;
	
	
	
	
	
		    const textoEnvio = `Se realiza el pedido mediante Whatsapp al 11 7110 4740  Con Horario de Atención: De 9 a 21hs.
			Los pedidos confirmados serán programados y listos para su entrega, según corresponda el horario de armado de pedidos y proponga el cliente dentro del "Horario de Entrega".
			
			Tabaco:
			
			Horario de Entrega: 
			Lunes a Viernes de 9 a 12hs y de 18hs a 21hs.	
			
			Se arman los pedidos de Miércoles 15:01hs a Lunes hasta 15:00hs, listo para entregarse el Miércoles, y de Lunes 15:01 a Miercoles 15hs, listo para entregarse el Viernes, por lo que la velocidad de entrega depende, de el horario en el que se arman los pedidos y el momento en el que se confirma el pedido solicitado(Máxima velocidad de entrega de pedido, desde que se confirma: 2 días).
			Ejemplo: 
			1 - Se confrima pedido un Lunes a las 14:00hs, llega el Miércoles(Ejemplo de Máxima velocidad de entrega del pedido, desde que se confirma). 
			2 - Se confrima pedido un Lunes a las 15:01hs ya pasaría a entregarse el Viernes.
			3 - Se confrima pedido un Mártes, ya pasaría a entregarse el Viernes.
			
			Alcance y Costo de Envio:
			(Contando desde Estaciòn Banfield)
			- Menos de 5km(50 cuadras) $5000. 
			- Cualquier distancia Mayor a 5km(50 cuadras) $6000.
			- Compra Mínima: SIN LIMITES.`;


    // Aplicar como title (tooltip)
    const btnEnvio = document.getElementById("InfoEnvios-Barra");
    btnEnvio.setAttribute("title", textoEnvio);

    // Activar Bootstrap tooltip
    new bootstrap.Tooltip(btnEnvio);

    // Aplicar como contenido de <p>
    const parrafoEnvio = document.getElementById("contenidoEnvios");
    parrafoEnvio.innerText = textoEnvio;
	
	
	
	
	const textoFormasPago = `- Mercado Pago<br>- Efectivo<br>- Transferencia Bancaria`;

	// Aplicar como contenido del tooltip con HTML
	const btnFormasPago = document.getElementById("InfoFormasPago-Barra");
	btnFormasPago.setAttribute("title", textoFormasPago);
	btnFormasPago.setAttribute("data-bs-html", "true"); // por si acaso

	// Activar tooltip HTML
	new bootstrap.Tooltip(btnFormasPago);

	// Aplicar también dentro del <p>
	const parrafoFormasPago = document.getElementById("contenidoFormasPago");
	parrafoFormasPago.innerHTML = textoFormasPago;


	
	
	const textoContacto = `- Nuestra via directa de compra y consultas es Whatsapp - 11 7110 4740  
	- Horario de Atención: De 9 a 21hs.`;


    // Aplicar como title (tooltip)
    const btnComoComprar = document.getElementById("InfoContacto-Barra");
    btnComoComprar.setAttribute("title", textoContacto);

    // Activar Bootstrap tooltip
    new bootstrap.Tooltip(btnComoComprar);

    // Aplicar como contenido de <p>
    const parrafoContacto = document.getElementById("contenidoContacto");
    parrafoContacto.innerText = textoContacto;
	
	
	

	
	  document.addEventListener("DOMContentLoaded", function () {
  

  // Carga el menú hamburguesa ó barra superior si es Mobile ó Desktop
    const mainNav = document.getElementById("main-nav-items");
    const mobileMenu = document.getElementById("mobile-clone");

    if (mainNav && mobileMenu) {
      // Clona solo los <li>, no el <ul>
      const items = mainNav.querySelectorAll("li");
      items.forEach(item => {
        mobileMenu.appendChild(item.cloneNode(true));
      });
    }
	
	  if (window.innerWidth >= 768) {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl);
	  
	  
    });
  }
  
  	  


  });
  
  
setTimeout(() => {
  const toggle = document.getElementById("menu-toggle");
  const sideMenu = document.querySelector(".side-menu");
  const overlay = document.querySelector(".overlay");

  // Cierra el menú al hacer clic en cualquier enlace del menú
  sideMenu?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      toggle.checked = false;
    });
  });
}, 320); // espera 200ms después de insertar el header

if (window.innerWidth < 768) {
  const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');

  tooltipElements.forEach(el => {
    const tooltipInstance = bootstrap.Tooltip.getInstance(el);
    if (tooltipInstance) {
      tooltipInstance.dispose();
    }
    el.removeAttribute("data-bs-toggle");
    el.removeAttribute("title");
  });
}

$('#InfoQuienesSomos-Barra, #InfoEnvios-Barra, #InfoFormasPago-Barra, #InfoComoComprar-Barra').on('click', function () {
  $('.css-1nuilh8').removeClass('force-visible');
});

$(document).on('click', '#SubirInicio', function () {
  $('.css-1nuilh8').addClass('force-visible');
});


$('bdi').each(function () {
  const $bdi = $(this);
  const text = $bdi.text().trim(); // Ej: "$3.528"

  const numberMatch = text.match(/[\d.,]+/);
  if (!numberMatch) return;

  let raw = numberMatch[0]
    .replace(/\./g, '') // quita puntos (miles)
    .replace(/,/g, ''); // quita comas

  let value = parseFloat(raw);
  if (isNaN(value)) return;

  // ✅ Aplicar nuevo factor: 0.9375
  let result = Math.round(value * 0.9375);

  // Reemplazar en el HTML sin decimales ni separadores
  $bdi.html('<span class="woocommerce-Price-currencySymbol">$</span>' + result);
});
