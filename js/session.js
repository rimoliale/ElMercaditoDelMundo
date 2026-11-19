// sesion.js - Enlazar en index.html, productos.html, carrito.html, etc.

const EstadoTienda = {
  // 1. Guardar o actualizar datos
  guardarUsuario(datosUsuario) {
    // Ej: { nombre: "Ale", email: "ale@mail.com" } (NUNCA guardes contraseñas ni tarjetas acá)
    sessionStorage.setItem('usuario_sesion', JSON.stringify(datosUsuario));
  },

  agregarProducto(producto) {
    const carrito = this.obtenerCarrito();
    const existente = carrito.find(item => item.id === producto.id);
    
    if (existente) {
      existente.cantidad += producto.cantidad || 1;
    } else {
      carrito.push({
        id: producto.id,
        titulo: producto.titulo,
        precio: Number(producto.precio),
        imagen: producto.imagen,
        cantidad: producto.cantidad || 1
      });
    }
    
    sessionStorage.setItem('carrito_sesion', JSON.stringify(carrito));
    this.actualizarVista();
  },

  // 2. Leer datos desde cualquier HTML
  obtenerUsuario() {
    const data = sessionStorage.getItem('usuario_sesion');
    return data ? JSON.parse(data) : null;
  },

  obtenerCarrito() {
    const data = sessionStorage.getItem('carrito_sesion');
    return data ? JSON.parse(data) : [];
  },

  obtenerTotal() {
    return this.obtenerCarrito().reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  },

  // 3. Limpiar al finalizar compra o cerrar sesión
  vaciarTodo() {
    sessionStorage.removeItem('carrito_sesion');
    sessionStorage.removeItem('usuario_sesion');
    this.actualizarVista();
  },

  // 4. Pintar automáticamente en el header de cualquier HTML que tenga #AccumulatedPriceItems
  actualizarVista() {
    const totalEl = document.getElementById('AccumulatedPriceItems');
    if (totalEl) {
      totalEl.textContent = this.obtenerTotal().toLocaleString('es-AR');
    }
  }
};



function  DOMContentLoadedPOSTA_carrito() {
EstadoTienda.actualizarVista();
}