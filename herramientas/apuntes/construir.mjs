// Uso: node construir.mjs <uN> : lee out/uN + cfg/uN.json y genera html/unidad-N.html + img/uN/*.png
import fs from 'node:fs'
import path from 'node:path'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { leerPagina, agruparLineas } from './lineas.mjs'

const un = process.argv[2]
const carpeta = `out/${un}`
const cfg = JSON.parse(fs.readFileSync(`cfg/${un}.json`, 'utf8'))
const nUnidad = un.replace('u', '')
fs.mkdirSync('html', { recursive: true }); fs.mkdirSync(`img/${un}`, { recursive: true })

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const SYMBOL = { 0x65: 'ε', 0xB3: '≥', 0xA3: '≤', 0xC7: '∩', 0xC8: '∪', 0xB4: '×', 0xA5: '∞', 0xAE: '→', 0xB1: '±', 0xB9: '≠', 0xBB: '≈', 0xD6: '√', 0xB7: '•', 0x6D: 'μ', 0x73: 'σ', 0x70: 'π', 0x53: 'Σ', 0x57: 'Ω', 0x77: 'ω', 0x44: 'Δ', 0x6C: 'λ' }
const mat = (s) => s
  .replace(/[\u{1D400}-\u{1D7FF}]/gu, (c) => c.normalize('NFKC'))
  .replace(/[-]/g, (c) => SYMBOL[c.charCodeAt(0) - 0xF000] ?? c)
const esNeg = (f) => /bold|black|heavy/i.test(f)
const esCur = (f) => /italic|oblique/i.test(f)
const BALA = /^[-•·▪●○◦–-]\s*/

const paginas = fs.readdirSync(carpeta).filter((f) => f.startsWith('pagina-')).length
const flujo = []   // elementos en orden de lectura
const altoPag = 842

for (let n = 1; n <= paginas; n++) {
  const p = leerPagina(carpeta, n)
  const rec = (cfg.recortes || []).filter((r) => r.pagina === n)
  const tabs = (cfg.tablas || []).filter((t) => t.pagina === n)
  const enCaja = (c, it) => it.x >= c[0] - 2 && it.x <= c[2] && it.y >= c[1] - 2 && it.y <= c[3] + 2
  const dentro = (it) => rec.some((r) => enCaja(r.caja, it)) || tabs.some((t) => enCaja(t.caja, it))
  for (const t of tabs) {
    const celdas = p.items.filter((i) => i.s !== undefined && i.s.trim() && enCaja(t.caja, i))
    flujo.push({ t: 'T', pag: n, y: t.caja[1] + n * 1000, tabla: t, celdas })
  }
  let items = p.items.filter((i) => i.s !== undefined && i.s.length && !dentro(i))
  // Ítems pequeños (índices, límites) se asocian a la línea normal más cercana como sup/sub
  const hCuerpo = Math.max(...items.map((i) => i.h)) || 11
  const normales = items.filter((i) => i.h >= hCuerpo * 0.8)
  for (const it of items) {
    if (it.h < hCuerpo * 0.8) {
      const base = normales.filter((b) => Math.abs(b.y - it.y) <= 9 && it.x >= b.x - 3 && it.x <= b.x + b.w + 3).sort((a, b) => Math.abs(a.y - it.y) - Math.abs(b.y - it.y))[0]
      if (base) { it.ind = it.y < base.y - 1.5 ? 'sup' : 'sub'; it.yReal = it.y; it.y = base.y }
    }
  }
  for (const l of agruparLineas(items)) {
    if (l.y > 770 || /PROB.*ESTAD.*PONTI/i.test(l.texto)) continue          // pie de página
    flujo.push({ t: 'L', pag: n, y: l.y + n * 1000, l })
  }
  const dentroDeRecorte = (im) => [...rec, ...tabs].some((r) => { const c = r.caja; const cx = im.x + im.w / 2, cy = im.y + im.h / 2; return cx >= c[0] && cx <= c[2] && cy >= c[1] && cy <= c[3] })
  for (const im of p.imagenes) if (im.archivo && !dentroDeRecorte(im)) flujo.push({ t: 'I', pag: n, y: im.y + n * 1000, im })
  for (const r of rec) flujo.push({ t: 'R', pag: n, y: r.caja[1] + n * 1000, r })
}
flujo.sort((a, b) => a.y - b.y)
// Imágenes que comparten altura en la misma página se muestran juntas, en una fila, ordenadas por x
{
  const usado = new Set()
  for (const e of flujo) {
    if (e.t !== 'I' || usado.has(e)) continue
    const fila = [e]; usado.add(e)
    const [a0, a1] = [e.im.y, e.im.y + e.im.h]
    for (const o of flujo) {
      if (o.t !== 'I' || usado.has(o) || o.pag !== e.pag) continue
      const solape = Math.min(a1, o.im.y + o.im.h) - Math.max(a0, o.im.y)
      if (solape > 10) { fila.push(o); usado.add(o) }
    }
    e.fila = fila.sort((a, b) => a.im.x - b.im.x).map((x) => x.im)
  }
  for (let i = flujo.length - 1; i >= 0; i--) if (flujo[i].t === 'I' && !flujo[i].fila) flujo.splice(i, 1)
}

