import { useState, useEffect } from 'react';
import api from '../services/api';

function ModalHabilidades({ jugadorId, onClose, onHabilidadesCargadas }) {
  const [formData, setFormData] = useState({
    reaccion: 5,
    equilibrio: 5,
    velocidad: 5,
    fuerza: 5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarHabilidadesExistentes();
  }, []);

  const cargarHabilidadesExistentes = async () => {
    try {
      const response = await api.get(`/habilidades/ultima/${jugadorId}`);
      if (response.data.habilidad) {
        setFormData({
          reaccion: response.data.habilidad.reaccion,
          equilibrio: response.data.habilidad.equilibrio,
          velocidad: response.data.habilidad.velocidad,
          fuerza: response.data.habilidad.fuerza
        });
      }
    } catch (error) {
      console.log('No hay habilidades previas');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseInt(e.target.value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/habilidades', {
        id_jugador: jugadorId,
        ...formData
      });
      onHabilidadesCargadas(response.data.habilidad);
      onClose();
    } catch (err) {
      setError('Error al guardar habilidades');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Diagnóstico Inicial</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Reacción (0-10)</label>
              <input
                type="number"
                name="reaccion"
                value={formData.reaccion}
                onChange={handleChange}
                min="0"
                max="10"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Equilibrio (0-10)</label>
              <input
                type="number"
                name="equilibrio"
                value={formData.equilibrio}
                onChange={handleChange}
                min="0"
                max="10"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Velocidad (0-10)</label>
              <input
                type="number"
                name="velocidad"
                value={formData.velocidad}
                onChange={handleChange}
                min="0"
                max="10"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Fuerza (0-10)</label>
              <input
                type="number"
                name="fuerza"
                value={formData.fuerza}
                onChange={handleChange}
                min="0"
                max="10"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Diagnóstico'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalHabilidades;