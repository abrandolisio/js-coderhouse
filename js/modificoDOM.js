// Modifico el DOM
function modificoResultados(){
  const info = cargarInfoLocalStorage();
  const pagos = cargarInfoSimulacion();
  if (pagos.length > 0) {
    mostrarResultados(pagos);
    habilitarBusqueda();
    mostrarInfoPrestamo(info);
  }
}
//
function cargarInfoSimulacion() {
  return JSON.parse(localStorage.getItem("pagos")) || [];
}

cargarInfoLocalStorage();
modificoResultados();