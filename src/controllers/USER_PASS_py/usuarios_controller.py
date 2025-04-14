
from flask import request, session, flash, url_for, redirect, render_template
import base64
from config import conn_users, conn_clients, conn_sae80empre01, conn_sae90empre02, conn_sae80empre02, conn_admins


#1. Convertir el objeto Row a un diccionario
#Puedes convertir el objeto Row a un diccionario utilizando un enfoque como este:
def row_to_dict(row):
    if row is None:
        return None
    return dict(zip([column[0] for column in row.cursor_description], row))
# ---------------------------------------------- Funcion para Iniciar Sesion -----------------------------------------------------------

def login():
    if request.method == 'POST':
        role = request.form['role']
        username = request.form['USUARIO']
        password = request.form['PASS']

        if role == 'administrador':
            if username == 'ADMON':
                cursor_users = conn_users.cursor()
                cursor_users.execute("SELECT PASS FROM dbo.USUARIOS WHERE USUARIO = ?", (username,))
                user = cursor_users.fetchone()
                cursor_users.close()

                if user and user[0] == password:
                    session['admin'] = username
                    flash('Inicio de sesión como administrador exitoso', 'success')
                    return redirect(url_for('Login_rutas.administrador'))
                else:
                    flash('Credenciales de administrador incorrectas', 'danger')

        if role == 'empleado':
            if username == 'ADMON':
                flash('No se puede iniciar sesión como empleado con el usuario ADMON', 'danger')
            else:
                # Verificar credenciales del empleado
                cursor_users = conn_users.cursor()
                cursor_users.execute("SELECT device_password, position_id FROM dbo.personnel_employee WHERE first_name = ?", (username,))
                user = cursor_users.fetchone()
                cursor_users.close()

                if user and user[0] == password:
                    session['empleado'] = username

                    # Obtener información del empleado
                    cursor_empleados = conn_users.cursor()
                    cursor_empleados.execute("SELECT * FROM dbo.personnel_employee WHERE first_name = ?", (username,))
                    empleado_info = cursor_empleados.fetchone()
                    cursor_empleados.close()

                    if empleado_info is None:
                        flash('Empleado no encontrado', 'danger')
                        return redirect(url_for('Login_rutas.Iniciar_sesion'))

                    # Obtener el cargo del empleado
                    position_id = user[1]  # position_id es el segundo elemento en la tupla
                    cursor_position = conn_users.cursor()
                    cursor_position.execute("SELECT position_name FROM dbo.personnel_position WHERE position_code = ?", (position_id,))
                    position_info = cursor_position.fetchone()
                    cursor_position.close()

                    # Convertir los objetos Row a diccionarios
                    empleado_info_dict = row_to_dict(empleado_info)
                    position_info_dict = row_to_dict(position_info) if position_info else None

                    # Almacenar la información en la sesión
                    session['empleado_info'] = empleado_info_dict
                    session['position_info'] = position_info_dict

                    # Verificar la sesión
                    print("Sesión después de almacenar posicion_info:", session)

                    flash('Inicio de sesión como empleado exitoso', 'success')
                    return redirect(url_for('Login_rutas.empleados'))
                else:
                    flash('Empleado no encontrado o contraseña incorrecta', 'danger')

        elif role == 'cliente':
            cursor_clients = conn_clients.cursor()
            cursor_clients.execute("SELECT CLAVE FROM dbo.CLIE01 WHERE RFC = ?", (username,))
            client = cursor_clients.fetchone()
            cursor_clients.close()

            if client and client[0] == password:
                session['cliente'] = username
                flash('Inicio de sesión como cliente exitoso', 'success')

                desbloqueos = {
                    "laser_factura": False,
                    "laser_remision": False,
                    "resal_factura": False,
                    "resal_remision": False
                }

                try:
                    cursor = conn_clients.cursor()
                    cursor.execute("SELECT CLAVE FROM dbo.CLIE01 WHERE RFC = ?", (username,))
                    if cursor.fetchone():
                        desbloqueos["laser_factura"] = True

                    cursor = conn_sae80empre01.cursor()
                    cursor.execute("SELECT CLAVE FROM dbo.CLIE01 WHERE RFC = ?", (username,))
                    if cursor.fetchone():
                        desbloqueos["laser_remision"] = True

                    cursor = conn_sae90empre02.cursor()
                    cursor.execute("SELECT CLAVE FROM dbo.CLIE02 WHERE RFC = ?", (username,))
                    if cursor.fetchone():
                        desbloqueos["resal_factura"] = True

                    cursor = conn_sae80empre02.cursor()
                    cursor.execute("SELECT CLAVE FROM dbo.CLIE02 WHERE RFC = ?", (username,))
                    if cursor.fetchone():
                        desbloqueos["resal_remision"] = True

                except Exception as e:
                    print("Error al verificar el RFC:", str(e))

                session['desbloqueos'] = desbloqueos
                return redirect(url_for('Login_rutas.clientes'))
            else:
                flash('Cliente no encontrado o contraseña incorrecta', 'danger')

    return redirect(url_for('Login_rutas.Iniciar_sesion'))

# ------------------------------------------------Funcion para cerrar sesión -------------------------------------

def logout():
    session.clear()  # Cierra sesión para todos los roles
    flash('Sesión cerrada', 'info')
    return redirect(url_for('Inicio.home'))


# ----------------------------- Ruta para el Dashboard Personalizado para Usuarios Logeados ---------------------------

def rutas_empleados():
    if 'empleado' in session:
        empleado_info = session.get('empleado_info')
        position_info = session.get('position_info')
       

        print("Contenido de empleado_info:", empleado_info)
        print("Contenido de position_info:", position_info)
        
        return render_template(
            'USER_PASS/EMPLEADOS/Empleados_home.html',
            empleado_info=empleado_info,
            position_info=position_info
           
        )
    else:
        flash('Por favor, inicia sesión para acceder al dashboard', 'warning')
        return redirect(url_for('Login_rutas.Iniciar_sesion'))
    
#  ------------------------------------------ Ruta para el Dashboard de Clientes --------------------------------------------
    
def rutas_clientes():

        if 'cliente' in session:
            return render_template('USER_PASS/CLIENTES/CLIENTE_home.html')
        else:
            flash('Por favor, inicia sesión para acceder a la página de clientes', 'warning')
        return redirect(url_for('Login_rutas.Iniciar_sesion'))
    
    
#  ------------------------------------------ Ruta para el Dashboard de ADMINISTRADOR --------------------------------------------
    
def rutas_administradores():
    
    if 'admin' not in session:
        flash('Por favor, inicia sesión como administrador', 'warning')
        return redirect(url_for('Login_rutas.Iniciar_sesion'))

    # Usuarios de GRUPO-LASER
    cursor_users = conn_users.cursor()
    cursor_users.execute("SELECT * FROM dbo.USUARIOS")
    usuarios = cursor_users.fetchall()
    cursor_users.close()

    # Clientes de SAE90EMPRE01
    cursor_clients = conn_clients.cursor()
    cursor_clients.execute("SELECT * FROM dbo.CLIE01")
    clientes = cursor_clients.fetchall()
    cursor_clients.close()

    return render_template('USER_PASS/ADMINISTRADOR/Admin_home.html', usuarios=usuarios, clientes=clientes)