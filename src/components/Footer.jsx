import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          
          {/* Columna 1 - Logo y descripción */}
          <div>
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">📊</span>
              <span className="text-xl font-bold text-blue-400">SportMetrics Pro</span>
            </div>
            <p className="text-gray-400 text-sm">
              La plataforma profesional para la gestión del rendimiento deportivo en clubes formativos.
            </p>
          </div>

          {/* Columna 2 - Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-gray-400 hover:text-white transition">
                  Características
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-400 hover:text-white transition">
                  Testimonios
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-white transition">
                  Planes
                </a>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition">
                  Iniciar sesión
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 - Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Contacto</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <span className="mr-2">📧</span>
                <a href="mailto:info@sportmetricspro.com" className="hover:text-white transition">
                  info@sportmetricspro.com
                </a>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📱</span>
                <a href="tel:+5493513636593" className="hover:text-white transition">
                  +54 9 351 3636593
                </a>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📍</span>
                <span>Córdoba, Argentina</span>
              </li>
            </ul>
          </div>

          {/* Columna 4 - Redes sociales */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Seguinos</h3>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition">
                <span className="text-xl">📘</span>
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition">
                <span className="text-xl">📸</span>
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition">
                <span className="text-xl">🐦</span>
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition">
                <span className="text-xl">💼</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© {currentYear} SportMetrics Pro. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Términos</a>
              <a href="#" className="hover:text-white transition">Privacidad</a>
              <a href="#" className="hover:text-white transition">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;