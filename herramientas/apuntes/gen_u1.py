"""Genera cfg/u1.json (Unidad 1). Las tablas se transcriben de los datos extraídos del PDF; las fórmulas y los gráficos
se recortan de la página renderizada (con texto alternativo) o se escriben como HTML cuando son simples."""
import json


def tabla(cabecera, filas, leyenda, primera_th=False):
    h = f'<div class="tabla"><table><caption>{leyenda}</caption><thead><tr>' + ''.join(f'<th scope="col">{c}</th>' for c in cabecera) + '</tr></thead><tbody>'
    for f in filas:
        h += '<tr>' + ''.join((f'<th scope="row">{c}</th>' if (i == 0 and primera_th) else f'<td>{c}</td>') for i, c in enumerate(f)) + '</tr>'
    return h + '</tbody></table></div>'


def html(pagina, id_, caja, contenido):
    return {'pagina': pagina, 'id': id_, 'caja': caja, 'html': contenido}


def crop(pagina, id_, caja, alt, rotular=False):
    d = {'pagina': pagina, 'id': id_, 'caja': caja, 'alt': alt}
    if rotular:
        d['rotular'] = rotular
    return d


def f(txt):
    return f'<p class="formula-texto">{txt}</p>'


FREC = ['F. absoluta (f<sub>a</sub>)', 'F. relativa (f<sub>r</sub>)', 'F. relativa porcentual (f<sub>r</sub>%)', 'F. acumulada (F<sub>a</sub>)']
NOTAS = tabla(['Notas'] + FREC, [
    ['1', '2', '2/15 = 0,133', '13,3 %', '2'], ['3', '3', '3/15 = 0,2', '20 %', '5'], ['4', '2', '2/15 = 0,133', '13,3 %', '7'],
    ['5', '1', '1/15 = 0,07', '7 %', '8'], ['6', '3', '3/15 = 0,2', '20 %', '11'], ['7', '2', '2/15 = 0,133', '13,3 %', '13'],
    ['9', '2', '2/15 = 0,133', '13,3 %', '15'], ['Total', '15', '15/15 = 1', '—', '—']], 'Notas de matemática de 15 alumnos', True)
INTERV = ['Intervalos', 'Marca de clase X<sub>im</sub>'] + FREC
MONEDAS = tabla(INTERV, [
    ['[0 – 1)', '0,5', '1', '1/20 = 0,05', '5 %', '1'], ['[1 – 2)', '1,5', '5', '5/20 = 0,25', '25 %', '6'], ['[2 – 3)', '2,5', '6', '6/20 = 0,3', '30 %', '12'],
    ['[3 – 4)', '3,5', '4', '4/20 = 0,2', '20 %', '16'], ['[4 – 5]', '4,5', '4', '4/20 = 0,2', '20 %', '20'], ['Total', '—', '20', '20/20 = 1', '100 %', '—']],
    'Pesos de 20 monedas, agrupados en intervalos', True)
