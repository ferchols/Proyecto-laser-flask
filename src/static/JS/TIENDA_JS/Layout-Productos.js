 
  // ---------------------------------------------Navegacion de pestañas--------------------------------------------- 
 // Navegación de breadcrumb 
  // Obtenemos el nombre de la página actual de la URL
  const currentPage = window.location.pathname.split("/").pop().replace(".html", "");
  
  // Si estamos en la raíz, mostrar "Inicio"
  const pageName = currentPage ? currentPage.charAt(0).toUpperCase() + currentPage.slice(1) : "Inicio";

  // Insertamos el nombre de la página actual en el breadcrumb
  document.getElementById("current-page").textContent = pageName;

  // ---------------------------------------------Carrusel de imagenes de productos -----------------------------------------------------------------

// ------------------------------------------------CATIDAD DE PRODUCTO-------------------------------------------------------------------

// Aumenta la cantidad de producto
function increaseQuantity() {
    const quantityInput = document.getElementById("productQuantity");
    let currentQuantity = parseInt(quantityInput.value);
    quantityInput.value = currentQuantity + 1;
}

// Disminuye la cantidad de producto
function decreaseQuantity() {
    const quantityInput = document.getElementById("productQuantity");
    let currentQuantity = parseInt(quantityInput.value);
    if (currentQuantity > 1) {
        quantityInput.value = currentQuantity - 1;
    }
}

// ------------------------------------------------DESCRIPCIONES-------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function() {
    const titles = document.querySelectorAll('.toggle-title');

    titles.forEach(title => {
        title.addEventListener('click', function() {
            const description = this.nextElementSibling; // Obtiene el siguiente elemento (la descripción)
            description.classList.toggle('show'); // Alterna la clase 'show'
        });
    });
});