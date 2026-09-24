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
	
	
	document.querySelectorAll('.wpc-term-item-content-wrapper input[type="checkbox"]').forEach(function(checkbox) {
		checkbox.addEventListener('change', function() {
			var filtrosSeleccionados = Array.from(document.querySelectorAll('.wpc-term-item-content-wrapper input[type="checkbox"]:checked'))
				.map(cb => cb.closest('.wpc-term-item-content-wrapper').querySelector('a').textContent.toLowerCase().trim());

			var productos = document.querySelectorAll('ul.products li.product');
			var productsCant = 0;

			if (filtrosSeleccionados.length === 0) {
				productos.forEach(function(producto) {
					producto.style.display = '';
				});
				$(".woocommerce-result-count").text("Mostrando " + productos.length + " de " + productos.length + " Productos");
				$("#checkedDeseleccionar").prop("checked", true).prop("disabled", true);
				return;
			}

			productos.forEach(function(producto) {
				var textoProducto = producto.innerText.toLowerCase();
				var contieneTodos = filtrosSeleccionados.every(filtro => textoProducto.includes(filtro));
				if (contieneTodos) {
					producto.style.display = '';
					productsCant++;
				} else {
					producto.style.display = 'none';
				}
			});

			$(".woocommerce-result-count").text("Mostrando " + productsCant + " de " + productos.length + " Productos");
			$("#checkedDeseleccionar").prop("checked", false).prop("disabled", false);
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

