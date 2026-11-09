# Guías de lectura

- En todas las guías, el título del libro es el encabezado grande, con la tipografía y el acento naranja subrayado del sitio. «Guía y resumen» y el autor aparecen debajo en tamaño secundario.

- Todas las páginas cargan `legibility.css` como última hoja de estilo del `<head>`: ahí vive el piso de 12px para etiquetas y el terracota oscuro (`--terra-ink`) para texto chico. Al crear una guía nueva, conservar ese `<link>`.
- Todas las guías (menos La Biblia e Imitación de Cristo, que tienen otra estructura) cargan `<script src="guide-nav.js" defer></script>` justo después de `legibility.css`: agrega el índice y el botón «Continuar donde me quedé». Al crear una guía nueva, incluir esa línea. Funciona solo con la estructura común (`.bar`, `#map > .group > h2.g-title`, `.card[id^="card-"]`, `section.block[id]`).

## Novelas

- El inicio usa un solo recuadro «Resumen y guía de lectura», con la introducción y «Antes de leer».
- El recorrido comienza con «El libro de un vistazo», seguido de personajes y después los capítulos o bloques de la historia. La navegación Anterior/Siguiente sigue ese mismo orden.
- Todo personaje mencionado por nombre en el recorrido debe tener una ficha en la sección de personajes que explique quién es y su relación con los demás. Revisar también personajes secundarios, apodos, nombres alternativos y animales con nombre. Mantener actualizado el inventario de `scripts/novels.test.mjs` al introducir nombres.
- Las identidades que revelan un giro se explican dentro de la sección de spoilers; las fichas previas deben orientar sin revelar ese giro.
- Conservar los identificadores de las tarjetas existentes para mantener el progreso guardado. Ajustar el total de secciones cuando se añadan fichas.
- Verificar `node --test scripts/*.test.mjs` y comprobar en el navegador el salto de vistazo a personajes y de personajes a historia.

## Inicio

- En computadora se ve `index.html` (diseño de estantería). En celular, el `<script id="mobile-swap">` del `<head>` carga `movil.html` (el inicio anterior) sin cambiar la dirección.
- Al agregar un libro, actualizar la lista `BOOKS` en `index.html` y también en `movil.html`.
- La novedad del inicio solo sale si la guía tiene ilustración: imagen vertical 3:4 en `assets/novedades/` y una línea en `PHOTOS` dentro de `index.html`.
- El catálogo para buscadores (`<!-- seo-catalog -->`) se genera con `scripts/seo.mjs`; el código del catálogo termina en el comentario `/* fin del catálogo */`.

## Guías en computadora (diseño nuevo)
- Lo usan `la-paciente-silenciosa.html`, `el-jardin-de-las-mariposas.html`, `la-biblioteca-de-la-medianoche.html`, `el-ultimo-secreto.html`, `piensalo-otra-vez.html` y `la-teoria-let-them.html`. También funciona en guías de no ficción: los bloques de actividades, quiz y notas se acomodan solos. En el celular la guía se ve igual que siempre.
- Tres piezas: el script `#desk-switch` en el `<head>` (pone la clase `desk` en `<html>` si la pantalla mide más de 760 px), `guia-desk.css` y `guia-desk.js`.
- `guia-desk.js` no cambia el contenido: reacomoda lo que la guía ya tiene (tarjetas, progreso, final, notas, comentarios). Los datos propios de cada guía (ficha, imagen de `assets/novedades/`, resumen corto, datos del libro, autores de la guía anterior y siguiente) van en el objeto `GUIDES`.
- Para pasarlo a otra guía: agregar su ficha en `GUIDES`, copiar el script `#desk-switch`, sumar Instrument Sans a la liga de Google Fonts y cargar `guia-desk.css` y `guia-desk.js` después de `guide-nav.js`.
