// Datos de productos para la licorería (precios en Soles)
const products = [
    // Combinaciones
    {
        id: 1,
        name: "Gaseosa Everest",
        price: 8,
        category: "combinaciones",
        image: "https://images.unsplash.com/photo-1624517452481-1faf733d19c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Gaseosa para combinar con tus tragos favoritos"
    },
    {
        id: 2,
        name: "Gaseosa Coca Cola",
        price: 8,
        category: "combinaciones",
        image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Refresco ideal para mezclar"
    },
    {
        id: 3,
        name: "Red Bull",
        price: 8,
        category: "combinaciones",
        image: "https://images.unsplash.com/photo-1603398938373-e54da0bb5e48?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Energizante para tus combinaciones"
    },
    // Vodkas
    {
        id: 4,
        name: "Smirnoff",
        price: 33,
        category: "vocks",
        image: "https://images.unsplash.com/photo-1578001265125-ea67e0f4add0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Vodka premium de alta calidad"
    },
    {
        id: 5,
        name: "Russ Kaya",
        price: 27,
        category: "vocks",
        image: "https://images.unsplash.com/photo-1544145945-9452c3a8c8a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Vodka suave con caracter único"
    },
    {
        id: 6,
        name: "Skyy",
        price: 47,
        category: "vocks",
        image: "https://images.unsplash.com/photo-1578001265125-ea67e0f4add0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Vodka americano premium"
    },
    // Licores
    {
        id: 7,
        name: "Jagermeister",
        price: 80,
        category: "licores",
        image: "https://images.unsplash.com/photo-1578001265125-ea67e0f4add0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Licor de hierbas alemán"
    },
    // Rones
    {
        id: 8,
        name: "Barcelo Añejo",
        price: 47,
        category: "ron",
        image: "https://images.unsplash.com/photo-1578001265125-ea67e0f4add0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Ron añejo de República Dominicana"
    },
    {
        id: 9,
        name: "Cartablo",
        price: 29,
        category: "ron",
        image: "https://images.unsplash.com/photo-1578001265125-ea67e0f4add0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Ron con sabor característico"
    },
    // Whisky
    {
        id: 10,
        name: "Old Time",
        price: 25,
        category: "whisky",
        image: "https://images.unsplash.com/photo-1578001265125-ea67e0f4add0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Whisky económico y de calidad"
    },
    // Cervezas
    {
        id: 11,
        name: "Coronita",
        price: 23,
        category: "cerveza",
        image: "https://images.unsplash.com/photo-1571613316887-6f8d5cbf0826?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Cerveza mexicana en botella pequeña"
    },
    {
        id: 12,
        name: "Corona",
        price: 32,
        category: "cerveza",
        image: "https://images.unsplash.com/photo-1571613316887-6f8d5cbf0826?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Cerveza mexicana premium"
    },
    {
        id: 13,
        name: "Pilsen Lata",
        price: 31,
        category: "cerveza",
        image: "https://images.unsplash.com/photo-1571613316887-6f8d5cbf0826?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Cerveza nacional en lata"
    },
    {
        id: 14,
        name: "Pilsen Botella",
        price: 29,
        category: "cerveza",
        image: "https://images.unsplash.com/photo-1571613316887-6f8d5cbf0826?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Cerveza nacional en botella"
    },
    // Tragos Preparados
    {
        id: 15,
        name: "Mikes",
        price: 31,
        category: "preparados",
        image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Trago preparado listo para beber"
    },
    {
        id: 16,
        name: "Smirnoff Ice",
        price: 9,
        category: "preparados",
        image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Bebida refrescante con vodka"
    },
    {
        id: 17,
        name: "Four Loko",
        price: 12,
        category: "preparados",
        image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Bebida energética con alcohol"
    },
    // Cigarros
    {
        id: 18,
        name: "Cigarros Canela",
        price: 9,
        category: "cigarros",
        image: "https://images.unsplash.com/photo-1603398748227-6f8d5cbf0826?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Cigarros con sabor a canela"
    },
    {
        id: 19,
        name: "Cigarros Llurix",
        price: 8,
        category: "cigarros",
        image: "https://images.unsplash.com/photo-1603398748227-6f8d5cbf0826?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Cigarros premium"
    }
];

// Combos predefinidos
const combos = {
    'jager-redbull': {
        name: 'Combo Jager + Red Bull',
        items: [
            { productId: 7, quantity: 1 }, // Jagermeister
            { productId: 3, quantity: 1 }  // Red Bull
        ],
        price: 80
    },
    'ron-cocacola': {
        name: 'Combo Ron + Coca Cola',
        items: [
            { productId: 8, quantity: 1 }, // Barcelo Añejo
            { productId: 2, quantity: 1 }  // Coca Cola
        ],
        price: 50
    },
    'vodka-everest': {
        name: 'Combo Vodka + Everest',
        items: [
            { productId: 4, quantity: 1 }, // Smirnoff
            { productId: 1, quantity: 1 }  // Everest
        ],
        price: 36
    },
    'fiesta': {
        name: 'Combo Fiesta',
        items: [
            { productId: 4, quantity: 1 }, // Smirnoff
            { productId: 12, quantity: 6 }, // Corona (sixpack)
            { productId: 1, quantity: 2 }  // Everest
        ],
        price: 120
    },
    'premium': {
        name: 'Combo Premium',
        items: [
            { productId: 6, quantity: 1 }, // Skyy
            { productId: 8, quantity: 1 }, // Barcelo
            { productId: 12, quantity: 6 }, // Corona
            { productId: 3, quantity: 3 }  // Red Bull
        ],
        price: 180
    },
    'basico': {
        name: 'Combo Básico',
        items: [
            { productId: 9, quantity: 1 }, // Cartablo
            { productId: 14, quantity: 6 }, // Pilsen Botella
            { productId: 2, quantity: 1 }  // Coca Cola
        ],
        price: 75
    }
};

