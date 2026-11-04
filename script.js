// sacamos DateTime de luxon para poder usarlo
const { DateTime } = luxon;

// traemos los elementos del html
const formulario = document.getElementById("formulario");
const campoFecha = document.getElementById("fecha");
const resultado = document.getElementById("resultado");

// activamos el calendario de flatpickr en el campo
// (en español, formato dia/mes/año y sin dejar elegir fechas futuras)
flatpickr(campoFecha, {
    locale: "es",
    dateFormat: "d/m/Y",
    maxDate: "today"
});

// esto se ejecuta cuando le dan al boton calcular
formulario.addEventListener("submit", (evento) => {
    // para que no se recargue la pagina
    evento.preventDefault();
    resultado.classList.remove("error");

    // validacion 1: que no este vacio
    if (campoFecha.value === "") {
        resultado.classList.add("error");
        resultado.textContent = "Por favor ingresa tu fecha de nacimiento.";
        return;
    }

    // convertimos el texto a una fecha de luxon
    const nacimiento = DateTime.fromFormat(campoFecha.value, "d/M/yyyy");

    // validacion 2: que la fecha exista (por ejemplo 31/02 no existe)
    if (!nacimiento.isValid) {
        resultado.classList.add("error");
        resultado.textContent = "La fecha no es válida. Usa el formato dd/mm/aaaa.";
        return;
    }

    // fecha de hoy a las 00:00 para comparar solo los dias
    const hoy = DateTime.now().startOf("day");

    // validacion 3: que no sea una fecha del futuro
    if (nacimiento > hoy) {
        resultado.classList.add("error");
        resultado.textContent = "La fecha no puede ser futura.";
        return;
    }

    // luxon calcula la diferencia entre hoy y el nacimiento
    const edad = hoy.diff(nacimiento, ["years", "months", "days"]);
    const anios = edad.years;
    const meses = edad.months;
    const dias = Math.floor(edad.days); // redondeamos porque los dias pueden salir con decimales

    // mostramos el resultado en la misma pagina
    resultado.innerHTML =
        "Tienes <strong>" + anios + " años, " + meses + " meses y " + dias + " días</strong>";
});