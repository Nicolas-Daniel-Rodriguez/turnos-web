import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login'; // Asegúrate de tener el componente Login
import Register from './components/Register';
import ProfessionalPage from './components/ProfessionalPage'; // El componente para la página de los profesionales

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Ruta dinámica para profesionales usando el subdominio */}
        <Route path="/:subdomain" element={<ProfessionalPage />} />
        {/* Agrega más rutas según lo necesites */}
      </Routes>
    </Router>
  );
}

export default App;
