import { Box, Button, Card, CardActions, CardContent, Chip, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import VisibilityRounded from '@mui/icons-material/VisibilityRounded'
import DownloadRounded from '@mui/icons-material/DownloadRounded'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import HourglassTopRounded from '@mui/icons-material/HourglassTopRounded'
import PersonSearchRounded from '@mui/icons-material/PersonSearchRounded'
import SpellcheckRounded from '@mui/icons-material/SpellcheckRounded'
import EditNoteRounded from '@mui/icons-material/EditNoteRounded'
import MoveToInboxRounded from '@mui/icons-material/MoveToInboxRounded'
import TaskAltRounded from '@mui/icons-material/TaskAltRounded'
import { AUTORIA, ESTADOS, FORMATOS_VISIBLES, etiquetaEstado, nombreArchivo, urlMaterial } from '../data/materiales.js'

const PRESENTACION_ESTADO = {
  [ESTADOS.autoriaPorConfirmar]: {
    Icono: PersonSearchRounded,
    nota: 'Falta confirmar quién elaboró este material antes de solicitar su autorización.',
  },
  [ESTADOS.pendienteAutorizacion]: {
    Icono: HourglassTopRounded,
    nota: 'Se habilitará cuando se confirme la autorización de publicación.',
  },
  [ESTADOS.correccionEdicion]: {
    Icono: SpellcheckRounded,
    nota: 'Se están corrigiendo erratas y detalles de legibilidad antes de publicarlo.',
  },
  [ESTADOS.correccionContenido]: {
    Icono: EditNoteRounded,
    nota: 'Se están corrigiendo errores de contenido antes de publicarlo.',
  },
  [ESTADOS.materialFaltante]: {
    Icono: MoveToInboxRounded,
    nota: 'Todavía no recibimos este material.',
  },
  [ESTADOS.listaParaPublicar]: {
    Icono: TaskAltRounded,
    nota: 'Autorizado. Se habilitará cuando el archivo definitivo esté en su ubicación pública.',
  },
  [ESTADOS.disponible]: { Icono: CheckCircleRounded, nota: null },
}

function notaDe(material) {
  if (material.estado === ESTADOS.pendienteAutorizacion && material.autoria === AUTORIA.porConfirmar) {
    return 'Se habilitará cuando se confirmen la autoría y la autorización de publicación.'
  }
  return PRESENTACION_ESTADO[material.estado].nota
}

export default function MaterialCard({ material, Icono, estilo }) {
  const disponible = material.estado === ESTADOS.disponible && material.archivo
  // Si el material tiene visor de páginas en la unidad (PPTX/DOCX), no hace falta el botón "Ver"
  const conVisor = Boolean(material.vista)
  const visible = Boolean(disponible && !conVisor && FORMATOS_VISIBLES.includes(material.formato))
  const { Icono: IconoEstado } = PRESENTACION_ESTADO[material.estado]
  const nota = disponible && conVisor
    ? `Para leerlo sin salir de esta página usá "Ver aquí" (más abajo). "Descargar" baja el archivo original (${material.formato}).`
    : disponible && !visible
      ? `El navegador no muestra archivos ${material.formato}: descargalo para abrirlo con un programa compatible.`
      : notaDe(material)

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderColor: alpha(estilo.principal, 0.35),
        transition: 'transform .2s ease, box-shadow .2s ease, border-color .2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: estilo.principal,
          boxShadow: `0 12px 28px ${alpha(estilo.principal, 0.18)}`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '0 0 auto 0',
          height: 4,
          bgcolor: estilo.principal,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pt: 3 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box
            aria-hidden
            sx={{
              flexShrink: 0,
              width: 46,
              height: 46,
              borderRadius: '14px',
              display: 'grid',
              placeItems: 'center',
              bgcolor: estilo.suave,
              color: estilo.oscuro,
            }}
          >
            <Icono />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" component="h3" sx={{ mb: 1 }}>
              {material.titulo}
            </Typography>
            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.75}>
              {material.formato && (
                <Chip size="small" label={material.formato} sx={{ bgcolor: estilo.suave, color: estilo.oscuro }} />
              )}
              <Chip
                size="small"
                icon={<IconoEstado />}
                label={etiquetaEstado(material)}
                color={disponible ? 'success' : 'default'}
                variant={disponible ? 'filled' : 'outlined'}
              />
            </Stack>
          </Box>
        </Stack>
        {nota && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {nota}
          </Typography>
        )}
      </CardContent>
      {disponible && (
        <CardActions sx={{ px: 2, pb: 2 }}>
          {visible && (
            <Button
              variant="contained"
              size="small"
              startIcon={<VisibilityRounded />}
              href={urlMaterial(material.archivo)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver ${material.titulo} (${material.formato}, se abre en una pestaña nueva)`}
            >
              Ver
            </Button>
          )}
          <Button
            variant={visible ? 'text' : 'contained'}
            size="small"
            startIcon={<DownloadRounded />}
            href={urlMaterial(material.archivo)}
            download={nombreArchivo(material.archivo)}
            aria-label={`Descargar ${material.titulo} (${material.formato})`}
          >
            Descargar
          </Button>
        </CardActions>
      )}
    </Card>
  )
}
