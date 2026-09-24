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

document.addEventListener('DOMContentLoaded', function() {
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
	



		$(".marquee-text").css("visibility", "visible");

});

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

	
});


//Cargo primero mi icono sobre productos para no mostrar logo original y despues muestro productos
document.addEventListener('DOMContentLoaded', function () {
	
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
	

});


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

