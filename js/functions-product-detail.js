

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
	
	
	
	
	
		    const textoEnvio =`Se realiza el pedido mediante Whatsapp al 11 7110 4740  Con Horario de Atención: De 9 a 21hs.
			Los pedidos confirmados serán programados y listos para su entrega, según corresponda el horario de armado de pedidos y proponga el cliente dentro del "Horario de Entrega".
				
			Horario de Entrega: 
			Lunes a Viernes de 9 a 12hs y de 18hs a 21hs
			
			Se arman los pedidos de Lunes a Viernes hasta las 15:00hs, por lo que el pedido confirmado ántes, puede entregarse el mismo día).
			
			Alcance y Costo de Envio:
			(Contando desde Estaciòn Banfield)
			- Menos de 5km(50 cuadras) envío gratis. 
			- Cualquier Mayor distancia Consultar.			
			- Compra Mínima: SIN LÍMITE.`


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
  
    // MENU HAMBURGUESA Cierra menú al hacer click en alguna opcion
setTimeout(() => {
  const toggle = document.getElementById("menu-toggle");
  const sideMenu = document.querySelector(".side-menu");
  const overlay = document.querySelector(".overlay");


  sideMenu?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      toggle.checked = false;
    });
  });
}, 320); 

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


 
 // // lógica de agregar al carrito
document.querySelector('.add_to_cart_button').addEventListener('click', function(e) {
		$(".ast-count-text").text(parseInt($(".ast-count-text").text()) + 1);
});


//AGREGAR A CARRITO
 $('.add_to_cart_button').on('click', function (e) {
	  // //alert('prueba');
     e.preventDefault();

     // Contenedor del producto actual
     var $product = $(this).closest('li');

     // Tomar el variation_id del input oculto
     var variationId = $product.find('input.variation_id').val();

     // Tomar el precio que está dentro del producto actual
     var priceActual = $product.find('.price bdi').first().text().replace('$', '').replace('.', '').replace(',', '.');

	
     //console.log('Producto:', variationId);
     //console.log('Precio:', price);;

	

	
	let priceActiualFormated = parseFloat(priceActual);
	let AccumulatedPriceItems = parseFloat($("#AccumulatedPriceItems").text());
	let priceActuaaAcumulatedFormated = AccumulatedPriceItems + priceActiualFormated;


	$(".ast-count-text").text(parseInt($(".ast-count-text").text()) + 1);
	
	if($("#AccumulatedPriceItems").text() == "$")
	{// let resultFormated = priceFormated.toFixed(1);// $("#AccumulatedPriceItems").text(resultFormated);
	}
	else
	{// let CarritoFormated = parseFloat($("#AccumulatedPriceItems").text());// let result = CarritoFormated + priceFormated;// let resultFormated = result.toFixed(1);// $("#AccumulatedPriceItems").text(resultFormated);
	}
	
	$("#AccumulatedPriceItems").text(priceActuaaAcumulatedFormated);

	

    // Acá podrías llamar a tu función para agregar al carrito, ejemplo:
    //agregarAlCarrito(variationId, price);
});
  // // lógica de agregar al carrito






  function tryLoadScript(url) {
  fetch(url)
    .then(resp => {
      if (resp.ok) {
        const s = document.createElement('script');
        s.src = url;
        document.head.appendChild(s);
      }
    })
    .catch(() => {}); // Silencia error
}

function tryLoadStylesheet(url) {
  fetch(url)
    .then(resp => {
      if (resp.ok) {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = url;
        document.head.appendChild(l);
      }
    })
    .catch(() => {}); // Silencia error
}



var Marcas = {
    marca: []
};

var checkboxes = {
    check: []
};

var productsCant = 0;

var PrimerClickDeFiltro = true;

function  DOMContentLoadedPOSTA() {
  detectSessionJs();

  //REFACTOR PRICES
  UpdateDataProductDetail();
}


$("#checkedDeseleccionar").on("change", function () {
    const isChecked = this.checked;

    // Desmarca todos los filtros
    $(".wpc-filters-section input[type='checkbox']").prop("checked", false);
	
	$("#checkedDeseleccionar").prop("checked", true);
	$("#checkedDeseleccionar").prop("disabled", true);
	
	var productos = document.querySelectorAll('ul.products li.product');
	
	productos.forEach(function(producto) 
	{
		producto.style.display = ''; // mostrar todos los productos
	});
	
	$(".woocommerce-result-count").text("Mostrando " + document.querySelectorAll('ul.products li.product').length + " de " + document.querySelectorAll('ul.products li.product').length + " Productos" );
	
	PrimerClickDeFiltro = true; 

	$("#search").val('')	
});


