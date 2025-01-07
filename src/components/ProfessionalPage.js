import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from '../firebaseConfig'; // Firebase config
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Calendar from 'react-calendar'; // Calendario interactivo
import 'react-calendar/dist/Calendar.css'; // Estilos del calendario

const ProfessionalPage = () => {
  const { subdomain } = useParams();
  const [professional, setProfessional] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [turnosVigentes, setTurnosVigentes] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    console.log("Subdominio recibido:", subdomain);
    const fetchProfessional = async () => {
      const docRef = doc(db, "professionals", subdomain);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Datos del profesional:", docSnap.data());
        setProfessional(docSnap.data());
      } else {
        console.log("No se encontró ningún profesional con ese subdominio.");
      }
    };

    fetchProfessional();
  }, [subdomain]);

  // Función para manejar la selección de fecha del calendario
  const handleDateChange = async (date) => {
    setSelectedDate(date);

    // Obtener los turnos disponibles para el día seleccionado
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const docRef = doc(db, "turnos", formattedDate); // Consulta en Firestore para el día seleccionado
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setTurnosVigentes(docSnap.data().bookedAppointments || []);
    } else {
      setTurnosVigentes([]);
    }
  };

  // Función para manejar la selección de turno
  const handleAppointmentClick = (slot) => {
    setSelectedSlot(slot);
    setShowConfirmation(true);
  };

  // Confirmar la reserva del turno
  const confirmTurno = async () => {
    const formattedDate = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
    const docRef = doc(db, "turnos", formattedDate);

    // Actualiza la disponibilidad de los turnos y añade el turno al historial
    await updateDoc(docRef, {
      availableSlots: professional.availableSlots.filter((s) => s !== selectedSlot), // Elimina el turno seleccionado
      bookedAppointments: [
        ...turnosVigentes,
        { time: selectedSlot, patient: 'Nombre del paciente' }, // Agrega el turno confirmado
      ],
    });

    alert(`Turno reservado: ${selectedSlot}`);
    setShowConfirmation(false);
  };

  const cancelTurno = () => {
    setSelectedSlot(null);
    setShowConfirmation(false);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg space-y-6">
        {professional ? (
          <>
            <h1 className="text-2xl font-semibold">{professional.name}</h1>
            <p className="text-lg">{professional.specialty}</p>
            
            <div className="flex">
              <div className="flex-shrink-0 w-1/3">
                <h2 className="text-xl">Calendario</h2>
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  tileClassName={({ date, view }) => {
                    if (view === 'month' && professional.availableSlots.some(slot => slot.date === date.toLocaleDateString())) {
                      return 'bg-green-200'; // Estilo de turno disponible
                    }
                    return '';
                  }}
                />
              </div>

              <div className="flex-grow ml-6">
                <h2 className="text-xl">Turnos Disponibles</h2>
                <ul>
                  {professional.availableSlots.length > 0 ? (
                    professional.availableSlots.map((slot, index) => (
                      <li key={index} className={`flex items-center space-x-2`}>
                        <span>{slot}</span>
                        <button
                          onClick={() => handleAppointmentClick(slot)}
                          className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                        >
                          Reservar
                        </button>
                      </li>
                    ))
                  ) : (
                    <p>No hay turnos disponibles en este momento.</p>
                  )}
                </ul>
              </div>
            </div>

            {selectedSlot && showConfirmation && (
              <div className="mt-4 p-4 border rounded bg-gray-200">
                <p className="text-lg">¿Estás seguro de reservar el turno para: <strong>{selectedSlot}</strong>?</p>
                <div className="flex space-x-4 mt-2">
                  <button onClick={confirmTurno} className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600">Sí</button>
                  <button onClick={cancelTurno} className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600">No</button>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-xl">Turnos Vigentes</h2>
              <ul>
                {turnosVigentes.length > 0 ? (
                  turnosVigentes.map((turno, index) => (
                    <li key={index} className="p-2 border-b">
                      <span>{turno.time} - {turno.patient}</span>
                    </li>
                  ))
                ) : (
                  <p>No hay turnos vigentes.</p>
                )}
              </ul>
            </div>
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
    </div>
  );
};

export default ProfessionalPage;
