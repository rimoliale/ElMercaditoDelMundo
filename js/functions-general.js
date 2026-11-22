

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

//REEMPLAZADOR DE TITULOS DE SUBPRODUCTOS//------------------------------	
  const archivo = window.location.pathname.split("/").pop().replace(".html", "");
  const nombreFormateado = archivo.replace(/-/g, " ").toUpperCase();

  const h1 = document.querySelector("h1.page-title.ast-archive-title");

  if (h1) {
    let texto = h1.textContent.trim();

    if (texto.includes("*")) {
      // Borra solo el asterisco (y espacios alrededor si los hay)
      h1.textContent = texto.replace(/\s*\*\s*/, "").trim();
    } else {
      // Reemplaza por el nombre del archivo
      h1.textContent = nombreFormateado;
    }
  }
//------------------------------//REEMPLAZADOR DE TITULOS DE SUBPRODUCTOS//	

	$(".woocommerce-result-count").text("Mostrando " + document.querySelectorAll('ul.products li.product').length + " de " + document.querySelectorAll('ul.products li.product').length + " Productos" );




		
		document.querySelectorAll('.wpc-term-item-content-wrapper a').forEach(function(link) {

		  
		  link.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation(); // Evita que llegue al contenedor del filtro
		  });
		});
		
		// Ahora no escucho al <a>, escucho al <label> o al <div>
		var filtros = document.querySelectorAll('.wpc-term-item-content-wrapper');

		var productos = document.querySelectorAll('ul.products li.product');

		filtros.forEach(function(filtro) {
			filtro.addEventListener('click', function(e) {
				//e.preventDefault();

				var unCheckbox = this.querySelector('input[type="checkbox"]');
				checkboxes.check.push(unCheckbox);
				
				// var cbCheckedChangeBefore = unCheckbox.checked;
								
				// Buscar el <a> adentro
				var a = this.querySelector('a');
				if (!a) return; // si no hay <a>, no hacer nada

				var marcaCruda = a.textContent.toLowerCase().replace(/\(\d+\)/g, '').trim();

				productos.forEach(function(producto) {
					var textoProducto = producto.innerText.toLowerCase();
					
					if(PrimerClickDeFiltro)
					{			
						if (textoProducto.includes(marcaCruda)) 
						{
							producto.style.display = '';//muestra
							productsCant = productsCant + 1;
						} 
						else 
						{
							producto.style.display = 'none';//No muestra
						}
					}
					else
					{	
						if (unCheckbox.checked == true) 
						{
							if(textoProducto.includes(marcaCruda)) 
							{
								producto.style.display = '';//muestra
								productsCant = productsCant + 1;
							} 
						} 
						else 
						{						
							if(textoProducto.includes(marcaCruda)) 
							{
								producto.style.display = 'none';//No muestra
								productsCant = productsCant - 1;
							} 
							//unCheckbox.checked = !unCheckbox.checked;
						}
					}	
				});
				
				// if(cbCheckedChangeBefore != unCheckbox.checked)
				// {
					// unCheckbox.checked = !unCheckbox.checked;
				// }
				
				PrimerClickDeFiltro = false;
				
				// Verificar si no quedó ningún checkbox marcado
				var algunCheckboxActivo = Array.from(document.querySelectorAll('.wpc-term-item-content-wrapper input[type="checkbox"]'))
					.some(cb => cb.checked);

				if (!algunCheckboxActivo) //Ningun checked marcado
				{
					productos.forEach(function(producto) 
					{
						producto.style.display = ''; // mostrar todos los productos
					});
					
					PrimerClickDeFiltro = true; 
					
					$(".woocommerce-result-count").text("Mostrando " + document.querySelectorAll('ul.products li.product').length + " de " + document.querySelectorAll('ul.products li.product').length + " Productos" );
					$("#checkedDeseleccionar").prop("checked", true);
					$("#checkedDeseleccionar").prop("disabled", true);
				}
				else
				{
					$(".woocommerce-result-count").text("Mostrando " + productsCant + " de " + document.querySelectorAll('ul.products li.product').length + " Productos" );
					$("#checkedDeseleccionar").prop("checked", false);
					$("#checkedDeseleccionar").prop("disabled", false);
				}
				
				
				
				// if (checkbox) 
				// {
					// checkbox.checked = !checkbox.checked; // toggle (marcar/desmarcar)
				// }
			});
			

		});
		
		
		 // Eliminar los precios acumulados
