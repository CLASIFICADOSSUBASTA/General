const CACHE = "animalitos-v1";
const ARCHIVOS = [
  "./",
  "index.html",
  "style.css",
  "app.js",
  "manifest.json",
  "data/animales.json",
  "images/leon.jpg",
  "images/elefante.jpg",
  "images/vaca.jpg",
  "images/gallina.jpg",
  "images/hipopotamo.jpg",
  "videos/leon.mp4",
  "videos/elefante.mp4",
  "videos/vaca.mp4",
  "videos/gallina.mp4",
  "videos/hipopotamo.mp4"
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((claves) =>
      Promise.all(claves.filter((c) => c !== CACHE).map((c) => caches.delete(c)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((respuesta) => respuesta || fetch(evento.request))
  );
});
