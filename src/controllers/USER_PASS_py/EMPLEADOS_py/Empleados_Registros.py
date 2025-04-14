import matplotlib.pyplot as plt
import io
import base64
from config import connect_db  # Importar la función de conexión desde config.py

def obtener_registros_empleados():
    """
    Obtiene los registros de los empleados desde la base de datos.
    """
    try:
        # Conexión a la base de datos
        conn = connect_db('ELMM_BIOMETRIC')  # Usar la base de datos correcta
        if conn is None:
            raise Exception("No se pudo conectar a la base de datos")
        
        cursor = conn.cursor()
        
        # Consulta para obtener los registros
        cursor.execute("SELECT fecha, horas_trabajadas FROM registros_empleados ORDER BY fecha")
        registros = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return registros
    except Exception as e:
        print(f"Error en obtener_registros_empleados: {str(e)}")
        return []

def generar_grafica(registros):
    """
    Genera una gráfica a partir de los registros de empleados.
    """
    if not registros:
        return None  # Si no hay registros, retornar None
    
    # Procesar los datos para la gráfica
    fechas = [registro[0] for registro in registros]
    horas_trabajadas = [registro[1] for registro in registros]
    
    # Generar la gráfica
    plt.figure(figsize=(10, 5))
    plt.plot(fechas, horas_trabajadas, marker='o')
    plt.title('Registros de Horas Trabajadas')
    plt.xlabel('Fecha')
    plt.ylabel('Horas Trabajadas')
    plt.grid(True)
    
    # Guardar la gráfica en un buffer
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    imagen_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    buf.close()
    
    return imagen_base64


