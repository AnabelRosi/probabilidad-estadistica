import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded'
import vistas from '../data/vistas.json'

// Muestra un documento (presentación o trabajo práctico) como páginas dentro del sitio.
// Las imágenes salen de la versión PDF del documento, por lo que se ve igual en cualquier navegador,
// sin depender del visor de PDF (que en muchos celulares descarga el archivo en lugar de abrirlo).
export default function VisorPaginas({ unidad, clave, titulo, estilo }) {
  const doc = vistas[unidad]?.[clave]
  if (!doc) return null

  const etiqueta = clave === 'pres' ? 'diapositivas' : 'páginas'
  const base = `${import.meta.env.BASE_URL}materiales/vista/unidad-${unidad}/`

  return (
    <Accordion
      disableGutters
      slotProps={{ transition: { unmountOnExit: true } }}
      sx={{
        mt: 2,
        border: 2,
        borderColor: alpha(estilo.principal, 0.7),
        borderRadius: '16px !important',
        boxShadow: 'none',
        '&::before': { display: 'none' },
        overflow: 'hidden',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreRounded />}
        aria-controls={`visor-${clave}-${unidad}`}
        id={`visor-${clave}-${unidad}-cabecera`}
        sx={{ bgcolor: estilo.suave, fontWeight: 700 }}
      >
        <Typography sx={{ fontWeight: 700, color: estilo.oscuro }}>
          Ver {titulo} aquí ({doc.paginas} {etiqueta})
        </Typography>
      </AccordionSummary>
      <AccordionDetails id={`visor-${clave}-${unidad}`} sx={{ bgcolor: '#f4f6fb', p: { xs: 1.5, sm: 3 }, display: 'grid', gap: 2 }}>
        {doc.alts.map((alt, i) => (
          <Box
            key={i}
            component="img"
            src={`${base}${clave}-${String(i + 1).padStart(2, '0')}.jpg`}
            alt={alt}
            loading="lazy"
            sx={{
              display: 'block',
              width: '100%',
              maxWidth: 900,
              height: 'auto',
              mx: 'auto',
              bgcolor: '#fff',
              border: 1,
              borderColor: 'divider',
              borderRadius: '8px',
            }}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  )
}
