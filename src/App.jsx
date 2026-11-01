import { Route, Routes } from 'react-router'
import Layout from './components/Layout.jsx'
import Inicio from './pages/Inicio.jsx'
import Unidad from './pages/Unidad.jsx'
import NoEncontrada from './pages/NoEncontrada.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="unidad/:numero" element={<Unidad />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  )
}
