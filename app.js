const cuadricula = document.getElementById("cuadricula");
const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaVideo = document.getElementById("pantalla-video");
const videoAnimal = document.getElementById("video-animal");
const botonCerrar = document.getElementById("boton-cerrar");

function cerrarVideo() {
  videoAnimal.pause();
  videoAnimal.removeAttribute("src");
  videoAnimal.load();
  pantallaVideo.classList.add("oculto");
}

function abrirVideo(animal) {
  videoAnimal.src = animal.video;
  pantallaVideo.classList.remove("oculto");
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

  boton.addEventListener("click", () => abrirVideo(animal));
  return boton;
}

async function iniciar() {
  const respuesta = await fetch("data/animales.json");
  const animales = await respuesta.json();
  animales.forEach((animal) => cuadricula.appendChild(crearTarjeta(animal)));
}

videoAnimal.addEventListener("ended", cerrarVideo);
botonCerrar.addEventListener("click", cerrarVideo);

iniciar();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
