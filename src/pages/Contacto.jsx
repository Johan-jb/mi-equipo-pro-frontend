import React from 'react';
import { useNavigate } from 'react-router-dom';

function Contacto() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-blue-600">📊 SportMetrics Pro - Contacto</div>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              ← Volver
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Contacto</h1>
        <p className="text-lg text-gray-600 mb-6">
          ¿Tenés preguntas? Completá el formulario y te responderemos a la brevedad.
        </p>

        <form className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Nombre</label>
              <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Email</label>
              <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Mensaje</label>
            <textarea rows="5" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"></textarea>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Enviar mensaje
          </button>
        </form>

        <div className="mt-12 text-center text-gray-600">
          <p>📧 info@sportmetricspro.com</p>
          <p>📱 +54 9 351 3636593</p>
          <p>📍 Córdoba, Argentina</p>
        </div>
      </div>
    </div>
  );
}

export default Contacto;