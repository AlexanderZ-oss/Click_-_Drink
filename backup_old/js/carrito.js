// Variable global para el carrito
let carritoItems = [];

// Cargar carrito al iniciar
document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    setupEventListeners();
    actualizarVistaCarrito();
});

function setupEventListeners() {
    // Formulario de checkout
    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        enviarPedidoWhatsApp();
    });
    
    // Botón limpiar carrito
    document.getElementById('clear-cart').addEventListener('click', function() {
        limpiarCarrito();
    });
}

// Cargar carrito desde localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carritoFerest');
    if (carritoGuardado) {
        carritoItems = JSON.parse(carritoGuardado);
    }
    actualizarContadorCarrito();
}

// Actualizar vista del carrito
function actualizarVistaCarrito() {
    const carritoLista = document.getElementById('carrito-lista');
    const subtotalElement = document.getElementById('subtotal');
    const deliveryElement = document.getElementById('delivery');
    const totalElement = document.getElementById('total');
    const enviarPedidoBtn = document.getElementById('enviarPedido');
    
    if (carritoItems.length === 0) {
        carritoLista.innerHTML = `
            <div class="carrito-vacio">
                <div class="empty-icon">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega algunos productos para continuar</p>
                <a href="index.html" class="btn btn-primary">Ver Tragos</a>
            </div>
        `;
        subtotalElement.textContent = 'S/ 0.00';
        deliveryElement.textContent = 'S/ 0.00';
        totalElement.textContent = 'S/ 0.00';
        enviarPedidoBtn.disabled = true;
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    carritoItems.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;
        
        html += `
            <div class="carrito-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.productName}" class="carrito-item-img">
                <div class="carrito-item-info">
                    <div class="carrito-item-nombre">${item.productName}</div>
                    <div class="carrito-item-categoria">${getCategoryName(item.category)}</div>
                    <div class="carrito-item-cantidad">
                        <button class="cantidad-btn" onclick="cambiarCantidad(${index}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <span>${item.quantity}</span>
                        <button class="cantidad-btn" onclick="cambiarCantidad(${index}, 1)">+</button>
                    </div>
                </div>
                <div class="carrito-item-precio">
                    <span class="precio-unitario">S/ ${item.price.toFixed(2)} c/u</span>
                    <span class="precio-total">S/ ${itemSubtotal.toFixed(2)}</span>
                </div>
                <button class="carrito-item-eliminar" onclick="eliminarDelCarrito(${index})" title="Eliminar producto">
                    🗑️
                </button>
            </div>
        `;
    });
    
    carritoLista.innerHTML = html;
    
    // Calcular delivery (gratis para compras mayores a S/ 50)
    const delivery = subtotal >= 50 ? 0 : 8;
    const total = subtotal + delivery;
    
    subtotalElement.textContent = `S/ ${subtotal.toFixed(2)}`;
    deliveryElement.textContent = delivery === 0 ? 'GRATIS' : `S/ ${delivery.toFixed(2)}`;
    totalElement.textContent = `S/ ${total.toFixed(2)}`;
    
    enviarPedidoBtn.disabled = false;
    
    // Resaltar delivery gratis
    if (delivery === 0) {
        deliveryElement.style.color = 'var(--success-color)';
        deliveryElement.style.fontWeight = 'bold';
    }
}

// Cambiar cantidad de un item
function cambiarCantidad(index, cambio) {
    const item = carritoItems[index];
    const nuevaCantidad = item.quantity + cambio;
    
    if (nuevaCantidad < 1) {
        eliminarDelCarrito(index);
        return;
    }
    
    item.quantity = nuevaCantidad;
    guardarCarrito();
    actualizarVistaCarrito();
    actualizarContadorCarrito();
}

// Eliminar item del carrito
function eliminarDelCarrito(index) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
        return;
    }
    
    carritoItems.splice(index, 1);
    guardarCarrito();
    actualizarVistaCarrito();
    actualizarContadorCarrito();
    
    mostrarNotificacion('Producto eliminado del carrito');
}

