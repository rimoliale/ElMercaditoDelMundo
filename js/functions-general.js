// document.querySelector('.add_to_cart_button').addEventListener('click', function(e) {
  // // lógica de agregar al carrito
  // $("#CantidadACarrito").text(parseInt($("#CantidadACarrito").text()) + 1);
  
  
// });

//.sidebar-main


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


//woocommerce-result-count




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
			e.preventDefault(); // evita la navegación
		  });
		});
		
		document.querySelectorAll('.wpc-term-item-content-wrapper a').forEach(function(link) {
		  // Remover href para que no se muestre en la barra de estado
		  link.removeAttribute('href');
		  // Opcional: cambiar el cursor para que no parezca un link
		  link.style.cursor = 'default';
		  
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
		document.querySelectorAll('.price').forEach(function(priceElement) {
			let amounts = priceElement.querySelectorAll('.woocommerce-Price-amount.amount');
			if (amounts.length > 1) {
				amounts[1].remove();
			}
		});
		
		document.querySelectorAll('ul.products li.product .astra-shop-thumbnail-wrap a').forEach(function (link) {
			var parent = link.parentNode;
			while (link.firstChild) {
				parent.insertBefore(link.firstChild, link);
			}
			parent.removeChild(link);
		});	


		
		BuscadorProductos();
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

	function soloParaComentar() 
	{


//AGREGAR A CARRITO
  // $('.add_to_cart_button').on('click', function (e) {
	  // //alert('prueba');
    // e.preventDefault();

    // // Contenedor del producto actual
    // var $product = $(this).closest('li');

    // // Tomar el variation_id del input oculto
    // var variationId = $product.find('input.variation_id').val();

    // // Tomar el precio que está dentro del producto actual
    // var price = $product.find('.price bdi').first().text().replace('$', '').replace('.', '').replace(',', '.');

	
    // //console.log('Producto:', variationId);
    // //console.log('Precio:', price);;

	

	
	// let priceFormated = parseFloat(price);
	

	// $("#CantidadACarrito").text(parseInt($("#CantidadACarrito").text()) + 1);
	
	// if($("#AccumulatedPriceItems").text() == "$")
	// {
		// let resultFormated = priceFormated.toFixed(1);
		
		// $("#AccumulatedPriceItems").text(resultFormated);
	// }
	// else
	// {
		// let CarritoFormated = parseFloat($("#AccumulatedPriceItems").text());
		// let result = CarritoFormated + priceFormated;
		// let resultFormated = result.toFixed(1);
		
		// $("#AccumulatedPriceItems").text(resultFormated);
		
	// }
	
	// //$("#AccumulatedPriceItems").text(numero);
	
	
	
    // // Acá podrías llamar a tu función para agregar al carrito, ejemplo:
    // // agregarAlCarrito(variationId, price);
    // });
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


// document.addEventListener('DOMContentLoaded', inicializarBuscadorCuandoEsteListo);

