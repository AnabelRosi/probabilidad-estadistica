import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Inicio from './pages/Inicio.jsx'
import Unidad from './pages/Unidad.jsx'
import Complementario from './pages/Complementario.jsx'
import NoEncontrada from './pages/NoEncontrada.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="unidad/:numero" element={<Unidad />} />
        <Route path="complementario" element={<Complementario />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  )
}
