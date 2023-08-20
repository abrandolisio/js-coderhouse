// Constante y varibles globales.
const iva = 0.21;
let monto;
let plazo;
let intereses;
let diaVencimiento;
// Obtengo los datos del DOM
let simulacionDom = document.getElementById("formSimulador");
const inputMontoDom = document.getElementById("monto");
const selectDom = document.getElementById("selectCondicion");
const buscarDom = document.getElementById("opcionesBuscar");
const infoDom = document.getElementById("infoPrestamo");
const resultadoDom = document.getElementById("resultado");

/* Uso LUXON para obtener la fecha*/
let DateTime = luxon.DateTime;


simulacionDom.addEventListener("submit", iniciaSimulacion);
function iniciaSimulacion(event) {
  event.preventDefault();

  monto = parseInt(inputMontoDom.value);
  plazo = parseInt(condiciones[selectDom.value].plazo);
  intereses = parseFloat(condiciones[selectDom.value].intereses);
  diaVencimiento = DateTime.now().day.toString().padStart(2, "0");
  
  calcularPagos(monto, plazo, intereses);
  guardaInfoLotalStorage();
  guardaSimulacionLocalStorage(pagos);

  const info = cargarInfoLocalStorage();
  habilitarBusqueda();
  mostrarInfoPrestamo(info);
  mostrarResultados(pagos);
  document.getElementById("continua").innerHTML = "";
  scroll();
}

// Calculo los pagos
const calcularPagos = (monto, plazo, intereses) => {
  pagos = [];
  const interesMensual = intereses / 100 / 12;
  const cuotaPura =
    (monto * (interesMensual * Math.pow(1 + interesMensual, plazo))) /
    (Math.pow(1 + interesMensual, plazo) - 1);

  // Calculo los pagos mensuales desde el mes 1 al seleccionado con un bucle.
  for (let i = 1; i <= plazo; i++) {
    if (i === 1) {
      saldoDeuda = monto;
    } else {
      saldoDeuda = saldoDeuda - capital;
    }
    // Obtengo la fecha de pago usando LUXON
    const fecha = DateTime.local().plus({ months: i });
    const fechaCuota = fecha.toFormat("dd-MM-yyyy");
    
    calculaInteres(saldoDeuda, interesMensual);
    calculaCapital(cuotaPura, interes);
    calculaIva(iva, interes);
    calculaCuotaTotal(capital, interes, pagoIva);
    // Almaceno los valores en el array "pagos", redondeando los resultados a dos decimales
    pagos.push({
      cuotaN: i,
      vtoCuota: fechaCuota,
      saldoDeuda: saldoDeuda.toFixed(2),
      cuotaPura: cuotaPura.toFixed(2),
      capital: capital.toFixed(2),
      intereses: interes.toFixed(2),
      iva: pagoIva.toFixed(2),
      cuotaTotal: cuotaTotal.toFixed(2),
    });
  }

  calculaTasaEfectivaMensual();
  calculaTasaEfectivaAnual();
  calcularPrimerVencimiento(pagos);
  calcularUltimoVencimiento(pagos);
};

// Realizo todos los calculos
const calculaInteres = (saldoDeuda, interesMensual) => {
  interes = saldoDeuda * interesMensual;
};

const calculaCapital = (cuotaPura, interes) => {
  capital = cuotaPura - interes;
};

const calculaIva = (iva, interes) => {
  pagoIva = iva * interes;
};

const calculaCuotaTotal = (capital, interes, pagoIva) => {
  cuotaTotal = capital + interes + pagoIva;
};

const calculaTasaEfectivaMensual = () => {
  tem = intereses / 12;
};

const calculaTasaEfectivaAnual = () => {
  tea = (Math.pow(1 + tem / 100, 12) - 1) * 100;
};

const calcularPrimerVencimiento = (pagos) => {
  primerVencimiento = pagos[0].vtoCuota;
};

const calcularUltimoVencimiento = (pagos) => {
  const i = pagos.length - 1;
  ultimoVencimiento = pagos[i].vtoCuota;
};


//tea = tasa efectiva anual, tem = tasa efectiva mensual
const guardaInfoLotalStorage = () => {
  const info = {
    monto: monto,
    plazo: plazo,
    intereses: intereses,
    tea: tea,
    tem: tem,
    diaVencimiento: diaVencimiento,
    primerVencimiento: primerVencimiento,
    ultimoVencimiento: ultimoVencimiento,
  };
  localStorage.setItem("info", JSON.stringify(info));
};

//guarda simulacion en LS
const guardaSimulacionLocalStorage = (pagos) => {
  localStorage.setItem("pagos", JSON.stringify(pagos));
};

