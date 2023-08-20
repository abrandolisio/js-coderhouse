// Obtengo la data del Local Storage
function cargarInfoLocalStorage() {
  return JSON.parse(localStorage.getItem("info")) || [];
}

// Para poder ver correctamenta el monto doy formato al numero
function separadorMiles(numero) {
  let partes = numero.toString().split(".");
  partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return partes.join(",");
}
