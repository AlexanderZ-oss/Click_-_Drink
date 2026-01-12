from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Archivo de base de datos
DB_FILE = 'backend/database.json'

def load_database():
    os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
    
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return get_default_database()
    return get_default_database()

def get_default_database():
    return {
        'products': [
            {
                "id": 1,
                "name": "Smirnoff",
                "price": 33,
                "category": "vodka",
                "image": "https://images.unsplash.com/photo-1578001265125-ea67e0f4add0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                "description": "Vodka premium de alta calidad",
                "stock": 15,
                "dateAdded": "2024-01-01T00:00:00"
            },
            {
                "id": 2,
                "name": "Barcelo Añejo",
                "price": 47,
                "category": "ron",
                "image": "https://images.unsplash.com/photo-1578001265125-ea67e0f4add0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                "description": "Ron añejo de República Dominicana",
                "stock": 10,
                "dateAdded": "2024-01-01T00:00:00"
            }
        ],
        'users': [],
        'contacts': [],
        'carritos': [],
        'admins': [
            {'username': 'lenin', 'password': 'lenin123'},
            {'username': 'keyner', 'password': 'keyner123'},
            {'username': 'airson', 'password': 'airson123'},
            {'username': 'pedrito', 'password': 'pedrito123'}
        ]
    }

def save_database(data):
    os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# ========== RUTAS DE AUTENTICACIÓN ==========
@app.route('/api/auth/check', methods=['GET'])
def check_auth():
    return jsonify({
        'authenticated': True,
        'user': {'role': 'admin', 'username': 'admin'}
    })

@app.route('/api/auth/logout', methods=['POST'])
def admin_logout():
    return jsonify({'message': 'Logout exitoso'})

# ========== RUTAS DE ADMINISTRACIÓN ==========
@app.route('/api/admin/stats', methods=['GET'])
def admin_stats():
    db = load_database()
    
    stats = {
        'total_products': len(db.get('products', [])),
        'active_products': len(db.get('products', [])),
        'total_users': len(db.get('users', [])),
        'low_stock_products': len([p for p in db.get('products', []) if p.get('stock', 0) < 5])
    }
    
    return jsonify({'stats': stats})

@app.route('/api/admin/products', methods=['GET'])
def admin_products():
    db = load_database()
    products = []
    
    for product in db.get('products', []):
        products.append({
            'id': product['id'],
            'name': product['name'],
            'price': product['price'],
            'category': product.get('category', 'otros'),
            'stock': product.get('stock', 0),
            'active': True,
            'description': product.get('description', '')
        })
    
    return jsonify({'products': products})

@app.route('/api/admin/users', methods=['GET'])
def admin_users():
    db = load_database()
    users = []
    
    for user in db.get('users', []):
        users.append({
            'id': user['id'],
            'username': user.get('name', user['email']),
            'full_name': user.get('name', ''),
            'email': user['email'],
            'role': 'user',
            'created_at': user.get('dateRegistered', '')
        })
    
    return jsonify({'users': users})

@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    db = load_database()
    initial_count = len(db.get('users', []))
    db['users'] = [u for u in db.get('users', []) if u['id'] != user_id]
    
    if len(db.get('users', [])) == initial_count:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    save_database(db)
    return jsonify({'message': 'Usuario eliminado correctamente'})

@app.route('/api/admin/products/<int:product_id>', methods=['DELETE'])
def admin_delete_product(product_id):
    return delete_product(product_id)

# ========== RUTAS DE PRODUCTOS ==========
@app.route('/api/products', methods=['GET'])
def get_products():
    db = load_database()
    return jsonify(db['products'])

