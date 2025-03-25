import {BrowserRouter, Routes, Route} from 'react-router'
import ResponsiveGrid from "./pages/responsive-grid/responsive-grid.jsx";
import Experiment from "./pages/experiment/experiment.jsx";
import Register from "./pages/register/register.jsx";
import Login from "./pages/login/login.jsx";
import Chat from "./pages/chat/chat.jsx";
import 'bulma/css/versions/bulma-no-dark-mode.css'


function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/responsive-grid" element={<ResponsiveGrid />} />
              <Route path="/experiment" element={<Experiment />} />
              <Route path="/login" element={<Login />} />
              <Route path="/chat" element={<Chat />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
