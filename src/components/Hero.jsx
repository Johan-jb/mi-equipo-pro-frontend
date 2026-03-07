import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="pt-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Columna izquierda - Texto */}
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Gestiona el rendimiento deportivo de tu club
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              La plataforma profesional para llevar el control de jugadores, evaluaciones, 
              estadísticas y multimedia. Todo en un solo lugar.
            </p>
            
            {/* Características destacadas */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <span className="text-gray-700">Evaluaciones de rendimiento con gráficos</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <span className="text-gray-700">Informes PDF descargables</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <span className="text-gray-700">Galería multimedia con fotos y videos</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <span className="text-gray-700">Acceso para padres, DT y preparadores</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex space-x-4">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Comenzar ahora
              </Link>
              <a
                href="#features"
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Conocer más
              </a>
            </div>

            {/* Estadísticas rápidas */}
            <div className="flex space-x-8 mt-12 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-gray-500">Clubes confían</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-500">Jugadores registrados</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">1000+</div>
                <div className="text-sm text-gray-500">Evaluaciones</div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Imagen/Ilustración */}
          <div className="hidden md:block">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <span className="text-6xl">⚽📊</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Demo en acción</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <span className="font-semibold">Última evaluación:</span>
                  <span className="float-right text-blue-600">2 goles, 1 asistencia</span>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <span className="font-semibold">Rendimiento:</span>
                  <span className="float-right text-green-600">85%</span>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <span className="font-semibold">Videos recientes:</span>
                  <span className="float-right text-purple-600">3 nuevos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;