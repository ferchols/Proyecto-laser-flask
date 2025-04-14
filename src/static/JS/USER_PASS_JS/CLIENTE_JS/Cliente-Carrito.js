
// JS para bloquear las fechas de los primeros 21 días:
document.addEventListener("DOMContentLoaded", function () {
    // Configura la fecha mínima (21 días a partir de la fecha actual)
    const today = new Date();
    const minDate = new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000); // 21 días desde hoy

    // Configura el Flatpickr con la fecha mínima y hora
    flatpickr("#fecha-entrega", {
        minDate: minDate, // Bloquea las fechas anteriores a 21 días
        dateFormat: "Y-m-d H:i", // Formato de fecha y hora: 2024-11-25 14:30
        locale: "es", // Idioma español
        enableTime: true, // Habilita la selección de hora
        time_24hr: true, // Usar formato de 24 horas para la hora
        weekNumbers: true, // Muestra los números de semana
        disableMobile: false, // Desactiva el calendario móvil si se desea
        disable: [
            "2024-12-25",  // Deshabilita el 25 de diciembre de 2024
            { from: "2024-12-31", to: "2025-01-01" }  // Deshabilita un rango de fechas
        ],
        // mode: "range", // Permite seleccionar un rango de fechas (opcional)
        altInput: true, // Usar una vista alternativa para la fecha
        // altFormat: "F j, Y", // Muestra la fecha en formato: Noviembre 25, 2024 si usas "atlInput"
        // showMonths: 2, // Muestra dos meses a la vez

    });
});


// ----------------------BOTON DE REINICIAR CARRITO ------------------------------

// Función para reiniciar el carrito
function reiniciarCarrito() {
    cart = []; // Vaciar el carrito

    // Limpiar el contenido en el carrito
    document.getElementById('cart-items-container').innerHTML = '<p>Tu carrito está vacío.</p>';

    // Reiniciar el contador de productos
    document.getElementById('cart-count').innerText = '0';

    // Reiniciar los totales
    document.getElementById('costo-total').textContent = '0.00';
    document.getElementById('Total-cantidad').textContent = '0';
    document.getElementById('iva-total').textContent = '0.00';
    document.getElementById('costo-final').textContent = '0.00';
}
// Asociar el evento al botón de reiniciar carrito
document.getElementById('reiniciar-carrito').addEventListener('click', function () {
    reiniciarCarrito(); // Llamar a la función de reinicio del carrito
    
});