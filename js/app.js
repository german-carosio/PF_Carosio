/*---VARIABLES---*/
const formOperacion = document.getElementById('form-operacion');
const tabla = document.getElementById('tabla');
const tipo = document.getElementById('tipo');
const detalle = document.getElementById('detalle');
const monto = document.getElementById('monto');
const saldo = document.getElementById('saldo');
const deleteAll = document.getElementById('deleteAll');
const msj = document.getElementById('msj');

class Operacion {
    constructor(fecha, tipo, detalle, monto) {
        //declaro atributos
        this.fecha = fecha;
        this.tipo = tipo;
        this.detalle = detalle;
        this.monto = monto;
    }
}

const recibirLocalStorage = JSON.parse(localStorage.getItem('operaciones'));

let operaciones;

//Si recibirLocalStorage es null -> operaciones esta vacío, sino es la info que tenga
if (recibirLocalStorage === null) {
    operaciones = [];
} else {
    operaciones = recibirLocalStorage;
}

//Mostrando saldo inicial
saldoTotal();

//Mostrando el detalle de operaciones del localStorage
mostrarDetalle()

/*---FUNCIONES---*/

//función para devolver fecha editada (averiguar el tema de la hora)
function fecha() {

    let day = new Date().getDate();
    let month = new Date().getMonth();
    let year = new Date().getFullYear();

    return day + "/" + month + "/" + year;
}

//función que recarga la tabla con todas las operacion
function mostrarDetalle() {

    tabla.innerHTML = ``;

    operaciones.forEach(operacion => {

        let flecha;
        //Arrows en tipo de operación
        if (operacion.tipo === "Ingreso") {
            flecha = '<i class="fa-solid fa-arrow-up"></i>'
        } else {
           flecha = '<i class="fa-solid fa-arrow-down"></i>'
        }

        tabla.innerHTML += `<li class="item">
                            <p class="flecha">${flecha}</p>
                            <p>${operacion.fecha}</p>
                            <p>${operacion.detalle}</p>
                            <p>$${operacion.monto}</p>
                            <p class="trash"> <i class="fa-solid fa-trash"></i></p>
                            </li>
                            `
    })

}

//función cargar operacion
function cargarOperacion() {

    //validando que los campos no esten vacíos
    if (tipo.value == "" || detalle.value == "" || monto.value == "") {

        msj.style.display = 'block';
        msj.innerText = 'Debe completar todos los campos';

    } else {

        msj.style.display = 'none';

        let objOperacion = new Operacion();

        //agrego valores a los atributos
        objOperacion.fecha = fecha();
        objOperacion.tipo = tipo.value;
        objOperacion.detalle = detalle.value;
        objOperacion.monto = parseFloat(monto.value).toFixed(2);

        operaciones.unshift({ ...objOperacion });

        //envio la operacion a localStorage
        let operacionesJson = JSON.stringify(operaciones);
        localStorage.setItem('operaciones', operacionesJson);

        //reseteo formulario
        formOperacion.reset();
        console.log(operaciones);

        //Muestro detalle
        mostrarDetalle();
        //Muestro Saldo total
        saldoTotal();
    }

}

//Función Saldo total
function saldoTotal() {

    let resultado = 0;

    if (operaciones.length === 0) {
        return (saldo.innerHTML = `Saldo $${parseFloat(resultado).toFixed(2)}`);
    }

    //Hago un ciclo y verifico que tipo de operacion es y en base a eso sumo o resto
    operaciones.forEach(operacion => {
        if (operacion.tipo === "Ingreso") {
            resultado += parseFloat(operacion.monto);
        } else {
            resultado -= parseFloat(operacion.monto);
        }
    })

    //Colores segun el saldo
    if (resultado < 0) {
        saldo.style.color='var(--rojo)';
    } else if (resultado > 0) {
        saldo.style.color='var(--verde)';
    } else {
        saldo.style.color='var(--negro)';
    }

    return (saldo.innerHTML = `Saldo $${parseFloat(resultado).toFixed(2)}`);
}

/*---EVENTOS---*/

formOperacion.addEventListener('submit', (e) => {
    //detengo funcionalidad por defecto
    e.preventDefault();

    cargarOperacion();

});

//Borro localStorage, reseteo operaciones, y refresco pagina
deleteAll.addEventListener('click', () => {

    if (confirm('Se borrara toda la información guardada definitivamente')) {
        localStorage.clear();
        operaciones = [];
        location.reload();
    }

})


