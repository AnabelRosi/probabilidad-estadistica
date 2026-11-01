import { useEffect } from 'react'
import { Link as RouterLink } from 'react-router'
import { Box, Button, Card, CardActionArea, Chip, Grid, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import { TIPOS, UNIDADES } from '../data/materiales.js'
import { ESTILO_UNIDAD, ICONO_TIPO } from '../identidad.js'
import { COLORES } from '../theme.js'

const DESCRIPCION_TIPO = {
  teoria: 'Apuntes con el desarrollo de cada tema y ejemplos resueltos.',
  presentacion: 'Diapositivas de clase para repasar los conceptos clave.',
  infografia: 'Resúmenes visuales para estudiar de un vistazo.',
  tp: 'Trabajos prácticos resueltos de cada unidad.',
}

const COLOR_TIPO = {
  teoria: ESTILO_UNIDAD[1],
  presentacion: ESTILO_UNIDAD[2],
  infografia: ESTILO_UNIDAD[3],
  tp: ESTILO_UNIDAD[4],
}

// Ilustración decorativa: histograma con curva normal superpuesta.
function Ilustracion() {
  const barras = [18, 34, 58, 84, 100, 84, 58, 34, 18]
  const colores = [COLORES.turquesa, COLORES.turquesa, COLORES.violeta, COLORES.violeta, COLORES.dorado, COLORES.coral, COLORES.coral, COLORES.turquesa, COLORES.turquesa]
  return (
    <Box component="svg" viewBox="0 0 300 200" aria-hidden sx={{ width: '100%', maxWidth: 360, height: 'auto' }}>
      {barras.map((h, i) => (
        <rect key={i} x={20 + i * 29} y={170 - h * 1.4} width={22} height={h * 1.4} rx={6} fill={colores[i]} opacity={0.9} />
      ))}
      <path
        d="M10 168 C 70 166, 95 30, 150 28 S 230 166, 290 168"
        fill="none"
        stroke="#fff"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <line x1={10} y1={172} x2={290} y2={172} stroke={alpha('#fff', 0.5)} strokeWidth={2} />
      <circle cx={150} cy={28} r={7} fill={COLORES.dorado} stroke="#fff" strokeWidth={3} />
    </Box>
  )
}

function Hero() {
  return (
    <Box
      component="section"
      aria-labelledby="titulo-inicio"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: { xs: '20px', md: '28px' },
        px: { xs: 3, sm: 5, md: 6 },
        py: { xs: 4, sm: 6 },
        mb: { xs: 4, md: 6 },
        color: '#fff',
        background: `linear-gradient(135deg, ${COLORES.azulNoche} 0%, ${COLORES.azul} 55%, ${COLORES.azulMedio} 100%)`,
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 420,
          height: 420,
          left: -160,
          bottom: -260,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(COLORES.violeta, 0.45)} 0%, ${alpha(COLORES.violeta, 0)} 70%)`,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: 380,
          height: 380,
          right: -120,
          top: -180,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(COLORES.turquesa, 0.4)} 0%, ${alpha(COLORES.turquesa, 0)} 70%)`,
        },
      }}
    >
      <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid item xs={12} md={7}>
          <Chip
            label="Plataforma de estudio"
            sx={{ mb: 2, bgcolor: alpha(COLORES.dorado, 0.18), color: COLORES.dorado, border: `1px solid ${alpha(COLORES.dorado, 0.5)}` }}
          />
          <Typography id="titulo-inicio" variant="h1" sx={{ mb: 2 }}>
            Probabilidad y{' '}
            <Box component="span" sx={{ color: COLORES.dorado }}>
              Estadística
            </Box>
          </Typography>
          <Typography sx={{ color: alpha('#fff', 0.88), fontSize: { xs: '1.05rem', sm: '1.2rem' }, maxWidth: 560, mb: 4 }}>
            Material de estudio organizado en cuatro unidades: teoría, presentaciones, infografías y trabajos
            prácticos. Elegí una unidad para ver sus temas y documentos.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            flexWrap="wrap"
            useFlexGap
            spacing={1.5}
            sx={{ '& .MuiButton-root': { whiteSpace: 'nowrap' } }}
          >
            <Button
              component={RouterLink}
              to="/unidad/1"
              variant="contained"
              color="secondary"
              size="large"
              endIcon={<ArrowForwardRounded />}
            >
              Empezar por la Unidad 1
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
          <Ilustracion />
        </Grid>
      </Grid>
    </Box>
  )
}