// Limpiar todo el carrito
function limpiarCarrito() {
    if (carritoItems.length === 0) return;
    
    if (!confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
        return;
    }
    
    carritoItems = [];
    guardarCarrito();
    actualizarVistaCarrito();
    actualizarContadorCarrito();
    
    mostrarNotificacion('Carrito vaciado');
}

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carritoFerest', JSON.stringify(carritoItems));
}

// Actualizar contador en el header
function actualizarContadorCarrito() {
    const totalItems = carritoItems.reduce((total, item) => total + item.quantity, 0);
    
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(element => {
        element.textContent = totalItems;
    });
}

// Enviar pedido por WhatsApp
function enviarPedidoWhatsApp() {
    if (carritoItems.length === 0) {
        mostrarNotificacion('Tu carrito está vacío');
        return;
    }
    
    const formData = new FormData(document.getElementById('checkoutForm'));
    const datosCliente = Object.fromEntries(formData);
    
    // Validar formulario
    if (!validarFormularioCheckout(datosCliente)) {
        return;
    }
    
    // Crear mensaje para WhatsApp
    const mensaje = crearMensajeWhatsApp(datosCliente);
    const numeroWhatsApp = '51987654321'; // Reemplazar con número real
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    
    // Limpiar carrito después de enviar
    limpiarCarrito();
    
    // Abrir WhatsApp
    window.open(urlWhatsApp, '_blank');
}

function validarFormularioCheckout(datos) {
    const { clienteNombre, clienteTelefono, clienteEmail, clienteDireccion } = datos;
    
    if (!clienteNombre || !clienteTelefono || !clienteEmail || !clienteDireccion) {
        mostrarNotificacion('Por favor, completa todos los campos requeridos');
        return false;
    }
    
    // Validar teléfono peruano
    const phoneRegex = /^9\d{8}$/;
    const telefonoLimpio = clienteTelefono.replace(/\D/g, '');
    if (!phoneRegex.test(telefonoLimpio)) {
        mostrarNotificacion('Por favor, ingresa un número de teléfono peruano válido (9 dígitos)');
        return false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clienteEmail)) {
        mostrarNotificacion('Por favor, ingresa un email válido');
        return false;
    }
    
    return true;
}

function crearMensajeWhatsApp(datosCliente) {
    const subtotal = carritoItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal >= 50 ? 0 : 8;
    const total = subtotal + delivery;
    
    let mensaje = `¡Hola! Quiero hacer un pedido:\n\n`;
    mensaje += `*DATOS DEL CLIENTE:*\n`;
    mensaje += `👤 Nombre: ${datosCliente.clienteNombre}\n`;
    mensaje += `📞 Teléfono: ${datosCliente.clienteTelefono}\n`;
    mensaje += `📧 Email: ${datosCliente.clienteEmail}\n`;
    mensaje += `📍 Dirección: ${datosCliente.clienteDireccion}\n`;
    mensaje += `💳 Método de pago: ${datosCliente.metodoPago}\n\n`;
    
    mensaje += `*PEDIDO:*\n`;
    carritoItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        mensaje += `• ${item.productName} - ${item.quantity} x S/ ${item.price.toFixed(2)} = S/ ${itemTotal.toFixed(2)}\n`;
    });
    
    mensaje += `\n*RESUMEN DE PAGO:*\n`;
    mensaje += `Subtotal: S/ ${subtotal.toFixed(2)}\n`;
    mensaje += `Delivery: ${delivery === 0 ? 'GRATIS' : `S/ ${delivery.toFixed(2)}`}\n`;
    mensaje += `*TOTAL: S/ ${total.toFixed(2)}*\n\n`;
    
    if (datosCliente.observaciones) {
        mensaje += `*OBSERVACIONES:*\n${datosCliente.observaciones}\n\n`;
    }
    
    mensaje += `¡Gracias! 🍸`;
    
    return mensaje;
}

function getCategoryName(category) {
    const categories = {
        'combinaciones': 'Combinaciones',
        'vocks': 'Vodka',
        'licores': 'Licores',
        'ron': 'Ron',
        'whisky': 'Whisky',
        'cerveza': 'Cerveza',
        'preparados': 'Tragos Preparados',
        'cigarros': 'Cigarros'
    };
    return categories[category] || category;
}

function mostrarNotificacion(mensaje) {
    const notification = document.getElementById('notification');
    notification.textContent = mensaje;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}