import React from 'react';
import { useNavigate } from 'react-router-dom';

function Planes() {
  const navigate = useNavigate();

  const planes = [
    {
      nombre: 'Básico',
      precio: '$15',
      periodo: '/mes',
      jugadores: 30,
      almacenamiento: '5 GB',
      destacado: false,
      color: 'bg-gray-100',
      boton: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      nombre: 'Profesional',
      precio: '$25',
      periodo: '/mes',
      jugadores: 100,
      almacenamiento: '20 GB',
      destacado: true,
      color: 'bg-blue-50 border-2 border-blue-500',
      boton: 'bg-green-600 hover:bg-green-700'
    },
    {
      nombre: 'Ilimitado',
      precio: '$40',
      periodo: '/mes',
      jugadores: 'Ilimitados',
      almacenamiento: '50 GB',
      destacado: false,
      color: 'bg-gray-100',
      boton: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  const handleSeleccionar = (plan) => {
    alert(`Has seleccionado el plan ${plan.nombre}. Próximamente podrás pagar online.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Elegí el plan ideal para tu club</h1>
          <p className="text-xl text-gray-600">Todos los planes incluyen 15 días de prueba gratis</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {planes.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl shadow-lg overflow-hidden ${plan.color} ${plan.destacado ? 'scale-105 shadow-xl' : ''}`}
            >
              {plan.destacado && (
                <div className="bg-yellow-500 text-white text-center py-2 font-bold">
                  MÁS ELEGIDO
                </div>
              )}
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.nombre}</h2>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.precio}</span>
                  <span className="text-gray-600">{plan.periodo}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Hasta {plan.jugadores} jugadores
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    {plan.almacenamiento} para multimedia
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Evaluaciones ilimitadas
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    PDF profesionales
                  </li>
                </ul>
                <button
                  onClick={() => handleSeleccionar(plan)}
                  className={`w-full text-white py-3 rounded-lg font-semibold transition ${plan.boton}`}
                >
                  Seleccionar plan
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            ← Volver al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Planes;