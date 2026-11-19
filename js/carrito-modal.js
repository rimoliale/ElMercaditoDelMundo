document.addEventListener('DOMContentLoaded', () => {
  const cartWrapper = document.querySelector('.ast-site-header-cart');
  const cartList = document.getElementById('astMiniCartList');
  const subtotalEl = document.getElementById('astMiniCartSubtotal');
  const totalWrap = document.getElementById('astMiniCartTotalWrap');
  const buttonsWrap = document.getElementById('astMiniCartButtons');

  if (!cartWrapper || !cartList) return;

  let closeTimeout = null;

  // 1. Abrir / cerrar al pasar el mouse (con 220ms de tolerancia)
  function abrirModalCarrito() {
    clearTimeout(closeTimeout);
    sincronizarVistaModal();
    cartWrapper.classList.add('ast-cart-open');
  }

  function cerrarModalCarrito() {
    closeTimeout = setTimeout(() => {
      cartWrapper.classList.remove('ast-cart-open');
    }, 220);
  }

  cartWrapper.addEventListener('mouseenter', abrirModalCarrito);
  cartWrapper.addEventListener('mouseleave', cerrarModalCarrito);

  // 2. Lee tus datos SIN modificar #AccumulatedPriceItems ni tu lógica de incremento
  function sincronizarVistaModal() {
    // Busca en sessionStorage o localStorage la lista de productos que ya manejes
    const carrito =
      JSON.parse(sessionStorage.getItem('carrito_sesion')) ||
      JSON.parse(localStorage.getItem('carrito')) ||
      [];

    // Toma el valor exacto que YA calculó tu propio código en el header
    const totalActualHeader = document.getElementById('AccumulatedPriceItems')?.textContent?.trim() || '0';

    if (carrito.length === 0) {
      cartList.innerHTML = '<li class="ast-mini-cart-empty-msg">No hay productos en el carrito.</li>';
      if (subtotalEl) subtotalEl.textContent = totalActualHeader;
      if (totalWrap) totalWrap.style.display = totalActualHeader !== '0' ? 'flex' : 'none';
      if (buttonsWrap) buttonsWrap.style.display = 'flex';
      return;
    }

    if (totalWrap) totalWrap.style.display = 'flex';
    if (buttonsWrap) buttonsWrap.style.display = 'flex';
    cartList.innerHTML = '';

    carrito.forEach((prod, index) => {
      const cantidad = Number(prod.cantidad) || 1;
      const precioUnit = Number(String(prod.precio).replace(/[^0-9.-]+/g, '')) || 0;
      const totalItem = precioUnit * cantidad;

      const li = document.createElement('li');
      li.className = 'woocommerce-mini-cart-item mini_cart_item';
      li.innerHTML = `
        <a role="button" href="#" class="remove remove_from_cart_button" data-index="${index}" aria-label="Eliminar ${prod.titulo} del carrito">
          <span aria-hidden="true" class="ahfb-svg-iconset ast-inline-flex">
            <svg class="ast-mobile-svg ast-close-svg" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path>
            </svg>
          </span>
        </a>

        <a href="${prod.url || '#'}">
          <img width="300" height="300" src="${prod.imagen || 'images/Logo-1-Principal.png'}" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt="${prod.titulo}">
          <div class="ast-product-image ast-disable-image">
            <div class="ast-product-name">${prod.titulo}</div>
          </div>
        </a>

        <div class="quantity">
          <input type="number" class="input-text qty text" data-index="${index}" value="${cantidad}" min="1" step="1" inputmode="numeric" autocomplete="off" readonly>
        </div>

        <div class="ast-mini-cart-price-wrap">
          <span class="woocommerce-Price-amount amount">
            <bdi><span class="woocommerce-Price-currencySymbol" translate="no" dir="auto">$</span>${totalItem.toLocaleString('es-AR')}</bdi>
          </span>
        </div>
      `;
      cartList.appendChild(li);
    });

    // Muestra exactamente el mismo subtotal que ya calculó tu código
    if (subtotalEl) subtotalEl.textContent = totalActualHeader;
  }
});