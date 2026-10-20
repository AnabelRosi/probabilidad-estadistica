// Fuente única de contenido del sitio. Se corresponde con inventario/inventario-materiales.csv
// (columna "id" del inventario = campo "inventario"; columna "estado_publicacion" = campo "estado").
//
// Criterio vigente (decisión de la autora): todo el material existente se publica, incluidos los TP resueltos.
// Los 16 archivos están en public/materiales/unidad-N/: 12 son copias idénticas de materiales-originales/ con su
// nombre real; las 4 infografías se publican en su versión corregida (*_corregida.png, ver infografias-corregidas/CAMBIOS.md).
// Solo "disponible" con "archivo" muestra acciones: Ver (PDF, PNG) y Descargar (todos los formatos).
// Los materiales que todavía no se recibieron (F01-F06) quedan en material-faltante, sin archivo.
// Los demás estados se conservan para materiales futuros que requieran revisión antes de publicarse.

export const ESTADOS = {
  noPublicar: 'no-publicar',
  autoriaPorConfirmar: 'autoria-por-confirmar',
  pendienteAutorizacion: 'pendiente-autorizacion',
  correccionEdicion: 'correccion-edicion',
  correccionContenido: 'correccion-contenido',
  materialFaltante: 'material-faltante',
  listaParaPublicar: 'lista-para-publicar',
  disponible: 'disponible',
}

export const ETIQUETAS_ESTADO = {
  [ESTADOS.autoriaPorConfirmar]: 'Autoría por confirmar',
  [ESTADOS.pendienteAutorizacion]: 'Pendiente de autorización',
  [ESTADOS.correccionEdicion]: 'En corrección de edición',
  [ESTADOS.correccionContenido]: 'En corrección de contenido',
  [ESTADOS.materialFaltante]: 'Pendiente de recibir',
  [ESTADOS.listaParaPublicar]: 'Lista para publicar',
  [ESTADOS.disponible]: 'Disponible',
}

// Autoría: "declarada" = la autora del proyecto declaró ser autora del material;
// "indicada" = el propio documento la declara; "por-confirmar" = solo hay indicios;
// "desconocida" = no hay datos de autoría.
export const AUTORIA = {
  declarada: 'declarada',
  indicada: 'indicada',
  porConfirmar: 'por-confirmar',
  desconocida: 'desconocida',
}

export const etiquetaEstado = (material) =>
  material.estado === ESTADOS.materialFaltante && material.tipo === 'tp'
    ? 'Consigna pendiente de recibir'
    : ETIQUETAS_ESTADO[material.estado]

export const TIPOS = [
  { id: 'teoria', titulo: 'Teoría' },
  { id: 'presentacion', titulo: 'Presentaciones' },
  { id: 'infografia', titulo: 'Infografías' },
  { id: 'tp', titulo: 'Trabajos prácticos' },
]

// Nombres y temas tomados de los apuntes de cada unidad.
// Pendiente: confirmarlos con el programa oficial de la materia.
export const UNIDADES = [
  {
    numero: 1,
    titulo: 'Estadística descriptiva',
    resumen: 'Recolección, organización, representación y descripción de datos.',
    temas: [
      'Población y muestra',
      'Variables estadísticas',
      'Etapas de una investigación estadística',
      'Muestreo',
      'Tablas de frecuencias y gráficos',
      'Medidas de tendencia central',
      'Medidas de dispersión',
      'Medidas de forma',
    ],
  },
  {
    numero: 2,
    titulo: 'Probabilidad',
    resumen: 'Fundamentos de probabilidad como base de la inferencia estadística.',
    temas: [
      'Experimentos aleatorios y espacio muestral',
      'Definición clásica (Laplace)',
      'Reglas de probabilidad',
      'Probabilidad conjunta y condicional',
      'Eventos independientes',
      'Teorema de la probabilidad total',
      'Teorema de Bayes',
    ],
  },
  {
    numero: 3,
    titulo: 'Variable aleatoria discreta',
    resumen: 'Variables aleatorias discretas y modelos de probabilidad discretos.',
    temas: [
      'Función de probabilidad',
      'Función de distribución acumulada',
      'Esperanza y varianza',
      'Modelo binomial',
      'Binomial negativa y geométrica',
      'Modelo de Poisson',
    ],
  },
  {
    numero: 4,
    titulo: 'Variable aleatoria continua',
    resumen: 'Variables aleatorias continuas y el modelo normal.',
    temas: [
      'Función de densidad',
      'Función de distribución acumulada',
      'Modelo normal',
      'Distribución normal estándar y tipificación',
    ],
  },
]

// Datos comunes
const DECLARADA = 'Declarada por la autora del proyecto'
const NO_RECIBIDO = 'Material no recibido'
const REQ_CONSIGNA = ['Recibir la consigna original sin resolver', 'Copiar el archivo a public/materiales/']

// Material publicado: copia idéntica del original, con su nombre real.
const publicado = (inventario, unidad, tipo, titulo, formato, nombre) => ({
  inventario, unidad, tipo, titulo, formato,
  archivo: `materiales/unidad-${unidad}/${nombre}`,
  estado: ESTADOS.disponible,
  autoria: AUTORIA.declarada, autoriaDetalle: DECLARADA,
  requisitos: [],
})

