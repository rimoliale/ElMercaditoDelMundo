
const rutaPDF = 'Recursos/BD/ALMACENL2.pdf'; // archivo fijo

(async function () {
  const imagenDefault = 'images/Almacen.png';

  function procesarTexto(texto) {
  const productos = [];
  const regex = /(.+?)\s+(\d{3,6}\.\d{2})\s+-?\d+/g;
  let match;

  while ((match = regex.exec(texto)) !== null) {
    const nombre = match[1].replace(/\s+&*$/, '').trim();
/* 
      let ok;
      ok=false;
      if (ok==false) {
        ok=true;
        console.log(match[2]);

      }  */

    const precio = parseFloat(match[2]); // Ej: "1170.00" → 1170

    if (!isNaN(precio)) {
      const precioFinal = Math.ceil(precio * 1.25); // Redondea para arriba
      productos.push({ nombre, precioFinal });
    }
  }

  return productos;
}


  function renderizarProductos(productos) {
    const contenedor = document.querySelector('ul.products.columns-5');
    if (!contenedor) {
      console.warn("❌ No se encontró <ul.products.columns-5>");
      return;
    }

    productos.forEach((p, idx) => {
      const li = document.createElement('li');
      li.className = 'ast-col-sm-12 ast-article-post desktop-align-center tablet-align-center mobile-align-center ast-col-md-6 ast-product-gallery-layout-horizontal ast-product-single-variable ast-product-tabs-layout-horizontal product type-product post-' + (13000 + idx) + ' status-publish instock product_cat-limpieza has-post-thumbnail featured shipping-taxable purchasable product-type-variable';

      li.innerHTML = `
        <div class="astra-shop-thumbnail-wrap">
          <a class="woocommerce-LoopProduct-link woocommerce-loop-product__link">
            <img src="${imagenDefault}" alt="${p.nombre}">
          </a>
        </div>
        <input type="hidden" class="wpmProductId" data-id="${13000 + idx}">
        <div class="astra-shop-summary-wrap">
          <span class="ast-woo-product-category">Almacen</span>
          <a class="ast-loop-product__link"><h2 class="woocommerce-loop-product__title">${p.nombre}</h2></a>
          <span class="price">
            <div class="price">
              <span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>${p.precioFinal.toLocaleString("es-AR", { maximumFractionDigits: 0 })}</bdi></span>
            </div>
          </span>
          <a data-quantity="1" class="button product_type_variable add_to_cart_button thwvs_add_to_cart_button thwvs_ajax_add_to_cart"
            href="Intermediate-Web-Wa Chango Ale.html"
            style="display: block;"
            data-product_id="${13000 + idx}"
            aria-label="Comprar ${p.nombre}"
            rel="nofollow">Comprar</a>
        </div>
      `;

      contenedor.appendChild(li);
    });
  }

async function leerPDF() {
  try {
    const pdf = await pdfjsLib.getDocument(rutaPDF).promise;
    let texto = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      texto += content.items.map(i => i.str).join(' ') + '\n';
    }

    // Cortar desde donde empieza "LIMPIEZA"
    const inicio = texto.indexOf('ALMACEN');
    if (inicio > -1) {
      texto = texto.slice(inicio);
    }

        // Eliminar "LIMPIEZA DESBUL" si aparece en la primera línea
    texto = texto.replace(/^ALMACEN\s+DES\s+BUL\s*/i, '');

    return texto;
  } catch (err) {
    console.error("❌ Error leyendo PDF:", err);
    return '';
  }
}


  // 🔄 Esperar hasta que el contenedor exista
  const esperarContenedor = () =>
    new Promise(resolve => {
      const intervalo = setInterval(() => {
        const contenedor = document.querySelector('ul.products.columns-5');
        if (contenedor) {
          clearInterval(intervalo);
          resolve();
        }
      }, 200);
    });

  await esperarContenedor();

  console.log("✅ Contenedor de productos listo. Procesando PDF...");
  const texto = await leerPDF();
  const productos = procesarTexto(texto);
  renderizarProductos(productos);
})();
