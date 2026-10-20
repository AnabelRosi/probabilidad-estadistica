import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relativa ('./') + HashRouter: el sitio funciona en
// https://<usuario>.github.io/<repositorio>/ sin depender del nombre final del repositorio.
// Si se prefiere una base absoluta, reemplazar por '/<repositorio>/'.
export default defineConfig({
  plugins: [react()],
  base: './',
})
