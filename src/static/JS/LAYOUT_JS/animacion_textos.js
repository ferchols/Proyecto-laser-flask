const elementsToAnimate = document.querySelectorAll('.animate-slideInUp');

function handleScroll() {
    elementsToAnimate.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isVisible && !element.classList.contains('animated')) {
            element.classList.add('animated'); // Evitar reanimar
            element.classList.add('animate-slideInUp');
        }
    });
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll); // Asegúrate de que funcione al cargar