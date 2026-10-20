import { Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { COLORES } from '../theme.js'

// Banner de cabecera de página: fondo azul profundo con acento del color de la sección.
export default function Encabezado({ estilo, etiqueta, titulo, descripcion, children }) {
  const { principal, contraste, Icono } = estilo

  return (
    <Box
      component="header"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: { xs: '20px', md: '28px' },
        p: { xs: 3, sm: 4, md: 5 },
        mb: { xs: 3, md: 4 },
        color: '#fff',
        background: `linear-gradient(135deg, ${COLORES.azulNoche} 0%, ${COLORES.azul} 60%, ${COLORES.azulMedio} 100%)`,
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 320,
          height: 320,
          right: -90,
          top: -120,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(principal, 0.55)} 0%, ${alpha(principal, 0)} 70%)`,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 6,
          background: principal,
        },
      }}
    >
      <Box sx={{ position: 'relative', display: 'flex', gap: { xs: 2, sm: 3 }, alignItems: 'flex-start' }}>
        <Box
          aria-hidden
          sx={{
            flexShrink: 0,
            width: { xs: 52, sm: 68 },
            height: { xs: 52, sm: 68 },
            borderRadius: { xs: '16px', sm: '20px' },
            display: 'grid',
            placeItems: 'center',
            bgcolor: principal,
            color: contraste,
            boxShadow: `0 10px 30px ${alpha(principal, 0.45)}`,
          }}
        >
          <Icono sx={{ fontSize: { xs: 28, sm: 36 } }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          {etiqueta && (
            <Typography variant="overline" component="p" sx={{ color: COLORES.dorado, lineHeight: 1.6 }}>
              {etiqueta}
            </Typography>
          )}
          <Typography variant="h1" sx={{ mb: descripcion ? 1.5 : 0 }}>
            {titulo}
          </Typography>
          {descripcion && (
            <Typography sx={{ color: alpha('#fff', 0.85), maxWidth: 680, fontSize: { sm: '1.1rem' } }}>
              {descripcion}
            </Typography>
          )}
        </Box>
      </Box>
      {children && <Box sx={{ position: 'relative', mt: 3 }}>{children}</Box>}
    </Box>
  )
}