// Función para cargar productos en la página
function loadProducts(category = 'todos') {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';

    const filteredProducts = category === 'todos' 
        ? products 
        : products.filter(product => product.category === category);

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <h3>No hay productos en esta categoría</h3>
                <p>Prueba con otra categoría o vuelve más tarde</p>
            </div>
        `;
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-category">${getCategoryName(product.category)}</div>
                <div class="product-price">S/ ${product.price.toFixed(2)}</div>
                <p class="product-description">${product.description}</p>
                <div class="warning">Prohibida la venta a menores de edad</div>
                <button class="btn btn-add-cart" data-id="${product.id}">
                    🛒 Agregar al Carrito
                </button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });

    // Agregar event listeners a los botones de agregar al carrito
    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            agregarProductoAlCarrito(productId);
        });
    });
}

// Función para obtener nombre de categoría
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

// Función para agregar producto al carrito
function agregarProductoAlCarrito(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Producto no encontrado:', productId);
        return;
    }
    
    // Obtener carrito actual de localStorage
    let carrito = JSON.parse(localStorage.getItem('carritoFerest') || '[]');
    
    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.productId === productId);
    
    if (itemExistente) {
        // Incrementar cantidad si ya existe
        itemExistente.quantity += 1;
    } else {
        // Agregar nuevo item al carrito
        carrito.push({
            id: Date.now(), // ID temporal
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            category: product.category
        });
    }
    
    // Guardar en localStorage
    localStorage.setItem('carritoFerest', JSON.stringify(carrito));
    
    // Actualizar contador
    actualizarContadorCarrito();
    
    // Mostrar notificación
    mostrarNotificacion(`${product.name} agregado al carrito`);
    
    // Intentar guardar en el backend (opcional)
    guardarEnBackend(product.id, 1);
}

// Función para agregar combo al carrito
function agregarComboAlCarrito(comboId) {
    const combo = combos[comboId];
    
    if (!combo) {
        console.error('Combo no encontrado:', comboId);
        return;
    }
    
    let carrito = JSON.parse(localStorage.getItem('carritoFerest') || '[]');
    
    // Agregar cada item del combo al carrito
    combo.items.forEach(comboItem => {
        const product = products.find(p => p.id === comboItem.productId);
        if (product) {
            const itemExistente = carrito.find(item => item.productId === product.id);
            
            if (itemExistente) {
                itemExistente.quantity += comboItem.quantity;
            } else {
                carrito.push({
                    id: Date.now(),
                    productId: product.id,
                    productName: product.name,
                    price: product.price,
                    quantity: comboItem.quantity,
                    image: product.image,
                    category: product.category,
                    isComboItem: true
                });
            }
        }
    });
    
    // Guardar en localStorage
    localStorage.setItem('carritoFerest', JSON.stringify(carrito));
    
    // Actualizar contador
    actualizarContadorCarrito();
    
    // Mostrar notificación
    mostrarNotificacion(`Combo "${combo.name}" agregado al carrito`);
}

// Función para actualizar contador del carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carritoFerest') || '[]');
    const totalItems = carrito.reduce((total, item) => total + item.quantity, 0);
    
    // Actualizar en todas las páginas
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(element => {
        element.textContent = totalItems;
    });
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje) {
    const notification = document.getElementById('notification');
    notification.textContent = mensaje;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Función para guardar en el backend (opcional)
async function guardarEnBackend(productId, quantity) {
    try {
        const response = await fetch('http://localhost:5000/api/carrito', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: productId,
                quantity: quantity
            })
        });
        
        if (!response.ok) {
            console.warn('No se pudo guardar en el backend, usando localStorage');
        }
    } catch (error) {
        console.warn('Error de conexión con el backend, usando localStorage:', error);
    }
}

// Función para filtrar por categoría
function setupCategoryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const categoryCards = document.querySelectorAll('.category-card');
    const footerLinks = document.querySelectorAll('.footer-links a[data-category]');
    
    // Filtros de productos
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Actualizar botones activos
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Cargar productos de la categoría
            loadProducts(category);
        });
    });
    
    // Cards de categorías
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Actualizar botones activos
            filterBtns.forEach(b => b.classList.remove('active'));
            const targetBtn = document.querySelector(`[data-category="${category}"]`);
            if (targetBtn) {
                targetBtn.classList.add('active');
            }
            
            // Cargar productos y scroll a la sección
            loadProducts(category);
            document.getElementById('tragos').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Links del footer
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            
            // Actualizar botones activos
            filterBtns.forEach(b => b.classList.remove('active'));
            const targetBtn = document.querySelector(`[data-category="${category}"]`);
            if (targetBtn) {
                targetBtn.classList.add('active');
            }
            
            // Cargar productos y scroll a la sección
            loadProducts(category);
            document.getElementById('tragos').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Función para configurar botones de promociones y combos
function setupPromotionButtons() {
    // Botones de promociones
    document.querySelectorAll('.btn-promotion').forEach(button => {
        button.addEventListener('click', function() {
            const comboId = this.getAttribute('data-combo');
            agregarComboAlCarrito(comboId);
        });
    });
    
    // Botones de combos
    document.querySelectorAll('.btn-combo').forEach(button => {
        button.addEventListener('click', function() {
            const comboId = this.getAttribute('data-combo');
            agregarComboAlCarrito(comboId);
        });
    });
}

// Función para cargar productos del backend (opcional)
async function cargarProductosDelBackend() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
            const productosBackend = await response.json();
            if (productosBackend.length > 0) {
                // Si hay productos en el backend, actualizar la lista local
                products.length = 0;
                products.push(...productosBackend);
                loadProducts(); // Recargar productos
            }
        }
    } catch (error) {
        console.log('Usando productos locales, backend no disponible');
    }
}

// Función para inicializar la página
function init() {
    loadProducts();
    setupCategoryFilters();
    setupPromotionButtons();
    actualizarContadorCarrito();
    
    // Cargar productos del backend si están disponibles
    cargarProductosDelBackend();
    
    // Configurar scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
// Funciones de gestión de usuarios para administradores
async function loadUsers() {
    try {
        // En una implementación real, aquí llamarías a tu API para obtener usuarios
        // Por ahora simulamos datos de ejemplo
        const users = [
            { id: 1, username: 'usuario1', email: 'usuario1@email.com', role: 'user', created_at: '2024-01-01' },
            { id: 2, username: 'usuario2', email: 'usuario2@email.com', role: 'user', created_at: '2024-01-02' },
            { id: 3, username: 'cliente_premium', email: 'cliente@empresa.com', role: 'user', created_at: '2024-01-03' }
        ];
        
        let usersHTML = '';
        users.forEach(user => {
            usersHTML += `
                <div class="user-card" style="background: #2d2d2d; padding: 1rem; border-radius: 8px; border: 1px solid #444;">
                    <h4 style="color: #d4af37; margin-bottom: 0.5rem;">${user.username}</h4>
                    <p style="margin-bottom: 0.25rem;"><strong>Email:</strong> ${user.email}</p>
                    <p style="margin-bottom: 0.25rem;"><strong>Rol:</strong> ${user.role}</p>
                    <p style="margin-bottom: 1rem;"><strong>Registro:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn" style="padding: 0.5rem 1rem; background: #3498db;" onclick="editUser(${user.id})">Editar</button>
                        <button class="btn" style="padding: 0.5rem 1rem; background: #e74c3c;" onclick="deleteUser(${user.id})">Eliminar</button>
                    </div>
                </div>
            `;
        });
        
        document.getElementById('usersGrid').innerHTML = usersHTML;
    } catch (error) {
        console.error('Error cargando usuarios:', error);
    }
}

function refreshUsers() {
    loadUsers();
    alert('Lista de usuarios actualizada');
}

function editUser(userId) {
    alert(`Editando usuario ID: ${userId} - Funcionalidad en desarrollo`);
    // Aquí iría el código para editar usuario
}

function deleteUser(userId) {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
        alert(`Usuario ${userId} eliminado - Funcionalidad en desarrollo`);
        // Aquí iría el código para eliminar usuario
        refreshUsers();
    }
}

// Modificar la función loadAdminStats para incluir estadísticas de usuarios
async function loadAdminStats() {
    try {
        const response = await fetch(`${API_BASE}/admin/stats`);
        const data = await response.json();
        
        if (response.ok) {
            const stats = data.stats;
            document.getElementById('adminStats').innerHTML = `
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
            
            // Cargar la lista de usuarios cuando se muestren las stats
            loadUsers();
        }
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

// Función para gestionar productos
function manageProducts() {
    // Crear modal para gestión de productos
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="background: #1a1a1a; padding: 2rem; border-radius: 10px; width: 90%; max-width: 600px; border: 2px solid #d4af37;">
            <h2 style="color: #d4af37; margin-bottom: 1rem;">Gestión de Productos</h2>
            <p style="color: #ccc; margin-bottom: 2rem;">Funcionalidad completa en desarrollo</p>
            <div style="display: grid; gap: 1rem;">
                <button class="btn btn-primary" onclick="alert('Agregar producto - Próximamente')">Agregar Producto</button>
                <button class="btn btn-secondary" onclick="alert('Editar productos - Próximamente')">Editar Productos</button>
                <button class="btn" style="background: #e74c3c;" onclick="this.closest('.modal').remove()">Cerrar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}