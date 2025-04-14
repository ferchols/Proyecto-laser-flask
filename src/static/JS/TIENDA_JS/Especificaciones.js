


// Actualizar INFORMACION al seleccionar un producto
document.querySelector('.form-select').addEventListener('change', function () {
    const selectedProduct = this.value;
    const producto = productos.find(p => p.CVE_ART === selectedProduct);

    if (producto) {
        document.getElementById('Precio-uni').textContent = `$${producto.PRECIO.toFixed(2)}`;
        document.getElementById('product-quantity').textContent = producto.CANTIDAD;
        document.getElementById('product-boxes').textContent = producto.UNI_EMP;
        document.getElementById('Corona-A').textContent = producto.CORONA_A;
        document.getElementById('Corona-B').textContent = producto.CORONA_B;
        document.getElementById('Capacidad').textContent = producto.NOMINALC;
        document.getElementById('Altura-total').textContent = producto.ALTOH;
        document.getElementById('Diametro-total').textContent = producto.DIAM_TOTAL;
        document.getElementById('Mat-1').textContent = producto.MAT_1;
        document.getElementById('Por-mat-1').textContent = producto.POR_MAT_1;
        document.getElementById('Mat-2').textContent = producto.MAT_2;
        document.getElementById('Por-mat-2').textContent = producto.POR_MAT_2;
        document.getElementById('Mat-3').textContent = producto.MAT_3;
        document.getElementById('Por-mat-3').textContent = producto.POR_MAT_3;
        document.getElementById('Acomodo').textContent = producto.ACOMODADO;
        document.getElementById('Descr').textContent = producto.DESCR;
    } else {
        document.getElementById('product-quantity').textContent = '0';
        document.getElementById('product-boxes').textContent = 'N/A';
        document.getElementById('Precio-final').textContent = '$0.00';
        document.getElementById('Precio-caja').textContent = '$0.00';
        document.getElementById('Precio-uni').textContent = '$0.00';
        document.getElementById('Corona-A').textContent = 'Ancho';
        document.getElementById('Corona-B').textContent = 'Alto';
        document.getElementById('Capacidad').textContent = 'mm';
        document.getElementById('Altura-total').textContent = 'mm';
        document.getElementById('Diametro-total').textContent = 'mm';
        document.getElementById('Mat-1').textContent = 'Mat-1';
        document.getElementById('Por-mat-1').textContent = '%';
        document.getElementById('Mat-2').textContent = 'Mat-2';
        document.getElementById('Por-mat-2').textContent = '%';
        document.getElementById('Mat-3').textContent = 'Mat-3';
        document.getElementById('Por-mat-3').textContent = '%';
        document.getElementById('Acomodo').textContent = '-';
        document.getElementById('Descr').textContent = 'El precio mostrado es por caja de ventas por unidad';
    }

    updatePrecioCaja();
    updateCAJAS();
});









// JavaScript para manejar el desbloqueo del input:

function toggleInput() {
    var checkBox = document.getElementById("Fabricacion-check");
    var textBox = document.getElementById("Fabricacion-cajas");
    // Si el checkbox está marcado, habilitar el campo de texto
    if (checkBox.checked == true) {
        textBox.disabled = false;
    } else {
        textBox.disabled = true;
        textBox.value = ""; // Limpia el contenido del input al deshabilitar
    }
}


// Función para manejar el estado del checkbox basado en la selección del producto
function handleCheckboxState() {
    const productSelect = document.getElementById('product-select');
    const fabricacionCheckbox = document.getElementById('Fabricacion-check');
    
    // Verificar si se ha seleccionado un producto válido
    if (productSelect.value !== "Selecciona un producto" && productSelect.value !== "") {
        fabricacionCheckbox.disabled = false; // Habilitar checkbox
    } else {
        fabricacionCheckbox.disabled = true; // Deshabilitar checkbox
        fabricacionCheckbox.checked = false; // Restablecer estado desmarcado
    }
}
// Actualizar estado del checkbox al seleccionar un producto
document.getElementById('product-select').addEventListener('change', handleCheckboxState);




// Escuchar cambios en el campo de entrada de cajas
document.getElementById('num-cajas-input').addEventListener('input', () => {
    const stockCajas = parseFloat(document.getElementById('Stock-cajas').textContent.trim()) || 0;
    let numCajas = parseInt(document.getElementById('num-cajas-input').value, 10) || 0;
    if (numCajas > stockCajas) numCajas = 0; // Restablecer a 0 si excede el stock
    document.getElementById('num-cajas-input').value = numCajas;
    updatePrecioFinal();
});

// Función para actualizar el precio final basado en el número de cajas ingresado por el cliente
function updatePrecioFinal() {
    const precioCaja = parseFloat(document.getElementById('Precio-caja').textContent.replace('$', '').trim()) || 0;
    const numCajas = parseFloat(document.getElementById('num-cajas-input').value.trim()) || 0;
    const precioFinal = precioCaja * numCajas;
    document.getElementById('Precio-final').textContent = `$${precioFinal.toFixed(2)}`;
}


