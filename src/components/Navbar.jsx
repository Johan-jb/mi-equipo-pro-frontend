import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg fixed w-full z-10 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y nombre */}
          <div className="flex items-center">
            <span className="text-2xl mr-2">📊</span>
            <span className="text-xl font-bold text-blue-600">SportMetrics Pro</span>
          </div>

          {/* Menú de navegación */}
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Características</a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition">Testimonios</a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition">Planes</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition">Contacto</a>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Iniciar Sesión
            </Link>
            <a
              href="#register"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Registrarse
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;