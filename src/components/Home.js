import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
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
          {/* Botón de Login */}
          <div>
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
            </div>
        </div>
        
            
      </nav>

      {/* Hero Section with Full-width Image */}
      <div className="relative">
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
