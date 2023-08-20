// Obtengo las cotizaciones de la pagina dolarsi.com

const dolarInfoDiv = document.getElementById("cotizaciones");

// Función para obtener la información del dolar y el riesgo pais
async function obtenerInfoDolar() {
  const response = await fetch(
    "https://www.dolarsi.com/api/api.php?type=valoresprincipales"
  );
  const data = await response.json();
  //con MAP guardo la data en un nuevo array de la casa de cambio, diccionario casa
  const dolarData = data.map((element) => {
    return {
      nombre: element.casa.nombre,
      compra: element.casa.compra,
      venta: element.casa.venta,
      variacion: element.casa.variacion,
    };
  });

  // Selecciono 3 cotizaciones y el valor del riesgo pais que quiero mostrar en el header con un <marquee>
  const dolarSi = dolarData.filter((element) => {
    return [
      "Dolar Oficial",
      "Dolar Contado con Liqui",
      "Dolar turista",
      "Argentina",
    ].includes(element.nombre);
  });

  let salida = `<div class=" lead"><marquee>`;
  for (let i = 0; i < dolarSi.length - 1; i++) {
    salida += `${dolarSi[i].nombre} --> Compra $ ${dolarSi[i].compra} / Venta $ ${dolarSi[i].venta} / Var. ${dolarSi[i].variacion} %  -  `;
  }
  salida += `<span id="riesgo">Riesgo País: ${dolarSi[3].compra} puntos.</span></marquee></div>`;
  dolarInfoDiv.innerHTML = salida;
}

obtenerInfoDolar();
