//defino como variable global condiciones y la cargo en el array usando Fetch desde archivo JSON
let condiciones = [];

function cargarCondiciones() {
  fetch("./js/paquetes.json")
    .then((response) => response.json())
    .then((data) => {
      condiciones = data;
      renderSelect(data);
    })
    .catch((error) => console.error(error));
}

//cargo las condiciones del  archivo JSON en el DOM label SELECT #selectCondicion del HTML
function renderSelect(x) {
  const opciones = x;
  const select = document.getElementById("selectCondicion");
  let salida = "";
  for (let i = 0; i < opciones.length; i++) {
    const opcion = opciones[i];
    salida += `<option value="${i}">${opcion.plazo} meses - Intereses: ${opcion.intereses}%</option>`;
  }
  select.innerHTML = salida;
}

cargarCondiciones();