FILA_NOTAS = ['Nota', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']


def curso(nombre, fa):
    return tabla(FILA_NOTAS, [['fa'] + fa], f'Curso {nombre}: frecuencia absoluta de cada nota', True)


ESP = 'Gráfico de'
recortes = [
    # --- Página 5: razón de muestreo
    html(5, 'razon', [296, 244, 336, 270], f('r = N / n')),
    html(5, 'razon-ej', [282, 390, 350, 416], f('r = 100 / 20 = 5')),
    # --- Página 7: tablas de frecuencias
    html(7, 'tabla1', [85, 104, 540, 412], tabla(['Enfermedades que manifiestan los hijos de epilépticos'] + FREC, [
        ['Epilepsia', '70', '70/507 = 0,1381', '13,81 %', '70'], ['Debilidad mental', '200', '200/507 = 0,3945', '39,45 %', '270'],
        ['Psicosis', '45', '45/507 = 0,0888', '8,88 %', '315'], ['Personalidades anormales', '93', '93/507 = 0,1834', '18,34 %', '408'],
        ['Estados morfológicos anormales', '50', '50/507 = 0,0986', '9,86 %', '458'], ['Estados funcionales anormales', '29', '29/507 = 0,0572', '5,72 %', '487'],
        ['Enfermedades neurológicas', '20', '20/507 = 0,0394', '3,94 %', '507'], ['Total', '507', '507/507 = 1', '100 %', '—']],
        'Hallazgos anormales en los hijos de epilépticos', True)),
    html(7, 'tabla2', [85, 562, 540, 745], tabla(['Temperaturas'] + FREC, [
        ['3 ºC', '1', '1/10 = 0,1', '10 %', '1'], ['8 ºC', '3', '3/10 = 0,3', '30 %', '4'], ['9 ºC', '1', '1/10 = 0,1', '10 %', '5'],
        ['10 ºC', '2', '2/10 = 0,2', '20 %', '7'], ['11 ºC', '2', '2/10 = 0,2', '20 %', '9'], ['12 ºC', '1', '1/10 = 0,1', '10 %', '10'],
        ['Total', '10', '10/10 = 1', '100 %', '—']], 'Temperaturas máximas registradas en Tandil', True)),
    # --- Páginas 8 y 9: intervalos de clase
    html(8, 'amplitud', [85, 544, 520, 566], '<p>3º Calcular la amplitud de cada intervalo mediante la siguiente fórmula A = R / M</p>'),
    html(8, 'armar', [100, 700, 515, 752], '<p>[2 – 4) 2 y 4 son los límites del intervalo de amplitud A = 4 – 2 = 2, luego se procede a obtener los límites del intervalo siguiente utilizando como límite inferior al límite superior del intervalo anterior y así sucesivamente. Para calcular la marca de clase o punto del intervalo (X<sub>im</sub>) se realiza el promedio aritmético de los límites del intervalo: X<sub>im</sub> = (2 + 4) / 2 = 3. La frecuencia absoluta del intervalo se calcula determinado todos los valores comprendidos entre los extremos del intervalo sin considerar el límite superior del mismo</p>'),
    html(9, 'continua', [100, 76, 515, 150], '<!-- continúa el párrafo anterior -->'),
    html(9, 'tabla', [85, 192, 560, 410], tabla(INTERV, [
        ['[2 – 4)', '3', '3', '3/20 = 0,15', '15 %', '3'], ['[4 – 6)', '5', '7', '7/20 = 0,35', '35 %', '10'], ['[6 – 8)', '7', '6', '6/20 = 0,3', '30 %', '16'],
        ['[8 – 10)', '9', '3', '3/20 = 0,15', '15 %', '19'], ['[10 – 12]', '11', '1', '1/20 = 0,05', '5 %', '20'], ['Total', '—', '20', '20/20 = 1', '100 %', '—']],
        'Tamaño de las familias, agrupado en intervalos', True)),
    # --- Páginas 10 y 11: gráficos
    crop(10, 'barras1', [85, 140, 520, 455], 'Gráfico de barras de los hallazgos anormales en hijos de epilépticos. Frecuencias: epilepsia 70, debilidad mental 200, psicosis 45, personalidades anormales 93, estados morfológicos anormales 50, estados funcionales anormales 29 y enfermedades neurológicas 20.'),
    crop(10, 'barras2', [85, 474, 520, 628], 'Gráfico de barras de las temperaturas máximas registradas en Tandil. Frecuencias: 3 ºC una vez, 8 ºC tres veces, 9 ºC una vez, 10 ºC dos veces, 11 ºC dos veces y 12 ºC una vez.'),
    crop(11, 'circular', [85, 128, 420, 300], 'Gráfico circular de los hallazgos anormales en los hijos de epilépticos. El sector más grande corresponde a debilidad mental (39,45 %).'),
    crop(11, 'histograma', [90, 482, 430, 672], 'Histograma de la cantidad de miembros de las familias que aspiran a un préstamo hipotecario, con los intervalos [2–4), [4–6), [6–8), [8–10) y [10–12] y frecuencias 3, 7, 6, 3 y 1.'),
    # --- Páginas 12 a 14: media aritmética
    crop(12, 'media', [205, 278, 510, 336], 'Media aritmética: X barra = suma, desde i = 1 hasta n, de x_i dividido por n. x_i es el dato i y n es el número de datos en la muestra.', True),
    crop(12, 'media-ej', [170, 392, 430, 434], 'X barra = suma de x_i dividido por n = (3 + 5 + 7 + 8 + 4 + 2 + 5 + 1) / 8 = 4,375.'),
    crop(12, 'media-agr', [175, 470, 470, 524], 'Media para datos agrupados: X barra = suma, desde i = 1 hasta n, de x_i por f_i, dividido por n. x_i es la variable i, f_i su frecuencia absoluta y n el número de datos en la muestra.', True),
    html(12, 'tabla-notas', [85, 690, 560, 750], '<!-- la tabla continúa en la página siguiente -->'),
    html(13, 'tabla-notas', [85, 76, 515, 212], NOTAS),
    crop(13, 'media-notas', [140, 262, 460, 306], 'X barra = suma de x_i por f_i dividido por n = (1·2 + 3·3 + 4·2 + 5·1 + 6·3 + 7·2 + 9·2) / 15 = 4,9.'),
    crop(13, 'media-int', [180, 386, 480, 442], 'Media para datos agrupados en intervalos: X barra = suma, desde i = 1 hasta n, de X_im por f_i, dividido por n. X_im es la marca de clase, f_i la frecuencia absoluta del intervalo y n el número de datos.', True),
    html(13, 'rango', [85, 618, 520, 700], tabla(['Rango', 'Número de intervalos', 'Amplitud de intervalo'], [[
        'R = X<sub>máx</sub> − X<sub>mín</sub><br>R = 5,1 − 0,1 = 5', 'M = 1 + 3,3 · log n<br>M = 1 + 3,3 · log 20 = 5,29 ≅ 5', 'C = R / M<br>C = 5 / 5 = 1<br>C ≅ 1']], 'Rango, número de intervalos y amplitud para los pesos de las monedas')),
    html(14, 'tabla-monedas', [85, 76, 480, 262], MONEDAS),
    crop(14, 'media-m1', [275, 312, 356, 354], 'X barra = suma, desde i = 1 hasta n, de X_im por f_i, dividido por n.'),
    crop(14, 'media-m2', [160, 376, 470, 418], 'X barra = suma de X_im por f_i dividido por n = (0,5·1 + 1,5·5 + 2,5·6 + 3,5·4 + 4,5·4) / 20 = 2,75.'),
    crop(14, 'media-m3', [150, 576, 445, 620], 'X barra = suma de x_i dividido por n = (2 + 2 + 2 + 3 + 3 + 4 + 4 + 6 + 35 + 40) / 10 = 10,1.'),
    # --- Páginas 15 a 19: mediana y moda
    crop(15, 'desvios', [195, 325, 440, 346], 'Suma de los desvíos: la suma de d = 0,4 + (−4,6) + (−2,6) + 4,4 + 2,4 es igual a 0.'),
    html(15, 'ord1', [115, 478, 245, 510], '<p>3 4 5 <strong>6</strong> 7 7 9</p><p>Me = 6</p>'),
    html(15, 'ord2', [115, 570, 195, 596], '<p>Me = (4 + 5) / 2 = 4,5</p>'),
    html(15, 'orden', [115, 734, 170, 758], f('º Me = n / 2')),
    html(16, 'tabla-notas', [85, 214, 540, 412], NOTAS),
    html(16, 'orden-ej', [85, 438, 190, 464], f('º Me = n / 2 = 15 / 2 = 7,5')),
    html(16, 'orden-int', [115, 628, 170, 654], f('º Me = n / 2')),
    crop(17, 'mediana', [225, 66, 375, 102], 'Mediana para datos agrupados: Me = Li + ((º Me − F_a−1) / f_a) · c.'),
    html(17, 'tabla-monedas', [85, 322, 540, 538], MONEDAS),
    html(17, 'orden-m', [262, 584, 335, 616], f('n / 2 = 20 / 2 = 10')),
    crop(17, 'mediana-ej', [170, 710, 425, 750], 'Me = Li + ((n/2 − F_a−1) / f_a) · c = 2 + ((10 − 6) / 6) · 1 = 2,66.'),
    html(18, 'tabla-notas', [85, 414, 540, 612], NOTAS),
    crop(19, 'moda', [240, 158, 372, 190], 'Moda para datos agrupados: Mo = Li + (Δ1 / (Δ1 + Δ2)) · c.'),
    html(19, 'tabla-monedas', [85, 410, 540, 592], MONEDAS),
    crop(19, 'moda-ej', [185, 660, 430, 694], 'Mo = Li + (Δ1 / (Δ1 + Δ2)) · c = 2 + (1 / (1 + 2)) · 1 = 2,33.'),
    # --- Páginas 20 y 21: gráficos de mediana y moda
    crop(20, 'poligono', [85, 224, 430, 402], 'Polígono de frecuencias por intervalos, con la moda señalada sobre el eje horizontal. Los intervalos de peso van de 284,5 a 938,5 con amplitud 109.', 'todo'),
    crop(21, 'ojiva', [130, 86, 460, 282], 'Ojiva (frecuencia acumulada) por intervalos, con la mediana señalada sobre el eje horizontal.', 'todo'),
    # --- Páginas 22 a 25: dispersión
    html(22, 'curso-a', [85, 312, 480, 352], curso('A', ['1', '2', '2', '1', '2', '7', '3', '3', '2', '2'])),
    html(22, 'curso-b', [85, 406, 480, 446], curso('B', ['4', '1', '1', '1', '2', '6', '1', '2', '2', '5'])),
    html(22, 'curso-c', [85, 500, 480, 540], curso('C', ['1', '1', '1', '1', '3', '11', '1', '3', '2', '1'])),
    html(22, 'resumen', [85, 658, 430, 740], tabla(['Curso', 'Media (X barra)', 'Mediana (Me)', 'Moda (Mo)'], [['A', '6', '6', '6'], ['B', '6', '6', '6'], ['C', '6', '6', '6']], 'Medidas de tendencia central de los tres cursos', True)),
    crop(23, 'barras-cursos', [85, 150, 420, 332], 'Gráfico de barras que compara las frecuencias de cada nota, de 1 a 10, en los cursos A, B y C.'),
    crop(23, 'varianza', [80, 612, 195, 656], 'Varianza: s al cuadrado = suma, desde i = 1 hasta n, de (x_i − X barra) al cuadrado por f_i, dividido por n − 1.'),
    crop(23, 'var-a1', [85, 690, 500, 732], 'Curso A: s_A al cuadrado = suma de (x_i − X barra) al cuadrado por f_i dividido por n − 1 = ((1 − 6)²·1 + (2 − 6)²·2 + (3 − 6)²·2 + (4 − 6)²·1 + …'),
    crop(24, 'var-a2', [90, 72, 510, 102], 'Curso A, continuación: … + (5 − 6)²·2 + (6 − 6)²·7 + (7 − 6)²·3 + (8 − 6)²·3 + (9 − 6)²·2 + (10 − 6)²·2) / (25 − 1) = 6,08.'),
    crop(24, 'var-b1', [85, 112, 500, 152], 'Curso B: s_B al cuadrado = suma de (x_i − X barra) al cuadrado por f_i dividido por n − 1 = ((1 − 6)²·4 + (2 − 6)²·1 + (3 − 6)²·1 + (4 − 6)²·1 + …'),
    crop(24, 'var-b2', [90, 164, 510, 194], 'Curso B, continuación: … + (5 − 6)²·2 + (6 − 6)²·6 + (7 − 6)²·1 + (8 − 6)²·2 + (9 − 6)²·2 + (10 − 6)²·5) / (25 − 1) = 9,92.'),
    crop(24, 'var-c1', [85, 204, 500, 244], 'Curso C: s_C al cuadrado = suma de (x_i − X barra) al cuadrado por f_i dividido por n − 1 = ((1 − 6)²·1 + (2 − 6)²·1 + (3 − 6)²·1 + (4 − 6)²·1 + …'),
    crop(24, 'var-c2', [90, 255, 510, 287], 'Curso C, continuación: … + (5 − 6)²·3 + (6 − 6)²·11 + (7 − 6)²·1 + (8 − 6)²·3 + (9 − 6)²·2 + (10 − 6)²·1) / (25 − 1) = 4,33.'),
    html(24, 'var-texto', [85, 346, 515, 432], '<p>La varianza es una medida razonablemente buena de la variabilidad debido a que si muchas de las diferencias son grandes (o pequeñas) entonces el valor de la s² será grande (o pequeño). El valor de la varianza puede sufrir un cambio muy desproporcionado, aún más que la media, por la presencia de algunos valores extremos del conjunto.</p>'),
    crop(24, 'desv', [85, 524, 200, 576], 'Desviación estándar: s es la raíz cuadrada de la suma, desde i = 1 hasta n, de (x_i − X barra) al cuadrado por f_i, dividido por n − 1.'),
    crop(25, 'cv', [270, 247, 325, 275], 'Coeficiente de variación: CV = s dividido por el valor absoluto de X barra.'),
    html(25, 'cv-texto', [85, 302, 515, 332], '<p>es a dimensional (y sólo definida si x̄ ≠ 0). En general se multiplica por 100 y así expresa un porcentaje.</p>'),
    html(25, 'cv-ej', [85, 360, 515, 392], '<p>Ejemplo: Si queremos comparar la dispersión de las variables potencia y velocidad de dos conjuntos de datos cuyas medidas son x̄ = 142, s = 5 y x̄ = 51, s = 5</p>'),
]

cfg = {
    'omitir': ['UNIDAD Nº 1', 'ESTADÍSTICA', 'MEDIDAS DE TENDENCIA CENTRAL', 'MEDIDAS DE DISPERSIÓN'],
    'nuevoParrafo': [],
    'titulos': [[t, n] for t, n in [
        ('1. ¿Qué es la estadística? ¿Por qué estudiar estadística?', 1), ('2. Etapas de una investigación estadística', 1),
        ('3. Teoría de muestreo', 1), ('4. Organización y representación de datos', 1), ('5. Medidas de tendencia central', 1),
        ('6. Medidas de dispersión', 1), ('7. Medidas de Forma', 1),
        ('1.1. Población y muestra estadística', 2), ('1.2. Variables estadísticas', 2), ('3.1. Muestreo aleatorio simple', 2),
        ('3.2. Muestreo sistemático', 2), ('3.3. Muestreo aleatorio estratificado', 2), ('3.4. Muestreo de conglomerados', 2),
        ('4.1. Tabla de distribución de frecuencias', 2), ('4.2. Gráficos estadísticos', 2), ('5.1. Media aritmética', 2),
        ('5.2. Mediana (Me)', 2), ('5.3. Moda', 2), ('6.1. Varianza', 2), ('6.2. Desviación estándar', 2),
        ('6.3 Coeficiente de variación', 2), ('7.1. Medidas de asimetría', 2),
        ('Ejemplos:', 3), ('Ejemplo:', 3), ('Pasos parar formar intervalos:', 3), ('4.2.1. Gráfico de barras', 3),
        ('4.2.2. Gráfico circular o de sectores', 3), ('4.2.3. Histograma', 3), ('5.1.1. Propiedades de la media aritmética', 3),
        ('Para datos agrupados', 3), ('Solución', 3), ('5.2.1. Propiedades de la mediana', 3), ('5.3.1. Propiedades de la moda:', 3),
        ('Obtención de la mediana y moda gráficamente para intervalos', 3), ('7.1.1. Coeficiente de Asimetría de Pearson:', 3),
        ('Tabla de distribución de frecuencias', 3)]],
    'alt': {
        'img-02-1.png': 'Esquema de las variables estadísticas: se dividen en cualitativas o categóricas (características que no son susceptibles de medición cuantitativa, por ejemplo color de ojos, sexo o género de película) y cuantitativas (susceptibles de medición cuantitativa), que pueden ser discretas (toman valores enteros) o continuas (toman valores dentro de un intervalo).',
        'img-04-1.png': 'Esquema del muestreo: según la cantidad de muestras puede ser simple o múltiple, y según la forma de seleccionar las muestras puede ser aleatorio o no aleatorio.',
        'img-20-1.png': 'Esquema para obtener gráficamente la mediana y la moda en un histograma: Δ1 y Δ2 son las diferencias de altura con las barras vecinas, Li es el límite inferior del intervalo modal (502,5), x es la distancia desde Li hasta la moda y h es la amplitud del intervalo (de 502,5 a 611,5).',
        'img-26-1.png': 'Coeficiente de asimetría de Pearson: A_s = (X barra − Mo) / s.',
        'img-26-2.png': 'Tres curvas: asimétrica hacia la izquierda (de izquierda a derecha: media, mediana y moda), simétrica (media, mediana y moda coinciden) y asimétrica hacia la derecha (de izquierda a derecha: moda, mediana y media).'
    },
    'recortes': recortes,
}
json.dump(cfg, open('cfg/u1.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('cfg/u1.json:', len(recortes), 'recortes')
