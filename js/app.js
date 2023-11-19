/*---VARIABLES---*/
const formOperacion = document.getElementById('form-operacion');
const tipo = document.getElementById('tipo');
const fecha = document.getElementById('fecha');
const detalle = document.getElementById('detalle');
const monto = document.getElementById('monto');
const deleteAll = document.getElementById('deleteAll');
const msj = document.getElementById('msj');

/*---FUNCIONES---*/

//Función que recarga la tabla con todas las operacion
const mostrarDetalle = (operaciones)=> {

  const tabla = document.getElementById('tabla');

  tabla.innerHTML = '';

  operaciones.forEach(operacion => {

    //desestructuración
    const { id, tipo, fecha, detalle, monto } = operacion;

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

};

//Función cargar operacion
const cargarOperacion = ()=> {

  //validando que los campos no esten vacíos
  if (tipo.value == "" || detalle.value == "" || monto.value == "" || fecha.value == "") {

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
    //console.log(operaciones);

    //Muestro detalle
    mostrarDetalle(operaciones);
    //Muestro Saldo total
    mostrarTotal(saldoTotal());

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
        background: "rgb(33, 132, 33)",
      },
      onClick: function () { } // Callback after click
    }).showToast();

    //reseteo formulario
    formOperacion.reset();
  }

};

//Funcion eliminar operacion
const eliminarOperacion = (id)=> {

  const index = operaciones.findIndex((item) => {
    return item.id === id;
  })
  //console.log(operaciones[index]);

  const operacion = operaciones[index];

  Swal.fire({
    title: `¿Desea eliminar ${operacion.detalle}?`,
    text: "La operación será eliminada definitivamente",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1A73E8",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {

      Toastify({
        text: `Se eliminó ${operacion.detalle}`,
        duration: 3000,
        /* destination: "https://github.com/apvarun/toastify-js", 
        newWindow: true,*/
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "rgb(33, 132, 33)",
        },
        onClick: function () { } // Callback after click
      }).showToast();

        operaciones.splice(index, 1);

        //elimino la operacion en localStorage
        let operacionesJson = JSON.stringify(operaciones);
        localStorage.setItem('operaciones', operacionesJson);

        //Muestro detalle
        mostrarDetalle(operaciones);
        //Muestro Saldo total
        mostrarTotal(saldoTotal());

      

    }
  });

};

//Función Saldo total
const saldoTotal = ()=> {

  //inicio resultado en cero
  let resultado = 0;

  //Hago un ciclo y verifico que tipo de operacion es y en base a eso sumo o resto
  operaciones.forEach(operacion => {

    const { tipo, monto } = operacion

    //Si el tipo es ingreso sumo el monto operación al resultado, sino se lo resto
    tipo === "Ingreso" ? resultado += parseFloat(monto) : resultado -= parseFloat(monto);

  })

  //Colores segun el saldo es positivo o negativo
  if (resultado < 0) {
    saldo.style.color = 'var(--rojo)';
  } else {
    saldo.style.color = 'var(--negro)';
  }

  return resultado;
};

//Función mostrar total
const mostrarTotal = (saldoTotal)=> {

  const saldo = document.getElementById('saldo');
  const saldoUsd = document.getElementById('saldo-usd');

  saldo.innerHTML = `$ ${mostrarMoneda(saldoTotal)}`;

    conversionUsd(saldoTotal).then((totalUsd)=>{

      if (totalUsd < 0) {
        saldoUsd.style.color = 'var(--rojo)';
      } else {
        saldoUsd.style.color = 'var(--negro)';
      }
      
      saldoUsd.innerText = `(${mostrarMoneda(totalUsd)} USD)`;

    }) .catch((err)=>{
      console.log(err);
    });
  
};

//Función convertir en dolares actualizado
const conversionUsd = async (monto)=> {
try{
  let datos= await verdes();

  return monto / datos.venta;
} catch (err) {
  console.log(err);
}
 
}

//Función de busqueda de operaciones
const buscarOperacion = () => {

  const inputBuscar = document.getElementById('input-buscar');

  inputBuscar.addEventListener('keyup', () => {

    const value = inputBuscar.value;

    const operacionesFiltradas = operaciones.filter((operacion) => {

      return operacion.detalle.toLowerCase().includes(value.toLowerCase())
    });

    mostrarDetalle(operacionesFiltradas);
  });
};


const mostrarMoneda = (numero)=> {
  const numeroConDecimales = Number(numero).toFixed(2);
  const numeroFormateado = numeroConDecimales.replace(/\./g, 'temp').replace(/\B(?=(\d{3})+(?!\d))/g, '.').replace('temp', ',');
  return numeroFormateado;
}

//Consumo API
const verdes = async()=> {
  const urlBlue = 'https://dolarapi.com/v1/dolares/blue';
  //try
  try {
      //fetch con await
      const response = await fetch(urlBlue, {
          header: 'Accept: application/json'
      });

      /* console.log(response);
      console.log(response.status) */

      //IFs de STATUS
      if (response.status === 200) {
            
          //acceder a la información
          const data = await response.json();

         return data;

      } else if (response.status === 401) {
          console.log('Estado 401: No tienes autoridad para acceder al recurso');
      }  else if (response.status === 403) {
          console.log('Estado 403: No tienes permisos para acceder');
      }  else if (response.status === 404) {
          console.log('Estado 404: Recurso no encontrado');
      }  else if (response.status === 500) {
          console.log('Estado 500: Error en el servidor');
      } else {
          console.log('Error desconocido');
      }
    
  //catch
  } catch (err) {
      console.log(err);
  }
};

/*---EVENTOS---*/

formOperacion.addEventListener('submit', (e) => {

  //detengo funcionalidad por defecto
  e.preventDefault();

  cargarOperacion();

});


//Borro localStorage, reseteo operaciones, y refresco pagina
deleteAll.addEventListener('click', () => {

  Swal.fire({
    title: "¿Desea eliminar todo?",
    text: "Se eliminará toda la base definitivamente",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1A73E8",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar todo",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {

      Toastify({
        text: `Se eliminó la base`,
        duration: 3000,
        /* destination: "https://github.com/apvarun/toastify-js", 
        newWindow: true,*/
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "rgb(33, 132, 33)",
        },
        onClick: function () { } // Callback after click
      }).showToast();

        localStorage.clear();
        operaciones = [];
        mostrarDetalle(operaciones);
        mostrarTotal(saldoTotal());
      

    }
  });

});


/*---INICIO DE PROGRAMA---*/

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
mostrarTotal(saldoTotal());

//Mostrando el detalle de operaciones del localStorage
mostrarDetalle(operaciones);

//buscador
buscarOperacion();

//fechaInput();