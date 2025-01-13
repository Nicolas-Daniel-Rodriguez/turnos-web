import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ProfessionalEditPage = ({ subdomain }) => {
  const [professional, setProfessional] = useState(null);
  const [newSlot, setNewSlot] = useState('');

  useEffect(() => {
    const fetchProfessional = async () => {
      const docRef = doc(db, "professionals", subdomain);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfessional(docSnap.data());
      } else {
        console.log("No se encontró el profesional.");
      }
    };

    fetchProfessional();
  }, [subdomain]);

  const handleAddSlot = async () => {
    const updatedSlots = [...professional.availableSlots, newSlot];
    await updateDoc(doc(db, "professionals", subdomain), {
      availableSlots: updatedSlots,
    });
    setProfessional({ ...professional, availableSlots: updatedSlots });
  };

  return (
    <div>
      {professional ? (
        <>
          <h1>Editando a {professional.name}</h1>
          <input type="text" placeholder="Nuevo Horario" value={newSlot} onChange={(e) => setNewSlot(e.target.value)} />
          <button onClick={handleAddSlot}>Agregar Horario</button>
          <ul>
            {professional.availableSlots.map((slot, index) => (
              <li key={index}>{slot}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default ProfessionalEditPage;
