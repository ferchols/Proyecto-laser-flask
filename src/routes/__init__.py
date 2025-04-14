from flask import Blueprint
from src.controllers.Home import home  # Importamos la vista home
from .Tienda_rutas import Tienda_rutas
from .Servicios_rutas import Servicios_rutas
from .Contactanos_rutas import Contactanos_rutas
from .Login_rutas import Login_rutas


Inicio_rutas = Blueprint('Inicio', __name__)


# Registramos las rutas
Inicio_rutas.add_url_rule('/', 'home', home)

# Registro del blueprint de Tienda
Inicio_rutas.register_blueprint(Tienda_rutas)