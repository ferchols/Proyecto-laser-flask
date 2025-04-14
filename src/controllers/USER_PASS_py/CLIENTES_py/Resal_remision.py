from flask import request, jsonify
import base64
from config import conn_sae80empre02 

# --------------------------------------------------------------BOTON RESAL REMISION-----------------------------------------------------

def Cliente_cards_resal_remision():
    try:
        page = int(request.args.get('page', 1))  # Obtener el número de página, por defecto es 1
        per_page = 12  # Número de productos por página

        cursor = conn_sae80empre02.cursor()
        query = """
        WITH PrecioProd AS (
            SELECT CVE_ART, PRECIO
            FROM SAE80EMPRE02.dbo.PRECIO_X_PROD02
            WHERE CVE_PRECIO = 1
        ),
        Inve02 AS (
            SELECT CVE_ART, UNI_EMP, [STATUS], DESCR
            FROM SAE80EMPRE02.dbo.INVE02
            WHERE [STATUS] = 'A'
        ),
        FotoInve AS (
            SELECT CVE_ART, CONVERT(VARBINARY(MAX), FOTO) AS FOTO
            FROM (
                SELECT CVE_ART, FOTO,
                    ROW_NUMBER() OVER (PARTITION BY CVE_ART ORDER BY (SELECT NULL)) AS RowNum
                FROM [GRUPO-LASER].dbo.FOTO_INVE
            ) AS FotoFiltered
            WHERE RowNum = 1
        )
        SELECT DISTINCT
            L.CVE_ART AS CVE_ART,
            ESP.id,
            L.CVE_ART AS L_CVE_ART,
            SUM(L.CANTIDAD) AS Total_CANTIDAD,
            L.CVE_ALM,
            P.PRECIO,
            (P.PRECIO * I.UNI_EMP) AS PRECIO_CAJA,
            I.UNI_EMP,
            I.[STATUS],
            I.DESCR,
            SUM(L.CANTIDAD) / I.UNI_EMP AS Stock_Cajas,
            ESP.CORONA_A,    
            ESP.CORONA_B,
            ESP.ALTOH,
            ESP.NOMINALC,
            ESP.DIAM_TOTAL,
            ESP.MAT_1,
            ESP.POR_MAT_1,
            ESP.MAT_2,
            ESP.POR_MAT_2,
            ESP.MAT_3,
            ESP.POR_MAT_3,
            ESP.ACOMODADO,
            ESP.EMPAQ,
            F.FOTO
        FROM SAE80EMPRE02.dbo.LTPD02 AS L
        LEFT JOIN PrecioProd P ON L.CVE_ART = P.CVE_ART COLLATE SQL_Latin1_General_CP1_CI_AS
        LEFT JOIN Inve02 I ON L.CVE_ART = I.CVE_ART COLLATE SQL_Latin1_General_CP1_CI_AS
        LEFT JOIN [GRUPO-LASER].dbo.INVE AS ESP ON L.CVE_ART = ESP.CVE_ART COLLATE SQL_Latin1_General_CP1_CI_AS
        LEFT JOIN FotoInve F ON L.CVE_ART = F.CVE_ART COLLATE SQL_Latin1_General_CP1_CI_AS
        WHERE L.CANTIDAD >= 0
            AND L.CVE_ALM = 90
            AND ESP.id LIKE 'LASER%'
        GROUP BY L.CVE_ART, ESP.id, L.CVE_ALM, P.PRECIO, I.UNI_EMP, I.[STATUS], I.DESCR,
            ESP.CORONA_A, ESP.CORONA_B, ESP.ALTOH, ESP.NOMINALC, ESP.DIAM_TOTAL,
            ESP.MAT_1, ESP.POR_MAT_1, ESP.MAT_2, ESP.POR_MAT_2, ESP.MAT_3, ESP.POR_MAT_3,
            ESP.ACOMODADO, ESP.EMPAQ, F.FOTO
        ORDER BY L.CVE_ART ASC;
        """

        cursor.execute(query)
        data = cursor.fetchall()

        # Total de productos
        total_products = len(data)
        total_pages = (total_products // per_page) + (1 if total_products % per_page else 0)

        # Paginar los productos
        start = (page - 1) * per_page
        end = start + per_page
        paginated_products = data[start:end]

        # Lista de productos para las cards
        productos = []
        
        for row in paginated_products:
            producto = {
                'CVE_ART': row.CVE_ART,
                'PRECIO': row.PRECIO,
                'PRECIO_CAJA': row.PRECIO_CAJA,
                'STOCK_CAJAS': row.Stock_Cajas,
                'CANTIDAD': row.Total_CANTIDAD,
                'UNI_EMP': row.UNI_EMP,
                'CORONA_A': row.CORONA_A,
                'CORONA_B': row.CORONA_B,
                'NOMINALC': row.NOMINALC,
                'ALTOH': row.ALTOH,
                'DIAM_TOTAL': row.DIAM_TOTAL,
                'MAT_1': row.MAT_1,
                'POR_MAT_1': row.POR_MAT_1,
                'MAT_2': row.MAT_2,
                'POR_MAT_2': row.POR_MAT_2,
                'MAT_3': row.MAT_3,
                'POR_MAT_3': row.POR_MAT_3,
                'ACOMODADO': row.ACOMODADO,
                'DESCR': row.DESCR,
                'FOTO': base64.b64encode(row.FOTO).decode('utf-8') if row.FOTO else None
            }
            productos.append(producto)
        
        cursor.close()  # CERRAR CURSOR

        # Retornar los productos paginados junto con la información de paginación
        return jsonify({
            'productos': productos,
            'total_pages': total_pages,
            'current_page': page
        })

    except Exception as e:
        return jsonify({'error': str(e)})