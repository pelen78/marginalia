# Guías de novelas

- El inicio usa un solo recuadro «Resumen y guía de lectura», con la introducción y «Antes de leer».
- El recorrido comienza con «El libro de un vistazo», seguido de personajes y después los capítulos o bloques de la historia. La navegación Anterior/Siguiente sigue ese mismo orden.
- Todo personaje mencionado por nombre en el recorrido debe tener una ficha en la sección de personajes que explique quién es y su relación con los demás. Revisar también personajes secundarios, apodos, nombres alternativos y animales con nombre. Mantener actualizado el inventario de `scripts/novels.test.mjs` al introducir nombres.
- Las identidades que revelan un giro se explican dentro de la sección de spoilers; las fichas previas deben orientar sin revelar ese giro.
- Conservar los identificadores de las tarjetas existentes para mantener el progreso guardado. Ajustar el total de secciones cuando se añadan fichas.
- Verificar `node --test scripts/*.test.mjs` y comprobar en el navegador el salto de vistazo a personajes y de personajes a historia.
