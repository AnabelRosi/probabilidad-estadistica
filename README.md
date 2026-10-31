# Probabilidad y Estadística: sitio web

Sitio educativo con el material de la materia organizado en cuatro unidades.
Usa React, Vite, Material UI y React Router.

## Estructura

```
proyecto-web/
├── index.html
├── vite.config.js           base relativa ('./') para GitHub Pages
├── public/materiales/       archivos publicados (unidad-1 … unidad-4)
└── src/
    ├── data/materiales.js   unidades, temas y materiales (fuente única de contenido)
    ├── components/          Layout (menú) y MaterialCard (ver / descargar)
    └── pages/               Inicio, Unidad, NoEncontrada
```

Rutas (HashRouter): `#/`, `#/unidad/1` … `#/unidad/4`.

## Uso local

```bash
npm install
npm run dev
```

Para generar el sitio estático en `dist/`: `npm run build` (vista previa con `npm run preview`).

## Cómo publicar un material

Los documentos originales están en `../materiales-originales/` y **no se modifican ni se mueven**.
El inventario está en `../inventario/inventario-materiales.csv`.

1. **Copiar** el archivo, con su nombre real, a `public/materiales/unidad-N/`.
2. En `src/data/materiales.js`, agregarlo con `publicado(...)` indicando su formato real.
3. Registrar en el inventario su `estado_publicacion`, `ruta_publica` y `acciones_web`.

Solo los materiales con estado `disponible` y `archivo` muestran acciones: **Ver** (en una pestaña nueva) y **Descargar**.
Los PPTX y DOCX se ven como PDF: junto a cada uno hay una copia `.pdf` con el mismo nombre (convertida con LibreOffice),
y "Descargar" baja el archivo original. Si se cambia un PPTX o DOCX hay que volver a generar su PDF.

## Criterio de publicación vigente

- Decisión de la autora: **todo el material existente se publica**, incluidos los cuatro trabajos prácticos
  resueltos. El sitio funciona como entrega académica completa.
- Apuntes, presentaciones y TP son copias idénticas de los originales: no se alteran créditos ni atribuciones internas.
  Las cuatro infografías se publican en su versión corregida (`*_corregida.png`); los originales se conservan.
  Las discrepancias de autoría y las erratas conocidas se registran en el inventario.

## Publicación en GitHub Pages

El workflow `.github/workflows/deploy.yml` compila y publica el sitio en cada push a `main`.
En el repositorio de GitHub hay que elegir una sola vez **Settings → Pages → Source: GitHub Actions**.
La `base` relativa y el HashRouter permiten publicar en `https://<usuario>.github.io/<repositorio>/`
sin depender del nombre del repositorio.
