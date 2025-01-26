import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para redireccionar

const Register = () => {
  const navigate = useNavigate(); // Inicializamos useNavigate

  const goToProfessionalRegister = () => {
    navigate('/RegisterProfessional'); // Redirige a la página de registro de profesionales
  };

  const goToPersonRegister = () => {
    navigate('/RegisterPatient'); // Redirige a la página de registro de personas
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">Registro</h2>
        <div className="mt-4">
          <button
            onClick={goToProfessionalRegister}
            className="w-full bg-green-500 text-white p-2 rounded mb-2"
          >
            Registro de Profesionales
          </button>
          <button
            onClick={goToPersonRegister}
            className="w-full bg-gray-500 text-white p-2 rounded"
          >
            Registro de Personas
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
