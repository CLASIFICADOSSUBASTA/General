const pantallaCategorias = document.getElementById("pantalla-categorias");
const cuadriculaCategorias = document.getElementById("cuadricula-categorias");
const pantallaItems = document.getElementById("pantalla-items");
const cuadricula = document.getElementById("cuadricula");
const tituloCategoria = document.getElementById("titulo-categoria");
const botonVolver = document.getElementById("boton-volver");
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

function abrirVideo(item) {
  videoAnimal.src = item.video;
  botonRepetir.classList.add("oculto");
  pantallaVideo.classList.remove("oculto");
  videoAnimal.play().catch(() => {});
}

function repetirVideo() {
  botonRepetir.classList.add("oculto");
  videoAnimal.currentTime = 0;
  videoAnimal.play().catch(() => {});
}

function crearTarjeta(item) {
  const boton = document.createElement("button");
  boton.className = "tarjeta";
  boton.style.backgroundImage = `url("${item.imagen}")`;
  boton.style.backgroundColor = item.color || "#eee";
  boton.setAttribute("aria-label", item.nombre);

  const etiqueta = document.createElement("span");
  etiqueta.className = "etiqueta";
  etiqueta.textContent = item.nombre;
  boton.appendChild(etiqueta);

  boton.addEventListener("click", () => {
    sonarBoop();
    boton.classList.add("tocada");
    boton.addEventListener(
      "animationend",
      () => {
        boton.classList.remove("tocada");
        abrirVideo(item);
      },
      { once: true }
    );
  });
  return boton;
}

function crearTarjetaCategoria(categoria) {
  const boton = document.createElement("button");
  boton.className = "tarjeta tarjeta-categoria";
  boton.style.background = categoria.color;
  boton.setAttribute("aria-label", categoria.nombre);

  const emoji = document.createElement("span");
  emoji.className = "emoji-categoria";
  emoji.textContent = categoria.emoji;

  const etiqueta = document.createElement("span");
  etiqueta.className = "etiqueta";
  etiqueta.textContent = categoria.nombre;

  boton.appendChild(emoji);
  boton.appendChild(etiqueta);

  boton.addEventListener("click", () => {
    sonarBoop();
    boton.classList.add("tocada");
    boton.addEventListener("animationend", () => abrirCategoria(categoria), { once: true });
  });
  return boton;
}

async function abrirCategoria(categoria) {
  const respuesta = await fetch(categoria.archivo);
  const items = await respuesta.json();

  cuadricula.innerHTML = "";
  tituloCategoria.textContent = `${categoria.emoji} ${categoria.nombre}`;

  if (items.length === 0) {
    const vacio = document.createElement("p");
    vacio.className = "mensaje-vacio";
    vacio.textContent = "¡Muy pronto habrá contenido aquí! 🚧";
    cuadricula.appendChild(vacio);
  } else {
    items.forEach((item) => cuadricula.appendChild(crearTarjeta(item)));
  }

  pantallaCategorias.classList.add("oculto");
  pantallaItems.classList.remove("oculto");
}

function volverACategorias() {
  pantallaItems.classList.add("oculto");
  pantallaCategorias.classList.remove("oculto");
}

async function iniciar() {
  const respuesta = await fetch("data/categorias.json");
  const categorias = await respuesta.json();
  categorias.forEach((categoria) => cuadriculaCategorias.appendChild(crearTarjetaCategoria(categoria)));
}

videoAnimal.addEventListener("ended", () => botonRepetir.classList.remove("oculto"));
botonCerrar.addEventListener("click", cerrarVideo);
botonRepetir.addEventListener("click", repetirVideo);
botonVolver.addEventListener("click", volverACategorias);

iniciar();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
