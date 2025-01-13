import { useState } from 'react';
import { db } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

const PatientRegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = async () => {
    try {
      await addDoc(collection(db, 'patients'), { name, email });
      alert('Paciente registrado con éxito');
    } catch (error) {
      console.error('Error al registrar paciente:', error);
    }
  };

  return (
    <div>
      <h1>Registro de Paciente</h1>
      <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleRegister}>Registrar</button>
    </div>
  );
};

export default PatientRegisterPage;
