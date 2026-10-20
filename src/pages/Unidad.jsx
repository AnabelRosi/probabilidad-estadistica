import { useEffect } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { Box, Breadcrumbs, Button, Chip, Grid, Link, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import MaterialCard from '../components/MaterialCard.jsx'
import Encabezado from '../components/Encabezado.jsx'
import NoEncontrada from './NoEncontrada.jsx'
import { TIPOS, UNIDADES, materialesDeUnidad } from '../data/materiales.js'
import { ESTILO_UNIDAD, ICONO_TIPO } from '../identidad.js'
import { COLORES } from '../theme.js'

function NavegacionUnidades({ numero }) {
  const anterior = UNIDADES.find((u) => u.numero === numero - 1)
  const siguiente = UNIDADES.find((u) => u.numero === numero + 1)

  return (
    <Box
      component="nav"
      aria-label="Otras unidades"
      sx={{
        mt: 2,
        pt: 3,
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        gap: 1.5,
      }}
    >
      {anterior ? (
        <Button component={RouterLink} to={`/unidad/${anterior.numero}`} variant="outlined" startIcon={<ArrowBackRounded />}>
          Unidad {anterior.numero}: {anterior.titulo}
        </Button>
      ) : (
        <Button component={RouterLink} to="/" variant="outlined" startIcon={<ArrowBackRounded />}>
          Inicio
        </Button>
      )}
      {siguiente ? (
        <Button component={RouterLink} to={`/unidad/${siguiente.numero}`} variant="contained" endIcon={<ArrowForwardRounded />}>
          Unidad {siguiente.numero}: {siguiente.titulo}
        </Button>
      ) : (
        <Button component={RouterLink} to="/complementario" variant="contained" endIcon={<ArrowForwardRounded />}>
          Material complementario
        </Button>
      )}
    </Box>
  )
}

export default function Unidad() {
  const { numero } = useParams()
  const unidad = UNIDADES.find((u) => String(u.numero) === numero)

  useEffect(() => {
    if (unidad) document.title = `Unidad ${unidad.numero}: ${unidad.titulo} · Probabilidad y Estadística`
  }, [unidad])

  if (!unidad) return <NoEncontrada />

  const estilo = ESTILO_UNIDAD[unidad.numero]
  const materiales = materialesDeUnidad(unidad.numero)

  return (
    <Box>
      <Breadcrumbs aria-label="Ubicación" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" underline="hover" color="text.secondary">
          Inicio
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 600 }}>
          Unidad {unidad.numero}
        </Typography>
      </Breadcrumbs>

      <Encabezado estilo={estilo} etiqueta={`Unidad ${unidad.numero}`} titulo={unidad.titulo} descripcion={unidad.resumen} />

      <Box
        component="section"
        aria-labelledby="titulo-temas"
        sx={{ mb: { xs: 4, md: 5 }, p: { xs: 2.5, sm: 3 }, borderRadius: '20px', bgcolor: estilo.suave }}
      >
        <Typography id="titulo-temas" variant="h3" component="h2" sx={{ mb: 2, color: COLORES.texto }}>
          Temas de la unidad
        </Typography>
        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
          {unidad.temas.map((tema) => (
            <Chip
              key={tema}
              label={tema}
              sx={{ bgcolor: '#fff', color: estilo.oscuro, border: `1px solid ${alpha(estilo.principal, 0.4)}` }}
            />
          ))}
        </Stack>
      </Box>

      {TIPOS.map((tipo) => {
        const delTipo = materiales.filter((m) => m.tipo === tipo.id)
        if (delTipo.length === 0) return null
        const Icono = ICONO_TIPO[tipo.id]
        return (
          <Box component="section" key={tipo.id} aria-labelledby={`titulo-${tipo.id}`} sx={{ mb: { xs: 4, md: 5 } }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <Box aria-hidden sx={{ display: 'grid', placeItems: 'center', color: estilo.oscuro }}>
                <Icono />
              </Box>
              <Typography id={`titulo-${tipo.id}`} variant="h2">
                {tipo.titulo}
              </Typography>
            </Stack>
            <Grid container spacing={2}>
              {delTipo.map((m) => (
                <Grid item xs={12} sm={6} md={4} key={m.titulo}>
                  <MaterialCard material={m} Icono={Icono} estilo={estilo} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )
      })}

      <NavegacionUnidades numero={unidad.numero} />
    </Box>
  )
}
