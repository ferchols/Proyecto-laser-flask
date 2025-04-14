from flask import Blueprint, render_template, request, redirect, url_for, session, flash
import base64
from config import conn_users, conn_clients, conn_sae80empre01, conn_sae90empre02, conn_sae80empre02, conn_admins
from controllers.USER_PASS_py.usuarios_controller import login, logout, rutas_empleados, rutas_clientes, rutas_administradores
from routes.USER_PASS_RUTAS.CLIENTES_RUTAS.Clientes_rutas import laser_factura, laser_remision, resal_factura, resal_remision



Login_rutas = Blueprint('Login_rutas', __name__)


# ------------------- Inicio de sesion -------------------

@Login_rutas.route('/login', methods=['GET', 'POST'])
def Iniciar_sesion():
    if request.method == 'POST':
        # Ejecutar la lógica de autenticación
        return login()
    # Si es GET, solo renderiza la página de login
    return render_template('USER_PASS/Login.html')


# ------------------- Finalizar de sesion -------------------

@Login_rutas.route('/logout')
def Cerrar_sesion():
    
    return logout()

    
# ------------------- Ruta para el Dashboard de Empleados -------------------
@Login_rutas.route('/EMPLEADOS')
def empleados ():
    
    return rutas_empleados()

# ------------------- Ruta para el Dashboard de Clientes -------------------
@Login_rutas.route('/CLIENTES')
def clientes():
    
    return rutas_clientes()
# ------------------- Ruta para el Dashboard de Administrador -------------------
@Login_rutas.route('/ADMINISTRADOR')
def administradores():
    return rutas_administradores()