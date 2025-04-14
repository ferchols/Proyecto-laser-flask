# src/app.py
import os
import pyodbc
from flask import Flask
from .routes.Tienda_rutas import Tienda_rutas
from .routes import Inicio_rutas  # ✅ 
from .routes import Servicios_rutas # ✅ 
from .routes import Contactanos_rutas # ✅ 
from .routes import Login_rutas # ✅ 
from .routes.USER_PASS_RUTAS.EMPLEADOS_RUTAS.Empleados_rutas import Empleados_rutas
# from routes.Usuarios_rutas import Usuarios_rutas  # ✅ se borro Usuarios_rutas.py
from routes.USER_PASS_RUTAS.CLIENTES_RUTAS.Clientes_rutas import Clientes_rutas # ✅ 
from config import SECRET_KEY

app = Flask(__name__, template_folder='templates', static_folder='static')
app.secret_key = SECRET_KEY

# Registrar los Blueprints
app.register_blueprint(Inicio_rutas)  # ✅ Registrar rutas principales
app.register_blueprint(Tienda_rutas)
app.register_blueprint(Servicios_rutas)
app.register_blueprint(Contactanos_rutas)
app.register_blueprint(Login_rutas)
# app.register_blueprint(Usuarios_rutas) #se borro Usuarios_rutas.py
app.register_blueprint(Clientes_rutas, url_prefix='/Clientes_rutas')
app.register_blueprint(Empleados_rutas)


if __name__ == '__main__':
    #  app.run(debug=True)
     app.run(debug=False, use_reloader=True, host="0.0.0.0", port=8443)