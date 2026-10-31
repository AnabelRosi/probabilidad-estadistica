"""Compara las palabras del PDF original con las del texto generado (HTML + textos alternativos)."""
import html
import os
import re
import sys

base = os.path.dirname(os.path.abspath(__file__))
contenido = sys.argv[1]


def palabras(t):
    return re.findall(r"[A-Za-záéíóúñüÁÉÍÓÚÑ]{4,}", t.lower())


PIE = {'prob', 'estadistica', 'estadística', 'ponti', 'pamela', 'probabilida', 'probabilidad'}
for n in (1, 2, 3, 4):
    pdf = open(os.path.join(base, 'out', f'u{n}-pdf.txt'), encoding='utf-8', errors='replace').read()
    h = open(os.path.join(contenido, f'unidad-{n}.html'), encoding='utf-8').read()
    alts = ' '.join(re.findall(r'alt="([^"]*)"', h))
    txt = html.unescape(re.sub(r'<[^>]+>', ' ', h)) + ' ' + html.unescape(alts)
    pw, hw = palabras(pdf), set(palabras(txt))
    utiles = [w for w in pw if w not in PIE]
    faltan = [w for w in utiles if w not in hw]
    print(f'Unidad {n}: {len(utiles)} palabras en el PDF, {len(faltan)} no aparecen ({100 * len(faltan) / len(utiles):.1f} %)')
    print('    ', ', '.join(sorted(set(faltan))[:70]))
