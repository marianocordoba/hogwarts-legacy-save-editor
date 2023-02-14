import { HashRouter, Routes, Route } from 'react-router-dom'
import { EditSave, OpenSave } from "./pages"

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<OpenSave />} />
        <Route path="/edit" element={<EditSave />} />
      </Routes>
    </HashRouter>
  )
}

export default App
