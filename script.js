let preguntas = [];
let indiceActual = 0;
let puntuacion = 0;
let idioma = 'es';

function cambiarIdioma() {
  idioma = document.getElementById("idioma").value;
  cargarXML();
  reiniciarQuiz();
}

function cargarXML() {
  const xhr = new XMLHttpRequest();
  const archivo = idioma === "es" ? "preguntas_es.xml" : "preguntas_en.xml";

  xhr.open("GET", archivo, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const xml = xhr.responseXML;
      preguntas = Array.from(xml.getElementsByTagName("question"));
      mostrarPregunta();
    }
  };
  xhr.send();
}

function mostrarPregunta() {
  if (indiceActual >= preguntas.length) {
    terminarQuiz();
    return;
  }

  const pregunta = preguntas[indiceActual];
  const enunciado = pregunta.getElementsByTagName("wording")[0].textContent;
  const opciones = Array.from(pregunta.getElementsByTagName("choice"));

  document.getElementById("pregunta").textContent = enunciado;
  const contenedorRespuestas = document.getElementById("respuestas");
  contenedorRespuestas.innerHTML = "";

  opciones.forEach(opcion => {
    const boton = document.createElement("button");
    boton.textContent = opcion.textContent;
    boton.onclick = function () {
      if (opcion.getAttribute("correct") === "yes") {
        puntuacion++;
      }
      document.getElementById("siguiente").disabled = false;
      deshabilitarBotones();
    };
    contenedorRespuestas.appendChild(boton);
  });

  document.getElementById("siguiente").disabled = true;
}

function deshabilitarBotones() {
  const botones = document.querySelectorAll("#respuestas button");
  botones.forEach(b => b.disabled = true);
}

function siguientePregunta() {
  indiceActual++;
  mostrarPregunta();
}

function terminarQuiz() {
  detenerReloj();
  document.getElementById("quiz").style.display = "none";
  document.getElementById("resultado").style.display = "block";
  document.getElementById("resultado").innerHTML =
    (idioma === "es"
      ? `¡Has terminado! Tu puntuación es: ${puntuacion} / ${preguntas.length}`
      : `You finished! Your score is: ${puntuacion} / ${preguntas.length}`);
}

function reiniciarQuiz() {
  indiceActual = 0;
  puntuacion = 0;
  document.getElementById("quiz").style.display = "block";
  document.getElementById("resultado").style.display = "none";
  iniciarReloj();
}
