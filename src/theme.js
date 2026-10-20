import { alpha, createTheme } from '@mui/material/styles'

// Paleta de la plataforma. Los tonos "oscuro" se usan para texto sobre fondo claro (contraste AA ≥ 4.5:1).
export const COLORES = {
  azul: '#0B2A5B',
  azulMedio: '#163E7A',
  azulNoche: '#071C3D',
  dorado: '#F2B705',
  doradoOscuro: '#7A5600',
  turquesa: '#14B8A6',
  turquesaOscuro: '#0F766E',
  violeta: '#7C3AED',
  violetaOscuro: '#6D28D9',
  coral: '#F26B5B',
  coralOscuro: '#B23A2D',
  fondo: '#F4F6FB',
  texto: '#14213D',
  textoSecundario: '#4A5876',
}

const titulos = '"Nunito", "Segoe UI", system-ui, sans-serif'

const theme = createTheme({
  palette: {
    primary: { main: COLORES.azul, light: COLORES.azulMedio, dark: COLORES.azulNoche, contrastText: '#fff' },
    secondary: { main: COLORES.dorado, dark: COLORES.doradoOscuro, contrastText: COLORES.azul },
    background: { default: COLORES.fondo, paper: '#fff' },
    text: { primary: COLORES.texto, secondary: COLORES.textoSecundario },
    divider: alpha(COLORES.azul, 0.1),
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    h1: { fontFamily: titulos, fontWeight: 800, fontSize: 'clamp(2rem, 1.4rem + 2.6vw, 3.25rem)', lineHeight: 1.1 },
    h2: { fontFamily: titulos, fontWeight: 800, fontSize: 'clamp(1.4rem, 1.2rem + 0.8vw, 1.85rem)', lineHeight: 1.2 },
    h3: { fontFamily: titulos, fontWeight: 800, fontSize: '1.3rem', lineHeight: 1.25 },
    h6: { fontFamily: titulos, fontWeight: 800 },
    subtitle1: { fontWeight: 700, lineHeight: 1.35 },
    overline: { fontWeight: 800, letterSpacing: '0.12em' },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: COLORES.fondo },
        ':focus-visible': { outline: `3px solid ${COLORES.dorado}`, outlineOffset: 2 },
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': { transition: 'none !important', animation: 'none !important' },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 999, paddingInline: 20 } },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 20 } },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&.Mui-selected': { backgroundColor: alpha(COLORES.azul, 0.08) },
          '&.Mui-selected:hover': { backgroundColor: alpha(COLORES.azul, 0.12) },
        },
      },
    },
  },
})

export default theme
