import { useState } from 'react';
import { db } from '../firebaseConfig'; 
import { doc, setDoc } from 'firebase/firestore'; 
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatientRegisterPage = () => {
  const [name, setName] = useState('');
  const [dni, setDni] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.');
      return;
    }

    if (name && dni && birthDate && phone && email && password) {
      const auth = getAuth();
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Enviar correo de verificación
        await sendEmailVerification(user);

        const patient = {
          name,
          dni,
          birthDate,
          phone,
          email,
          role: 'particular', // Asignar rol de particular
          uid: user.uid,
        };

        await setDoc(doc(db, 'patients', user.uid), patient);

        // Mostrar notificación estilizada
        toast.success('Paciente registrado con éxito. Por favor verifica tu correo.');

        // Redirigir a la página de login después de unos segundos
        setTimeout(() => {
          navigate('/login');
        }, 6000);

      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          setError('El correo electrónico ya está registrado. Por favor, usa uno diferente o inicia sesión.');
        } else {
          console.error('Error al registrar paciente:', error);
          setError('Hubo un problema al registrar. Intenta nuevamente.');
        }
      }
    } else {
      setError('Por favor completa todos los campos');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <ToastContainer /> {/* Contenedor para las notificaciones */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Registro de Paciente</h1>
        
        <input
          type="text"
          placeholder="Nombre y Apellido"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />
        
        <input
          type="text"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />
        
        <input
          type="date"
          placeholder="Fecha de Nacimiento"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />
        
        <input
          type="tel"
          placeholder="Teléfono (sin 0 ni 15)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />
        
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600"
        >
          Registrar
        </button>
      </div>
    </div>
  );
};

export default PatientRegisterPage;
