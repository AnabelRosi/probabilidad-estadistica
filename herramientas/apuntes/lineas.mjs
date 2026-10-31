// Uso: node lineas.mjs <carpeta out/uN> [pagina]
// Agrupa los ítems de texto en líneas y las imprime en orden de lectura junto con las imágenes (por posición vertical).
import fs from 'node:fs'
import path from 'node:path'

export function leerPagina(carpeta, n) {
  return JSON.parse(fs.readFileSync(path.join(carpeta, `pagina-${String(n).padStart(2, '0')}.json`), 'utf8'))
}

const esNegrita = (f) => /bold|black|heavy|semibold/i.test(f)
const esCursiva = (f) => /italic|oblique/i.test(f)

export function agruparLineas(items) {
  const util = items.filter((i) => i.s !== undefined && i.s.length > 0)
  util.sort((a, b) => a.y - b.y || a.x - b.x)
  const lineas = []
  for (const it of util) {
    const l = lineas.find((L) => Math.abs(L.y - it.y) <= Math.max(2, it.h * 0.35))
    if (l) l.items.push(it)
    else lineas.push({ y: it.y, items: [it] })
  }
  for (const l of lineas) {
    l.items.sort((a, b) => a.x - b.x)
    l.x0 = l.items[0].x
    l.x1 = Math.max(...l.items.map((i) => i.x + i.w))
    l.h = Math.max(...l.items.map((i) => i.h))
    // une los tramos: agrega espacio si hay hueco entre ellos
    let txt = ''; let prevFin = null
    for (const it of l.items) {
      if (prevFin !== null && it.x - prevFin > it.h * 0.18 && !txt.endsWith(' ') && !it.s.startsWith(' ')) txt += ' '
      txt += it.s; prevFin = it.x + it.w
    }
    l.texto = txt
    l.negrita = l.items.filter((i) => esNegrita(i.f)).reduce((a, i) => a + i.s.length, 0) > txt.length * 0.6
    l.fuente = l.items[0].f
  }
  lineas.sort((a, b) => a.y - b.y)
  return lineas
}

if (process.argv[1].endsWith('lineas.mjs')) {
  const [, , carpeta, solo] = process.argv
  const paginas = fs.readdirSync(carpeta).filter((f) => f.startsWith('pagina-')).length
  for (let n = 1; n <= paginas; n++) {
    if (solo && +solo !== n) continue
    const p = leerPagina(carpeta, n)
    console.log(`\n===== PÁGINA ${n} (${p.ancho}x${p.alto})`)
    const eventos = [
      ...agruparLineas(p.items).map((l) => ({ y: l.y, t: 'L', l })),
      ...p.imagenes.map((im) => ({ y: im.y, t: 'I', im })),
    ].sort((a, b) => a.y - b.y)
    for (const e of eventos) {
      if (e.t === 'L') console.log(`y${String(Math.round(e.y)).padStart(4)} x${String(Math.round(e.l.x0)).padStart(3)}-${String(Math.round(e.l.x1)).padStart(3)} h${e.l.h.toFixed(0).padStart(2)} ${e.l.negrita ? 'B' : ' '} ${e.l.texto.slice(0, 110)}`)
      else console.log(`y${String(Math.round(e.y)).padStart(4)} x${String(Math.round(e.im.x)).padStart(3)}-${String(Math.round(e.im.x + e.im.w)).padStart(3)}       [IMAGEN ${e.im.archivo || 'sin datos'} ${Math.round(e.im.w)}x${Math.round(e.im.h)}]`)
    }
  }
}
