import { useEffect } from 'react'
import { Link as RouterLink, useParams } from 'react-router'
import { Box, Breadcrumbs, Button, Chip, Link, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import DownloadRounded from '@mui/icons-material/DownloadRounded'
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded'
import Desplegable from '../components/Desplegable.jsx'
import ContenidoApunte from '../components/ContenidoApunte.jsx'
import VisorPaginas, { paginasDe } from '../components/VisorPaginas.jsx'
import Encabezado from '../components/Encabezado.jsx'
import NoEncontrada from './NoEncontrada.jsx'
import { UNIDADES, materialesDeUnidad, nombreArchivo, urlMaterial } from '../data/materiales.js'
import { ESTILO_UNIDAD, ICONO_TIPO } from '../identidad.js'

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
        <Button component={RouterLink} to="/" variant="contained" endIcon={<ArrowForwardRounded />}>
          Volver al inicio
        </Button>
      )}
    </Box>
  )
}

function Seccion({ id, Icono, titulo, estilo, children }) {
  return (
    <Box component="section" aria-labelledby={id} sx={{ mb: { xs: 5, md: 6 } }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
        <Box aria-hidden sx={{ display: 'grid', placeItems: 'center', color: estilo.oscuro }}>
          <Icono />
        </Box>
        <Typography id={id} variant="h2">
          {titulo}
        </Typography>
      </Stack>
      {children}
    </Box>
  )
}

// 1. Infografía visible en la página, con acceso al tamaño completo y a la descarga
function Infografia({ material, unidad, estilo }) {
  const url = urlMaterial(material.archivo)
  return (
    <Box component="figure" sx={{ m: 0 }}>
      <Box
        component="img"
        src={url}
        alt={`Infografía de la Unidad ${unidad.numero}: ${unidad.titulo}`}
        sx={{
          display: 'block',
          width: '100%',
          maxWidth: 900,
          height: 'auto',
          mx: 'auto',
          bgcolor: '#fff',
          border: 2,
          borderColor: alpha(estilo.principal, 0.7),
          borderRadius: '20px',
        }}
      />
      <Stack component="figcaption" direction="row" flexWrap="wrap" useFlexGap spacing={1.5} justifyContent="center" sx={{ mt: 2 }}>
        <Button variant="contained" startIcon={<OpenInNewRounded />} href={url} target="_blank" rel="noopener noreferrer">
          Ver en tamaño completo
        </Button>
        <Button variant="outlined" startIcon={<DownloadRounded />} href={url} download={nombreArchivo(material.archivo)}>
          Descargar infografía
        </Button>
      </Stack>
    </Box>
  )
}

// 2. Información escrita: el texto del apunte dentro de la página y, al final, el botón para descargarlo
function Informacion({ material, unidad, estilo }) {
  const url = urlMaterial(material.archivo)
  return (
    <>
      <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1} sx={{ mb: 2 }}>
        {unidad.temas.map((tema) => (
          <Chip key={tema} label={tema} sx={{ bgcolor: estilo.suave, color: estilo.oscuro }} />
        ))}
      </Stack>
      <ContenidoApunte numero={unidad.numero} titulo={unidad.titulo} estilo={estilo} />
      <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1.5} sx={{ mt: 3 }}>
        <Button variant="outlined" startIcon={<DownloadRounded />} href={url} download={nombreArchivo(material.archivo)}>
          Descargar apunte (PDF)
        </Button>
      </Stack>
    </>
  )
}

// Presentación o trabajo práctico: se lee en la página y, al final, se puede descargar el original
function DocumentoConVisor({ material, unidad, clave, etiqueta }) {
  return (
    <>
      <VisorPaginas unidad={unidad} clave={clave} />
      <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1.5} sx={{ mt: 3 }}>
        <Button variant="outlined" startIcon={<DownloadRounded />} href={urlMaterial(material.archivo)} download={nombreArchivo(material.archivo)}>
          Descargar {etiqueta} ({material.formato})
        </Button>
      </Stack>
    </>
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
  const de = (tipo) => materiales.find((m) => m.tipo === tipo)
  const infografia = de('infografia')
  const apunte = de('teoria')
  const presentacion = de('presentacion')
  const tp = de('tp')

  return (
    <Box key={unidad.numero}>
      <Breadcrumbs aria-label="Ubicación" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" underline="hover" color="text.secondary">
          Inicio
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 600 }}>
          Unidad {unidad.numero}
        </Typography>
      </Breadcrumbs>

      <Encabezado estilo={estilo} etiqueta={`Unidad ${unidad.numero}`} titulo={unidad.titulo} descripcion={unidad.resumen} />

      {infografia && (
        <Seccion id="titulo-infografia" Icono={ICONO_TIPO.infografia} titulo="Infografía" estilo={estilo}>
          <Infografia material={infografia} unidad={unidad} estilo={estilo} />
        </Seccion>
      )}

      {apunte && (
        <Desplegable id="informacion" Icono={ICONO_TIPO.teoria} titulo="Información de la unidad" descripcion="Teoría completa de la unidad" estilo={estilo}>
          <Informacion material={apunte} unidad={unidad} estilo={estilo} />
        </Desplegable>
      )}

      {presentacion && (
        <Desplegable id="presentacion" Icono={ICONO_TIPO.presentacion} titulo="Presentación" descripcion={`${paginasDe(unidad.numero, 'pres')} diapositivas`} estilo={estilo}>
          <DocumentoConVisor material={presentacion} unidad={unidad.numero} clave="pres" etiqueta="presentación" />
        </Desplegable>
      )}

      {tp && (
        <Desplegable id="tp" Icono={ICONO_TIPO.tp} titulo="Trabajo práctico" descripcion={`${paginasDe(unidad.numero, 'tp')} páginas`} estilo={estilo}>
          <DocumentoConVisor material={tp} unidad={unidad.numero} clave="tp" etiqueta="trabajo práctico" />
        </Desplegable>
      )}

      <NavegacionUnidades numero={unidad.numero} />
    </Box>
  )
}
