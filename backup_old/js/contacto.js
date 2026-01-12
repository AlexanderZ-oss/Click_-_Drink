// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    actualizarContadorCarrito();
    setupEventListeners();
    setupTipoConsulta();
});

function setupEventListeners() {
    // Formulario de contacto
    const contactoForm = document.getElementById('contactoForm');
    if (contactoForm) {
        contactoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            enviarContacto();
        });
    }
}

function setupTipoConsulta() {
    const tipoConsulta = document.getElementById('tipoConsulta');
    const grupoDireccion = document.getElementById('grupoDireccion');
    
    if (tipoConsulta && grupoDireccion) {
        tipoConsulta.addEventListener('change', function() {
            if (this.value === 'pedido-especial') {
                grupoDireccion.style.display = 'block';
                // Hacer el campo dirección requerido
                const direccionInput = document.getElementById('direccion');
                if (direccionInput) {
                    direccionInput.required = true;
                }
            } else {
                grupoDireccion.style.display = 'none';
                // Remover requerido si no es pedido especial
                const direccionInput = document.getElementById('direccion');
                if (direccionInput) {
                    direccionInput.required = false;
                }
            }
        });
    }
}

function enviarContacto() {
    const formData = new FormData(document.getElementById('contactoForm'));
    const datos = Object.fromEntries(formData);
    
    // Validar formulario
    if (!validarFormularioContacto(datos)) {
        return;
    }
    
    // Enviar datos al backend
    enviarAlBackend(datos);
    
    // Mostrar mensaje de éxito
    mostrarNotificacion('Mensaje enviado correctamente. Te contactaremos pronto.');
    
    // Limpiar formulario
    document.getElementById('contactoForm').reset();
    
    // Ocultar campo dirección si estaba visible
    const grupoDireccion = document.getElementById('grupoDireccion');
    if (grupoDireccion) {
        grupoDireccion.style.display = 'none';
    }
}

function validarFormularioContacto(datos) {
    const { tipoConsulta, nombre, telefono, email, mensaje } = datos;
    
    // Validar campos requeridos
    if (!tipoConsulta || !nombre || !telefono || !email || !mensaje) {
        mostrarNotificacion('Por favor, completa todos los campos requeridos');
        return false;
    }
    
    // Validar teléfono
    const phoneRegex = /^9\d{8}$/;
    const telefonoLimpio = telefono.replace(/\D/g, '');
    if (!phoneRegex.test(telefonoLimpio)) {
        mostrarNotificacion('Por favor, ingresa un número de teléfono peruano válido (9 dígitos)');
        return false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarNotificacion('Por favor, ingresa un email válido');
        return false;
    }
    
    return true;
}

async function enviarAlBackend(datos) {
    try {
        const response = await fetch('http://localhost:5000/api/contacto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tipo: datos.tipoConsulta,
                nombre: datos.nombre,
                telefono: datos.telefono,
                email: datos.email,
                direccion: datos.direccion || '',
                mensaje: datos.mensaje,
                fecha: new Date().toISOString()
            })
        });
        
        if (response.ok) {
            console.log('Mensaje enviado al backend correctamente');
        } else {
            console.warn('No se pudo enviar al backend, pero el mensaje fue procesado localmente');
        }
    } catch (error) {
        console.warn('Error de conexión con el backend, mensaje guardado localmente:', error);
        // Guardar localmente como fallback
        guardarContactoLocal(datos);
    }
}

function guardarContactoLocal(datos) {
    const contactos = JSON.parse(localStorage.getItem('contactosFerest') || '[]');
    const nuevoContacto = {
        id: Date.now(),
        ...datos,
        fecha: new Date().toISOString(),
        leido: false
    };
    
    contactos.push(nuevoContacto);
    localStorage.setItem('contactosFerest', JSON.stringify(contactos));
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carritoFerest') || '[]');
    const totalItems = carrito.reduce((total, item) => total + item.quantity, 0);
    
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(element => {
        element.textContent = totalItems;
    });
}

function mostrarNotificacion(mensaje) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = mensaje;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    } else {
        alert(mensaje);
    }
}