//Mostrar la Informacion del Prestamo
const mostrarInfoPrestamo = (info) => {
  infoDom.innerHTML = "";
  let tablaInfo = `<hr>
                  <h2 class="p-2  text-center">Información del Préstamo</h2>
                    <div class="table-responsive m-1 p-1">
                      <table class="table table-striped table-sm text-center background-none ">
                        <thead>                          
                            <tr>
                                <th scope="col">Monto del Préstamo</td>
                                <th scope="col">Plazo</td>
                                <th scope="col">Tasa Nominal Anual</td>
                                <th scope="col">Día de Vencimiento</td>
                                <th scope="col">Primera Cuota</td>
                                <th scope="col">Última Cuota</td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                                <td class="border-bottom text-center"><strong>$${separadorMiles(
                                  info.monto
                                )}</strong></td>
                                <td class="border-bottom text-center"><strong>${
                                  info.plazo
                                } Cuotas</strong></td>
                                <td class="border-bottom text-center"><strong>${
                                  info.intereses
                                }  %</strong></td>
                                <td class="border-bottom text-center"><strong>${
                                  info.diaVencimiento
                                } de cada mes</strong></td>
                                <td class="border-bottom text-center"><strong>${
                                  info.primerVencimiento
                                }</strong></td>
                                <td class="border-bottom text-center"><strong>${
                                  info.ultimoVencimiento
                                }</strong></td>
                        </tbody>
                      </table>
                    </div>`;
  infoDom.innerHTML = tablaInfo;
};

// Mostrar los resultados en una tabla
const mostrarResultados = (pagos) => {
  resultadoDom.innerHTML = "";
  let tabla = `<hr><h2>Resultados de la Simulación</h2>
    <div class="table-responsive">
        <table class="table table-striped table-sm text-center">
            <thead>
                <tr>
                    <th scope="col">Cuota N°</th>
                    <th scope="col">Vencimiento</th>
                    <th scope="col">Saldo Deuda</th>
                    <th scope="col">Capital</th>
                    <th scope="col">Intereses</th>
                    <th scope="col">Cuota Pura</th>
                    <th scope="col">IVA</th>
                    <th scope="col">Cuota Total</th>
                </tr>
            </thead>
            <tbody>`;

  for (var i = 0; i < pagos.length; i++) {
    tabla += `<tr>
                            <td>${pagos[i].cuotaN}</td>
                            <td>${pagos[i].vtoCuota}</td>
                            <td>$${separadorMiles(pagos[i].saldoDeuda)}</td>
                            <td>$${separadorMiles(pagos[i].capital)}</td>
                            <td>$${separadorMiles(pagos[i].intereses)}</td>
                            <td>$${separadorMiles(pagos[i].cuotaPura)}</td>
                            <td>$${separadorMiles(pagos[i].iva)}</td>
                            <td>$${separadorMiles(pagos[i].cuotaTotal)}</td>
                        </tr>`;
  }

  tabla += `</tbody></table></div>
  <a href="./pages/solicitar.html" class="btn btn-success fw-bold">Solicitar</a>
  <button type="button" class="btn btn-danger fw-bold" onclick="borrarTodo()">Borrar</button>`;

  resultadoDom.innerHTML = tabla;
};

