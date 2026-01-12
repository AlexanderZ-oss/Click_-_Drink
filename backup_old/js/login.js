const API_BASE = 'http://localhost:5000/api';

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    actualizarContadorCarrito();
    setupEventListeners();
    
    // Verificar si ya está logueado
    if (localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'admin.html';
    }
});

function setupEventListeners() {
    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            loginAdmin();
        });
    }
}

async function loginAdmin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Validar campos
    if (!username || !password) {
        mostrarNotificacion('Por favor, completa todos los campos');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Login exitoso
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminUser', data.user);
            mostrarNotificacion(`¡Bienvenido ${data.user}! Redirigiendo al panel...`);
            
            // Redirigir después de un breve delay
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
        } else {
            // Credenciales incorrectas
            mostrarNotificacion(data.error || 'Credenciales incorrectas');
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarNotificacion('Error de conexión con el servidor');
    }
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