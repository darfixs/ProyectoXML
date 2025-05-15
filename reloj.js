let tiempo = 0;
let intervalo;

function iniciarReloj() {
  tiempo = 0;
  clearInterval(intervalo); // por si acaso ya estaba corriendo
  actualizarReloj();
  intervalo = setInterval(() => {
    tiempo++;
    actualizarReloj();
  }, 1000);
}

function detenerReloj() {
  clearInterval(intervalo);
}

function actualizarReloj() {
  document.getElementById("reloj").textContent = (idioma === "es"
    ? `Tiempo: ${tiempo}s`
    : `Time: ${tiempo}s`);
}
