// Reemplaza con tus 2 datos de Supabase (Project Settings > API)
const SUPABASE_URL = 'https://sacyevqpfqobpennpwzo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_iIFuOmdVET7Xj8NDQeoJ8Q_A8kTVsnq';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const btnRealizarPedido = document.getElementById('place_order');
  if (!btnRealizarPedido) return;

  btnRealizarPedido.addEventListener('click', async (e) => {
    e.preventDefault(); // Evita que el form recargue o mande al action viejo de WooCommerce

    // 1. Captura lo que el usuario escribió en cada campo del HTML
    const datosCliente = {
      nombre: document.getElementById('billing_first_name')?.value.trim() || '',
      apellido: document.getElementById('billing_last_name')?.value.trim() || '',
      email: document.getElementById('billing_email')?.value.trim() || '',
      telefono: document.getElementById('billing_phone')?.value.trim() || '',
      // Ajusta estos IDs si en tu HTML tienen otro nombre (ej. billing_cuil o billing_wooccm11)
      situacion_impositiva: document.getElementById('billing_myfield13')?.value.trim() || '',
      cuil: document.getElementById('billing_myfield12')?.value.trim() || '',
      direccion: document.getElementById('billing_address_1')?.value.trim() || '',
      ciudad: document.getElementById('billing_city')?.value.trim() || '',
      codigo_postal: document.getElementById('billing_postcode')?.value.trim() || '',
      pais: document.getElementById('billing_country')?.value.trim() || '',
      provincia: '1',//document.getElementById('select2-billing_state-container')?.value.trim() || '',
      contra: document.getElementById('account_password')?.value.trim() || ''
    };

    // Validación básica de campos obligatorios
    if (!datosCliente.nombre || !datosCliente.email || !datosCliente.direccion) {
      alert('Por favor completa Nombre, Correo y Dirección antes de realizar el pedido.');
      return;
    }

    btnRealizarPedido.disabled = true;
    btnRealizarPedido.textContent = 'GUARDANDO DATOS...';

    try {
      // 2. Envía los datos del cliente a Supabase
      const { error } = await supabaseClient
        .from('clientes')
        .insert([datosCliente]);

      if (error) throw error;

      // 3. También los deja en sessionStorage por si los necesitas en gracias.html
      sessionStorage.setItem('usuario_sesion', JSON.stringify(datosCliente));

      alert('¡Datos del cliente guardados correctamente!');
      // Acá puedes disparar el pago con Mercado Pago si corresponde:
      // document.getElementById('btn-pagar-mp')?.click();

    } catch (err) {
      console.error('Error al guardar en Supabase:', err);
      alert('No se pudieron guardar los datos: ' + err.message);
    } finally {
      btnRealizarPedido.disabled = false;
      btnRealizarPedido.textContent = 'REALIZAR EL PEDIDO';
    }
  });
});



