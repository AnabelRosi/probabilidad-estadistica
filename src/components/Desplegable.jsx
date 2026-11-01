import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded'

// Sección de una unidad que se despliega al tocarla. El contenido se monta solo cuando está abierta.
export default function Desplegable({ id, Icono, titulo, descripcion, estilo, children }) {
  return (
    <Accordion
      disableGutters
      slotProps={{ transition: { unmountOnExit: true } }}
      sx={{
        mb: 2,
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
        aria-controls={`${id}-contenido`}
        id={`${id}-cabecera`}
        sx={{ bgcolor: estilo.suave, px: { xs: 2, sm: 3 }, py: 0.5 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
          <Box aria-hidden sx={{ display: 'grid', placeItems: 'center', color: estilo.oscuro }}>
            <Icono />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography component="h2" variant="h3" sx={{ color: estilo.oscuro }}>
              {titulo}
            </Typography>
            {descripcion && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {descripcion}
              </Typography>
            )}
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails id={`${id}-contenido`} sx={{ p: { xs: 2, sm: 3 } }}>
        {children}
      </AccordionDetails>
    </Accordion>
  )
}
