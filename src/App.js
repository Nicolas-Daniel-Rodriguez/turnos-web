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
import { getDoc, doc } from 'firebase/firestore';
import "./styleCalendar.css";

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
        // Busca el documento en la colección "professionals" que coincida con el subdominio
        const docRef = doc(db, "professionals", subdomain); // El subdominio será el nombre del documento
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setIsValidSubdomain(true);
        } else {
          setIsValidSubdomain(false);
          if (!toastShownRef.current) {  // Solo mostrar el toast si no se ha mostrado antes
            toastShownRef.current = true;  // Marcar que el toast ha sido mostrado
            toast.error(`La página o el profesional "${subdomain}" no existe. Redirigiendo al inicio...`);
          }
        }
      } catch (error) {
        console.error("Error al verificar el subdominio: ", error);
        if (!toastShownRef.current) {  // Solo mostrar el toast si no se ha mostrado antes
          toastShownRef.current = true;  // Marcar que el toast ha sido mostrado
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
  );
}

export default App;