/* 		document.querySelectorAll('.price').forEach(function(priceElement) {
			let amounts = priceElement.querySelectorAll('.woocommerce-Price-amount.amount');
			if (amounts.length > 1) {
				amounts[1].remove();
			}
		}); */


  
  detectSessionJs();
 //let cotizacion = obtenerEuroJS();
		//BuscadorProductos();



    //REFACTOR PRICES
    priceUpdate();




}
// LoadedPOSTA 




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



function BuscadorProductos(intentos = 0) {
  const searchInput = document.getElementById('search');
  const searchButton = document.querySelector('.icon');
  const productos = document.querySelectorAll('ul.products li.product');

  if (!searchInput || !searchButton || productos.length === 0) {
    if (intentos < 20) {
      console.log("⏳ Esperando DOM para inicializar buscador...");
      setTimeout(() => BuscadorProductos(intentos + 1), 200); // reintenta cada 200ms
    } else {
      console.warn("⚠️ No se pudo inicializar el buscador luego de varios intentos.");
    }
    return;
  }

  function filtrarPorBuscador() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let productosVisibles = 0;

    productos.forEach(function(producto) {
      const textoProducto = producto.innerText.toLowerCase();

      if (textoProducto.includes(searchTerm)) {
        producto.style.display = '';
        productosVisibles++;
      } else {
        producto.style.display = 'none';
      }
    });

    $(".woocommerce-result-count").text(`Mostrando ${productosVisibles} de ${productos.length} Productos`);
    $("#checkedDeseleccionar").prop("checked", false).prop("disabled", false);
  }

  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      filtrarPorBuscador();
    }
  });

  searchButton.addEventListener('click', function (e) {
    e.preventDefault();
    filtrarPorBuscador();
  });

  console.log("✅ Buscador inicializado correctamente.");
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

async function priceUpdate() {
/*   // 1. Marcamos la función contenedora como async (ej: $(document).ready(async function () { )
  const cotizacion = await obtenerEuroJS(); // ✅ Ahora sí espera el número (ej: 1805)

  $('bdi').each(function () {
    const $bdi = $(this);

    // Reemplazar en el HTML con el valor numérico ya resuelto
    $bdi.html('<span class="woocommerce-Price-currencySymbol">$</span>' + cotizacion.toLocaleString('es-AR'));
  }); */

  //1 calculo cotizacion
  const cotizacionEuro = await obtenerEuroJS();

  // 2. Traer productos.json para cruzar el ASIN con su precio_numerico
    $.getJSON('productos.json', function (productos) {
      // Creamos un mapa rápido { asin: producto } para no buscar con .find() en cada vuelta
      const mapaProductos = {};
      productos.forEach(p => {
        if (p.asin) mapaProductos[p.asin] = p;
      });

      // 3. Recorrer los <li> ya renderizados en el HTML
      $('ul li').each(function () {
        const $li = $(this);
        // Tomamos el ASIN desde el id del div .astra-shop-thumbnail-wrap
        const asin = $li.find('.astra-shop-thumbnail-wrap').attr('id');
        const producto = mapaProductos[asin];

        // Si ese <li> no es un producto con ASIN válido, lo saltea
        if (!producto) return; 

        const myGain = 1.12 //12% Celulares me cuestan entre 22 y 32%
        const costo_envioE = EuroToNumber(producto.entrega.costo_envio);
        const precioEnPesos = Math.ceil((producto.precio_numerico
          ? Math.round((producto.precio_numerico + costo_envioE)
          * cotizacionEuro): 0) * myGain);

        const $bdi = $li.find('bdi');

        if (precioEnPesos > 0) {
          $bdi.html(
            '<span class="woocommerce-Price-currencySymbol">$</span>' +
            precioEnPesos.toLocaleString('es-AR') +
            ' ARS'
          );
        } else {
          $bdi.text('Consultar precio');
        }
      });
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

