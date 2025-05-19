// Variables para controlar el estado del juego
let preguntas; // Aquí se guardan todas las preguntas del XML
let indice = 0; // Número de la pregunta actual que se está mostrando
let correctas = 0; // Contador de respuestas correctas
let tiempo = 0; // Contador del tiempo en segundos
let intervalo; // Variable para guardar el temporizador
let respuestasUsuario = []; // Arreglo para guardar qué opción eligió el usuario en cada pregunta
let idiomaActual = "es"; // Idioma por defecto (español)
let xmlActual = "preguntas.xml"; // Archivo XML que se cargará al iniciar (por defecto en español)

// Textos en dos idiomas para que el juego se adapte automáticamente
const textosIdioma = {
  es: { // Textos en español
    anterior: "Anterior",
    siguiente: "Siguiente",
    jugar: "Jugar",
    otraVez: "Jugar otra vez",
    completado: "¡Misión cumplida!",
    eslogan: "Yo soy la noche. Yo soy Batman.",
    tiempo: "Tardaste",
    aciertos: "Acertaste"
  },
  en: { // Textos en inglés
    anterior: "Previous",
    siguiente: "Next",
    jugar: "Play",
    otraVez: "Play again",
    completado: "Mission accomplished!",
    eslogan: "I am the night. I am Batman.",
    tiempo: "You took",
    aciertos: "You got right"
  }
};

// Función que inicia el juego
function empezar(xmlPath, idioma) {
  idiomaActual = idioma; // Guardamos el idioma actual
  xmlActual = xmlPath;   // Guardamos qué archivo XML se usará

  // Ocultamos la pantalla inicial y mostramos el quiz
  document.getElementById("pantalla-inicial").style.display = "none";
  document.getElementById("pantalla-quiz").style.display = "flex";
  document.getElementById("resultado").style.display = "none";

  // Reiniciamos valores por si ya se jugó una vez
  tiempo = 0;
  correctas = 0;
  indice = 0;
  respuestasUsuario = [];

  // Iniciamos el temporizador para contar los segundos
  clearInterval(intervalo);
  intervalo = setInterval(() => {
    tiempo++;
    actualizarReloj(); // Actualiza el reloj visualmente
  }, 1000); // Cada 1000 ms (1 segundo)

  cargarXML(xmlActual); // Cargamos las preguntas desde el XML
}

// Función que carga el archivo XML con las preguntas
function cargarXML(path) {
  const xhttp = new XMLHttpRequest(); // Creamos una petición HTTP
  xhttp.onload = function () {
    preguntas = this.responseXML.getElementsByTagName("question"); // Guardamos todas las preguntas
    mostrarPregunta(); // Mostramos la primera pregunta
  };
  xhttp.open("GET", path); // Indicamos el archivo que queremos abrir
  xhttp.send(); // Enviamos la petición
}

