from flask import render_template, Blueprint
from src.controllers.USER_PASS_py.EMPLEADOS_py.Empleados_Registros import obtener_registros_empleados, generar_grafica

Empleados_rutas = Blueprint('Empleados_rutas', __name__)


# ------SUB_PAG_REGISTROS-------------
@Empleados_rutas.route('/Empleados_registros', methods=['GET'])
def Empleados_Registros():
    # Obtener los registros de empleados
    registros = obtener_registros_empleados()
    # Generar la gráfica
    imagen_base64 = generar_grafica(registros)
    # Renderizar la plantilla con la gráfica y los registros
    return render_template('USER_PASS/EMPLEADOS/Empleados_Registros.html', imagen_base64=imagen_base64, registros=registros)

# ------SUB_PAG_REGISTROS-------------


