# Cómo se generó el texto de los apuntes

El texto de cada unidad que se lee en la web (`src/contenido/unidad-N.html`) se generó a partir de los PDF originales,
no se escribió a mano. Estos archivos permiten rehacerlo si cambia un PDF. **No forman parte del sitio publicado.**

1. `extract.mjs`: lee un PDF y guarda, por página, el texto con su posición, las imágenes incrustadas y una vista de la página.
2. `lineas.mjs`: agrupa ese texto en líneas, para revisarlo.
3. `construir.mjs` + `cfg/uN.json`: arma el HTML de la unidad N. El `cfg` define los títulos, las tablas, los recortes de
   fórmulas y gráficos (cada uno con su texto alternativo) y los bloques que se transcribieron a mano porque el PDF
   perdía símbolos (∪, ∩, barras de complemento).
4. `gen_u1.py` genera `cfg/u1.json` (la Unidad 1 tiene muchas tablas).
5. `cobertura.py` compara las palabras del PDF con las del texto generado para detectar pérdidas.

Requiere Node 20 o más, y `npm install pdfjs-dist@4.7.76 @napi-rs/canvas` en una carpeta de trabajo aparte
(no se agregan al proyecto del sitio). Las rutas del código apuntan a esa carpeta de trabajo.