@app.route('/api/products', methods=['POST'])
def add_product():
    db = load_database()
    product = request.json
    
    if not product or 'name' not in product or 'price' not in product:
        return jsonify({'error': 'Nombre y precio son requeridos'}), 400
    
    # Generar ID único
    new_id = max([p['id'] for p in db['products']], default=0) + 1
    
    new_product = {
        'id': new_id,
        'name': product['name'],
        'price': float(product['price']),
        'category': product.get('category', 'otros'),
        'image': product.get('image', ''),
        'description': product.get('description', ''),
        'stock': product.get('stock', 10),
        'dateAdded': datetime.now().isoformat()
    }
    
    db['products'].append(new_product)
    save_database(db)
    return jsonify(new_product), 201

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    db = load_database()
    product_data = request.json
    
    for product in db['products']:
        if product['id'] == product_id:
            # Actualizar campos permitidos
            if 'name' in product_data:
                product['name'] = product_data['name']
            if 'price' in product_data:
                product['price'] = float(product_data['price'])
            if 'category' in product_data:
                product['category'] = product_data['category']
            if 'image' in product_data:
                product['image'] = product_data['image']
            if 'description' in product_data:
                product['description'] = product_data['description']
            if 'stock' in product_data:
                product['stock'] = int(product_data['stock'])
            
            save_database(db)
            return jsonify(product)
    
    return jsonify({'error': 'Producto no encontrado'}), 404

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    db = load_database()
    initial_count = len(db['products'])
    db['products'] = [p for p in db['products'] if p['id'] != product_id]
    
    if len(db['products']) == initial_count:
        return jsonify({'error': 'Producto no encontrado'}), 404
    
    save_database(db)
    return jsonify({'message': 'Producto eliminado correctamente'})

# ========== RUTAS DE CARRITO ==========
@app.route('/api/carrito', methods=['GET'])
def get_carrito():
    db = load_database()
    return jsonify(db.get('carritos', []))

@app.route('/api/carrito', methods=['POST'])
def add_to_carrito():
    db = load_database()
    item_data = request.json
    
    if not item_data or 'productId' not in item_data:
        return jsonify({'error': 'ID de producto requerido'}), 400
    
    # Buscar producto
    product = next((p for p in db['products'] if p['id'] == item_data['productId']), None)
    if not product:
        return jsonify({'error': 'Producto no encontrado'}), 404
    
    # Crear item de carrito
    new_item = {
        'id': len(db.get('carritos', [])) + 1,
        'productId': item_data['productId'],
        'productName': product['name'],
        'price': product['price'],
        'quantity': item_data.get('quantity', 1),
        'image': product.get('image', ''),
        'addedDate': datetime.now().isoformat()
    }
    
    if 'carritos' not in db:
        db['carritos'] = []
    db['carritos'].append(new_item)
    save_database(db)
    
    return jsonify(new_item), 201

@app.route('/api/carrito/<int:item_id>', methods=['DELETE'])
def delete_from_carrito(item_id):
    db = load_database()
    initial_count = len(db.get('carritos', []))
    db['carritos'] = [item for item in db.get('carritos', []) if item['id'] != item_id]
    
    if len(db.get('carritos', [])) == initial_count:
        return jsonify({'error': 'Item no encontrado'}), 404
    
    save_database(db)
    return jsonify({'message': 'Item eliminado del carrito'})

@app.route('/api/carrito/clear', methods=['DELETE'])
def clear_carrito():
    db = load_database()
    db['carritos'] = []
    save_database(db)
    return jsonify({'message': 'Carrito limpiado'})

# ========== RUTAS DE USUARIOS ==========
@app.route('/api/users', methods=['GET'])
def get_users():
    db = load_database()
    return jsonify(db['users'])

@app.route('/api/users/register', methods=['POST'])
def register_user():
    db = load_database()
    user_data = request.json
    
    if not user_data or 'email' not in user_data or 'password' not in user_data:
        return jsonify({'error': 'Email y contraseña requeridos'}), 400
    
    # Verificar si el usuario ya existe
    if any(u['email'] == user_data['email'] for u in db['users']):
        return jsonify({'error': 'El usuario ya existe'}), 400
    
    new_user = {
        'id': len(db['users']) + 1,
        'name': user_data.get('name', ''),
        'email': user_data['email'],
        'password': user_data['password'],
        'dateRegistered': datetime.now().isoformat()
    }
    
    db['users'].append(new_user)
    save_database(db)
    
    # No devolver la contraseña
    user_response = {k: v for k, v in new_user.items() if k != 'password'}
    return jsonify({'message': 'Usuario registrado', 'user': user_response}), 201

