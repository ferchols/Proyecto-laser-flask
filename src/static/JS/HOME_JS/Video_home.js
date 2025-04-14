document.addEventListener('DOMContentLoaded', function() {
    const btnPlay = document.querySelector('.btn-play');
    const modal = document.getElementById('videoModal');
    const closeBtn = document.querySelector('.close');
    const video = document.getElementById('video');

    // Al hacer clic en el botón de reproducción
    btnPlay.addEventListener('click', function() {
        modal.style.display = 'block'; // Mostrar el modal
        video.play(); // Reproducir el video
    });

    // Al hacer clic en la "X" para cerrar el modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none'; // Ocultar el modal
        video.pause(); // Pausar el video
        video.currentTime = 0; // Reiniciar el video
    });

    // Cerrar el modal si se hace clic fuera de él
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none'; // Ocultar el modal
            video.pause(); // Pausar el video
            video.currentTime = 0; // Reiniciar el video
        }
    });
});