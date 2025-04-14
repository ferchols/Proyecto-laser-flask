// Arreglo para almacenar los productos añadidos al carrito
let cart = [];




// Controla la visibilidad del IVA dependiendo de la selección de los botones
function toggleIVAVisibility(buttonId) {
    const ivaSection = document.getElementById('iva-total'); // Sección del IVA

    // Muestra el IVA solo cuando se seleccionan LASER FACTURA o RESAL FACTURA
    if (buttonId === "laser-factura-btn" || buttonId === "resal-factura-btn") {
        ivaSection.style.display = 'block'; // Mostrar el IVA
    } else {
        ivaSection.style.display = 'none'; // Ocultar el IVA para otros botones
    }
}


// Inicializa la funcionalidad del carrito
function initializeCart() {
    document.addEventListener('click', handleCart);
    document.getElementById('staticBackdrop').addEventListener('show.bs.modal', renderCartItems);
}








// Función para renderizar los productos obtenidos del servidor
function renderProducts(data, currentPage) {
    const { productos, totalPages } = data;  // Destructuramos la respuesta
    const productCards = document.getElementById("productCards");

    if (productos.length === 0) {
        productCards.innerHTML = "<p class='text-center'>No se encontraron productos.</p>";
        return;
    }

    // Renderizar los productos
    productCards.innerHTML = productos.map(producto => `
        <div class="col-md-4 col-sm-6 mb-3">
            <div class="card h-100 border-0 shadow-sm rounded">
                <img src="data:image/jpeg;base64,${producto.FOTO || ''}" alt="${producto.DESCR || 'Sin descripción'}" class="card-img-top">
                <div class="card-body text-center">
                    <h5 class="card-title text-dark fw-bold mb-3">${producto.DESCR || 'Producto sin nombre'}</h5>
                    <div class="row text-start border-top pt-2">
                        <div class="col-6 text-primary fw-bold">
                            <p class="mb-1"><i class="bi bi-cash"></i> Precio:</p>
                            <p class="text-secondary mb-1">Caja: <span class="text-dark">$${(producto.PRECIO_CAJA || 0).toFixed(2)}</span></p>
                            <p class="text-secondary">Pieza: <span class="text-dark">$${(producto.PRECIO || 0).toFixed(2)}</span></p>
                        </div>
                        <div class="col-6 text-primary fw-bold border-start">
                            <p class="mb-1"><i class="bi bi-box"></i> Piezas:</p>
                            <p class="text-dark fw-bold">${producto.UNI_EMP || 0}</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-between mt-4">
                        <div class="quantity-container d-flex align-items-center">
                            <button class="btn btn-outline-secondary btn-sm decrement-btn"><i class="bi bi-dash"></i></button>
                            <input type="number" class="form-control text-center quantity-input mx-2" value="2" min="2" style="width: 60px;">
                            <button class="btn btn-outline-secondary btn-sm increment-btn"><i class="bi bi-plus"></i></button>
                        </div>
                        <a class="btn btn-primary add-to-cart-btn fw-bold px-4" 
                            data-title="${producto.DESCR || ''}" 
                            data-price="${producto.PRECIO || 0}" 
                            data-price-caja="${producto.PRECIO_CAJA || 0}" 
                            data-uni-emp="${producto.UNI_EMP || 0}">
                            <i class="bi bi-cart"></i> Añadir
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Agregar eventos de incremento y decremento
    addQuantityEvents();

    // Mostrar los controles de paginación
    updatePaginationControls(currentPage, totalPages);
}

// Actualiza los controles de paginación
function updatePaginationControls(currentPage, totalPages) {
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = '';  // Limpiar controles anteriores

    // Botón de "Previous"
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.classList.add('btn', 'btn-outline-secondary');
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => fetchProducts(currentEndpoint, currentPage - 1);
    paginationControls.appendChild(prevButton);

    // Botones de números de página
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('btn', 'btn-outline-secondary', 'mx-1');
        if (i === currentPage) button.classList.add('active');
        button.onclick = () => fetchProducts(currentEndpoint, i);
        paginationControls.appendChild(button);
    }

    // Botón de "Next"
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.classList.add('btn', 'btn-outline-secondary');
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => fetchProducts(currentEndpoint, currentPage + 1);
    paginationControls.appendChild(nextButton);

}
// Función para añadir los eventos de decremento e incremento a las cantidades
function addQuantityEvents() {
    const decrementBtns = document.querySelectorAll('.decrement-btn');
    const incrementBtns = document.querySelectorAll('.increment-btn');
    const quantityInputs = document.querySelectorAll('.quantity-input');

    decrementBtns.forEach((btn, index) => {
        btn.addEventListener('click', function () {
            const quantityInput = quantityInputs[index];
            let quantity = parseInt(quantityInput.value) || 2; // Aseguramos que si está vacío sea 2 por defecto
            quantity = Math.max(quantity - 1, 2); // El mínimo es 2, no 1
            quantityInput.value = quantity;
        });
    });

    incrementBtns.forEach((btn, index) => {
        btn.addEventListener('click', function () {
            const quantityInput = quantityInputs[index];
            let quantity = parseInt(quantityInput.value) || 2; // Aseguramos que si está vacío sea 2 por defecto
            quantity++;
            quantityInput.value = quantity;
        });
    });

    // Editar directamente la cantidad en el campo
    quantityInputs.forEach(input => {
        input.addEventListener('input', function () {
            let quantity = parseInt(input.value) || 2; // Aseguramos que si está vacío sea 2 por defecto
            input.value = Math.max(quantity, 2); // El mínimo es 2, no 1
        });
    });
}

// Llamar a la función inicial de carga de productos
let currentEndpoint = ''; // Variable global para saber qué endpoint estamos utilizando
function fetchProducts(endpoint, page = 1) {
    const productCards = document.getElementById("productCards");
    const loadingMessage = document.getElementById("loadingMessage");

    loadingMessage.style.display = "block";
    productCards.innerHTML = "";

    fetch(`${endpoint}?page=${page}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.ok ? response.json() : Promise.reject(response))
    .then(data => renderProducts(data, page))
    .catch(() => {
        productCards.innerHTML = "<p class='text-center text-danger'>Error al cargar los productos.</p>";
    })
    .finally(() => loadingMessage.style.display = "none");
}













