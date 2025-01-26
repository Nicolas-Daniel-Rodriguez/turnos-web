import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // Importa los métodos de Firebase
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Home = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para manejar la autenticación real con Firebase
  const navigate = useNavigate();
  const auth = getAuth();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    setFadeIn(true); // Activa el fade cuando el componente se monta

    // Verificar el estado de autenticación con Firebase
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Usuario autenticado:', user); // Verificar los datos del usuario

        setIsAuthenticated(true);

        // Verificar el tipo de usuario antes de hacer la consulta
        const db = getFirestore();

        // Buscar el usuario en la colección 'professionals' o 'patients' según el uid
        const userRef = doc(db, 'professionals', user.uid); // Comienza buscando en 'professionals'
        const patientRef = doc(db, 'patients', user.uid); // Luego en 'patients'

        // Primero intentar obtener datos de los profesionales
        getDoc(userRef).then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log('Datos del profesional:', userData); // Verifica los datos
            setUserType(userData.role); // Obtienes el 'role' del usuario
          } else {
            console.log("No se encontró el documento para el profesional, intentamos con los pacientes.");
            // Si no es un profesional, intenta con los pacientes
            getDoc(patientRef).then((patientSnap) => {
              if (patientSnap.exists()) {
                const patientData = patientSnap.data();
                console.log('Datos del paciente:', patientData); // Verifica los datos
                setUserType(patientData.role); // Obtienes el 'role' del paciente
              } else {
                console.log("No se encontró el documento para el paciente");
                setUserType('guest'); // Aquí asignamos un valor predeterminado si no se encuentra el tipo de usuario
              }
            }).catch((error) => {
              console.error("Error obteniendo los datos del paciente:", error);
              setUserType('guest'); // Valor por defecto para errores
            });
          }
        }).catch((error) => {
          console.error("Error obteniendo los datos del profesional:", error);
          setUserType('guest'); // Valor por defecto para errores
        });

      } else {
        setIsAuthenticated(false);
        setUserType('guest'); // Asegúrate de asignar un valor por defecto cuando el usuario no está autenticado
        console.log('Usuario no autenticado');
      }
    });
  }, [auth]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setIsAuthenticated(false); // Cerrar sesión correctamente
        navigate('/'); // Redirigir al home después de cerrar sesión
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  };

  const goToDashboard = () => {
    console.log('Tipo de usuario:', userType); // Verifica qué tipo de usuario es
    if (userType === 'professional') {
      navigate(`/${auth.currentUser.displayName}`); // Redirigir al dashboard del profesional
    } else if (userType === 'particular') {
      
    } else {
      console.log('No se ha encontrado el tipo de usuario');
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-white text-xl font-bold">Turnos Web</a>
          <ul className="flex space-x-4">
            <li><a href="/" className="text-white">Inicio</a></li>
            <li><a href="/precios" className="text-white">Precios</a></li>
            <li><a href="/contacto" className="text-white">Contacto</a></li>
          </ul>

          {/* Mostrar los botones dependiendo del estado de autenticación */}
          <div>
            {isAuthenticated ? (
              <>
                {/* Link a Dashboard */}
                {userType === 'professional' && (
                  <button onClick={goToDashboard} className="ml-4 bg-blue-500 text-white py-2 px-4 rounded">
                    Dashboard
                  </button>
                )}   

                {/* Botón de Cerrar Sesión */}
                <button
                  onClick={handleLogout}
                  className="ml-4 bg-red-500 text-white py-2 px-4 rounded"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                {/* Botón de Login */}
                <Link to="/login">
                  <button className="ml-4 bg-blue-500 text-white py-2 px-4 rounded">
                    Login
                  </button>
                </Link>
                {/* Botón de Registro */}
                <Link to="/register">
                  <button className="ml-4 bg-blue-500 text-white py-2 px-4 rounded">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Full-width Image */}
      <div className={`relative ${fadeIn ? 'fade-in' : ''}`}>
        <img
          src="https://via.placeholder.com/1920x800" // Cambia esta URL por la imagen que desees
          alt="Hero"
          className="w-full h-auto"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold">Bienvenido a Turnos Web</h1>
        </div>
      </div>

      {/* Content Section */}
      <section className="container mx-auto py-16 px-4 md:flex md:justify-between md:items-center">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">Gestiona tus turnos de manera fácil</h2>
          <p className="text-lg mb-4">
            Nuestra plataforma te permite gestionar los turnos de médicos, entrenadores, psicólogos y más de manera rápida y eficiente. Organiza tus horarios y brinda a tus usuarios la mejor experiencia.
          </p>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <img
            src="https://via.placeholder.com/400" // Imagen a la derecha
            alt="Gestión de turnos"
            className="w-full max-w-md"
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Nuestros Planes</h2>
          <div className="md:flex justify-center space-x-8">
            {/* Plan 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md max-w-sm mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4">Plan Básico</h3>
              <p className="text-lg mb-4">$19/mes</p>
              <ul className="mb-6">
                <li className="mb-2">Acceso a turnos ilimitados</li>
                <li className="mb-2">Soporte básico</li>
                <li className="mb-2">Estadísticas básicas</li>
              </ul>
              <button className="bg-blue-500 text-white py-2 px-4 rounded">Elegir Plan</button>
            </div>
            {/* Plan 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md max-w-sm">
              <h3 className="text-2xl font-bold mb-4">Plan Pro</h3>
              <p className="text-lg mb-4">$39/mes</p>
              <ul className="mb-6">
                <li className="mb-2">Todo en el Plan Básico</li>
                <li className="mb-2">Soporte premium</li>
                <li className="mb-2">Acceso a estadísticas avanzadas</li>
              </ul>
              <button className="bg-blue-500 text-white py-2 px-4 rounded">Elegir Plan</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
