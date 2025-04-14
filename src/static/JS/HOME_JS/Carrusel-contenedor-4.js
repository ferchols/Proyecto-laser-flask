let currentIndex = 0;

function moverCarrusel(direccion) {
    const carrusel = document.querySelector('.carrusel');
    const opciones = document.querySelectorAll('.opcion');
    const totalOpciones = opciones.length;

    // Calculamos el nuevo índice
    currentIndex += direccion;

    // Asegurarse de que el índice esté en el rango de las opciones
    if (currentIndex < 0) {
        currentIndex = totalOpciones - 1;
    } else if (currentIndex >= totalOpciones) {
        currentIndex = 0;
    }

    // Ajustamos la posición del carrusel
    const desplazamiento = currentIndex * opciones[0].offsetWidth;
    carrusel.style.transform = `translateX(-${desplazamiento}px)`;
}