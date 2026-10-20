import { useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'
import SearchOffRounded from '@mui/icons-material/SearchOffRounded'
import HomeRounded from '@mui/icons-material/HomeRounded'
import { COLORES } from '../theme.js'

export default function NoEncontrada() {
  useEffect(() => {
    document.title = 'Página no encontrada · Probabilidad y Estadística'
  }, [])

  return (
    <Box sx={{ textAlign: 'center', py: { xs: 6, md: 10 }, px: 2 }}>
      <Box
        aria-hidden
        sx={{
          width: 88,
          height: 88,
          mx: 'auto',
          mb: 3,
          borderRadius: '24px',
          display: 'grid',
          placeItems: 'center',
          bgcolor: '#FDECEA',
          color: COLORES.coralOscuro,
        }}
      >
        <SearchOffRounded sx={{ fontSize: 48 }} />
      </Box>
      <Typography variant="h1" gutterBottom>
        Página no encontrada
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        La dirección no corresponde a ninguna sección del sitio.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained" size="large" startIcon={<HomeRounded />}>
        Volver al inicio
      </Button>
    </Box>
  )
}
