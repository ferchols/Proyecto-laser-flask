# controllers/store.py
from config import conn_sae90empre01  # Usamos la conexión ya definida en config.py




# ------Función para obtener todos los productos de la tienda-------------
def get_all_products():
    cursor = conn_sae90empre01.cursor()
    cursor.execute("SELECT CVE_ART, DESCR, EXIST FROM dbo.INVE01")
    productos = cursor.fetchall()
    cursor.close()

    # Convertir los productos a un diccionario para usarlos en la plantilla
    productos_lista = []
    for producto in productos:
        productos_lista.append({
            'cve_art': producto[0],   # Código del producto
            'nombre': producto[1],    # Descripción
            'exist': producto[2],     # Existencias
           # 'precio': producto[3]     # Precio (ajustar si es otra columna)
        })
    
    return productos_lista

# --------Función para obtener los detalles de un producto específico-------
def get_product_details(product_id):
    cursor = conn_sae90empre01.cursor()
    cursor.execute("SELECT CVE_ART, UNI_EMP, EXIST FROM dbo.INVE01 WHERE CVE_ART = ?", (product_id,))
    producto = cursor.fetchone()
    cursor.close()
    return producto