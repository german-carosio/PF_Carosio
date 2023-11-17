const verdes = async()=> {
    //try
    try {
        //fetch con await
        const response = await fetch(urlBlue, {
            header: 'Accept: application/json'
        });

        //console.log(response);
        //console.log(response.status)

        //IFs de STATUS
        if (response.status === 200) {
              //acceder a la información
            const data = await response.json();

            //console.log(data);

            //Fecha de actualizacion traida de API
            date = new Date(`${data.fechaActualizacion}`);
            fecha.innerText = `Actualización = ${date.toLocaleString()}`;

            //Valores Dolar blue traidos de API
            compra.innerText = `Compra = $ ${data.compra}`;
            venta.innerText = `Venta = $ ${data.venta}`;

            // Accion de boton en Conversor
            btn.addEventListener('click', ()=>{
        
                let monto = parseFloat(document.getElementById('monto').value);

                if (monto > 0) {
                    if (option.value == 1) {
                        let resultado =  monto/`${data.venta}`;
                        document.getElementById('resultado').value = resultado.toFixed(2 );
                    } else if (option.value == 2) {
                        let resultado = monto*`${data.compra}`;
                    document.getElementById('resultado').value = resultado.toFixed(2);
                    }
                }
            });

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
    } catch (error) {
        console.log(error);
    }
};


verdes();