$(document).ready(function () {
  // 1. Desplegar / ocultar formulario de login al tocar "¿Ya eres cliente? Haz clic aquí para acceder"
  $('form.woocommerce-form-login').hide(); //[cite: 2]

  $(document).on('click', 'a.showlogin', function (e) { //[cite: 2]
    e.preventDefault(); //[cite: 2]
    $('form.woocommerce-form-login').slideToggle(300); //[cite: 2]
  });

  // 2. Función que completa los inputs de finish-sell-without-user.html con los datos del cliente[cite: 1]
  function autocompletarCheckout(cliente) {
    if (!cliente) return;

    if (cliente.nombre) $('#billing_first_name').val(cliente.nombre); //[cite: 1]
    if (cliente.apellido) $('#billing_last_name').val(cliente.apellido); //[cite: 1]
    if (cliente.email) $('#billing_email').val(cliente.email); //[cite: 1]
    if (cliente.telefono) $('#billing_phone').val(cliente.telefono); //[cite: 1]
    if (cliente.cuil) $('#billing_cuil, #billing_wooccm11').val(cliente.cuil); //[cite: 1]
    if (cliente.situacion_impositiva) {
      $('#billing_situacion_impositiva, #billing_wooccm12').val(cliente.situacion_impositiva).trigger('change'); //[cite: 1]
    }
    if (cliente.direccion) $('#billing_address_1').val(cliente.direccion); //[cite: 1]
    if (cliente.ciudad) $('#billing_city').val(cliente.ciudad); //[cite: 1]
    if (cliente.codigo_postal) $('#billing_postcode').val(cliente.codigo_postal); //[cite: 1]
    if (cliente.provincia) $('#billing_state').val(cliente.provincia).trigger('change'); //[cite: 1]
  }

  // Si ya había iniciado sesión en otra página (ej. index.html), completa el checkout al cargar[cite: 1, 4]
  const sesionGuardada = sessionStorage.getItem('usuario_sesion'); //[cite: 1, 4]
  if (sesionGuardada) {
    try {
      autocompletarCheckout(JSON.parse(sesionGuardada));
    } catch (err) {
      console.error('Error leyendo usuario_sesion:', err);
    }
  }

  // 3. Interceptar el envío del formulario de Login ("ACCEDER")[cite: 2]
  $(document).on('submit', 'form.woocommerce-form-login', async function (e) {
    e.preventDefault();

    const $form = $(this);
    const $btnAcceder = $form.find('button[type="submit"], input[type="submit"]');
    const textoOriginal = $btnAcceder.text();

    // Lee el input de usuario/correo (#username) y contraseña (#password) estándar de WooCommerce
    const identificador = $.trim($form.find('#username, input[name="username"]').val() || '');
    const password = $form.find('#password, input[name="password"]').val() || '';

    if (!identificador || !password) {
      alert('Por favor ingresa tu nombre de usuario o correo y tu contraseña.');
      return;
    }

    $btnAcceder.prop('disabled', true).text('VERIFICANDO...');

    try {
      let emailParaLogin = identificador;
      let datosCliente = null;

      // Si NO contiene "@", asumimos que ingresó su nombre o nombre_usuario y buscamos su email en Supabase[cite: 1]
      if (!identificador.includes('@')) {
        const { data: encontrados, error: errBusqueda } = await supabaseClient
          .from('clientes')
          .select('*')
          .or(`nombre_usuario.ilike.${identificador},nombre.ilike.${identificador}`)
          .limit(1);

        if (errBusqueda) throw errBusqueda;

        if (!encontrados || encontrados.length === 0) {
          throw new Error('No se encontró ningún cliente con ese nombre.');
        }

        datosCliente = encontrados[0];
        emailParaLogin = datosCliente.email;
      }

      // Intentamos autenticar contra Supabase Auth (email + contraseña)[cite: 1]
      const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
        email: emailParaLogin,
        password: password
      });

      // Si no está en Supabase Auth, verificamos si tiene contraseña guardada directo en la tabla clientes
      if (authError) {
        const { data: filaDirecta } = await supabaseClient
          .from('clientes')
          .select('*')
          .eq('email', emailParaLogin)
          .eq('password', password)
          .maybeSingle();

        if (!filaDirecta) {
          throw new Error('Usuario/correo o contraseña incorrectos.');
        }
        datosCliente = filaDirecta;
      } else if (!datosCliente) {
        // Si entró por Supabase Auth, traemos su ficha completa de la tabla clientes[cite: 1]
        const { data: filaPerfil } = await supabaseClient
          .from('clientes')
          .select('*')
          .eq('email', emailParaLogin)
          .order('creado_en', { ascending: false })
          .limit(1)
          .maybeSingle();

        datosCliente = filaPerfil || { email: emailParaLogin };
      }

      // 4. Guardamos en sessionStorage y completamos todo el formulario de compra[cite: 1, 4]
      sessionStorage.setItem('usuario_sesion', JSON.stringify(datosCliente)); //[cite: 1, 4]
      autocompletarCheckout(datosCliente);

      // Oculta el formulario de login y muestra saludo en el banner superior
      $form.slideUp(300);
      $('.woocommerce-form-login-toggle .woocommerce-info').html(
        `¡Hola <strong>${datosCliente.nombre || datosCliente.email}</strong>! Tus datos de envío fueron completados automáticamente.`
      );

    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      alert(err.message || 'No se pudo iniciar sesión.');
    } finally {
      $btnAcceder.prop('disabled', false).text(textoOriginal);
    }
  });
});