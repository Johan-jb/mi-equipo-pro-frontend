import { useState, useEffect } from 'react';
import api from '../services/api';

function ModalEditarJugador({ jugador, onClose, onJugadorActualizado }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    dni: '',
    posicion_principal: 'delantero centro',
    pierna_habil: 'derecha'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const posiciones = [
    'arquero',
    'defensor central',
    'lateral derecho',
    'lateral izquierdo',
    'mediocampista central',
    'mediocampista defensivo',
    'mediocampista ofensivo',
    'extremo derecho',
    'extremo izquierdo',
    'delantero centro',
    'enganche'
  ];

  const piernas = ['derecha', 'izquierda', 'ambas'];

  useEffect(() => {
    if (jugador) {
      // Formatear fecha para input type="date"
      const fecha = new Date(jugador.fecha_nacimiento);
      const fechaFormateada = fecha.toISOString().split('T')[0];
      
      setFormData({
        nombre: jugador.nombre || '',
        apellido: jugador.apellido || '',
        fecha_nacimiento: fechaFormateada,
        dni: jugador.dni || '',
        posicion_principal: jugador.posicion_principal || 'delantero centro',
        pierna_habil: jugador.pierna_habil || 'derecha'
      });
    }
  }, [jugador]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.put(`/jugadores/${jugador.id_jugador}`, formData);
      onJugadorActualizado(response.data.jugador);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar jugador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Editar Jugador</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Apellido *</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Fecha de Nacimiento *</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">DNI (opcional)</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Posición *</label>
              <select
                name="posicion_principal"
                value={formData.posicion_principal}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                {posiciones.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Pierna Hábil *</label>
              <select
                name="pierna_habil"
                value={formData.pierna_habil}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                {piernas.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
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

export default ModalEditarJugador;