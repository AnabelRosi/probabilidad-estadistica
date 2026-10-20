import { useEffect, useRef, useState } from 'react'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import MenuRounded from '@mui/icons-material/MenuRounded'
import HomeRounded from '@mui/icons-material/HomeRounded'
import SchoolRounded from '@mui/icons-material/SchoolRounded'
import { UNIDADES } from '../data/materiales.js'
import { ESTILO_COMPLEMENTARIO, ESTILO_UNIDAD } from '../identidad.js'
import { COLORES } from '../theme.js'

const ANCHO_MENU = 280

const ENLACES = [
  { ruta: '/', texto: 'Inicio', Icono: HomeRounded, color: COLORES.azul, contraste: '#fff' },
  ...UNIDADES.map((u) => ({
    ruta: `/unidad/${u.numero}`,
    texto: `Unidad ${u.numero}`,
    detalle: u.titulo,
    Icono: ESTILO_UNIDAD[u.numero].Icono,
    color: ESTILO_UNIDAD[u.numero].principal,
    contraste: ESTILO_UNIDAD[u.numero].contraste,
    oscuro: ESTILO_UNIDAD[u.numero].oscuro,
  })),
  {
    ruta: '/complementario',
    texto: 'Material complementario',
    Icono: ESTILO_COMPLEMENTARIO.Icono,
    color: ESTILO_COMPLEMENTARIO.principal,
    contraste: ESTILO_COMPLEMENTARIO.contraste,
  },
]

function Marca() {
  return (
    <Box
      component={RouterLink}
      to="/"
      sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'inherit', textDecoration: 'none', minWidth: 0 }}
    >
      <Box
        aria-hidden
        sx={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'secondary.main',
          color: 'primary.main',
        }}
      >
        <SchoolRounded />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h6" component="span" noWrap sx={{ display: 'block', lineHeight: 1.1 }}>
          Probabilidad y Estadística
        </Typography>
        <Typography
          variant="caption"
          component="span"
          noWrap
          sx={{ display: { xs: 'none', sm: 'block' }, color: alpha('#fff', 0.75) }}
        >
          Plataforma de estudio
        </Typography>
      </Box>
    </Box>
  )
}

export default function Layout() {
  const [abierto, setAbierto] = useState(false)
  const { pathname } = useLocation()
  const contenido = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const menu = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ minHeight: { xs: 64, sm: 72 } }} />
      <Typography variant="overline" sx={{ px: 3, pt: 2, color: 'text.secondary' }}>
        Contenido
      </Typography>
      <List component="nav" aria-label="Secciones del sitio" sx={{ px: 1.5, display: 'grid', gap: 0.5 }}>
        {ENLACES.map((e) => {
          const activo = pathname === e.ruta
          return (
            <ListItemButton
              key={e.ruta}
              component={RouterLink}
              to={e.ruta}
              selected={activo}
              aria-current={activo ? 'page' : undefined}
              onClick={() => setAbierto(false)}
              sx={{
                py: 1,
                position: 'relative',
                '&.Mui-selected::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 10,
                  bottom: 10,
                  width: 4,
                  borderRadius: '4px',
                  bgcolor: e.color,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Box
                  aria-hidden
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '10px',
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: activo ? e.color : alpha(e.color, 0.14),
                    color: activo ? e.contraste : e.oscuro || e.color,
                    transition: 'background-color .2s, color .2s',
                  }}
                >
                  <e.Icono fontSize="small" />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={e.texto}
                secondary={e.detalle}
                primaryTypographyProps={{ fontWeight: activo ? 800 : 600 }}
                secondaryTypographyProps={{ sx: { lineHeight: 1.3 } }}
              />
            </ListItemButton>
          )
        })}
      </List>
      <Box sx={{ mt: 'auto', p: 2.5 }}>
        <Box sx={{ p: 2, borderRadius: '14px', bgcolor: alpha(COLORES.dorado, 0.14) }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Todo el material disponible se puede ver o descargar. Algunos recursos están pendientes de recibir.
          </Typography>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Button
        onClick={() => contenido.current?.focus()}
        sx={{
          position: 'absolute',
          left: 8,
          top: -60,
          zIndex: (t) => t.zIndex.tooltip,
          bgcolor: 'secondary.main',
          color: 'primary.main',
          '&:focus-visible': { top: 8 },
          '&:hover': { bgcolor: 'secondary.main' },
        }}
      >
        Saltar al contenido
      </Button>

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          background: `linear-gradient(90deg, ${COLORES.azulNoche} 0%, ${COLORES.azul} 55%, ${COLORES.azulMedio} 100%)`,
          borderBottom: `3px solid ${COLORES.dorado}`,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 72 }, gap: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            aria-label="Abrir menú"
            aria-expanded={abierto}
            onClick={() => setAbierto(!abierto)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuRounded />
          </IconButton>
          <Marca />
        </Toolbar>
      </AppBar>

      <Box component="aside" sx={{ width: { md: ANCHO_MENU }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={abierto}
          onClose={() => setAbierto(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: ANCHO_MENU } }}
        >
          {menu}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: ANCHO_MENU, borderRight: 1, borderColor: 'divider' },
          }}
        >
          {menu}
        </Drawer>
      </Box>

      <Box
        component="main"
        id="contenido"
        ref={contenido}
        tabIndex={-1}
        sx={{ flexGrow: 1, minWidth: 0, outline: 'none' }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 72 } }} />
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3 } }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}