// Habilitar funciones de busqueda
const habilitarBusqueda = () => {
  buscarDom.innerHTML = `
  <div class="m-4">
      <div id="stopScroll">
          <label class="fw-bold">Buscar pago por N° de Cuota:
              <input type="number" class="form-control" id="cuotaInput" placeholder="Cuota N°">
          </label>
          <button id="btnBcuota" class="btn text-bg-dark fw-bold  m-1">Buscar</button>
          <button id="btnBorraBcuota" type="button" class="btn btn-danger  m-1">Borrar</button>
      </div>
      <div id="divBusquedaCuota" class="table-responsive col-11 m-2"></div>
  </div>
  <div class="form-group m-4">
      <div>
          <label class="fw-bold">Buscar pago por Vencimiento:
              <input type="date" class="form-control" id="fechaInput">
          </label>
          <button id="btnBfecha" class="btn text-bg-dark fw-bold m-1">Buscar</button>
          <button id="btnBorraBfecha" type="button" class="btn btn-danger m-1">Borrar</button>
      </div>
      <div id="divBusquedaFecha" class="table-responsive col-11 m-2"></div>
  </div>
  `;

  // Obtengo los datos de la busqueda
  let inputCuota = document.getElementById("cuotaInput");
  let botonBuscarCuota = document.getElementById("btnBcuota");

  botonBuscarCuota.onclick = () => {
    const info = cargarInfoLocalStorage();
    plazoMaximo = info.plazo;
    if (inputCuota.value - 1 > info.plazo || inputCuota.value - 1 < 0) {
      Swal.fire({
        icon: "error",
        title: "El Nro de Cuota no existe",
        text: `Debe ingresar un valor entre 1 y ${plazoMaximo}`,
      });
      inputCuota.value = "";
      return 0;
    }
    buscarCuota(inputCuota.value - 1);
  };

  // Buscar por fecha de vencimiento
  let fechaInput = document.getElementById("fechaInput");
  let buscarFechaCuota = document.getElementById("btnBfecha");

  buscarFechaCuota.onclick = () => {
    let fechaLuxon = DateTime.fromISO(fechaInput.value);
    let botonFecha = fechaLuxon.toFormat("dd-MM-yyyy");
    const pagos = cargarInfoSimulacion();

    // Controlo si existe la fecha en el array pagos
    const existeFecha = pagos.some((pagos) => pagos.vtoCuota === botonFecha);
    if (existeFecha == true) {
      buscarFecha(botonFecha);
    } else {
      const info = cargarInfoLocalStorage();
      Swal.fire({
        icon: "error",
        title: "El vencimiento no existe",
        text: `Recuerda que la cuota vence los días ${info.diaVencimiento} de cada mes entre el ${info.primerVencimiento} y ${info.ultimoVencimiento}`,
      });
    }
  };

  // Borrar busqueda por Cuota
  document.getElementById("btnBorraBcuota").addEventListener("click", () => {
    const salida = document.getElementById("divBusquedaCuota");
    salida.innerHTML = "";
    inputCuota.value = "";
  });
  // Borrar busqueda por Fecha
  document.getElementById("btnBorraBfecha").addEventListener("click", () => {
    const salida = document.getElementById("divBusquedaFecha");
    salida.innerHTML = "";
  });
};

// Busqueda por Nro de cuota.
const buscarCuota = (i) => {
  const pagos = cargarInfoSimulacion();
  divBusquedaCuota.innerHTML = `
  <table class="table table-striped table-sm text-center">
    <thead>
        <tr>
            <th scope="col">Cuota N°</th>
            <th scope="col">Vencimiento</th>
            <th scope="col">Saldo Deuda</th>
            <th scope="col">Capital</th>
            <th scope="col">Intereses</th>
            <th scope="col">Cuota Pura</th>
            <th scope="col">IVA</th>
            <th scope="col">Cuota Total</th>
        </tr>
    </thead>
    <tbody>
        <tr>
          <td>${pagos[i].cuotaN}</td>
          <td>${pagos[i].vtoCuota}</td>
          <td>$${separadorMiles(pagos[i].saldoDeuda)}</td>
          <td>$${separadorMiles(pagos[i].capital)}</td>
          <td>$${separadorMiles(pagos[i].intereses)}</td>
          <td>$${separadorMiles(pagos[i].cuotaPura)}</td>
          <td>$${separadorMiles(pagos[i].iva)}</td>
          <td>$${separadorMiles(pagos[i].cuotaTotal)}</td>
        </tr>
    </tbody>
  </table>
  `;
};

// Busqueda por fecha de vencimiento utilizando FILTER
const buscarFecha = (botonFecha) => {
  const pagos = cargarInfoSimulacion();
  const filtroFecha = pagos.filter((pagos) => pagos.vtoCuota == botonFecha);
  divBusquedaFecha.innerHTML = `
  <table class="table table-striped table-sm text-center">
    <thead>
        <tr>
            <th scope="col">Cuota N°</th>
            <th scope="col">Vencimiento</th>
            <th scope="col">Saldo Deuda</th>
            <th scope="col">Capital</th>
            <th scope="col">Intereses</th>
            <th scope="col">Cuota Pura</th>
            <th scope="col">IVA</th>
            <th scope="col">Cuota Total</th>
        </tr>
    </thead>
    <tbody>
        <tr>
          <td>${filtroFecha[0].cuotaN}</td>
          <td>${filtroFecha[0].vtoCuota}</td>
          <td>$${separadorMiles(filtroFecha[0].saldoDeuda)}</td>
          <td>$${separadorMiles(filtroFecha[0].capital)}</td>
          <td>$${separadorMiles(filtroFecha[0].intereses)}</td>
          <td>$${separadorMiles(filtroFecha[0].cuotaPura)}</td>
          <td>$${separadorMiles(filtroFecha[0].iva)}</td>
          <td>$${separadorMiles(filtroFecha[0].cuotaTotal)}</td>
        </tr>
    </tbody>
  </table>
  `;
};

// Borrar Todo
function borrarTodo() {
  localStorage.removeItem("pagos");
  localStorage.removeItem("info");
  infoDom.innerHTML = "";
  resultadoDom.innerHTML = "";
  buscarDom.innerHTML = "";
  document.getElementById("continua").innerHTML = "";
  scrollTop();
}