function inline(l) {
  let out = '', prev = null, abierto = []
  const cierra = () => { while (abierto.length) out += `</${abierto.pop()}>` }
  for (const it of l.items) {
    const s = mat(it.s)
    const tags = []
    if (esNeg(it.f)) tags.push('strong')
    if (esCur(it.f)) tags.push('em')
    if (it.ind) tags.push(it.ind)
    const clave = tags.join(',')
    if (clave !== prev) { cierra(); for (const t of tags) { out += `<${t}>`; abierto.push(t) } ; abierto.reverse(); prev = clave }
    out += esc(s)
  }
  cierra()
  return out
}
const plano = (l) => mat(l.items.map((i) => i.s).join('')).replace(/\s+/g, ' ').trim()

function textoLinea(l) {
  let txt = '', fin = null
  for (const it of l.items) {
    if (it.ind) { txt += mat(it.s); fin = it.x + it.w; continue }
    if (fin !== null && it.x - fin > it.h * 0.18 && !txt.endsWith(' ') && !it.s.startsWith(' ')) txt += ' '
    txt += mat(it.s); fin = it.x + it.w
  }
  return txt.replace(/\s+/g, ' ').trim()
}

// Une las líneas en un HTML de línea con espacios entre tramos
function htmlLinea(l) {
  let out = '', fin = null, tagAbierto = null
  const abrir = (t) => { if (tagAbierto !== t) { if (tagAbierto) out += `</${tagAbierto}>`; if (t) out += `<${t}>`; tagAbierto = t } }
  for (const it of l.items) {
    const s = mat(it.s)
    const t = it.ind ? it.ind : esNeg(it.f) && !l.negrita ? 'strong' : esCur(it.f) && /italic/i.test(it.f) && false ? 'em' : null
    if (!it.ind && fin !== null && it.x - fin > it.h * 0.18 && !out.endsWith(' ') && !s.startsWith(' ')) { abrir(null); out += ' ' }
    abrir(t); out += esc(s); fin = it.x + it.w
  }
  abrir(null)
  const limpio = out.replace(/\s+/g, ' ').trim()
  return l.negrita && limpio ? `<strong>${limpio}</strong>` : limpio
}