function TarjetaUnidad({ unidad }) {
  const estilo = ESTILO_UNIDAD[unidad.numero]
  const visibles = unidad.temas.slice(0, 3)
  const resto = unidad.temas.length - visibles.length

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        borderColor: alpha(estilo.principal, 0.35),
        transition: 'transform .2s ease, box-shadow .2s ease, border-color .2s ease',
        '&:hover, &:focus-within': {
          transform: 'translateY(-4px)',
          borderColor: estilo.principal,
          boxShadow: `0 16px 36px ${alpha(estilo.principal, 0.22)}`,
        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/unidad/${unidad.numero}`}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <Box
          sx={{
            position: 'relative',
            p: 3,
            pb: 2.5,
            background: `linear-gradient(135deg, ${estilo.suave} 0%, #fff 100%)`,
            borderBottom: `4px solid ${estilo.principal}`,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              aria-hidden
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                display: 'grid',
                placeItems: 'center',
                bgcolor: estilo.principal,
                color: estilo.contraste,
                boxShadow: `0 8px 20px ${alpha(estilo.principal, 0.4)}`,
              }}
            >
              <estilo.Icono sx={{ fontSize: 30 }} />
            </Box>
            <Box>
              <Typography variant="overline" component="p" sx={{ color: estilo.oscuro, lineHeight: 1.5 }}>
                Unidad {unidad.numero}
              </Typography>
              <Typography variant="h3" component="h3">
                {unidad.titulo}
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Box sx={{ p: 3, pt: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {unidad.resumen}
          </Typography>
          <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.75} sx={{ mb: 2.5 }}>
            {visibles.map((t) => (
              <Chip key={t} size="small" label={t} sx={{ bgcolor: estilo.suave, color: estilo.oscuro }} />
            ))}
            {resto > 0 && <Chip size="small" variant="outlined" label={`+${resto} temas`} />}
          </Stack>
          <Typography
            sx={{ mt: 'auto', fontWeight: 700, color: estilo.oscuro, display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            Explorar unidad <ArrowForwardRounded fontSize="small" aria-hidden />
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  )
}

export default function Inicio() {
  useEffect(() => {
    document.title = 'Probabilidad y Estadística'
  }, [])

  return (
    <Box>
      <Hero />

      <Box component="section" aria-labelledby="titulo-unidades" sx={{ mb: { xs: 5, md: 7 } }}>
        <Typography variant="overline" component="p" color="text.secondary">
          Recorrido de la materia
        </Typography>
        <Typography id="titulo-unidades" variant="h2" sx={{ mb: 3 }}>
          Las cuatro unidades
        </Typography>
        <Grid container spacing={3}>
          {UNIDADES.map((u) => (
            <Grid item xs={12} sm={6} key={u.numero}>
              <TarjetaUnidad unidad={u} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box component="section" aria-labelledby="titulo-tipos" sx={{ mb: { xs: 5, md: 7 } }}>
        <Typography variant="overline" component="p" color="text.secondary">
          En cada unidad
        </Typography>
        <Typography id="titulo-tipos" variant="h2" sx={{ mb: 3 }}>
          Qué vas a encontrar
        </Typography>
        <Grid container spacing={2}>
          {TIPOS.map((t) => {
            const Icono = ICONO_TIPO[t.id]
            const estilo = COLOR_TIPO[t.id]
            return (
              <Grid item xs={12} sm={6} md={3} key={t.id}>
                <Box sx={{ height: '100%', p: 2.5, borderRadius: '18px', bgcolor: '#fff', border: 1, borderColor: 'divider' }}>
                  <Box
                    aria-hidden
                    sx={{
                      width: 44,
                      height: 44,
                      mb: 1.5,
                      borderRadius: '12px',
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: estilo.suave,
                      color: estilo.oscuro,
                    }}
                  >
                    <Icono />
                  </Box>
                  <Typography variant="subtitle1" component="h3" sx={{ mb: 0.5 }}>
                    {t.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {DESCRIPCION_TIPO[t.id]}
                  </Typography>
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </Box>
  )
}
