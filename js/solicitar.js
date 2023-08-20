//Cargo los datos dal LS
const info = cargarInfoLocalStorage();

//Obtengo los datos del DOM
let datosPrestamo = document.getElementById("prestamoSeleccionado");
let inputInfoOculta = document.getElementById("infoOculta");

function prestamoSeleccionado() {
  if (info == "") {
    //si carga la pagina solicitar sin antes haber seleccionado un prestamo se muestra esto
    salida = `<p class="text-danger">Préstamo sin simular</p>`; 
  } else {
    salida = `<ul class="list-group mb-3">
                          <li class="list-group-item d-flex justify-content-between lh-sm">
                            <div>
                              <h6 class="my-0">Monto del Préstamo</h6>
                                <small class="text-body-secondary">Pesos</small>
                            </div>
                            <span class="text-body-secondary ">$${separadorMiles(
                              info.monto
                            )}</span>
                          </li>
                          <li class="list-group-item d-flex justify-content-between lh-sm">
                            <div>
                              <h6 class="my-0">Plazo</h6>
                              <small class="text-body-secondary">Meses</small>
                            </div>
                            <span class="text-body-secondary ">${
                              info.plazo
                            }</span>
                          </li>
                          <li class="list-group-item d-flex justify-content-between lh-sm">
                            <div>
                              <h6 class="my-0">Tasa Nominal Anual</h6>
                            </div>
                            <span class="text-body-secondary ">${
                              info.intereses
                            } %</span>
                          </li>
                          
                        </ul> `;
  }
  datosPrestamo.innerHTML = salida;
}


//Boton Borrar datos de la simulacion
function borrarSolicitud() {
  localStorage.removeItem("pagos");
  localStorage.removeItem("info");
  datosPrestamo.innerHTML="Préstamo sin datos";
  inputInfoOculta.value="Préstamo sin datos";
}


// Validar formulario de Bootstrap
( () => {
  'use strict'
  const forms = document.querySelectorAll('.needs-validation')
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', async event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }else {       
        await alertaEnvio(event)
        await form.submit()
      }
      form.classList.add('was-validated')
      
    }, false)
  })
})()

// utilizo Sweet Alert Script para el alert del envio
async function alertaEnvio(event) {
  event.preventDefault();
  Swal.fire({
    timer:5000,
    icon: "success",
    title: "Tu solicitud ha sido enviada",
    text: "Pronto nos contactaremos, muchas gracias!",
    footer: '<a href="../index.html">Volver a Simular</a>',
  }, function(isConfirm){
    console.log("sdfsf");
    if (isConfirm) form.submit();
});
}


function infoSimulacion() {
  inputInfoOculta.value =  `monto: ${info.monto}, plazo: ${info.plazo}, intereses: ${info.intereses}, tea: ${info.tea.toFixed(2)}, tem: ${info.tem.toFixed(2)}`;
}

// Solo envia por Metodo POST la informacion si existe la simulacion
prestamoSeleccionado();
info != ""  && infoSimulacion();