function htmlTabla(t, celdas) {
  const cols = [-Infinity, ...t.cols, Infinity], filas = t.filas
  const nFilas = filas.length - 1, nCols = cols.length - 1
  const cuerpo = Array.from({ length: nFilas }, () => Array.from({ length: nCols }, () => []))
  for (const it of celdas) {
    const r = filas.findIndex((b, i) => i < nFilas && it.y >= b && it.y < filas[i + 1])
    const c = cols.findIndex((b, i) => i < nCols && it.x >= b && it.x < cols[i + 1])
    if (r >= 0 && c >= 0) cuerpo[r][c].push(it)
  }
  const texto = (its) => {
    its.sort((a, b) => (Math.abs(a.y - b.y) > 3 ? a.y - b.y : a.x - b.x))
    let out = '', prev = null
    for (const it of its) {
      const s1 = mat(it.s)
      if (prev) { const mismaLinea = Math.abs(prev.y - it.y) <= 3; if (!mismaLinea || it.x - (prev.x + prev.w) > 1.5) out += ' ' }
      out += s1; prev = it
    }
    return esc(out.replace(/\s+/g, ' ').trim())
  }
  const enc = t.encabezado ?? 1
  let h = '<div class="tabla"><table>'
  if (t.leyenda) h += `<caption>${esc(t.leyenda)}</caption>`
  cuerpo.forEach((fila, r) => {
    if (r === 0 && enc) h += '<thead>'
    if (r === enc) h += '<tbody>'
    h += '<tr>' + fila.map((c, j) => (r < enc ? `<th scope="col">${texto(c)}</th>` : j === 0 && t.primeraColumnaTh ? `<th scope="row">${texto(c)}</th>` : `<td>${texto(c)}</td>`)).join('') + '</tr>'
    if (r === enc - 1) h += '</thead>'
  })
  if (nFilas > enc) h += '</tbody>'
  return h + '</table></div>'
}

const titulos = cfg.titulos || []
// Coincidencia exacta; si el texto del título termina en * se compara solo el comienzo
const nivelTitulo = (t) => { for (const [txt, niv] of titulos) { if (txt.endsWith('*') ? t.startsWith(txt.slice(0, -1)) : t === txt) return niv } return 0 }
const omitir = (t) => (cfg.omitir || []).some((o) => t === o || t.startsWith(o))
const MARG = cfg.margenDer || 495
let html = [], par = null, lista = null
const cierraPar = () => { if (par) { html.push(`<p>${par.partes.join(' ')}</p>`); par = null } }
const cierraLista = () => { if (lista) { html.push('<ul>' + lista.map((i) => `<li>${i}</li>`).join('') + '</ul>'); lista = null } }
const cierraTodo = () => { cierraPar(); cierraLista() }
let ultY = null, copiadas = new Set()

for (const e of flujo) {
  if (e.t === 'I') {
    cierraTodo()
    const figs = []
    for (const im of e.fila) {
      const tx = (cfg.imagenesTexto || {})[im.archivo]
      if (tx) { figs.push({ texto: tx }); continue }
      const nombre = `u${nUnidad}-${im.archivo.replace('img-', '').replace('.png', '')}.png`
      if (!copiadas.has(nombre)) { fs.copyFileSync(path.join(carpeta, im.archivo), `img/${un}/${nombre}`); copiadas.add(nombre) }
      const alt = (cfg.alt || {})[im.archivo]
      if (!alt) console.log('  ⚠ sin texto alternativo:', im.archivo)
      figs.push({ img: `<img src="materiales/contenido/unidad-${nUnidad}/${nombre}" alt="${esc(alt || 'Figura del apunte')}" style="width:${Math.round(im.w * 1.25)}px" loading="lazy">`, pequena: im.h < 100 })
    }
    for (const f of figs.filter((x) => x.texto)) html.push(`<div class="recuadro">${f.texto}</div>`)
    const imgs = figs.filter((x) => x.img)
    if (imgs.length === 1) html.push(`<figure class="${imgs[0].pequena ? 'formula' : 'figura'}">${imgs[0].img}</figure>`)
    else if (imgs.length > 1) html.push(`<figure class="fila">${imgs.map((x) => x.img).join('')}</figure>`)
    ultY = e.y; continue
  }
  if (e.t === 'T') {
    cierraTodo()
    html.push(htmlTabla(e.tabla, e.celdas))
    ultY = e.y; continue
  }
  if (e.t === 'R') {
    cierraTodo()
    const r = e.r, nombre = `u${nUnidad}-f${String(r.pagina).padStart(2, '0')}-${r.id}.png`
    if (r.html) { html.push(r.html); ultY = e.y; continue }
    html.push(`<figure class="formula"><img src="materiales/contenido/unidad-${nUnidad}/${nombre}" alt="${esc(r.alt)}" style="width:${Math.round((r.caja[2] - r.caja[0]) * 1.25)}px"></figure>`)
    ultY = e.y; continue
  }
  const l = e.l, t = textoLinea(l)
  if (omitir(t)) continue
  const niv = nivelTitulo(t)
  if (niv) { cierraTodo(); html.push(`<h${niv + 2}>${htmlLinea(l)}</h${niv + 2}>`); ultY = e.y; continue }
  const bala = l.items.length && BALA.test(mat(l.items[0].s)) && l.x0 >= 95
  const sinBala = (txt) => txt.replace(BALA, '')
  if (bala) {
    cierraPar()
    if (!lista) lista = []
    lista.push(htmlLinea(l).replace(BALA, '')); ultY = e.y; continue
  }
  if (lista && l.x0 >= 95 && (e.y - ultY) < l.h * 1.9 && !(cfg.nuevoParrafo || []).some((x) => t.startsWith(x))) { lista[lista.length - 1] += ' ' + htmlLinea(l); ultY = e.y; continue }
  cierraLista()
  if (l.negrita && /[=<>]/.test(t) && t.length < 80) { cierraPar(); html.push(`<p class="formula-texto">${htmlLinea(l)}</p>`); ultY = e.y; continue }
  const cruzaPagina = par && e.pag !== par.pag && par.xFin > MARG - 30 && /^[a-záéíóúñ(]/.test(t) && Math.abs(l.x0 - par.x0) < 5
  const sigue = cruzaPagina || (par && e.pag === par.pag && (l.x0 - par.x0) > -5 && (l.x0 - par.x0) < 22 && !/^(\d+[.)]|[a-z]\))\s/.test(t) && (e.y - ultY) < l.h * 1.9 && par.xFin > MARG - 30 && !(cfg.nuevoParrafo || []).some((x) => t.startsWith(x)))
  if (sigue) { par.partes.push(htmlLinea(l)); par.xFin = l.x1; par.pag = e.pag }
  else { cierraPar(); par = { x0: (cfg.nuevoParrafo || []).some((x) => t.startsWith(x)) ? 85 : l.x0, xFin: l.x1, pag: e.pag, partes: [htmlLinea(l)] } }
  ultY = e.y
}
cierraTodo()