// Función para actualizar el precio por caja
function updatePrecioCaja() {
    const precioUni = parseFloat(document.getElementById('Precio-uni').textContent.replace('$', '').trim()) || 0;
    const uniEmp = parseFloat(document.getElementById('product-boxes').textContent.trim()) || 0;
    const precioCaja = precioUni * uniEmp;
    document.getElementById('Precio-caja').textContent = `$${precioCaja.toFixed(2)}`;
    updatePrecioFinal(); // Actualizar el precio final de acuerdo con la cantidad de cajas
}



// Función para actualizar las cajas
function updateCAJAS() {
    const Piezas = parseFloat(document.getElementById('product-quantity').textContent.trim());
    const uniEmp = parseFloat(document.getElementById('product-boxes').textContent.trim());

    if (!isNaN(Piezas) && !isNaN(uniEmp)) {
        const Cajas = Piezas / uniEmp;
        console.log(`Cajas calculadas: ${Cajas}`); // Depuración para verificar el cálculo
        document.getElementById('Stock-cajas').textContent = `${Cajas.toFixed(2)}`;
    } else {
        console.error('Valores inválidos para la multiplicación');
        document.getElementById('Stock-cajas').textContent = '0';
    }
}

// Observadores para actualizar Precio-caja y Stock-cajas
const precioUniObserver = new MutationObserver(updatePrecioCaja);
const productBoxesObserver = new MutationObserver(() => {
    updatePrecioCaja();
    updateCAJAS();
});
const stockcajasObserver = new MutationObserver(updateCAJAS);

precioUniObserver.observe(document.getElementById('Precio-uni'), { childList: true });
productBoxesObserver.observe(document.getElementById('product-boxes'), { childList: true });
stockcajasObserver.observe(document.getElementById('Stock-cajas'), { childList: true });

// JUNTAR CORONA "A" CON LA "B"
function updateCoronaAB() {
    const coronaA = document.getElementById('Corona-A').textContent.trim();
    const coronaB = document.getElementById('Corona-B').textContent.trim();
    const coronaAB = `${coronaA} / ${coronaB}`;
    document.getElementById('Corona-A-B').textContent = coronaAB;
}

// Llamar a la función después de actualizar los valores
document.querySelector('.form-select').addEventListener('change', function () {
    const selectedProduct = this.value;
    const producto = productos.find(p => p.CVE_ART === selectedProduct);

    if (producto) {
        document.getElementById('Corona-A').textContent = producto.CORONA_A;
        document.getElementById('Corona-B').textContent = producto.CORONA_B;
    } else {
        document.getElementById('Corona-A').textContent = 'C_A';
        document.getElementById('Corona-B').textContent = 'C_B';
    }

    // Actualizar el contenido combinado
    updateCoronaAB();
});











// Restablecer estado del modal y deshabilitar el checkbox
function resetModalState() {
    // Restablecer select de productos
    document.getElementById('product-select').innerHTML = '<option selected>Selecciona un producto</option>';
    // Restablecer cantidades y precios
    document.getElementById('product-quantity').textContent = '0';
    document.getElementById('product-boxes').textContent = 'N/A';
    document.getElementById('Precio-final').textContent = '$0.00';
    document.getElementById('Precio-caja').textContent = '$0.00';
    document.getElementById('Precio-uni').textContent = '$0.00';
    document.getElementById('num-cajas-input').value = '';
    document.getElementById('Corona-A').textContent = 'C_A';
    document.getElementById('Corona-B').textContent = 'C_B';
    document.getElementById('Capacidad').textContent = 'mm';
    document.getElementById('Altura-total').textContent = 'mm';
    document.getElementById('Diametro-total').textContent = 'mm';
    document.getElementById('Mat-1').textContent = 'Mat-1';
    document.getElementById('Por-mat-1').textContent = '%';
    document.getElementById('Mat-2').textContent = 'Mat-2';
    document.getElementById('Por-mat-2').textContent = '%';
    document.getElementById('Mat-3').textContent = 'Mat-3';
    document.getElementById('Por-mat-3').textContent = '%';
    document.getElementById('Acomodo').textContent = '-';
    document.getElementById('Descr').textContent = 'El precio mostrado es por caja de ventas por unidad';
     // Restablecer imagen del producto
     document.getElementById('Product-foto').src = ''; // Coloca la ruta de la imagen por defecto aquí
     document.getElementById('Product-foto').alt = 'Imagen del Producto';
     // Restablecer checkbox de fabricación
    const fabricacionCheckbox = document.getElementById('Fabricacion-check');
    const fabricacionTextBox = document.getElementById('Fabricacion-cajas');
    fabricacionCheckbox.checked = false; // Desmarcar el checkbox
    fabricacionCheckbox.disabled = true; // Deshabilitar el checkbox
    fabricacionTextBox.disabled = true; // Deshabilitar el campo de texto
    fabricacionTextBox.value = ""; // Limpiar el contenido del input
}



// Restablecer los botones seleccionados
document.querySelectorAll('.btn-group button').forEach(btn => {
    btn.classList.remove('selected-button', 'disabled-button');
    btn.disabled = btn.hasAttribute('data-disabled-session');
});