// Función que muestra la pregunta actual
function mostrarPregunta() {
  // Si ya hemos terminado todas las preguntas:
  if (indice >= preguntas.length) {
    clearInterval(intervalo); // Paramos el reloj

    // Ocultamos el quiz y mostramos el resultado
    document.getElementById("pantalla-quiz").style.display = "none";
    const resultado = document.getElementById("resultado");
    resultado.style.display = "flex";
    resultado.style.flexDirection = "column";
    resultado.style.justifyContent = "center";
    resultado.style.alignItems = "center";
    resultado.style.backgroundImage = "url('https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExODJ3cndjb3hqZnZlejBiZXNyb2RzZmF4ZnA4Z20yczh4b3NpcGdqcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/14bhmZtBNhVnIk/giphy.gif')";
    resultado.style.backgroundSize = "cover";
    resultado.style.backgroundPosition = "center";
    resultado.style.color = "#ffe81f";

    // Mostramos el mensaje final con los datos
    resultado.innerHTML = `
    <div class="pantalla-final" style="background: rgba(0,0,0,0.7); padding: 40px; border-radius: 16px; text-align: center; max-width: 500px;">
      <h2 style="font-size: 2.2em; margin-bottom: 20px;">${textosIdioma[idiomaActual].completado}</h2>
      <p style="font-size: 1.6em; margin: 10px 0;"><strong>${textosIdioma[idiomaActual].tiempo}:</strong> ${tiempo}s</p>
      <p style="font-size: 1.6em; margin: 10px 0;"><strong>${textosIdioma[idiomaActual].aciertos}:</strong> ${correctas} / ${preguntas.length}</p>
      <button onclick="reiniciar()" style="margin-top: 30px;">${textosIdioma[idiomaActual].otraVez}</button>
      <p style="margin-top: 25px; font-style: italic; font-size: 1.1em;">"${textosIdioma[idiomaActual].eslogan}"</p>
      <p style="margin-top: 30px; font-size: 0.9em; opacity: 0.3;">@darfixs en GitHub</p> 
    </div>`; //En la linea 98, añado mi github obviamente siempre es importante mostrar los creditos jeje..
  
    return; // Salimos de la función
  }

  // Mostramos la pregunta actual
  const q = preguntas[indice];
  const enunciado = q.getElementsByTagName("wording")[0].textContent;
  const opciones = q.getElementsByTagName("choice");

  // Ponemos el texto de la pregunta en pantalla
  document.getElementById("pregunta").textContent = enunciado;
  const contenedor = document.getElementById("respuestas");
  contenedor.innerHTML = ""; // Vaciamos las respuestas anteriores

  // Mostrar u ocultar los botones según la posición
  document.getElementById("btnAnterior").style.display = indice === 0 ? "none" : "inline-block";
  document.getElementById("btnSiguiente").style.display = indice === preguntas.length - 1 ? "none" : "inline-block";

  // Cambiar los textos de los botones según el idioma
  document.getElementById("btnAnterior").textContent = textosIdioma[idiomaActual].anterior;
  document.getElementById("btnSiguiente").textContent = textosIdioma[idiomaActual].siguiente;

  const botonera = document.getElementById("botonera");
  botonera.style.justifyContent = indice === 0 || indice === preguntas.length - 1 ? "center" : "space-between";

  // Mostramos las opciones de respuesta
  for (let i = 0; i < opciones.length; i++) {
    const texto = opciones[i].textContent;
    const esCorrecta = opciones[i].getAttribute("correct") === "yes";

    const div = document.createElement("div");
    div.className = "respuesta";
    div.textContent = texto;

    // Si ya se había respondido esta pregunta antes, marcamos la opción
    if (respuestasUsuario[indice] !== undefined && respuestasUsuario[indice] === i) {
      div.classList.add(esCorrecta ? "correcta" : "incorrecta", "selected");
    }

    // Cuando el usuario hace clic en una respuesta
    div.onclick = () => {
      if (respuestasUsuario[indice] !== undefined) return; // No permitir repetir respuesta
      respuestasUsuario[indice] = i; // Guardar la respuesta

      // Quitar selección anterior y marcar la actual
      const todas = document.querySelectorAll(".respuesta");
      todas.forEach(r => r.classList.remove("selected"));
      div.classList.add("selected");

      // Si es correcta o no
      if (esCorrecta) {
        correctas++;
        div.classList.add("correcta");
      } else {
        div.classList.add("incorrecta");
      }

      actualizarAciertos(); // Actualiza el contador de aciertos

      // Si ya se han respondido todas, mostramos resultado
      const respondidas = respuestasUsuario.filter(r => r !== undefined).length;
      if (respondidas === preguntas.length) {
        setTimeout(() => {
          indice = preguntas.length; // Forzamos a que entre en modo resultado
          mostrarPregunta(); // Mostrar pantalla final
        }, 700); // Espera para mostrar bien el color de respuesta
      }
    };

    contenedor.appendChild(div); // Añadir respuesta al HTML
  }

  actualizarAciertos(); // Siempre actualizar el contador
}

// Ir a la siguiente pregunta
function siguientePregunta() {
  if (indice < preguntas.length - 1) {
    indice++;
    mostrarPregunta();
  }
}

// Volver a la pregunta anterior
function anteriorPregunta() {
  if (indice > 0) {
    indice--;
    mostrarPregunta();
  }
}

// Cambiar idioma al mover el switch
function toggleIdioma() {
  const switchElem = document.getElementById("idiomaSwitch");

  // Si el switch está activado, cambiamos a inglés
  if (switchElem.checked) {
    idiomaActual = "en";
    xmlActual = "questions.xml";
  } else {
    idiomaActual = "es";
    xmlActual = "preguntas.xml";
  }

  // Recargamos el XML y cambiamos los textos de los botones
  cargarXML(xmlActual);
  document.getElementById("btnAnterior").textContent = textosIdioma[idiomaActual].anterior;
  document.getElementById("btnSiguiente").textContent = textosIdioma[idiomaActual].siguiente;
}

// Reiniciar el juego recargando la página
function reiniciar() {
  location.reload();
}

// Actualizar el contador de aciertos en pantalla
function actualizarAciertos() {
  document.getElementById("aciertos").textContent = `${correctas} / ${preguntas.length}`;
}

// Actualizar el tiempo en pantalla cada segundo
function actualizarReloj() {
  document.getElementById("reloj").textContent = `${tiempo}s`;
}