const consignaFaltante = (inventario, unidad) => ({
  inventario, unidad, tipo: 'tp', titulo: `Trabajo práctico Nº ${unidad}: consigna`, formato: null,
  archivo: null, estado: ESTADOS.materialFaltante,
  autoria: AUTORIA.desconocida, autoriaDetalle: NO_RECIBIDO,
  requisitos: REQ_CONSIGNA,
})

export const MATERIALES = [
  // Unidad 1
  publicado('01', 1, 'teoria', 'Apunte: Estadística descriptiva', 'PDF', 'UNIDAD Nº 1. Estadistica descriptiva (1).pdf'),
  publicado('02', 1, 'presentacion', 'Presentación: Estadística descriptiva', 'PPTX', 'Unidad1_Estadistica_Descriptiva_naranja.pptx'),
  publicado('04', 1, 'infografia', 'Infografía: Fundamentos de la estadística descriptiva', 'PNG', 'Fundamentos_de_la_estadística_descriptiva_corregida.png'),
  publicado('03', 1, 'tp', 'Trabajo práctico Nº 1 (resuelto)', 'DOCX', 'TPN°1.docx'),
  consignaFaltante('F01', 1),

  // Unidad 2
  publicado('05', 2, 'teoria', 'Apunte: Probabilidad', 'PDF', 'UNIDAD Nº 2. Probabilidad.pdf'),
  publicado('06', 2, 'presentacion', 'Presentación: Probabilidad', 'PPTX', 'Unidad2_Probabilidad_rosa.pptx'),
  publicado('08', 2, 'infografia', 'Infografía: Fundamentos de la probabilidad', 'PNG', 'Guía_de_fundamentos_de_probabilidad_corregida.png'),
  publicado('07', 2, 'tp', 'Trabajo práctico Nº 2 (resuelto)', 'DOCX', 'TPN°2.docx'),
  consignaFaltante('F02', 2),

  // Unidad 3
  publicado('09', 3, 'teoria', 'Apunte: Variable aleatoria discreta', 'PDF', 'UNIDAD Nº 3. VARIABLE ALEATORIA DISCRETA (1).pdf'),
  publicado('10', 3, 'presentacion', 'Presentación: Variables aleatorias discretas', 'PPTX', 'Unidad3_Variables_Aleatorias_Discretas.pptx'),
  publicado('12', 3, 'infografia', 'Infografía: Variable aleatoria discreta y modelos', 'PNG', 'Guía_de_variable_aleatoria_discreta_corregida.png'),
  publicado('11', 3, 'tp', 'Trabajo práctico Nº 3 (resuelto)', 'DOCX', 'TPN_3_verde.docx'),
  consignaFaltante('F03', 3),

  // Unidad 4
  publicado('13', 4, 'teoria', 'Apunte: Variable aleatoria continua', 'PDF', 'UNIDAD Nº 4. VARIABLE ALETROIA CONTINUA.pdf'),
  publicado('14', 4, 'presentacion', 'Presentación: Variable aleatoria continua', 'PPTX', 'Unidad4_Variable_Aleatoria_Continua.pptx'),
  publicado('16', 4, 'infografia', 'Infografía: Variables continuas y distribución normal', 'PNG', 'Guía_de_distribución_normal_continua_corregida.png'),
  publicado('15', 4, 'tp', 'Trabajo práctico Nº 4 (resuelto)', 'DOCX', 'TPN°4.docx'),
  consignaFaltante('F04', 4),
]

export const COMPLEMENTARIO = [
  {
    inventario: 'F05', id: 'programa', titulo: 'Programa de la materia', formato: null,
    archivo: null, estado: ESTADOS.materialFaltante,
    autoria: AUTORIA.desconocida, autoriaDetalle: NO_RECIBIDO,
    requisitos: ['Recibir el programa oficial', 'Copiar el archivo a public/materiales/'],
  },
  {
    inventario: 'F06', id: 'tabla-normal', titulo: 'Tabla de la distribución normal estándar', formato: null,
    archivo: null, estado: ESTADOS.materialFaltante,
    autoria: AUTORIA.desconocida, autoriaDetalle: NO_RECIBIDO,
    requisitos: ['Conseguir la tabla y confirmar su origen', 'Copiar el archivo a public/materiales/'],
  },
]

// Formatos que el navegador puede mostrar directamente; el resto solo se descarga.
export const FORMATOS_VISIBLES = ['PDF', 'PNG']

// Salvaguarda: un material en no-publicar nunca se muestra, aunque se agregue por error a la lista.
export const materialesDeUnidad = (numero) =>
  MATERIALES.filter((m) => m.unidad === numero && m.estado !== ESTADOS.noPublicar)

// Codifica cada segmento: los nombres reales tienen espacios, tildes, "º" y "°".
export const urlMaterial = (archivo) =>
  `${import.meta.env.BASE_URL}${archivo.split('/').map(encodeURIComponent).join('/')}`

export const nombreArchivo = (archivo) => archivo.split('/').pop()
