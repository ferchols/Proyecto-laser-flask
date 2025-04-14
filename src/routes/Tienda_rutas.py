from flask import Blueprint, render_template, session, request, jsonify
from src.controllers.Tienda import get_all_products, get_product_details

# Crear un Blueprint para las rutas de la tienda
Tienda_rutas = Blueprint('Tienda_rutas', __name__, url_prefix='/tienda')

# Ruta para la tienda (página principal)
@Tienda_rutas.route('/tienda')
def tienda():
    productos = get_all_products()  # Obtener todos los productos de la tienda
    return render_template('Tienda_HTML/Tienda.html', productos=productos)

# Ruta para el carrito
@Tienda_rutas.route('/carrito')
def carrito():
    cart_items = len(session.get('cart', []))  # Número de productos en el carrito
    return render_template('TIENDA_HTML/CLIENTE_home.html', cart_items=cart_items)

# Ruta para actualizar el carrito
@Tienda_rutas.route('/update-cart', methods=['POST'])
def update_cart():
    cart = request.json.get('cart', [])
    session['cart'] = cart  # Almacenar carrito en la sesión
    return jsonify({'message': 'Carrito actualizado', 'cart_size': len(cart)})

# Ruta para un producto específico (ej. Boston 125ml)
@Tienda_rutas.route('/<product_id>')
def product_detail(product_id):
    producto = get_product_details(product_id)
    return render_template('Tienda_HTML/BOSTON_125ML/Boston_125ml.html', producto=producto)