function handleCart(event) {
    if (event.target.classList.contains('add-to-cart-btn')) {
        event.preventDefault();
        const button = event.target;
        const productCard = button.closest('.card');
        const productTitle = button.getAttribute('data-title');
        const productPrice = parseFloat(button.getAttribute('data-price')) || 0;
        const productPriceCaja = parseFloat(button.getAttribute('data-price-caja')) || 0;
        const productUniEmp = parseInt(button.getAttribute('data-uni-emp')) || 0;
        const productImage = productCard.querySelector('.card-img-top').src;
        const quantityInput = productCard.querySelector('.quantity-input');
        const quantity = parseInt(quantityInput.value) || 1;

        // Verificar si el producto ya está en el carrito
        const existingProduct = cart.find(item => item.title === productTitle);
        if (existingProduct) {
            existingProduct.quantity += quantity;  // Sumar la cantidad si ya está en el carrito
            existingProduct.totalPorCaja = existingProduct.quantity * existingProduct.priceCaja; // Recalcular el total por cajas
        } else {
            cart.push({
                title: productTitle,
                price: productPrice,
                priceCaja: productPriceCaja,
                quantity: quantity,
                uniEmp: productUniEmp,
                image: productImage,
                totalPorCaja: quantity * productPriceCaja,
            });
        }

        // Actualizar el número de artículos en el carrito
        document.getElementById('cart-count').innerText = cart.length;
        alert("Producto añadido al carrito");

        // Actualizar el costo total después de añadir el producto
        actualizarCostoTotal();
    }

    

   // Manejo de incremento y decremento de cantidad en el carrito
if (event.target.classList.contains('increment-btn') || event.target.classList.contains('decrement-btn')) {
    const button = event.target;
    const index = button.getAttribute('data-index');
    const quantityInput = document.querySelector(`.cart-quantity-input[data-index="${index}"]`);
    let newQuantity = parseInt(quantityInput.value) || 2;  // Aseguramos que la cantidad inicial sea 2

    if (event.target.classList.contains('increment-btn')) {
        newQuantity += 1; // Incrementar cantidad
    } else if (event.target.classList.contains('decrement-btn')) {
        newQuantity = Math.max(newQuantity - 1, 2); // Decrementar cantidad pero no permitir valores menores que 2
    }

    // Actualizar la cantidad en el carrito
    cart[index].quantity = newQuantity;
    cart[index].totalPorCaja = newQuantity * cart[index].priceCaja; // Recalcular el total por cajas

    // Re-renderizar el carrito
    renderCartItems();
    actualizarCostoTotal(); // Llamar después de actualizar la cantidad
    actualizarTotalCantidad(); // Actualizar la cantidad total
}

// Eliminar producto del carrito
if (event.target.classList.contains('remove-cart-item-btn')) {
    const productIndex = event.target.dataset.index;
    cart.splice(productIndex, 1); // Eliminar el producto del carrito
    renderCartItems(); // Re-renderizar los elementos
    document.getElementById('cart-count').innerText = cart.length; // Actualizar el contador del carrito
    actualizarCostoTotal(); // Actualizar el costo total
    actualizarTotalCantidad(); // Actualizar el total de cantidades
}
}

// Función para actualizar el costo total en el DOM
function actualizarCostoTotal() {
    const costoTotal = calcularCostoTotal(); // Calcular el costo total
    document.getElementById('costo-total').textContent = `$${costoTotal}`; // Mostrar en el DOM
}

// Función para calcular el costo total (suma de todos los "Total por cajas")
function calcularCostoTotal() {
    let costoTotal = 0;
    cart.forEach(product => {
        costoTotal += (product.quantity * product.priceCaja); // Calcular el costo basado en cantidad y precio por caja
    });
    return costoTotal.toFixed(2); // Retornar con dos decimales
}


