import { useState } from 'react';
import { db } from '../firebaseConfig'; 
import { collection, addDoc } from 'firebase/firestore'; 
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfessionalRegisterPage = () => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Para redirigir

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

    if (name && specialty && displayName && dni && email && password) {
      const auth = getAuth();
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Enviar correo de verificación
        await sendEmailVerification(user);

        const professional = {
          name,
          specialty,
          displayName,
          dni,
          email,
          role: 'professional',
          uid: user.uid
        };

        await addDoc(collection(db, 'professionals'), professional);

        // Mostrar notificación estilizada
        toast.success('Profesional registrado con éxito. Por favor verifica tu correo.');

        // Redirigir a la página de login después de unos segundos
        setTimeout(() => {
          navigate('/login'); // Cambia '/login' por la ruta de tu página de login
        }, 6000);

      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          setError('El correo electrónico ya está registrado. Por favor, usa uno diferente o inicia sesión.');
        } else {
          console.error('Error al registrar profesional:', error);
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
        <h1 className="text-3xl font-bold mb-6 text-center">Registro de Profesional</h1>
        
        <input
          type="text"
          placeholder="Nombre y Apellido"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />
        
        <input
          type="text"
          placeholder="Especialidad"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />
        
        <input
          type="text"
          placeholder="Nombre para mostrar (Subdominio)"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
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

export default ProfessionalRegisterPage;
