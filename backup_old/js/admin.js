// Configuración
const API_BASE = 'http://localhost:5000/api';

// Estado de la aplicación
let currentSection = 'dashboard';

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
});

function initializeAdminPanel() {
    checkAuthentication();
    setupEventListeners();
}

function setupEventListeners() {
    // Formulario de login
    document.getElementById('loginForm').addEventListener('submit', login);
    
    // Navegación por defecto
    showSection('dashboard');
}

// ========== AUTENTICACIÓN ==========
async function checkAuthentication() {
    try {
        const response = await fetch(`${API_BASE}/auth/check`);
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.authenticated && data.user.role === 'admin') {
                showAdminPanel();
                loadDashboard();
            } else {
                showLoginScreen();
            }
        } else {
            showLoginScreen();
        }
    } catch (error) {
        console.log('No autenticado, mostrando login');
        showLoginScreen();
    }
}

async function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');
    
    // Limpiar error anterior
    errorElement.style.display = 'none';
    
    // Validación básica
    if (!username || !password) {
        errorElement.textContent = 'Por favor complete todos los campos';
        errorElement.style.display = 'block';
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
            // Guardar en localStorage para mantener la sesión
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminUser', data.user);
            
            showAdminPanel();
            loadDashboard();
            showNotification('Login exitoso', 'success');
        } else {
            errorElement.textContent = data.error || 'Credenciales incorrectas';
            errorElement.style.display = 'block';
        }
    } catch (error) {
        errorElement.textContent = 'Error de conexión con el servidor';
        errorElement.style.display = 'block';
        console.error('Error de login:', error);
    }
}

async function logout() {
    if (confirm('¿Está seguro de que desea cerrar sesión?')) {
        try {
            await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
        } catch (error) {
            console.log('Error en logout:', error);
        } finally {
            // Limpiar localStorage y redirigir
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminUser');
            showLoginScreen();
            showNotification('Sesión cerrada correctamente', 'info');
        }
    }
}

// ========== INTERFAZ DE USUARIO ==========
function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
    // Limpiar formulario
    document.getElementById('loginForm').reset();
}

function showAdminPanel() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    
    // Mostrar nombre de usuario
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
        document.getElementById('adminUsername').textContent = adminUser;
    }
}

function showSection(sectionName) {
    currentSection = sectionName;
    
    // Ocultar todas las secciones
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('productsSection').style.display = 'none';
    document.getElementById('usersSection').style.display = 'none';
    
    // Remover activo de todos los links
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.style.background = 'transparent';
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(sectionName + 'Section').style.display = 'block';
    
    // Resaltar link activo
    const activeLink = document.getElementById(sectionName + 'Link');
    if (activeLink) {
        activeLink.style.background = 'rgba(212, 175, 55, 0.2)';
    }
    
    // Cargar datos si es necesario
    switch(sectionName) {
        case 'products':
            loadProducts();
            break;
        case 'dashboard':
            loadDashboard();
            break;
        case 'users':
            loadUsers();
            break;
    }
}

// ========== DASHBOARD ==========
async function loadDashboard() {
    try {
        const statsGrid = document.getElementById('statsGrid');
        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">...</div>
                <div>Cargando...</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">...</div>
                <div>Cargando...</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">...</div>
                <div>Cargando...</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">...</div>
                <div>Cargando...</div>
            </div>
        `;
        
        const response = await fetch(`${API_BASE}/admin/stats`);
        const data = await response.json();
        
        if (response.ok) {
            const stats = data.stats;
            statsGrid.innerHTML = `
                <div class="stat-card">
                    <div class="stat-number">${stats.total_products}</div>
                    <div>Total Productos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.active_products}</div>
                    <div>Productos Activos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.total_users}</div>
                    <div>Usuarios Registrados</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.low_stock_products}</div>
                    <div>Stock Bajo</div>
                </div>
            `;
        } else {
            throw new Error(data.error || 'Error al cargar estadísticas');
        }
    } catch (error) {
        console.error('Error cargando dashboard:', error);
        document.getElementById('statsGrid').innerHTML = `
            <div class="stat-card">
                <div class="stat-number">0</div>
                <div>Total Productos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">0</div>
                <div>Productos Activos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">0</div>
                <div>Usuarios Registrados</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">0</div>
                <div>Stock Bajo</div>
            </div>
        `;
        showNotification('Error al cargar estadísticas', 'error');
    }
}

// ========== GESTIÓN DE PRODUCTOS ==========
async function loadProducts() {
    try {
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = '<div class="loading-card"><h3>Cargando productos...</h3><p>Espere por favor</p></div>';
        
        const response = await fetch(`${API_BASE}/admin/products`);
        const data = await response.json();
        
        if (response.ok) {
            let productsHTML = '';
            
            if (data.products && data.products.length > 0) {
                data.products.forEach(product => {
                    productsHTML += `
                        <div class="product-card">
                            <h3>${product.name}</h3>
                            <p><strong>Precio:</strong> S/ ${product.price}</p>
                            <p><strong>Categoría:</strong> ${product.category}</p>
                            <p><strong>Stock:</strong> ${product.stock}</p>
                            <p><strong>Estado:</strong> ${product.active ? 'Activo' : 'Inactivo'}</p>
                            ${product.description ? `<p><strong>Descripción:</strong> ${product.description}</p>` : ''}
                            <div class="product-actions">
                                <button class="btn-edit" onclick="editProduct(${product.id})">Editar</button>
                                <button class="btn-delete" onclick="deleteProduct(${product.id})">Eliminar</button>
                            </div>
                        </div>
                    `;
                });
            } else {
                productsHTML = `
                    <div class="loading-card">
                        <h3>No hay productos registrados</h3>
                        <p>Agrega el primer producto para comenzar</p>
                    </div>
                `;
            }
            
            productsGrid.innerHTML = productsHTML;
        } else {
            throw new Error(data.error || 'Error al cargar productos');
        }
    } catch (error) {
        console.error('Error cargando productos:', error);
        document.getElementById('productsGrid').innerHTML = `
            <div class="loading-card">
                <h3>Error al cargar productos</h3>
                <p>${error.message}</p>
            </div>
        `;
        showNotification('Error al cargar productos', 'error');
    }
}

async function deleteProduct(productId) {
    if (confirm('¿Está seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
        try {
            const response = await fetch(`${API_BASE}/admin/products/${productId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showNotification('Producto eliminado exitosamente', 'success');
                loadProducts();
                loadDashboard(); // Actualizar stats
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Error al eliminar producto');
            }
        } catch (error) {
            console.error('Error eliminando producto:', error);
            showNotification('Error al eliminar producto: ' + error.message, 'error');
        }
    }
}

