import {BrowserRouter, Routes, Route} from 'react-router'
import ResponsiveGrid from "./pages/responsive-grid/responsive-grid.jsx";
import Experiment from "./pages/experiment/experiment.jsx";


function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/responsive-grid" element={<ResponsiveGrid />} />
              <Route path="/experiment" element={<Experiment />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
