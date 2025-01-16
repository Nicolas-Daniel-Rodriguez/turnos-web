import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ProfessionalPage from './components/ProfessionalPage';
import RegisterProfessional from './components/ProfessionalRegisterPage';
import RegisterPatient from './components/PatientRegisterPage';
import { db } from './firebaseConfig'; // Asegúrate de importar Firebase
import { getDocs, query, collection, where } from 'firebase/firestore';
import "./styleCalendar.css";
import { AuthProvider } from "./components/AuthContext"; 

// Componente para verificar si el subdominio es válido en Firebase
const ProfessionalSubdomain = () => {
  const { subdomain } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isValidSubdomain, setIsValidSubdomain] = useState(false);
  const toastShownRef = useRef(false);  // Usamos useRef en lugar de useState para evitar re-renderizados

  useEffect(() => {
    const checkSubdomain = async () => {
      setIsLoading(true);
      try {
        // Debes hacer una query para buscar dentro de los documentos por el campo "displayName"
        const querySnapshot = await getDocs(query(collection(db, "professionals"), where("displayName", "==", subdomain)));
        
        if (!querySnapshot.empty) {
          setIsValidSubdomain(true);
        } else {
          setIsValidSubdomain(false);
          if (!toastShownRef.current) {
            toastShownRef.current = true;
            toast.error(`La página o el profesional "${subdomain}" no existe. Redirigiendo al inicio...`);
          }
        }
      } catch (error) {
        console.error("Error al verificar el subdominio: ", error);
        if (!toastShownRef.current) {
          toastShownRef.current = true;
          toast.error("Error al verificar el subdominio. Redirigiendo al inicio...");
        }
        setIsValidSubdomain(false);
      } finally {
        setIsLoading(false);
      }
    };
    

    // Llamar a la función de verificación
    checkSubdomain();
  }, [subdomain]);  // Solo dependemos del subdominio

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Si el subdominio es válido, muestra la página del profesional
  if (isValidSubdomain) {
    return <ProfessionalPage subdomain={subdomain} />;
  }

  // Si el subdominio no es válido, redirige al inicio
  return <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/RegisterProfessional" element={<RegisterProfessional />} />
        <Route path="/RegisterPatient" element={<RegisterPatient />} />
        <Route path="/register" element={<Register />} />
        {/* Ruta dinámica para profesionales */}
        <Route path="/:subdomain" element={<ProfessionalSubdomain />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