// ========== GESTIÓN DE USUARIOS ==========
async function loadUsers() {
    try {
        const usersGrid = document.getElementById('usersGrid');
        usersGrid.innerHTML = '<div class="loading-card"><h3>Cargando usuarios...</h3><p>Espere por favor</p></div>';
        
        const response = await fetch(`${API_BASE}/admin/users`);
        const data = await response.json();
        
        if (response.ok) {
            let usersHTML = '';
            
            if (data.users && data.users.length > 0) {
                let hasRegularUsers = false;
                
                data.users.forEach(user => {
                    // Mostrar solo usuarios normales, no administradores
                    if (user.role === 'user') {
                        hasRegularUsers = true;
                        usersHTML += `
                            <div class="user-card">
                                <h3>${user.username}</h3>
                                <p><strong>Nombre:</strong> ${user.full_name || 'No especificado'}</p>
                                <p><strong>Email:</strong> ${user.email}</p>
                                <p><strong>Registro:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
                                <p><strong>Rol:</strong> ${user.role}</p>
                                <div class="user-actions">
                                    <button class="btn-delete" onclick="deleteUser(${user.id})">Eliminar Usuario</button>
                                </div>
                            </div>
                        `;
                    }
                });
                
                if (!hasRegularUsers) {
                    usersHTML = `
                        <div class="loading-card">
                            <h3>No hay usuarios registrados</h3>
                            <p>Los usuarios aparecerán aquí cuando se registren</p>
                        </div>
                    `;
                }
            } else {
                usersHTML = `
                    <div class="loading-card">
                        <h3>No hay usuarios registrados</h3>
                        <p>Los usuarios aparecerán aquí cuando se registren</p>
                    </div>
                `;
            }
            
            usersGrid.innerHTML = usersHTML;
        } else {
            throw new Error(data.error || 'Error al cargar usuarios');
        }
    } catch (error) {
        console.error('Error cargando usuarios:', error);
        document.getElementById('usersGrid').innerHTML = `
            <div class="loading-card">
                <h3>Error al cargar usuarios</h3>
                <p>${error.message}</p>
            </div>
        `;
        showNotification('Error al cargar usuarios', 'error');
    }
}

async function deleteUser(userId) {
    if (confirm('¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
        try {
            const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showNotification('Usuario eliminado exitosamente', 'success');
                loadUsers(); // Recargar la lista
                loadDashboard(); // Actualizar stats
            } else {
                throw new Error(data.error || 'Error al eliminar usuario');
            }
        } catch (error) {
            console.error('Error eliminando usuario:', error);
            showNotification('Error al eliminar usuario: ' + error.message, 'error');
        }
    }
}

// ========== FUNCIONES AUXILIARES ==========
function showAddProductForm() {
    showNotification('Funcionalidad para agregar producto - Próximamente', 'info');
}

function editProduct(productId) {
    showNotification(`Editar producto ${productId} - Próximamente`, 'info');
}

function showNotification(message, type = 'info') {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Estilos según el tipo
    switch(type) {
        case 'success':
            notification.style.background = '#27ae60';
            break;
        case 'error':
            notification.style.background = '#e74c3c';
            break;
        case 'warning':
            notification.style.background = '#f39c12';
            break;
        default:
            notification.style.background = '#3498db';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Animaciones CSS para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);