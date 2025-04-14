//  Script para Mes/Año actual y Festivos 
    // Mes y Año actual
    const monthYear = document.getElementById("current-month-year");
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                   "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const fechaActual = new Date();
    monthYear.textContent = `${meses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}`;

    // Próximos 3 días festivos (Ejemplo)
    const festivos = [
        { fecha: "01/05/2024", nombre: "Día del Trabajo" },
        { fecha: "16/09/2024", nombre: "Día de la Independencia" },
        { fecha: "25/12/2024", nombre: "Navidad" }
    ];

    const listaFestivos = document.getElementById("festive-days");
    festivos.forEach(festivo => {
        const item = document.createElement("li");
        item.style.marginBottom = "10px";
        item.textContent = `${festivo.fecha} - ${festivo.nombre}`;
        listaFestivos.appendChild(item);
    });





// Función para mostrar las ausencias de enero
function showJanuaryAbsences() {
    const currentYear = new Date().getFullYear(); // Año actual
    const januaryDays = [
        { date: '01/01', hours: '9:00am - 6:00pm' },
        { date: '02/01', hours: '9:00am - 6:00pm' },
        { date: '03/01', hours: '9:00am - 6:00pm' },
        { date: '04/01', hours: '9:00am - 6:00pm' },
        // Puedes agregar más días de ausencias aquí
    ];

    // Mostrar el mes y año actual en el título
    const monthYearElement = document.getElementById('current-month-year');
    monthYearElement.innerText = `Enero ${currentYear}`;

    // Obtener el cuerpo de la tabla y limpiar cualquier contenido previo
    const tableBody = document.getElementById('absence-table-body');
    tableBody.innerHTML = '';

    // Insertar las filas con las ausencias
    januaryDays.forEach(absence => {
        const tr = document.createElement('tr');
        const tdDate = document.createElement('td');
        tdDate.innerText = absence.date;
        const tdHours = document.createElement('td');
        tdHours.innerText = absence.hours;
        tr.appendChild(tdDate);
        tr.appendChild(tdHours);
        tableBody.appendChild(tr);
    });
}




// 🔥 Nueva función para mostrar los horarios
function showJanuarySchedules() {
    const januarySchedules = [
        { date: '01/01', hours: '8:00am - 5:00pm' },
        { date: '02/01', hours: '8:00am - 5:00pm' },
        { date: '03/01', hours: '8:00am - 5:00pm' },
        { date: '04/01', hours: '8:00am - 5:00pm' }
    ];

    const scheduleBody = document.getElementById('schedule-table-body');
    scheduleBody.innerHTML = '';

    januarySchedules.forEach(schedule => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${schedule.date}</td><td>${schedule.hours}</td>`;
        scheduleBody.appendChild(tr);
    });
}


// Llamar a la función para mostrar las ausencias de enero al cargar la página
showJanuaryAbsences();
showJanuarySchedules();