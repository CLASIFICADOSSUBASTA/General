const CACHE = "aprendo-jugando-v1";
const ARCHIVOS = [
  "./",
  "index.html",
  "style.css",
  "app.js",
  "manifest.json",
  "data/categorias.json",
  "data/animales.json",
  "data/letras.json",
  "data/numeros.json",
  "data/colores.json",
  "images/leon.jpg",
  "images/elefante.jpg",
  "images/vaca.jpg",
  "images/gallina.jpg",
  "images/hipopotamo.jpg",
  "images/gato.jpg",
  "images/oveja.jpg",
  "images/caballo.jpg",
  "images/perro.jpg",
  "images/jirafa.jpg",
  "videos/leon.mp4",
  "videos/elefante.mp4",
  "videos/vaca.mp4",
  "videos/gallina.mp4",
  "videos/hipopotamo.mp4",
  "videos/gato.mp4",
  "videos/oveja.mp4",
  "videos/caballo.mp4",
  "videos/perro.mp4",
  "videos/jirafa.mp4"
];

const ES_MEDIA = /\/(videos|images|icons)\//;

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
  const esMedia = ES_MEDIA.test(new URL(evento.request.url).pathname);

  if (esMedia) {
    // Videos e imágenes pesan mucho: se sirven de la caché primero para funcionar sin conexión.
    evento.respondWith(
      caches.match(evento.request).then(
        (enCache) =>
          enCache ||
          fetch(evento.request).then((respuesta) => {
            const copia = respuesta.clone();
            caches.open(CACHE).then((cache) => cache.put(evento.request, copia));
            return respuesta;
          })
      )
    );
  } else {
    // El código de la app se pide siempre a la red primero para que las actualizaciones lleguen al instante.
    evento.respondWith(
      fetch(evento.request)
        .then((respuesta) => {
          const copia = respuesta.clone();
          caches.open(CACHE).then((cache) => cache.put(evento.request, copia));
          return respuesta;
        })
        .catch(() => caches.match(evento.request))
    );
  }
});
