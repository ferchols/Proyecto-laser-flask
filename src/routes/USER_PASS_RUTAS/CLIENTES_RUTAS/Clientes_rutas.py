from flask import Blueprint, render_template, request, redirect, url_for, session, flash
import base64
from src.config import conn_users, conn_clients, conn_sae80empre01, conn_sae90empre02, conn_sae80empre02
from src.controllers.USER_PASS_py.CLIENTES_py.Laser_factura import Cliente_cards_laser_factura
from src.controllers.USER_PASS_py.CLIENTES_py.Resal_factura import Cliente_cards_resal_factura
from src.controllers.USER_PASS_py.CLIENTES_py.Laser_remision import Cliente_cards_laser_remision
from src.controllers.USER_PASS_py.CLIENTES_py.Resal_remision import Cliente_cards_resal_remision



Clientes_rutas = Blueprint('Clientes_rutas', __name__)


@Clientes_rutas.route('/Cliente_cards_laser_factura', methods=['GET'])
def laser_factura():
    return Cliente_cards_laser_factura ()

@Clientes_rutas.route('/Cliente_cards_laser_remision', methods=['GET'])
def laser_remision():
    return Cliente_cards_laser_remision ()

@Clientes_rutas.route('/Cliente_cards_resal_factura', methods=['GET'])
def resal_factura():
    return Cliente_cards_resal_factura ()

@Clientes_rutas.route('/Cliente_cards_resal_remision', methods=['GET'])
def resal_remision():
    return Cliente_cards_resal_remision ()