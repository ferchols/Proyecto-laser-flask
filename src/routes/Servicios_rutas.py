from flask import Blueprint, render_template

# Crear el Blueprint
Servicios_rutas = Blueprint('Servicios_rutas', __name__)

# Definir la ruta para /services
@Servicios_rutas.route('/services')
def services():
    return render_template('Servicios.html')