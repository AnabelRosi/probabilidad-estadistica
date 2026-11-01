import { Box } from '@mui/material'
import vistas from '../data/vistas.json'

// Cantidad de páginas de un documento (presentación o trabajo práctico) con vista disponible
export function paginasDe(unidad, clave) {
  return vistas[unidad]?.[clave]?.paginas ?? 0
}

// Muestra un documento (presentación o trabajo práctico) como páginas dentro del sitio.
// Las imágenes salen de la versión PDF del documento, por lo que se ve igual en cualquier navegador,
// sin depender del visor de PDF (que en muchos celulares descarga el archivo en lugar de abrirlo).
export default function VisorPaginas({ unidad, clave }) {
  const doc = vistas[unidad]?.[clave]
  if (!doc) return null

  const base = `${import.meta.env.BASE_URL}materiales/vista/unidad-${unidad}/`

  return (
    <Box sx={{ display: 'grid', gap: 2, bgcolor: '#f4f6fb', borderRadius: '12px', p: { xs: 1.5, sm: 3 } }}>
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
    </Box>
  )
}
