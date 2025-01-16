import { useParams, useLocation  } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from '../firebaseConfig'; // Firebase config
import {  collection, query, where, doc, getDocs, updateDoc, setDoc, getDoc } from 'firebase/firestore'; // Se restauran updateDoc y setDoc
import { onAuthStateChanged, signOut, getAuth } from 'firebase/auth'; // Importamos Firebase Auth
import Calendar from 'react-calendar'; // Calendario interactivo
import 'react-calendar/dist/Calendar.css'; // Estilos del calendario

const ProfessionalPage = () => {
  const { subdomain } = useParams(); // El subdominio ahora será el displayName
  const [professional, setProfessional] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [turnosVigentes, setTurnosVigentes] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [user, setUser] = useState(null); // Para almacenar el usuario logueado
  const [errorMessage, setErrorMessage] = useState(""); // Para mostrar el mensaje de error
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true); // Estado para la carga

  const auth = getAuth();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setErrorMessage("");

        const currentSubdomain = location.pathname.split('/')[1];  // Obtener el subdominio de la URL (ej. "/displayName")

        // Comparar el displayName del usuario con el subdominio
        if (currentUser.displayName === currentSubdomain) {
          setIsOwner(true);  // Si coinciden, es el propietario
          console.log("El usuario es el propietario de esta página.");
        } else {
          setIsOwner(false);  // Si no coinciden, no es el propietario
          console.log("El usuario no es el propietario de esta página.");
        }

      } else {
        setUser(null);
        setErrorMessage("Debe estar logueado para acceder a esta página.");
      }
    });

    return () => unsubscribe();
  }, [auth, location]); 
  

  useEffect(() => {
    const fetchProfessional = async () => {
      setLoading(true); // Iniciamos la carga
      
      // Creamos una query para buscar en la colección "professionals" donde el displayName coincida con el subdominio
      const q = query(collection(db, "professionals"), where("displayName", "==", subdomain));
  
      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setProfessional(doc.data()); // Establecemos los datos del profesional
          });
        } else {
          setErrorMessage("No se encontró ningún profesional con ese subdominio.");
        }
      } catch (error) {
        console.error("Error buscando el profesional:", error);
        setErrorMessage("Hubo un error al buscar al profesional.");
      }
      
      setLoading(false); // Terminamos la carga
    };
  
    fetchProfessional();
  }, [subdomain]);

  const handleDateChange = async (date) => {
    setSelectedDate(date);

    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const docRef = doc(db, "turnos", formattedDate);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setTurnosVigentes(docSnap.data().bookedAppointments || []);
    } else {
      setTurnosVigentes([]);
    }
  };

  const confirmTurno = async (slot) => {
    const formattedDate = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
    const docRef = doc(db, "turnos", formattedDate);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        availableSlots: professional.availableSlots.filter((s) => s !== slot),
        bookedAppointments: [
          ...turnosVigentes,
          { time: slot, patient: user.displayName, dni: '12345678', telefono: '123456789', obraSocial: 'Obra Social' },
        ],
      });
    } else {
      await setDoc(docRef, {
        availableSlots: professional.availableSlots.filter((s) => s !== slot),
        bookedAppointments: [
          { time: slot, patient: user.displayName, dni: '12345678', telefono: '123456789', obraSocial: 'Obra Social' },
        ],
      });
    }
  
    alert(`Turno reservado: ${slot}`);
    setShowConfirmation(false); // Cierra la ventana de confirmación
  };

  const cancelTurno = async (turno) => {
    const formattedDate = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
    const docRef = doc(db, "turnos", formattedDate);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const updatedBookedAppointments = turnosVigentes.filter((t) => t.time !== turno.time);
      const updatedAvailableSlots = [...professional.availableSlots, turno.time];

      await updateDoc(docRef, {
        availableSlots: updatedAvailableSlots,
        bookedAppointments: updatedBookedAppointments,
      });

      alert(`Turno cancelado: ${turno.time}`);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><span>Cargando...</span></div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Menú a la izquierda que fue reemplazado por el calendario */}
      <div className="w-1/4 p-4 bg-slate-800 shadow-lg">
        <h2 className="text-xl mb-4 text-white">Calendario</h2>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={({ date, view }) => {
            if (view === 'month' && professional?.availableSlots?.some(slot => slot.date === date.toLocaleDateString())) {
              return 'react-calendar__tile--has-turn'; // Aplica la clase personalizada
            }

            return '';
          }}
          className="react-calendar"  // Esta es la clase principal que se aplica al calendario
        />
      </div>

      {/* Contenido a la derecha */}
      <div className="w-3/4 p-6 space-y-6">
        {professional && (
          <div className="flex justify-between items-center">
            {/* Nombre del profesional */}
            <div>
              <p className="text-gray-800 text-lg font-semibold">{professional.name}</p>
              <p>{professional.specialty}</p>
            </div>

            {/* Menú horizontal y Cerrar sesión */}
            <div className="flex items-center space-x-6">
              <nav className="flex space-x-6">
                {user && isOwner && (
                  <>
                    <a href="#" className="text-gray-800 hover:underline">Agenda</a>
                    <a href="#" className="text-gray-800 hover:underline">Clientes</a>
                    <a href="#" className="text-gray-800 hover:underline">Configuración</a>
                  </>
                )}
              </nav>

              {user ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                >
                  Cerrar Sesión
                </button>
              ) : (
                <a
                  href="/login"
                  className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
                >
                  Iniciar Sesión
                </a>
              )}
            </div>
          </div>
        )}

        {/* Mostrar mensaje de error si existe */}
        {errorMessage && (
          <div className="bg-red-200 text-red-700 p-2 rounded">
            {errorMessage}
          </div>
        )}

        {/* Turnos del día */}
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h2 className="text-xl mb-4">
            Turnos del día: {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h2>
          <ul>
            {turnosVigentes.map((turno, index) => (
              <li key={index} className="flex justify-between mb-2">
                <div>{turno.time}</div>
                {isOwner && (
                  <button
                    onClick={() => cancelTurno(turno)}
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                  >
                    Cancelar
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Confirmación para reservar */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg space-y-4">
              <p className="text-xl">Confirmar turno para: </p>
              <button
                onClick={confirmTurno}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalPage;
