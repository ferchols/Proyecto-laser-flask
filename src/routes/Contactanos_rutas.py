from flask import Blueprint, render_template

Contactanos_rutas = Blueprint('Contactanos_rutas', __name__)


@Contactanos_rutas.route('/Contactanos')
def contactanos():
    return render_template('Contactanos.html')