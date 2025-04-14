# src/config.py
from dotenv import load_dotenv
import os
import pyodbc

load_dotenv()  # Carga las variables de .env

# Configuración general
SECRET_KEY = os.getenv('SECRET_KEY')

# Parámetros de conexión
DB_CONFIG = {
    'server': os.getenv('DB_SERVER'),
    'username': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'driver': '{SQL Server}'
}

# Función para conectar a bases de datos
def connect_db(database):
    try:
        connection = pyodbc.connect(
            f'DRIVER={DB_CONFIG["driver"]};'
            f'SERVER={DB_CONFIG["server"]};'
            f'DATABASE={database};'
            f'UID={DB_CONFIG["username"]};'
            f'PWD={DB_CONFIG["password"]};'
            'TrustServerCertificate=yes;'
        )
        print(f"Conexión exitosa a {database}")
        return connection
    except Exception as e:
        print(f"Error al conectar a {database}:", str(e))
        return None

# Conexiones a las bases de datos
conn_users = connect_db('BioTimePro')
conn_sae90empre01 = connect_db('SAE90EMPRE01')
conn_sae80empre01 = connect_db('SAE80EMPRE01')
conn_sae80empre02 = connect_db('SAE80EMPRE02')
conn_sae90empre02 = connect_db('SAE90EMPRE02')
conn_clients = connect_db('SAE90EMPRE01')
conn_admins = connect_db('GRUPO-LASER')
conn_biometrico = connect_db('BioTimePro')
conn_propia  = connect_db('ELMM_BIOMETRIC')