function detectSessionJs(intentos = 0) {
  let encontreJS = false;

 my_if:   if (intentos < 20) {
      
        $.getScript("js/session.js")
        .done(function () {
          console.log("El session.js cargó correctamente.");
          DOMContentLoadedPOSTA_carrito();
          
        })
        .fail(function () {
          console.log("Error al cargar el session.js.");
        });

      break my_if;
      setTimeout(() => detectSessionJs(intentos + 1), 5000); // reintenta cada 200ms
    } else {
      console.warn("⚠️ No se pudo inicializar el buscador luego de varios intentos.");
    }
    return;
  } 




async function obtenerEuroJS() {
  const VALOR_RESPALDO = 1805.00; // Por si la API externa tarda o se cae

  try {
    const resp = await fetch('https://dolarapi.com/v1/cotizaciones/eur');
    if (!resp.ok) throw new Error('Error consultando API');
    
    const data = await resp.json();
    // data.venta trae el valor numérico de venta (ej: 1805)
    const cotizacionVenta = Number(data.venta) || VALOR_RESPALDO;
    
    //console.log(`Euro Venta: $ ${cotizacionVenta.toLocaleString('es-AR')} ARS`);
    return cotizacionVenta;

  } catch (error) {
    console.warn('No se pudo obtener cotización en vivo, se usa respaldo:', error);
    return VALOR_RESPALDO;
  }
}

async function UpdateDataProductDetail() {
/*   // 1. Marcamos la función contenedora como async (ej: $(document).ready(async function () { )
  const cotizacion = await obtenerEuroJS(); // ✅ Ahora sí espera el número (ej: 1805)

  $('bdi').each(function () {
    const $bdi = $(this);

    // Reemplazar en el HTML con el valor numérico ya resuelto
    $bdi.html('<span class="woocommerce-Price-currencySymbol">$</span>' + cotizacion.toLocaleString('es-AR'));
  }); */

  //1 calculo cotizacion
  const cotizacionEuro = await obtenerEuroJS();

  const url = new URL(window.location.href);
  const asinBuscado = "B0GNNTX269";
  //const asinBuscado = url.searchParams.get("prod");

    $.getJSON('productos.json', function (productos) {
      // 1. Buscar el producto exacto por ASIN
      const producto = asinBuscado
        ? productos.find(p => p.asin === asinBuscado)
        : productos[0];

      if (!producto) {
        console.warn("No se encontró producto para ASIN:", asinBuscado);
        return;
      }



      //Reescribo Producto Detalle
      $('img.thwvs_shop_image').attr({
    'srcset': `${producto.imagen} 600w, ${producto.imagen} 1200w`
  });

      const regex = /^.*?(?=\s*(?:smartphone|,|-))/si;
      tituloRemasted = producto.titulo.match(regex);  
      $('.product_title').text(tituloRemasted);

      $('.rating').text(producto.rating);
      $('.ratingText').text(producto.rating);
      $('.count').text(producto.cantidad_resenas);
      $('#ProductoDetMarca').text(producto.marca);
      $('#ProductoDetCapacidad').text(producto.tamano);
      $('#ProductoDetColor').text(producto.color);
      $('#ProductoDetTamano').text(producto.especificaciones.tamano_pantalla);
      $('#ProductoDetSO').text(producto.especificaciones.sistema_operativo);
      $('#ProductoDetEstado').text(producto.especificaciones.estado);

      // 2. Unir el array de bullets con .join()
      const bullets = Array.isArray(producto.acerca_de_este_producto)
        ? producto.acerca_de_este_producto.join('\n• ')
        : (producto.acerca_de_este_producto || '');

      const myGain = 1.12 //12% Celulares me cuestan entre 22 y 32%
      const costo_envioE = EuroToNumber(producto.entrega.costo_envio);
      const precioEnPesos = Math.ceil((producto.precio_numerico
        ? Math.round((producto.precio_numerico + costo_envioE)
        * cotizacionEuro): 0) * myGain);

      const $bdi = $('.amount');

      if (precioEnPesos > 0) {
        $bdi.html(
          '<span class="woocommerce-Price-currencySymbol">Menos de: $</span>' +
          precioEnPesos.toLocaleString('es-AR') +
          ' ARS'
        );
      } else {
        $bdi.text('Consultar precio');
      }




      $('#tab-description').text(bullets ? '• ' + bullets : '');

    }).fail(function () {
      console.error("No se pudo cargar la lista de productos.");
    });
  
}

function EuroToNumber(texto) {
  if (!texto) return 0;

  const limpio = String(texto)
    .replace(/\./g, '')       // 1. Quita puntos de miles (ej: "1.299,99" -> "1299,99")
    .replace(',', '.')        // 2. Cambia la coma decimal por punto ("14,99" -> "14.99")
    .replace(/[^\d.-]/g, ''); // 3. Quita "€", espacios y cualquier otro carácter

  return parseFloat(limpio) || 0;
}

// document.addEventListener('DOMContentLoaded', inicializarBuscadorCuandoEsteListo);