let salida = html.join('\n')
for (const [de, a] of cfg.reemplazos || []) salida = salida.split(de).join(a)
fs.writeFileSync(`html/unidad-${nUnidad}.html`, salida)

// Recortes de fórmulas desde la vista ampliada de la página
for (const r of (cfg.recortes || []).filter((x) => !x.html)) {
  const src = path.join(carpeta, `vista-${String(r.pagina).padStart(2, '0')}.png`)
  const im = await loadImage(src)
  const esc1 = im.width / 595.3
  const [x0, y0, x1, y1] = r.caja.map((v) => v * esc1)
  const c = createCanvas(Math.round(x1 - x0), Math.round(y1 - y0)), cx = c.getContext('2d')
  cx.fillStyle = '#fff'; cx.fillRect(0, 0, c.width, c.height)
  cx.drawImage(im, x0, y0, x1 - x0, y1 - y0, 0, 0, c.width, c.height)
  if (r.rotular) {   // textos en Arial que el renderizador no dibuja: se escriben encima con su posición exacta
    const pj = leerPagina(carpeta, r.pagina)
    for (const it of pj.items) {
      if ((r.rotular !== 'todo' && !/Arial/i.test(it.f)) || !it.s.trim()) continue
      if (it.x < r.caja[0] - 2 || it.x > r.caja[2] || it.y < r.caja[1] || it.y > r.caja[3] + 4) continue
      cx.fillStyle = '#000'
      cx.font = `${/Bold/i.test(it.f) ? 'bold ' : ''}${/Italic/i.test(it.f) ? 'italic ' : ''}${(it.h * esc1).toFixed(1)}px Arial`
      cx.fillText(it.s, it.x * esc1 - x0, it.y * esc1 - y0)
    }
  }
  fs.writeFileSync(`img/${un}/u${nUnidad}-f${String(r.pagina).padStart(2, '0')}-${r.id}.png`, c.toBuffer('image/png'))
}
console.log(`unidad ${nUnidad}: ${html.length} bloques, ${copiadas.size} imágenes, ${(cfg.recortes || []).length} recortes → html/unidad-${nUnidad}.html`)