@app.route('/api/users/login', methods=['POST'])
def login_user():
    db = load_database()
    credentials = request.json
    
    if not credentials or 'email' not in credentials or 'password' not in credentials:
        return jsonify({'error': 'Email y contraseña requeridos'}), 400
    
    user = next((u for u in db['users'] if u['email'] == credentials['email'] and u['password'] == credentials['password']), None)
    
    if user:
        # No devolver la contraseña
        user_response = {k: v for k, v in user.items() if k != 'password'}
        return jsonify({'message': 'Login exitoso', 'user': user_response})
    else:
        return jsonify({'error': 'Credenciales inválidas'}), 401

# ========== RUTAS PARA ADMINISTRADORES ==========
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    db = load_database()
    credentials = request.json
    
    if not credentials or 'username' not in credentials or 'password' not in credentials:
        return jsonify({'error': 'Usuario y contraseña requeridos'}), 400
    
    admin = next((a for a in db['admins'] if a['username'] == credentials['username'] and a['password'] == credentials['password']), None)
    
    if admin:
        return jsonify({
            'message': 'Login de administrador exitoso', 
            'user': credentials['username'],
            'role': 'admin'
        })
    else:
        return jsonify({'error': 'Credenciales de administrador inválidas'}), 401

# ========== RUTA PARA CONTACTO ==========
@app.route('/api/contacto', methods=['POST'])
def contacto():
    db = load_database()
    contacto_data = request.json
    
    required_fields = ['tipoConsulta', 'nombre', 'telefono', 'email', 'mensaje']
    if not contacto_data or any(field not in contacto_data for field in required_fields):
        return jsonify({'error': 'Todos los campos requeridos deben ser completados'}), 400
    
    new_contacto = {
        'id': len(db.get('contacts', [])) + 1,
        'tipoConsulta': contacto_data['tipoConsulta'],
        'nombre': contacto_data['nombre'],
        'telefono': contacto_data['telefono'],
        'email': contacto_data['email'],
        'direccion': contacto_data.get('direccion', ''),
        'mensaje': contacto_data['mensaje'],
        'fecha': datetime.now().isoformat(),
        'leido': False
    }
    
    if 'contacts' not in db:
        db['contacts'] = []
    db['contacts'].append(new_contacto)
    save_database(db)
    
    return jsonify({'message': 'Mensaje enviado exitosamente'}), 201

@app.route('/api/contactos', methods=['GET'])
def get_contactos():
    db = load_database()
    return jsonify(db.get('contacts', []))

# ========== ESTADÍSTICAS ==========
@app.route('/api/stats', methods=['GET'])
def get_stats():
    db = load_database()
    
    stats = {
        'totalProducts': len(db.get('products', [])),
        'totalUsers': len(db.get('users', [])),
        'totalContacts': len(db.get('contacts', [])),
        'totalCarrito': len(db.get('carritos', [])),
        'unreadContacts': len([c for c in db.get('contacts', []) if not c.get('leido', False)])
    }
    
    return jsonify(stats)

# ========== RUTA DE SALUD ==========
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK', 
        'message': 'Servidor funcionando correctamente',
        'timestamp': datetime.now().isoformat()
    })

# Servir archivos estáticos
@app.route('/admin.html')
def serve_admin():
    return app.send_static_file('admin.html')

if __name__ == '__main__':
    # Crear directorio y archivo de base de datos al iniciar
    os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
    if not os.path.exists(DB_FILE):
        save_database(get_default_database())
        print("Base de datos inicializada")
    
    print("Servidor iniciado en http://localhost:5000")
    print("Credenciales de administrador:")
    print(" - Usuario: lenin | Contraseña: lenin123")
    print(" - Usuario: keyner | Contraseña: keyner123")
    print(" - Usuario: airson | Contraseña: airson123")
    print(" - Usuario: pedrito | Contraseña: pedrito123")
    app.run(debug=True, port=5000, host='0.0.0.0')