// Función para renderizar el carrito
function renderCartItems() {
    const cartContainer = document.getElementById('cart-items-container');
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        document.getElementById('costo-total').textContent = '0'; // Si el carrito está vacío, el total es 0
        document.getElementById('Total-cantidad').textContent = '0'; // Reiniciar el total de cantidades
        document.getElementById('iva-total').textContent = '0.00'; // Reiniciar el IVA
        document.getElementById('costo-final').textContent = '0.00'; // Reiniciar el costo final
        return;
    }

    cartContainer.innerHTML = cart.map((product, index) => {
        const totalPorCaja = (product.quantity * product.priceCaja).toFixed(2);
        return `
        <div class="cart-item d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
            <img src="${product.image}" alt="${product.title}" class="me-3 cart-item-img">
            <div class="d-flex flex-column flex-grow-1">
                <h6 class="mb-1 fw-bold">${product.title}</h6>
                <div class="row">
                    <div class="col-md-6">
                        <p class="mb-1 text-muted">Precio:</p>
                        <p class="mb-1 text-muted">Pieza: $${product.price.toFixed(2)}</p>
                        <p class="mb-1 text-muted">Caja: $${product.priceCaja.toFixed(2)}</p>
                    </div>
                    <div class="col-md-6">
                        <p class="mb-1 text-muted">Piezas por caja:</p>
                        <p class="mb-1 text-muted">${product.uniEmp}</p>
                        <p class="mb-1 text-muted">Total por cajas:</p>
                        <p id="total-cajas-${index}" class="total-cajas"> $${totalPorCaja}</p>
                    </div>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <button class="btn btn-outline-secondary btn-sm decrement-btn" data-index="${index}">-</button>
                <input type="number" 
       class="form-control text-center mx-2 cart-quantity-input" 
       data-index="${index}" 
       value="${Math.max(product.quantity, 2)}"  
       min="2"  
       style="width: 60px;">
                <button class="btn btn-outline-secondary btn-sm increment-btn" data-index="${index}">+</button>
            </div>
            <button class="btn btn-danger btn-sm ms-2 remove-cart-item-btn" data-index="${index}"><i class="bi bi-trash"></i> Eliminar</button>
        </div>
        `;
    }).join('');

    // Agregar event listeners para los inputs de cantidad
    document.querySelectorAll('.cart-quantity-input').forEach((input, index) => {
        input.addEventListener('change', () => {
            const newQuantity = parseInt(input.value) || 1;
            cart[index].quantity = newQuantity;
            cart[index].totalPorCaja = newQuantity * cart[index].priceCaja;
            actualizarTotalIndividual(index);
            actualizarTotalCantidad();
            actualizarCostoTotal();
            actualizarIVA();
            actualizarCostoFinal();
        });
    });

    // Actualizar los totales
    actualizarTotalCantidad();
    actualizarCostoTotal();
    actualizarIVA();
    actualizarCostoFinal();
}

// Función para calcular el total de todas las cantidades de los productos en el carrito
function calcularTotalCantidad() {
    if (cart.length === 0) return 0; // Si el carrito está vacío, el total es 0
    return cart.reduce((total, product) => total + product.quantity, 0);
}

// Función para actualizar el total de las cantidades en la fila de la tabla
function actualizarTotalCantidad() {
    const totalCantidad = calcularTotalCantidad();
    document.getElementById('Total-cantidad').textContent = totalCantidad; // Actualizamos el total en el DOM
}

// Función para actualizar el total por cajas de un producto específico
function actualizarTotalIndividual(index) {
    const product = cart[index];
    const totalPorCaja = (product.quantity * product.priceCaja).toFixed(2); // Calcula el total por cajas
    document.getElementById(`total-cajas-${index}`).textContent = `$${totalPorCaja}`; // Actualiza en el DOM
}



// Función para calcular el IVA (16% por ejemplo)
function calcularIVA(costoTotal) {
    const IVA = 0.16; // 16% de IVA
    return (costoTotal * IVA).toFixed(2); // Retorna el IVA con dos decimales
}

// Función para actualizar el IVA en el DOM
function actualizarIVA() {
    const costoTotal = parseFloat(calcularCostoTotal()); // Obtener el costo total
    const ivaTotal = calcularIVA(costoTotal); // Calcular el IVA basado en el costo total
    document.getElementById('iva-total').textContent = `$${ivaTotal}`; // Mostrar el IVA en el DOM
}

// Función para calcular el costo final (Costo total + IVA, si corresponde)
function calcularCostoFinal() {
    const costoTotal = parseFloat(calcularCostoTotal()); // Obtener el costo total
    const ivaTotal = document.getElementById('iva-total').style.display === 'none' ? 0 : parseFloat(calcularIVA(costoTotal)); // Si el IVA está oculto, no se añade
    return (costoTotal + ivaTotal).toFixed(2); // Sumar costo total + IVA y retornar con dos decimales
}

// Función para actualizar el costo final en el DOM
function actualizarCostoFinal() {
    const costoFinal = calcularCostoFinal(); // Calcular el costo final
    document.getElementById('costo-final').textContent = `$${costoFinal}`; // Mostrar el costo final en el DOM
}

// Inicialización de la lógica de carrito
document.addEventListener('DOMContentLoaded', function () {
    renderCartItems();
});

