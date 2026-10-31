import { Box } from '@mui/material'
import { alpha } from '@mui/material/styles'
import unidad1 from '../contenido/unidad-1.html?raw'
import unidad2 from '../contenido/unidad-2.html?raw'
import unidad3 from '../contenido/unidad-3.html?raw'
import unidad4 from '../contenido/unidad-4.html?raw'

// Texto de cada apunte, generado a partir del PDF original (src/contenido/unidad-N.html).
// Es contenido propio del proyecto, no de usuarios, por eso se inserta como HTML.
const CONTENIDO = { 1: unidad1, 2: unidad2, 3: unidad3, 4: unidad4 }

export default function ContenidoApunte({ numero, titulo, estilo }) {
  const html = CONTENIDO[numero]
  if (!html) return null

  return (
    <Box
      component="article"
      aria-label={`Apunte de la Unidad ${numero}: ${titulo}`}
      sx={{
        bgcolor: '#fff',
        border: 2,
        borderColor: alpha(estilo.principal, 0.7),
        borderRadius: '20px',
        px: { xs: 2.5, sm: 4, md: 6 },
        py: { xs: 3, md: 4 },
        fontSize: '1.02rem',
        lineHeight: 1.75,
        overflowWrap: 'break-word',
        '& > :first-child': { mt: 0 },
        '& h3': { fontSize: '1.55rem', mt: 5, mb: 1.5, pb: 0.75, borderBottom: 3, borderColor: estilo.principal },
        '& h4': { fontSize: '1.2rem', mt: 3.5, mb: 1 },
        '& h5': { fontSize: '1.05rem', mt: 3, mb: 0.5, fontFamily: 'inherit', color: estilo.oscuro },
        '& p': { my: 1.25 },
        '& ul': { my: 1.25, pl: 3 },
        '& li': { mb: 0.5 },
        '& .formula-texto': {
          textAlign: 'center',
          fontWeight: 700,
          bgcolor: estilo.suave,
          borderRadius: '12px',
          py: 1,
          px: 2,
        },
        '& figure': { m: 0, my: 2.5, display: 'flex', justifyContent: 'center' },
        '& figure.formula': { overflowX: 'auto' },
        '& img': { display: 'block', maxWidth: '100%', height: 'auto' },
        '& figure.fila': { flexWrap: 'wrap', alignItems: 'center', gap: 2 },
        '& .recuadro': { border: 2, borderColor: estilo.principal, borderRadius: '12px', bgcolor: estilo.suave, px: 2.5, py: 0.5, my: 2.5 },
        '& .tabla': { overflowX: 'auto', my: 2.5 },
        '& table': { width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' },
        '& caption': { captionSide: 'top', textAlign: 'left', fontWeight: 700, pb: 1, color: estilo.oscuro },
        '& th, & td': { border: '1px solid', borderColor: alpha(estilo.principal, 0.5), px: 1.25, py: 0.75, textAlign: 'center', verticalAlign: 'middle' },
        '& th': { bgcolor: estilo.suave, fontWeight: 700 },
        '& td': { whiteSpace: 'nowrap' },
        '& tbody th[scope="row"], & td:first-of-type': { textAlign: 'left', whiteSpace: 'normal', minWidth: 130 },
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
