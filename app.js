const cuadricula = document.getElementById("cuadricula");
const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaVideo = document.getElementById("pantalla-video");
const videoAnimal = document.getElementById("video-animal");
const botonCerrar = document.getElementById("boton-cerrar");
const botonRepetir = document.getElementById("boton-repetir");

let audioCtx = null;

function sonarBoop() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const ahora = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const ganancia = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, ahora);
    osc.frequency.exponentialRampToValueAtTime(880, ahora + 0.15);
    ganancia.gain.setValueAtTime(0.001, ahora);
    ganancia.gain.exponentialRampToValueAtTime(0.3, ahora + 0.02);
    ganancia.gain.exponentialRampToValueAtTime(0.001, ahora + 0.22);
    osc.connect(ganancia).connect(audioCtx.destination);
    osc.start(ahora);
    osc.stop(ahora + 0.25);
  } catch (error) {
    // el audio es un extra: si falla, seguimos sin sonido
  }
}

function cerrarVideo() {
  videoAnimal.pause();
  videoAnimal.removeAttribute("src");
  videoAnimal.load();
  pantallaVideo.classList.add("oculto");
  botonRepetir.classList.add("oculto");
}

function abrirVideo(animal) {
  videoAnimal.src = animal.video;
  botonRepetir.classList.add("oculto");
  pantallaVideo.classList.remove("oculto");
  videoAnimal.play().catch(() => {});
}

function repetirVideo() {
  botonRepetir.classList.add("oculto");
  videoAnimal.currentTime = 0;
  videoAnimal.play().catch(() => {});
}

function crearTarjeta(animal) {
  const boton = document.createElement("button");
  boton.className = "tarjeta";
  boton.style.backgroundImage = `url("${animal.imagen}")`;
  boton.style.backgroundColor = animal.color || "#eee";
  boton.setAttribute("aria-label", animal.nombre);

  const etiqueta = document.createElement("span");
  etiqueta.className = "etiqueta";
  etiqueta.textContent = animal.nombre;
  boton.appendChild(etiqueta);

  boton.addEventListener("click", () => {
    sonarBoop();
    boton.classList.add("tocada");
    boton.addEventListener(
      "animationend",
      () => {
        boton.classList.remove("tocada");
        abrirVideo(animal);
      },
      { once: true }
    );
  });
  return boton;
}

async function iniciar() {
  const respuesta = await fetch("data/animales.json");
  const animales = await respuesta.json();
  animales.forEach((animal) => cuadricula.appendChild(crearTarjeta(animal)));
}

videoAnimal.addEventListener("ended", () => botonRepetir.classList.remove("oculto"));
botonCerrar.addEventListener("click", cerrarVideo);
botonRepetir.addEventListener("click", repetirVideo);

iniciar();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
