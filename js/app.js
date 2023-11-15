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
mostrarDetalle(operaciones);

//buscador
buscarOperacion();

//fechaInput();

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
                        <p>$${mostrarMoneda(monto)}</p>
                        <p class="trash" id="btn-eliminar" onclick='eliminarOperacion(${id})'> <i class="fa-solid fa-trash"></i></p>`

        li.innerHTML = datos;

        tabla.appendChild(li);
    })

}

//función cargar operacion
function cargarOperacion() {

    //validando que los campos no esten vacíos
    if (tipo.value == "" || detalle.value == "" || monto.value == "" || fecha.value == "" ) {

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

        
        //fechaInput();
        console.log(operaciones);

        //Muestro detalle
        mostrarDetalle(operaciones);
        //Muestro Saldo total
        saldoTotal();

        //Mensajito
        Toastify({
            text: `Se agregó ${detalle.value}`,
            duration: 3000,
            /* destination: "https://github.com/apvarun/toastify-js", 
            newWindow: true,*/
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#1A73E8",
            },
            onClick: function(){} // Callback after click
          }).showToast();

          //reseteo formulario
            formOperacion.reset();
    }

}

//funcion eliminar operacion
function eliminarOperacion(id) {

    const index = operaciones.findIndex((item)=>{
        return item.id == id;
    })
    console.log(operaciones[index]);


    Swal.fire({
        title: "Desea eliminar esta operación?",
        text: "La operación será eliminada definitivamente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1A73E8",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          
            Swal.fire({
            title: "Eliminado!",
            text: "La operación ya no se encuentra en la base",
            confirmButtonColor: "#1A73E8",
            icon: "success"
          }).then(()=>{

            operaciones.splice(index,1);
        
        //elimino la operacion en localStorage
        let operacionesJson = JSON.stringify(operaciones);
        localStorage.setItem('operaciones', operacionesJson);

        //Muestro detalle
        mostrarDetalle(operaciones);
        //Muestro Saldo total
        saldoTotal();
            
          });

        }
      });

}

//Función Saldo total
function saldoTotal() {
    
    //inicio resultado en cero
    let resultado = 0;

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

    return (saldo.innerHTML = `$${mostrarMoneda(resultado)}`);
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

//Función par input date ---->>> a chequear 
/* function fechaInput() {
    var fecha = new Date(); //Fecha actual
    var mes = fecha.getMonth()+1; //obteniendo mes
    var dia = fecha.getDate(); //obteniendo dia
    var ano = fecha.getFullYear(); //obteniendo año
    if(dia<10)
      dia='0'+dia; //agrega cero si el menor de 10
    if(mes<10)
      mes='0'+mes //agrega cero si el menor de 10
    document.getElementById('fecha').value=ano+"-"+mes+"-"+dia;
  } */

  function mostrarMoneda(numero) {
    const numeroConDecimales = Number(numero).toFixed(2);
    const numeroFormateado = numeroConDecimales.replace(/\./g, 'temp').replace(/\B(?=(\d{3})+(?!\d))/g, '.').replace('temp', ',');
    return numeroFormateado;
 }

/*---EVENTOS---*/

formOperacion.addEventListener('submit', (e) => {
    
    //detengo funcionalidad por defecto
    e.preventDefault();

    cargarOperacion();

});


//Borro localStorage, reseteo operaciones, y refresco pagina
deleteAll.addEventListener('click', () => {

    Swal.fire({
        title: "Esta seguro de eliminar todo?",
        text: "Se eliminará toda la base definitivamente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1A73E8",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar todo!",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          
            Swal.fire({
            title: "Eliminado!",
            text: "Toda su base ha sido eliminada",
            confirmButtonColor: "#1A73E8",
            icon: "success"
          }).then(()=>{

            localStorage.clear();
            operaciones = [];
            location.reload();
            
          });

        }
      });

});

