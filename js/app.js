//https://www.youtube.com/watch?v=Muz_tBzcz8E

/*---VARIABLES---*/
const formOperacion = document.getElementById('form-operacion');
const tabla = document.getElementById('tabla');
const tipo = document.getElementById('tipo');
const fecha = document.getElementById('fecha');
const detalle = document.getElementById('detalle');
const monto = document.getElementById('monto');
const saldo = document.getElementById('saldo');
const deleteAll = document.getElementById('deleteAll');
const msj = document.getElementById('msj');
const btnForm = document.getElementById('btn-form');

class Operacion {
    constructor(id, fecha, tipo, detalle, monto) {
        //declaro atributos
        this.id = id;
        this.fecha = fecha;
        this.tipo = tipo;
        this.detalle = detalle;
        this.monto = monto;
    }
}

const recibirLocalStorage = JSON.parse(localStorage.getItem('operaciones'));

let operaciones;

//Si recibirLocalStorage es null -> operaciones esta vacío, sino es la info que tenga
recibirLocalStorage === null ? operaciones = [] : operaciones = recibirLocalStorage;


//Mostrando saldo inicial
saldoTotal();

//Mostrando el detalle de operaciones del localStorage
mostrarDetalle(operaciones)

/*---FUNCIONES---*/

//función que recarga la tabla con todas las operacion
function mostrarDetalle(elementos) {

    tabla.innerHTML = '';

    elementos.forEach(elemento => {

        //desestructuración
        const {id, tipo, fecha, detalle, monto} = elemento;

        let flecha;
        //Arrows en tipo de operación (up ingreso - down gasto)
        if (tipo === "Ingreso") {
            flecha = '<i class="fa-solid fa-arrow-up"></i>'
        } else {
           flecha = '<i class="fa-solid fa-arrow-down"></i>'
        }

        const li = document.createElement('li');
        li.classList.add('item');

        const datos = `<p class="flecha">${flecha}</p>
                        <p>${fecha}</p>
                        <p>${detalle}</p>
                        <p>$${monto}</p>
                        <p class="trash" id="btn-eliminar" onclick='eliminarOperacion(${id})'> <i class="fa-solid fa-trash"></i></p>`

        li.innerHTML = datos;

        tabla.appendChild(li);
    })

}

//función cargar operacion
function cargarOperacion() {

    //validando que los campos no esten vacíos
    if (tipo.value == "" || detalle.value == "" || monto.value == "" ) {

        msj.style.display = 'block';
        msj.innerText = 'Debe completar todos los campos';

    } else {

        msj.style.display = 'none';
        let objOperacion = new Operacion();

        //agrego valores a los atributos
        objOperacion.id = Date.now();
        objOperacion.fecha = fecha.value;
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
        mostrarDetalle(operaciones);
        //Muestro Saldo total
        saldoTotal();
    }

}

//funcion eliminar operacion
function eliminarOperacion(id) {

    const index = operaciones.findIndex((item)=>{
        return item.id == id;
    })
    console.log(operaciones[index]);

    if (confirm('¿Desea eliminar esta operación?')) {
        operaciones.splice(index,1);
        

        //elimino la operacion en localStorage
        let operacionesJson = JSON.stringify(operaciones);
        localStorage.setItem('operaciones', operacionesJson);

        //Muestro detalle
        mostrarDetalle(operaciones);
        //Muestro Saldo total
        saldoTotal();
    }

}

//Función Saldo total
function saldoTotal() {
    
    //inicio resultado en cero
    let resultado = 0;

    //Si no hay datos en el array el saldo es cero
    operaciones.length === 0 && (saldo.innerHTML = `Saldo $0.00`);

    //Hago un ciclo y verifico que tipo de operacion es y en base a eso sumo o resto
    operaciones.forEach(operacion => {

        const {tipo, monto} = operacion

        //Si el tipo es ingreso sumo el monto operación al resultado, sino se lo resto
        tipo === "Ingreso" ? resultado += parseFloat(monto) : resultado -= parseFloat(monto);
        
    })

    //Colores segun el saldo es positivo o negativo
    if (resultado < 0) {
        saldo.style.color='var(--rojo)';
    } else {
        saldo.style.color='var(--negro)';
    }

    return (saldo.innerHTML = `Saldo $${parseFloat(resultado).toFixed(2)}`);
}

//Función de busqueda de operaciones
function buscarOperacion() {
    
    const inputBuscar = document.getElementById('input-buscar');

    inputBuscar.addEventListener('keyup', ()=>{

        const value = inputBuscar.value;

        const operacionesFiltradas = operaciones.filter((operacion)=>{

            return operacion.detalle.toLowerCase().includes(value.toLowerCase())
        });

        mostrarDetalle(operacionesFiltradas);
    });
}

buscarOperacion();

/*---EVENTOS---*/

formOperacion.addEventListener('submit', (e) => {
    
    //detengo funcionalidad por defecto
    e.preventDefault();

    cargarOperacion();

});


//Borro localStorage, reseteo operaciones, y refresco pagina
deleteAll.addEventListener('click', () => {

    //Mensaje de si esta seguro de querer borrar todo
    if (confirm('Se borrara toda la información guardada definitivamente')) {
        localStorage.clear();
        operaciones = [];
        location.reload();
    }

})

