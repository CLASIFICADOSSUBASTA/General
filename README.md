# Aprendo Jugando 🐾🔤🔢🎨

App web educativa para bebés y niños pequeños. Primero eliges una
categoría (Animales, Letras, Números o Colores), luego tocas un elemento
de la cuadrícula y se reproduce su video en pantalla completa.

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

## Agregar más contenido

Cada categoría tiene su propio archivo en `data/` (`animales.json`,
`letras.json`, `numeros.json`, `colores.json`). Para agregar un elemento:

1. Coloca el video en `videos/nombre.mp4` (formato MP4, códec H.264/AAC).
2. Agrega una miniatura en `images/nombre.jpg`.
3. Agrega una entrada en el archivo de esa categoría:

```json
{ "id": "nombre", "nombre": "Nombre a mostrar", "video": "videos/nombre.mp4", "imagen": "images/nombre.jpg", "color": "#RRGGBB" }
```

Una categoría vacía (`[]`) muestra un mensaje de "¡Muy pronto habrá
contenido aquí!" en vez de una cuadrícula vacía.

Para agregar una categoría nueva por completo, súmala a
`data/categorias.json` (con su propio `emoji`, `color` y archivo de
datos) y crea el archivo `data/nueva.json` con `[]`.

No requiere recompilar nada: son solo archivos estáticos.

## Estructura

- `index.html`, `style.css`, `app.js` — la app.
- `data/categorias.json` — las categorías disponibles.
- `data/animales.json`, `letras.json`, `numeros.json`, `colores.json` — el
  contenido de cada categoría.
- `videos/`, `images/` — el contenido en sí.
- `manifest.json`, `sw.js` — soporte de instalación y uso sin conexión.
