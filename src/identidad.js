// Identidad visual (colores e iconos) de unidades y tipos de material.
// Se mantiene separada de data/materiales.js para no mezclar diseño con contenido académico.
import BarChartRounded from '@mui/icons-material/BarChartRounded'
import CasinoRounded from '@mui/icons-material/CasinoRounded'
import EqualizerRounded from '@mui/icons-material/EqualizerRounded'
import ShowChartRounded from '@mui/icons-material/ShowChartRounded'
import MenuBookRounded from '@mui/icons-material/MenuBookRounded'
import SlideshowRounded from '@mui/icons-material/SlideshowRounded'
import ImageRounded from '@mui/icons-material/ImageRounded'
import AssignmentRounded from '@mui/icons-material/AssignmentRounded'
import LibraryBooksRounded from '@mui/icons-material/LibraryBooksRounded'
import TableChartRounded from '@mui/icons-material/TableChartRounded'
import { COLORES } from './theme.js'

// principal: relleno de iconos y acentos · oscuro: texto sobre fondo claro · contraste: icono sobre "principal"
export const ESTILO_UNIDAD = {
  1: { principal: COLORES.turquesa, oscuro: COLORES.turquesaOscuro, suave: '#E3F8F5', contraste: COLORES.azul, Icono: BarChartRounded },
  2: { principal: COLORES.violeta, oscuro: COLORES.violetaOscuro, suave: '#F1EAFE', contraste: '#fff', Icono: CasinoRounded },
  3: { principal: COLORES.coral, oscuro: COLORES.coralOscuro, suave: '#FDECEA', contraste: COLORES.azul, Icono: EqualizerRounded },
  4: { principal: COLORES.dorado, oscuro: COLORES.doradoOscuro, suave: '#FEF5D6', contraste: COLORES.azul, Icono: ShowChartRounded },
}

export const ESTILO_COMPLEMENTARIO = {
  principal: COLORES.azulMedio,
  oscuro: COLORES.azul,
  suave: '#E6ECF6',
  contraste: '#fff',
  Icono: LibraryBooksRounded,
}

export const ICONO_TIPO = {
  teoria: MenuBookRounded,
  presentacion: SlideshowRounded,
  infografia: ImageRounded,
  tp: AssignmentRounded,
}

export const ICONO_COMPLEMENTARIO = {
  programa: LibraryBooksRounded,
  'tabla-normal': TableChartRounded,
}
