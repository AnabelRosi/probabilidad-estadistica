// Uso: node extract.mjs <pdf> <carpeta de salida>
// Genera: pagina-NN.json (texto con posición/fuente + imágenes con posición), img-NN-K.png, vista-NN.png
import fs from 'node:fs'
import path from 'node:path'
import { createCanvas, DOMMatrix, ImageData, Path2D, GlobalFonts } from '@napi-rs/canvas'
for (const [f, a] of [['arial.ttf','Arial'],['arialbd.ttf','Arial'],['ariali.ttf','Arial'],['arialbi.ttf','Arial'],['arial.ttf','sans-serif'],['arial.ttf','ArialMT'],['arialbd.ttf','Arial-BoldMT'],['ariali.ttf','Arial-ItalicMT'],['arialbi.ttf','Arial-BoldItalicMT'],['arial.ttf','Helvetica'],['arialbd.ttf','Helvetica-Bold'],['times.ttf','TimesNewRomanPSMT'],['times.ttf','serif'],['calibri.ttf','Calibri-Light'],['calibrib.ttf','Calibri-Bold'],['calibrii.ttf','Calibri-Italic'],['calibri.ttf','Calibri'],['times.ttf','Times New Roman'],['symbol.ttf','Symbol'],['cambria.ttc','Cambria Math']]) { try { GlobalFonts.registerFromPath('C:/Windows/Fonts/' + f, a) } catch (e) { console.log('fuente no registrada', f) } }
globalThis.DOMMatrix ??= DOMMatrix
globalThis.ImageData ??= ImageData
globalThis.Path2D ??= Path2D
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'

const [, , ruta, salida] = process.argv
fs.mkdirSync(salida, { recursive: true })
const datos = new Uint8Array(fs.readFileSync(ruta))
class FabricaLienzos {
  constructor() {}
  create(w, h) { const canvas = createCanvas(w, h); return { canvas, context: canvas.getContext('2d') } }
  reset(c, w, h) { c.canvas.width = w; c.canvas.height = h }
  destroy(c) { c.canvas.width = 0; c.canvas.height = 0 }
}
const doc = await pdfjs.getDocument({ data: datos, useSystemFonts: true, verbosity: 0, CanvasFactory: FabricaLienzos }).promise
const OPS = pdfjs.OPS

const mult = (a, b) => [
  a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3],
  a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5],
]

function pngDesdeImagen(img) {
  const { width, height, data, kind } = img
  const c = createCanvas(width, height)
  const ctx = c.getContext('2d')
  const out = ctx.createImageData(width, height)
  if (kind === 3 || data.length === width * height * 4) {            // RGBA
    out.data.set(data)
  } else if (kind === 2 || data.length === width * height * 3) {     // RGB
    for (let i = 0, j = 0; i < data.length; i += 3, j += 4) { out.data[j] = data[i]; out.data[j + 1] = data[i + 1]; out.data[j + 2] = data[i + 2]; out.data[j + 3] = 255 }
  } else {                                                            // 1 bit por píxel (máscara)
    const fila = Math.ceil(width / 8)
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const bit = (data[y * fila + (x >> 3)] >> (7 - (x & 7))) & 1
      const v = bit ? 255 : 0, j = (y * width + x) * 4
      out.data[j] = out.data[j + 1] = out.data[j + 2] = v; out.data[j + 3] = 255
    }
  }
  ctx.putImageData(out, 0, 0)
  return c.toBuffer('image/png')
}

const paginas = []
for (let n = 1; n <= doc.numPages; n++) {
  const pagina = await doc.getPage(n)
  const vp = pagina.getViewport({ scale: 1 })
  const tc = await pagina.getTextContent()
  const items = []
  for (const it of tc.items) {
    if (!it.str && !it.hasEOL) continue
    const fam = tc.styles[it.fontName]?.fontFamily || ''
    let nombre = it.fontName
    try { nombre = pagina.commonObjs.has(it.fontName) ? pagina.commonObjs.get(it.fontName).name : it.fontName } catch {}
    items.push({
      s: it.str, x: +it.transform[4].toFixed(1), y: +(vp.height - it.transform[5]).toFixed(1),
      w: +it.width.toFixed(1), h: +Math.abs(it.transform[3]).toFixed(1), f: nombre, fam, eol: it.hasEOL,
    })
  }

  // Imágenes: posición real según la matriz de transformación vigente
  const ops = await pagina.getOperatorList()
  let ctm = [1, 0, 0, 1, 0, 0]; const pila = []; const imagenes = []; let k = 0
  for (let i = 0; i < ops.fnArray.length; i++) {
    const fn = ops.fnArray[i], args = ops.argsArray[i]
    if (fn === OPS.save) pila.push(ctm.slice())
    else if (fn === OPS.restore) ctm = pila.pop() || ctm
    else if (fn === OPS.transform) ctm = mult(ctm, args)
    else if (fn === OPS.paintImageXObject || fn === OPS.paintInlineImageXObject || fn === OPS.paintImageMaskXObject) {
      const m = ctm
      const xs = [m[4], m[4] + m[0], m[4] + m[2], m[4] + m[0] + m[2]], ys = [m[5], m[5] + m[1], m[5] + m[3], m[5] + m[1] + m[3]]
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys)
      let img = null
      try {
        if (fn === OPS.paintInlineImageXObject) img = args[0]
        else img = await new Promise((res) => { const t = setTimeout(() => res(null), 4000); pagina.objs.get(args[0], (o) => { clearTimeout(t); res(o) }) })
      } catch {}
      if (!img || !img.data) { imagenes.push({ sinDatos: true, x: x0, y: vp.height - y1, w: x1 - x0, h: y1 - y0 }); continue }
      k++
      const archivo = `img-${String(n).padStart(2, '0')}-${k}.png`
      fs.writeFileSync(path.join(salida, archivo), pngDesdeImagen(img))
      imagenes.push({ archivo, px: [img.width, img.height], x: +x0.toFixed(1), y: +(vp.height - y1).toFixed(1), w: +(x1 - x0).toFixed(1), h: +(y1 - y0).toFixed(1), mascara: fn === OPS.paintImageMaskXObject })
    }
  }

  // Vista de la página, para comparar
  const esc = 3, vp2 = pagina.getViewport({ scale: esc })
  const cv = createCanvas(vp2.width, vp2.height), cx = cv.getContext('2d')
  cx.fillStyle = '#fff'; cx.fillRect(0, 0, vp2.width, vp2.height)
  try {
    await pagina.render({ canvasContext: cx, viewport: vp2, canvas: cv }).promise
    fs.writeFileSync(path.join(salida, `vista-${String(n).padStart(2, '0')}.png`), cv.toBuffer('image/png'))
  } catch (e) { console.log('sin vista de la página', n, String(e.message).slice(0, 80)) }

  const info = { num: n, ancho: +vp.width.toFixed(1), alto: +vp.height.toFixed(1), items, imagenes }
  fs.writeFileSync(path.join(salida, `pagina-${String(n).padStart(2, '0')}.json`), JSON.stringify(info))
  paginas.push({ n, items: items.length, imagenes: imagenes.length })
}
console.log(path.basename(ruta), '→', JSON.stringify(paginas))
