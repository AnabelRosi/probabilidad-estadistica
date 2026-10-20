import { useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Breadcrumbs, Grid, Link, Typography } from '@mui/material'
import MaterialCard from '../components/MaterialCard.jsx'
import Encabezado from '../components/Encabezado.jsx'
import { COMPLEMENTARIO } from '../data/materiales.js'
import { ESTILO_COMPLEMENTARIO, ICONO_COMPLEMENTARIO } from '../identidad.js'

export default function Complementario() {
  useEffect(() => {
    document.title = 'Material complementario · Probabilidad y Estadística'
  }, [])

  return (
    <Box>
      <Breadcrumbs aria-label="Ubicación" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" underline="hover" color="text.secondary">
          Inicio
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 600 }}>
          Material complementario
        </Typography>
      </Breadcrumbs>

      <Encabezado
        estilo={ESTILO_COMPLEMENTARIO}
        etiqueta="Para todas las unidades"
        titulo="Material complementario"
        descripcion="Documentos de consulta para todas las unidades."
      />

      <Grid container spacing={2}>
        {COMPLEMENTARIO.map((m) => (
          <Grid item xs={12} sm={6} md={4} key={m.id}>
            <MaterialCard material={m} Icono={ICONO_COMPLEMENTARIO[m.id]} estilo={ESTILO_COMPLEMENTARIO} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
