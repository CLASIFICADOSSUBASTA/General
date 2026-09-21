# Animalitos 🐾

App web educativa para bebés y niños pequeños. Muestra una cuadrícula de
animalitos; al tocar uno, se reproduce su video en pantalla completa.

## Cómo verla

Necesitas un servidor local simple (los navegadores no reproducen `fetch`
sobre `file://`):

```bash
python3 -m http.server 8000
```

Luego abre `http://localhost:8000` en el navegador o en una tablet
conectada a la misma red.

## Instalarla como app

Es una PWA (Progressive Web App). Abriéndola en Chrome o Safari en un
celular/tablet, usa la opción "Agregar a pantalla de inicio" y queda como
un ícono más, a pantalla completa, sin barra del navegador.

## Agregar más animalitos

1. Coloca el video en `videos/nombre.mp4` (formato MP4, códec H.264/AAC).
2. Agrega una miniatura en `images/nombre.jpg`.
3. Agrega una entrada en `data/animales.json`:

```json
{ "id": "nombre", "nombre": "Nombre a mostrar", "video": "videos/nombre.mp4", "imagen": "images/nombre.jpg", "color": "#RRGGBB" }
```

No requiere recompilar nada: son solo archivos estáticos.

## Estructura

- `index.html`, `style.css`, `app.js` — la app.
- `data/animales.json` — lista de animalitos.
- `videos/`, `images/` — contenido.
- `manifest.json`, `sw.js` — soporte de instalación y uso sin conexión.
